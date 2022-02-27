import React from "react";
import { useOnBlur } from "@dhmk/react";
import Animated from "components/Animated";
import SearchBox from "components/SearchBox";
import AddChannel from "components/AddChannel";
import Event from "components/Event";
import { Stack, Spacer } from "components/Misc";
import { useInterval } from "hooks";
import { selectChannelsHelper, getChannels } from "utils";
import { useStore } from "store";
import { Channel } from "types";
import styles from "./styles.module.css";

type Props = {
  data: Channel;
  index: number;
};

export default function _Channel({ data, index }: Props) {
  useInterval(60_000);

  const now = Date.now();
  const { channel } = data;

  const selectChannels = useStore((s) => s.schedule.selectChannels);

  const replaceChannel = (id) =>
    selectChannels(selectChannelsHelper(id, channel.id, true));

  return (
    <Animated>
      <div id={channel.id}>
        <Stack className={styles.header}>
          <ChannelName name={channel.name} onNewChannel={replaceChannel} />
          <Spacer />
          <ChannelToolbar id={channel.id} index={index} />
        </Stack>
        <hr />
        <div className={styles.events}>
          {data.event.map((x) => (
            <Event key={x.id} data={x} now={now} />
          ))}
        </div>
      </div>
    </Animated>
  );
}

function ChannelName({ name, onNewChannel }) {
  const [isEditing, setEditing] = React.useState(false);
  const blurDetector = useOnBlur(() => setEditing(false));

  return isEditing ? (
    <div {...blurDetector}>
      <SearchBox onSelect={onNewChannel} />
    </div>
  ) : (
    <h2 onClick={() => setEditing(true)}>{name}</h2>
  );
}

function ChannelToolbar({ id, index }) {
  const selectChannels = useStore((s) => s.schedule.selectChannels);

  return (
    <Stack>
      <button
        onClick={() => {
          const old = getChannels();
          if (index === 0) return;

          selectChannels(selectChannelsHelper(id, old[index - 1].channel.id));
        }}
      >
        &lt;&lt;
      </button>

      <AddChannel id={id} />

      <button
        onClick={() => {
          const old = getChannels();
          selectChannels(old.map((x) => x.channel.id).filter((x) => x !== id));
        }}
      >
        x
      </button>

      <button
        onClick={() => {
          const old = getChannels();
          if (index === old.length - 1) return;

          selectChannels(selectChannelsHelper(id, old[index + 1].channel.id));
        }}
      >
        &gt;&gt;
      </button>
    </Stack>
  );
}
