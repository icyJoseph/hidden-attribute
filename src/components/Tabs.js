import React from "react";

export function Tabs({ children }) {
  const [current, setCurrent] = React.useState(0);
  const currentTab = React.useRef();
  currentTab.current = current;

  const controls = React.useMemo(
    () =>
      React.Children.map(
        children,
        ({ props: { label, importance, title } }, index) => {
          return (
            <button
              key={index}
              className={`nes-btn ${importance} tab-btn`}
              onClick={() => setCurrent(index)}
              aria-label={title}
            >
              {label}
            </button>
          );
        }
      ),
    []
  );

  return (
    <>
      <div className="tab-controls">{controls}</div>
      {React.Children.toArray(children).map((child, index) => {
        const isHidden = index !== currentTab.current;
        const withHiddenProp = {
          ...child,
          props: { ...child.props, isHidden }
        };
        return (
          <div
            key={index}
            hidden={isHidden}
            className="nes-container with-title is-dark"
          >
            {withHiddenProp}
          </div>
        );
      })}
    </>
  );
}

export default Tabs;
