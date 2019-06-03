import React from "react";

export function Tabs({ children }) {
  const [current, setCurrent] = React.useState(0);
  const currentTab = React.useRef();
  currentTab.current = current;

  const controls = React.useMemo(
    () =>
      React.Children.map(
        children,
        ({ props: { order, label, importance } }) => {
          return (
            <button
              className={`nes-btn ${importance}`}
              onClick={() => setCurrent(order)}
            >
              {label}
            </button>
          );
        }
      ),
    []
  );

  const tabs = React.Children.toArray(children).map(child => {
    const {
      props: { order }
    } = child;

    const isHidden = order !== currentTab.current;
    const enriched = { ...child, props: { ...child.props, isHidden } };
    return (
      <div key={order} hidden={isHidden} className="nes-container with-title">
        {enriched}
      </div>
    );
  });

  return (
    <>
      <div className="tab-controls">{controls}</div>
      {tabs}
    </>
  );
}

export default Tabs;
