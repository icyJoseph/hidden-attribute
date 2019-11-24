import React from "react";

const Evolve = ({ canvasId }) => {
  const width = 200;
  const height = 200;
  const [row, setRow] = React.useState(height);
  const _ref = React.useRef();

  const onLoad = function() {
    requestAnimationFrame(animate);
  };

  function animate() {
    const canvas = document.getElementById(canvasId);
    const context = canvas.getContext("2d");
    context.drawImage(_ref.current, 0, row, width, 1, 0, 0, width / 2, row / 2);
    setRow(x => (x === 0 ? 0 : x - 1));
  }

  React.useEffect(() => {
    if (row > 0) {
      const raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
    }
  }, [row]);

  return (
    <img
      className="evolve-img"
      src="./evolve.png"
      alt="Evolve"
      onLoad={onLoad}
      ref={_ref}
    />
  );
};

export default Evolve;
