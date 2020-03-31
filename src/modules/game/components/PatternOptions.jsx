import React from "react";
import styled from "styled-components";

import {GRID_SIZE} from "../../shared/constants";
import eight from "../../shared/images/eight.gif";
import stepper from "../../shared/images/stepper.gif";
import twister from "../../shared/images/twister.gif";

const PatternOptionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: ${GRID_SIZE}px;

  > div {
    display: flex;
    flex-direction: column;
    width: calc(100% / 3);
    padding: 10px;
    align-items: center;

    img {
      margin-bottom: 10px;
      width: 100%;
    }

    label {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`;

const PatternOptions = ({updatePattern}) => {
  return (
    <PatternOptionsWrapper>
      <div>
        <label htmlFor="twister">
          <img src={twister} alt="twister" />
          Twister
        </label>
        <input
          onChange={updatePattern}
          type="radio"
          id="twister"
          name="pattern"
          value="twister"
        />
      </div>
      <div>
        <label htmlFor="stepper">
          <img src={stepper} alt="stepper" />
          Stepper
        </label>
        <input
          onChange={updatePattern}
          type="radio"
          id="stepper"
          name="pattern"
          value="stepper"
        />
      </div>
      <div>
        <label htmlFor="eight">
          <img src={eight} alt="eight" />
          Eight
        </label>
        <input
          onChange={updatePattern}
          type="radio"
          id="eight"
          name="pattern"
          value="eight"
        />
      </div>
    </PatternOptionsWrapper>
  );
};

export default PatternOptions;
