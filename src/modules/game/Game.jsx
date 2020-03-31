import "./game.css";

import React, {Fragment, useEffect, useRef, useState} from "react";

import {GRID_SIZE, SQUARES, UPDATE_INTERVAL} from "../shared/constants";
import {getDefaultGameState, getNextGenerations, updateGrid} from "./gameUtils";

const SQUARE_SIZE = GRID_SIZE / SQUARES;
const intialGrid = getDefaultGameState(SQUARES);

let timerId;
let isDragging = false;
let lastSquare = null;
let dragged = false;

const Game = () => {
  const canvasRef = useRef();
  const [isPlaying, setPlaying] = useState(false);
  const [grid, setGrid] = useState(intialGrid);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    for (var x = 0; x < GRID_SIZE; x += SQUARE_SIZE) {
      for (var y = 0; y < GRID_SIZE; y += SQUARE_SIZE) {
        // Draw rectangles
        context.clearRect(x, y, SQUARE_SIZE, SQUARE_SIZE); // Clear previous state
        const xIndex = Math.floor(x / SQUARE_SIZE);
        const yIndex = Math.floor(y / SQUARE_SIZE);

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

  const startTimer = () => {
    timerId = setTimeout(() => {
      setGrid(old => getNextGenerations(old, SQUARES));
      startTimer();
    }, UPDATE_INTERVAL);
  };

  const toggleGame = () => {
    if (isPlaying) {
      clearTimeout(timerId);
      timerId = null;
    } else {
      startTimer();
    }

    setPlaying(!isPlaying);
  };

  const handleClick = event => {
    if (dragged) return (dragged = false); // Don't register click when we just dragged

    const {offsetX, offsetY} = event.nativeEvent;
    const xIndex = Math.floor(offsetX / SQUARE_SIZE);
    const yIndex = Math.floor(offsetY / SQUARE_SIZE);
    const nextGenerations = updateGrid(grid, xIndex, yIndex);
    setGrid(nextGenerations);
  };

  const toggleDrawing = () => {
    isDragging = !isDragging;
  };

  const handleMouseMove = event => {
    if (!isDragging) return;

    const {offsetX, offsetY} = event.nativeEvent;
    const currentSquare = {
      x: Math.floor(offsetX / SQUARE_SIZE),
      y: Math.floor(offsetY / SQUARE_SIZE),
    };

    const noLastSquare = lastSquare === null;
    const coordinateChanged =
      noLastSquare ||
      lastSquare.x !== currentSquare.x ||
      lastSquare.y !== currentSquare.y;

    if (noLastSquare || coordinateChanged) {
      dragged = true;
      const nextGenerations = updateGrid(
        grid,
        currentSquare.x,
        currentSquare.y,
      );
      setGrid(nextGenerations);

      lastSquare = {
        ...currentSquare,
      };
    }
  };

  const init = () => {
    setPlaying(true);
    startTimer();

    return () => clearTimeout(timerId);
  };

  useEffect(init, []);
  useEffect(drawGrid, [grid]);

  return (
    <Fragment>
      <button onClick={toggleGame} style={{display: "block"}}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <canvas
        onMouseMove={handleMouseMove}
        onMouseDown={toggleDrawing}
        onMouseUp={toggleDrawing}
        onClick={handleClick}
        width={GRID_SIZE}
        height={GRID_SIZE}
        ref={canvasRef}
      />
    </Fragment>
  );
};

export default Game;
