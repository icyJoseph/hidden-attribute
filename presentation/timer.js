import React from "react";

import { useDeck } from "mdx-deck";
import Evolve from "./evolve";

const TOTAL_TIME = 15 * 60 * 1000;

const Timer = () => {
  const state = useDeck();
  const [start, setStart] = React.useState(false);
  const [flood, setFlood] = React.useState(false);
  const [buffer, setBuffer] = React.useState([0]);
  const _container = React.useRef();

  const TIME_PER_SLIDE = Math.floor(TOTAL_TIME / state.length);

  React.useEffect(() => {
    const timer = setTimeout(() => setStart(true), TIME_PER_SLIDE * 0.95);
    return () => clearTimeout(timer);
  }, [TIME_PER_SLIDE]);

  React.useEffect(() => {
    if (start) {
      const timer = setTimeout(() => setFlood(true), 20 * 1000);
      return () => clearTimeout(timer);
    }
  }, [start]);

  React.useEffect(() => {
    if (flood) {
      const offset = _container.current.offsetTop;
      if (offset > -600) {
        const interval = setInterval(
          () => setBuffer(prev => [...prev, prev.length + 1]),
          1000
        );
        return () => clearInterval(interval);
      }
    }
  }, [flood, buffer]);

  return (
    start && (
      <div className="canvas-container" ref={_container}>
        {buffer.map(pos => (
          <div
            key={pos}
            className="evolve-logo"
            style={{
              justifyContent: pos % 2 === 0 ? "center" : "flex-start",
              alignItems: pos % 2 === 0 ? "center" : "flex-end"
            }}
          >
            <canvas
              id={`img-canvas-${pos}`}
              className="evolve-canvas"
              width="100"
              height="100"
            />
            <Evolve canvasId={`img-canvas-${pos}`} />
          </div>
        ))}
      </div>
    )
  );
};

export default Timer;
