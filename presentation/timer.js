import React from "react";

const Timer = () => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const timer = setTimeout(() => setCount(10), 1000);
    return () => clearTimeout(timer);
  }, []);

  return <div>{count}</div>;
};

export default Timer;
