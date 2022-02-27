import React from "react";
import Popup from "components/Popup";
import { useOnBlur } from "@dhmk/react";
import { useStore } from "store";
import regions, { getName, Region } from "regions";
import styles from "./styles.module.css";

const azRegions = Object.values(regions).sort((a, b) =>
  getName(a).localeCompare(getName(b))
);

export default function RegionSelector() {
  const selectChannels = useStore((s) => s.schedule.selectChannels);
  const regionId = useStore((s) => s.schedule.region);
  const region: Region | undefined = regions[regionId!];
  const name = region ? getName(region) : "";

  const [editing, setEditing] = React.useState(false);
  const [filter, setFilter] = React.useState("");
  const [focus, setFocus] = React.useState(false);

  const selectRegion = (id) => {
    const ids = useStore.getState().schedule.channels.map((x) => x.channel.id);
    selectChannels(ids, undefined, id);
    resetModes();
  };

  const resetModes = () => {
    setFocus(false);
    setEditing(false);
  };

  const blurProps = useOnBlur(resetModes);

  React.useEffect(() => {
    setFilter(name);
  }, [name]);

  const label = "Регион: ";

  if (!editing) {
    return (
      <div onClick={() => setEditing(true)}>
        {label}
        {name || "<выбрать>"}
      </div>
    );
  }

  return (
    <div className={styles.wrap} {...blurProps}>
      {label}
      <div>
        <input
          autoFocus
          value={filter}
          onChange={(ev) => setFilter(ev.target.value)}
          onFocus={() => setFocus(true)}
        />
        <Popup>
          <div className={styles.regions}>
            {focus &&
              azRegions
                .filter((x) =>
                  getName(x).toLowerCase().includes(filter.toLowerCase())
                )
                .map((x) => (
                  <div
                    key={x.id}
                    className={styles.item}
                    onClick={() => selectRegion(x.id)}
                  >
                    {getName(x)}
                  </div>
                ))}
          </div>
        </Popup>
      </div>
    </div>
  );
}
