import React from "react";
import cn from "classnames";
import { Stack } from "components/Misc";
import { useStore } from "store";
import styles from "./styles.module.css";

export default function Sidebar() {
  const channels = useStore((s) => s.schedule.channels);
  const [isActive, setActive] = React.useState(false);

  return (
    <div className={cn(styles.wrap, isActive && styles.active)}>
      <button
        className={styles.toggleButton}
        onClick={() => setActive((x) => !x)}
      >
        ☰
      </button>

      <div className={styles.content}>
        <div className={styles.title}>
          <h3>Каналы</h3>
          <hr />
        </div>

        <Stack className={styles.channels} direction="column">
          {channels.map((x) => (
            <a key={x.channel.id} href={`#${x.channel.id}`}>
              {x.channel.name}
            </a>
          ))}
        </Stack>
      </div>
    </div>
  );
}
