import React from "react";

// this could apply further styling to children
export function Tab({ isHidden, title, children, importance }) {
  return (
    <>
      <h3 className={`${!isHidden && "title"} nes-text ${importance}`}>
        {title}
      </h3>
      <div className={`nes-text ${importance}`}>{children}</div>
    </>
  );
}

export default Tab;
