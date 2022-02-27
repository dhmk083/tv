import React from "react";
import { useUpdate } from "@dhmk/react";

export function useDocument() {
  const [value, setValue] = React.useState<typeof document>();
  React.useEffect(() => setValue(document), []);
  return value;
}

export function useInterval(ms: number) {
  const update = useUpdate();

  React.useEffect(() => {
    const tid = setInterval(update, ms);
    return () => clearInterval(tid);
  }, [ms, update]);
}
