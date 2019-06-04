import React, { useEffect, useState } from "react";

export function ScrollUp({ active, scrollUp }) {
  return (
    <button
      className={`nes-btn is-error scroll-btn ${active}`}
      aria-label="scroll-up"
      onClick={scrollUp}
    >
      <span>{`<`}</span>
    </button>
  );
}

export default ScrollUp;
