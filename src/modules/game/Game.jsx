import PropTypes from "prop-types";
import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {createGlobalStyle} from "styled-components";

import {GRID_SIZE, SQUARES, UPDATE_INTERVAL} from "../shared/constants";
import GameControls from "./components/GameControls";
import PatternOptions from "./components/PatternOptions";
import {setGrid, setPattern} from "./gameActions";
import {
  addPatternToGrid,
  createGrid,
  getNextGenerations,
  getPatternCoordinates,
  updateGrid,
} from "./gameUtils";

const GlobalStyle = createGlobalStyle`
html,
body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: sans-serif;
}
`;

const SQUARE_SIZE = GRID_SIZE / SQUARES;
class Game extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.timerId = null;
    this.isDragging = false;
    this.lastSquare = null;
    this.state = {
      isPlaying: false,
      pattern: null,
    };
  }

  componentDidMount() {
    this.drawGrid();
    this.startTimer(); // Start the game!
  }

  componentDidUpdate() {
    this.drawGrid();
  }

  render() {
    const {isPlaying} = this.state;

    return (
      <Fragment>
        <GlobalStyle />
        <GameControls
          toggleGame={this.toggleGame}
          resetGame={this.resetGame}
          clearGame={this.clearGame}
          isPlaying={isPlaying}
        />
        <canvas
          onMouseMove={this.handleMouseMove}
          onMouseDown={this.toggleDrawing}
          onMouseUp={this.toggleDrawing}
          onClick={this.handleClick}
          width={GRID_SIZE}
          height={GRID_SIZE}
          ref={this.canvas}
        />
        <PatternOptions updatePattern={this.updatePattern} />
      </Fragment>
    );
  }

  drawGrid = () => {
    const {grid, pattern} = this.props;
    const canvas = this.canvas.current;
    const context = canvas.getContext("2d");
    let stringCoordinates = [];

    if (pattern.length > 0) {
      stringCoordinates = pattern.map(({x, y}) => {
        return `${String(x).padStart(String(SQUARES).length, "0")}${String(
          y,
        ).padStart(String(SQUARES).length, "0")}`;
      });
    }

    for (var x = 0; x < GRID_SIZE; x += SQUARE_SIZE) {
      for (var y = 0; y < GRID_SIZE; y += SQUARE_SIZE) {
        // Draw rectangles
        context.clearRect(x, y, SQUARE_SIZE, SQUARE_SIZE); // Clear previous state

        const xIndex = x / SQUARE_SIZE;
        const yIndex = y / SQUARE_SIZE;
        const isAlive = !!grid[xIndex][yIndex];
        if (isAlive) {
          context.rect(x, y, SQUARE_SIZE, SQUARE_SIZE);
        } else {
          context.fillStyle = "#000";
          context.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
        }
        if (pattern.length !== 0) {
          const currentCoordinate = `${String(xIndex).padStart(
            String(SQUARES).length,
            "0",
          )}${String(yIndex).padStart(String(SQUARES).length, "0")}`;

          if (stringCoordinates.includes(currentCoordinate)) {
            context.fillStyle = "red";
            context.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
          }
        }
      }
    }

    context.stroke(); // Draw rectangles
  };

  updatePattern = e => {
    this.setState({pattern: e.target.value});
  };

  clearGame = () => {
    const emptyGrid = createGrid(SQUARES, true);
    this.props.setGrid(emptyGrid);
  };

  resetGame = () => {
    const newGrid = createGrid(SQUARES);
    this.props.setGrid(newGrid);
  };

  startTimer = () => {
    this.timerId = setTimeout(() => {
      if (this.state.isPlaying) {
        const nextGenerations = getNextGenerations(this.props.grid);

        this.props.setGrid(nextGenerations);
        this.startTimer();
      }
    }, UPDATE_INTERVAL);
  };

  toggleGame = () => {
    if (this.state.isPlaying) {
      clearTimeout(this.timerId);
      this.timerId = null;
    } else {
      this.startTimer();
    }

    this.setState({isPlaying: !this.state.isPlaying});
  };

  handleClick = event => {
    if (this.state.pattern) return;

    const {grid} = this.props;
    const {offsetX, offsetY} = event.nativeEvent;
    const xIndex = Math.floor(offsetX / SQUARE_SIZE);
    const yIndex = Math.floor(offsetY / SQUARE_SIZE);
    const nextGenerations = updateGrid(grid, xIndex, yIndex);
    this.props.setGrid(nextGenerations);
  };

  toggleDrawing = () => {
    if (this.state.pattern !== null) {
      const newGrid = addPatternToGrid(this.props.grid, this.props.pattern);
      this.props.setGrid(newGrid);
    } else {
      if (this.isDragging) this.lastSquare = null;
      this.isDragging = !this.isDragging;
    }
  };

  handleMouseMove = event => {
    if (this.isDragging) this.handleDrawing(event);
    if (this.state.pattern) this.handlePatternPreview(event);
  };

  handlePatternPreview = event => {
    const {offsetX, offsetY} = event.nativeEvent;
    const currentSquare = {
      x: Math.floor(offsetX / SQUARE_SIZE),
      y: Math.floor(offsetY / SQUARE_SIZE),
    };
    const coordinates = getPatternCoordinates(
      currentSquare,
      this.state.pattern,
    );
    this.props.setPattern(coordinates);
  };

  handleDrawing = event => {
    const {offsetX, offsetY} = event.nativeEvent;
    const currentSquare = {
      x: Math.floor(offsetX / SQUARE_SIZE),
      y: Math.floor(offsetY / SQUARE_SIZE),
    };

    if (
      this.lastSquare === null ||
      this.lastSquare.x !== currentSquare.x ||
      this.lastSquare.y !== currentSquare.y
    ) {
      const nextGenerations = updateGrid(
        this.props.grid,
        currentSquare.x,
        currentSquare.y,
      );
      this.props.setGrid(nextGenerations);

      this.lastSquare = {
        ...currentSquare,
      };
    }
  };
}

Game.propTypes = {
  grid: PropTypes.array.isRequired,
};

const mapDispatchToProps = dispatcher => ({
  setGrid: bindActionCreators(setGrid, dispatcher),
  setPattern: bindActionCreators(setPattern, dispatcher),
});

const mapStateToProps = state => ({
  grid: state.gameState.grid,
  pattern: state.gameState.pattern,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game);
