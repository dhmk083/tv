import React from "react";
import cn from "classnames";
import styles from "./styles.module.css";

export const Centered: React.FC<{ position: "fixed" | "absolute" }> = ({
  children,
  position,
}) => (
  <div className={styles.centered} style={{ position }}>
    {children}
  </div>
);

export const Spinner = ({ className = "" }) => (
  <div className={cn(styles.spinner, className)}></div>
);

function _Stack(
  {
    as = "div",
    align = "center",
    justify = "initial",
    direction = "row",
    wrap = "nowrap",
    gap = "1em",
    ...rest
  },
  ref
) {
  const C = as as any;
  return (
    <C
      {...rest}
      ref={ref}
      style={{
        ...rest.style,
        display: "flex",
        alignItems: align,
        justifyContent: justify,
        flexDirection: direction,
        flexWrap: wrap,
        gap,
      }}
    />
  );
}

export const Stack = React.forwardRef(_Stack);

export const Spacer = () => <div style={{ flex: 1 }}></div>;
