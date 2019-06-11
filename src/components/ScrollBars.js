import React, { useState, useEffect, useCallback } from "react";
import OverlayScrollbars from "overlayscrollbars";
import "overlayscrollbars/css/OverlayScrollbars.css";
import ScrollUp from "./ScrollUp";
import useDebounce from "../hooks/useDebounce";

function ScrollBars({ children }) {
  const [osInstance, setOsInstance] = useState(null);
  const [active, setActive] = useState("");
  const debounced = useDebounce(active, 200);

  useEffect(() => {
    const onScroll = e =>
      e.target.scrollTop > 100 ? setActive("active") : setActive("");
    setOsInstance(
      OverlayScrollbars(document.body, {
        autoUpdate: true,
        callbacks: { onScroll }
      })
    );

    return () => {
      if (osInstance && osInstance.destroy) osInstance.destroy();
    };
  }, [osInstance]);

  const scrollUp = useCallback(
    () => osInstance && osInstance.scroll({ x: "0%", y: "0%" }, 500),
    [osInstance]
  );

  return (
    !!osInstance && (
      <>
        {children}
        <ScrollUp active={debounced} scrollUp={scrollUp} />
      </>
    )
  );
}

export default ScrollBars;
