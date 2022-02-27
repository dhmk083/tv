import Link from "next/link";
import React from "react";
import { add, isSameDay } from "date-fns";
import cn from "classnames";
import { useDocument } from "hooks";
import { formatDate } from "utils";
import { Stack } from "components/Misc";
import styles from "./styles.module.css";

export default function Nav() {
  const now = new Date();
  const selected = new Date(
    new URLSearchParams(useDocument()?.location.search).get("date") ||
      Date.now()
  );
  const halfRange = 7;
  const dates = Array.from({ length: halfRange }, (_, i) =>
    add(selected, { days: i - halfRange })
  ).concat(
    Array.from({ length: halfRange + 1 }, (_, i) => add(selected, { days: i }))
  );

  const getHref = (d) =>
    isSameDay(d, now) ? "?" : `?date=${d.toISOString().split("T")[0]}`;

  const ref = React.useRef<HTMLElement>();

  React.useLayoutEffect(() => {
    const handler = () => {
      const node = ref.current!;
      const today = node.children[halfRange] as HTMLElement;
      node.scrollLeft =
        today.offsetLeft -
        node.offsetLeft -
        node.offsetWidth / 2 +
        today.offsetWidth / 2;
    };

    handler();

    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <Stack className={styles.wrap} ref={ref}>
      {dates.map((d) => (
        <div
          key={d.getTime()}
          className={cn(
            styles.date,
            !(d.getDay() % 6) && styles.isWeekend,
            isSameDay(d, selected) && styles.isSelected,
            isSameDay(d, now) && styles.now
          )}
        >
          <Link href={getHref(d)}>{formatDate(d, "eeeeee, d")}</Link>
        </div>
      ))}
    </Stack>
  );
}
