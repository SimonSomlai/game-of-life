import React from "react";
import styled from "styled-components";

const GameControlsWrapper = styled.div`
  display: flex;
`;

const StyledButton = styled.button`
  display: block;
  padding: 10px 5px;
  margin-right: 5px;
  margin-bottom: 5px;
`;

const GameControls = ({toggleGame, resetGame, clearGame, isPlaying}) => (
  <GameControlsWrapper>
    <StyledButton onClick={toggleGame}>
      {isPlaying ? "Pause" : "Play"}
    </StyledButton>
    <StyledButton onClick={resetGame}>Reset</StyledButton>
    <StyledButton onClick={clearGame}>Clear</StyledButton>
  </GameControlsWrapper>
);

export default GameControls;
