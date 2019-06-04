import React from "react";

// this could apply further styling to children
export function Tab({ isHidden, title, children }) {
  return (
    <>
      <h3 className={`${!isHidden && "title"}`}>{title}</h3>
      <div>{children}</div>
    </>
  );
}

export default Tab;
