// this could apply further styling to children
export function Tab({ title, children }) {
  return (
    <>
      <h3 className="title">{title}</h3>
      <div>{children}</div>
    </>
  );
}

export default Tab;
