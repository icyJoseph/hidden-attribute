import React from "react";

import { useDeck } from "mdx-deck";
import Evolve from "./evolve";

const TOTAL_TIME = 5 * 60 * 1000;

const Timer = () => {
  const state = useDeck();
  const [start, setStart] = React.useState(false);
  const [buffer, setBuffer] = React.useState([]);
  const _container = React.useRef();

  const TIME_PER_SLIDE = Math.floor(TOTAL_TIME / state.length);

  React.useEffect(() => {
    const timer = setTimeout(() => setStart(true), TIME_PER_SLIDE * 0.75);
    return () => clearTimeout(timer);
  }, [TIME_PER_SLIDE]);

  React.useEffect(() => {
    if (start) {
      const offset = _container.current.offsetTop;
      if (offset > -600) {
        const interval = setInterval(
          () => setBuffer(prev => [...prev, prev.length + 1]),
          1000
        );
        return () => clearInterval(interval);
      }
    }
  }, [start, buffer]);

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
