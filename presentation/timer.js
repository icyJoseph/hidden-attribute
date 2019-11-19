import React from "react";

import { useDeck } from "mdx-deck";
import Evolve from "./evolve";

const TOTAL_TIME = 5 * 60 * 1000;

const Timer = () => {
  const state = useDeck();
  const [start, setStart] = React.useState(false);

  const TIME_PER_SLIDE = Math.floor(TOTAL_TIME / state.length);

  React.useEffect(() => {
    const timer = setTimeout(() => setStart(true), TIME_PER_SLIDE * 0.75);
    return () => clearTimeout(timer);
  }, [TIME_PER_SLIDE]);

  return (
    start && (
      <>
        <canvas
          id="img-canvas"
          className="evolve-logo"
          width="100"
          height="100"
        />
        <Evolve />
      </>
    )
  );
};

export default Timer;
