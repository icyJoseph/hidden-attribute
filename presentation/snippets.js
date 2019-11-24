export const hiddenSnippet = `function Tabs({ children }) {
  const [current, setCurrent] = React.useState(0);

  const controls = React.useMemo(
    () =>
      React.Children.map(children, ({ props }, index) => (
        <button
          key={index}
          className={\`nes-btn \${props.importance} tab-btn\`}
          onClick={() => setCurrent(index)}
        >
          {props.label}
        </button>
      )),
    []
  );

  return (
    <>
      {controls}
      {React.Children.toArray(children).map((child, index) => (
        <div key={index} hidden={index !== current}>
          {child}
        </div>
      ))}
    </>
  );
}
`;

export const displayNoneSnippet = `function Tabs({ children }) {
  const [current, setCurrent] = React.useState(0);

  const controls = React.useMemo(
    () =>
      React.Children.map(children, ({ props }, index) => (
        <button
          key={index}
          className={\`nes-btn \${props.importance} tab-btn\`}
          onClick={() => setCurrent(index)}
        >
          {props.label}
        </button>
      )),
    []
  );

  return (
    <>
      {controls}
      {React.Children.toArray(children).map((child, index) => (
        <div
          key={index}
          style={{ display: index !== current ? "none" : "block" }}
        >
          {child}
        </div>
      ))}
    </>
  );
}
`;

export const visibilitySnippet = `function Tabs({ children }) {
  const [current, setCurrent] = React.useState(0);

  const controls = React.useMemo(
    () =>
      React.Children.map(children, ({ props }, index) => (
        <button
          key={index}
          className={\`nes-btn \${props.importance} tab-btn\`}
          onClick={() => setCurrent(index)}
        >
          {props.label}
        </button>
      )),
    []
  );

  return (
    <>
      {controls}
      {React.Children.toArray(children).map((child, index) => (
        <div
          key={index}
          style={{ visibility: index !== current ? "hidden" : "visible" }}
        >
          {child}
        </div>
      ))}
    </>
  );
}
`;

export const booleanFlagSnippet = `function Tabs({ children }) {
  const [current, setCurrent] = React.useState(0);

  const controls = React.useMemo(
    () =>
      React.Children.map(children, ({ props }, index) => (
        <button
          key={index}
          className={\`nes-btn \${props.importance} tab-btn\`}
          onClick={() => setCurrent(index)}
        >
          {props.label}
        </button>
      )),
    []
  );

  return (
    <>
      {controls}
      {React.Children.toArray(children).map(
        (child, index) => index !== current && <div key={index}>{child}</div>
      )}
    </>
  );
}
`;
