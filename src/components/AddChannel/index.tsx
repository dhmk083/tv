import React from "react";
import { useOnBlur } from "@dhmk/react";
import Popup from "components/Popup";
import SearchBox from "components/SearchBox";
import { useStore } from "store";
import { selectChannelsHelper } from "utils";
import styles from "./styles.module.css";

export default function AddChannel({ id }) {
  const [isSearching, setSearching] = React.useState(false);
  const selectChannels = useStore((s) => s.schedule.selectChannels);

  const channelId = id;

  const insertChannel = (id) => {
    selectChannels(selectChannelsHelper(id, channelId, false));
    setSearching(false);
  };

  return (
    <div {...useOnBlur(() => setSearching(false))} className={styles.wrap}>
      <button onClick={() => setSearching(true)}>+</button>
      {isSearching && (
        <Popup>
          <div className={styles.popupWrap}>
            <div className={styles.title}>Поиск канала:</div>
            <SearchBox onSelect={insertChannel} />
          </div>
        </Popup>
      )}
    </div>
  );
}
