// NPM Libraries
import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";

// External Modules
import {setGrid} from "./gameActions";
import {GRID_SIZE, SQUARES, UPDATE_INTERVAL} from "../shared/constants";
import {getNextGenerations, updateGrid} from "./gameUtils";
// Components

// Queries & Query Constants

// Assets & Styles
import "./game.css";

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
        <button onClick={this.toggleGame} style={{display: "block"}}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <canvas
          onMouseMove={this.handleMouseMove}
          onMouseDown={this.toggleDrawing}
          onMouseUp={this.toggleDrawing}
          onClick={this.handleClick}
          width={GRID_SIZE}
          height={GRID_SIZE}
          ref={this.canvas}
        />
      </Fragment>
    );
  }

  drawGrid = () => {
    const {grid} = this.props;
    const canvas = this.canvas.current;
    const context = canvas.getContext("2d");

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
      }
    }

    context.stroke(); // Draw rectangles
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
    const {grid} = this.props;
    const {offsetX, offsetY} = event.nativeEvent;
    const xIndex = Math.floor(offsetX / SQUARE_SIZE);
    const yIndex = Math.floor(offsetY / SQUARE_SIZE);
    const nextGenerations = updateGrid(grid, xIndex, yIndex);
    this.props.setGrid(nextGenerations);
  };

  toggleDrawing = () => {
    if (this.isDragging) this.lastSquare = null;
    this.isDragging = !this.isDragging;
  };

  handleMouseMove = event => {
    if (!this.isDragging) return;

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
});

const mapStateToProps = state => ({
  grid: state.gameState,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game);
