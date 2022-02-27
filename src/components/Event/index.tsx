import cn from "classnames";
import { useStore } from "store";
import { TvEvent } from "types";
import { formatDate } from "utils";
import styles from "./styles.module.css";

enum EventStatus {
  Ended,
  Ongoing,
  Pending,
}

const formatTime = (s) => formatDate(s * 1000, "k:mm");

export default function Event({ data, now }: { data: TvEvent; now: number }) {
  const status =
    now > data.stop_ts * 1000
      ? EventStatus.Ended
      : now < data.start_ts * 1000
      ? EventStatus.Pending
      : EventStatus.Ongoing;

  const progress =
    status === EventStatus.Ongoing
      ? (now - data.start_ts * 1000) / ((data.stop_ts - data.start_ts) * 1000)
      : 0;

  const statusCN = {
    [EventStatus.Ended]: styles.ended,
    [EventStatus.Ongoing]: styles.ongoing,
    [EventStatus.Pending]: styles.pending,
  }[status];

  const toggleDetails = useStore((s) => s.details.toggle);

  return (
    <div
      className={cn(styles.wrap, statusCN)}
      onClick={() => toggleDetails(data.id)}
    >
      <div>
        <span className={styles.time}>
          {formatTime(data.start_ts)} - {formatTime(data.stop_ts)}
        </span>{" "}
        {data.name}
      </div>
      <div
        className={styles.progress}
        style={{ width: `${progress * 100}%` }}
      ></div>
    </div>
  );
}
