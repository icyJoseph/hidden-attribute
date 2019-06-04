import { useState, useEffect } from "react";
import OverlayScrollbars from "overlayscrollbars";
import "overlayscrollbars/css/OverlayScrollbars.css";

function ScrollBars({ children }) {
  const [osInstance, setOsInstance] = useState(null);

  useEffect(() => {
    setOsInstance(OverlayScrollbars(document.body, {}));

    return () => {
      if (osInstance && osInstance.destroy) osInstance.destroy();
    };
  }, [osInstance]);

  return !!osInstance && children;
}

export default ScrollBars;
