import { useState, useEffect } from "react";

export function useDebounce(query, delay) {
  const [value, setValue] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setValue(query), delay);

    return () => clearTimeout(timer);
  }, [delay, query]);

  return value;
}

export default useDebounce;
