import React, { CSSProperties } from "react";
import { useUpdate, useRefCallback } from "@dhmk/react";
import { useDocument } from "hooks";
import styles from "./styles.module.css";

type Props = React.PropsWithChildren<{
  viewportPos?: { x: number; y: number };
}>;

export default function Popup({ children, viewportPos }: Props) {
  const [visibility, setVisibility] =
    React.useState<CSSProperties["visibility"]>("hidden");
  const document = useDocument();
  const nodeRef = React.useRef<HTMLElement>();
  const update = useUpdate();

  const ref = useRefCallback((node) => {
    nodeRef.current = node;

    const xo = new IntersectionObserver(
      (x) => !x[0].isIntersecting && update(),
      { threshold: 1 }
    );
    const target = node.firstElementChild!;

    xo.observe(target);
    return () => xo.unobserve(target);
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useLayoutEffect(() => {
    function adjust() {
      const node = nodeRef.current;
      if (!document || !node) return;

      const bb = node.getBoundingClientRect();

      const offsetX = bb.left - (parseFloat(node.style.left) || 0);
      const offsetY = bb.top - (parseFloat(node.style.top) || 0);

      const newLeft = viewportPos?.x ?? bb.left;
      const newTop = viewportPos?.y ?? bb.top;

      const dw =
        newLeft + node.scrollWidth - document.documentElement.clientWidth;

      const dh =
        newTop + node.scrollHeight - document.documentElement.clientHeight;

      node.style.left = newLeft - Math.max(0, dw) - offsetX + "px";
      node.style.top = newTop - Math.max(0, dh) - offsetY + "px";
    }

    adjust();

    if (visibility !== "visible") setVisibility("visible");
  });

  return (
    <div className={styles.popupRoot} style={{ visibility }}>
      <div className={styles.popup} ref={ref}>
        <div className={styles.popupContent}>{children}</div>
      </div>
    </div>
  );
}
