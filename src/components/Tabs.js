import React from "react";

export function Tabs({ children }) {
  const [current, setCurrent] = React.useState(0);

  const controls = React.useMemo(
    () =>
      React.Children.map(
        children,
        ({ props: { label, importance, title } }, index) => (
          <button
            key={index}
            className={`nes-btn ${importance} tab-btn`}
            onClick={() => setCurrent(index)}
            aria-label={title}
          >
            {label}
          </button>
        )
      ),
    []
  );

  return (
    <>
      <div className="tab-controls">{controls}</div>
      {React.Children.toArray(children).map((child, index) => (
        <div
          key={index}
          hidden={index !== current}
          className="nes-container with-title is-dark"
        >
          {child}
        </div>
      ))}
    </>
  );
}

export default Tabs;
