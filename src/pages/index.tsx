import React from "react";
import Nav from "components/Nav";
import Channel from "components/Channel";
import EventDetails from "components/EventDetails";
import { Centered, Spinner, Stack } from "components/Misc";
import Sidebar from "components/Sidebar";
import SearchBox from "components/SearchBox";
import RegionSelector from "components/RegionSelector";
import { Props } from "utils/types";
import { selectChannelsHelper, formatDate } from "utils";
import { useDocument, useInterval } from "hooks";
import { useStore } from "store";
import { SearchType } from "types";
import styles from "./styles.module.css";

export default function Schedule() {
  const isLoading = useStore((s) => s.schedule.isLoading);
  const selectChannels = useStore((s) => s.schedule.selectChannels);
  const toggleDetails = useStore((s) => s.details.toggle);
  const rawDate = new URLSearchParams(useDocument()?.location.search).get(
    "date"
  );

  React.useEffect(() => {
    const ids = useStore.getState().schedule.channels.map((x) => x.channel.id);
    selectChannels(ids, new Date(rawDate || Date.now()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawDate]);

  const addChannelOrSearch: Props<typeof SearchBox>["onSelect"] = (
    id,
    type
  ) => {
    if (type === SearchType.Event) {
      toggleDetails(id);
    } else {
      selectChannels(selectChannelsHelper(id, undefined, true));
    }
  };

  return (
    <div className={styles.wrap}>
      <Stack className={styles.header}>
        <Time />
        <SearchBox onSelect={addChannelOrSearch} type={SearchType.All} />
        <RegionSelector />
      </Stack>

      <Nav />

      <Stack className={styles.fixture} wrap="wrap" align="initial">
        <Channels />
      </Stack>

      {isLoading && (
        <Centered position="fixed">
          <Spinner />
        </Centered>
      )}

      <Sidebar />

      <EventDetails />
    </div>
  );
}

function Time() {
  useInterval(60_000);
  return <h1>{formatDate(Date.now(), "eeee d MMMM y k:mm")}</h1>;
}

function Channels() {
  const channels = useStore((s) => s.schedule.channels);

  return (
    <>
      {channels.map((x, i) => (
        <Channel key={x.channel.id} data={x} index={i} />
      ))}
    </>
  );
}
