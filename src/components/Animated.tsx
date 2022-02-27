import React from "react";

export default function Animated({ children, ms = 500 }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const prevPos = React.useRef<{ x; y }>();

  React.useLayoutEffect(() => {
    const node = ref.current;
    const pp = prevPos.current;

    if (!node) return;

    const x = node.offsetLeft;
    const y = node.offsetTop;

    const dx = x - pp?.x ?? x;
    const dy = y - pp?.y ?? y;

    node.style.transition = "";
    node.style.transform = `translate(${-dx}px, ${-dy}px)`;

    node.offsetHeight;

    node.style.transition = `transform ${ms}ms`;
    node.style.transform = "";

    prevPos.current = { x, y };
  });

  return <div ref={ref}>{children}</div>;
}
