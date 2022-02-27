import { useStore } from "store";
import { Stack, Centered, Spinner } from "components/Misc";
import styles from "./styles.module.css";

export default function EventDetails() {
  const { details, isLoading, toggle } = useStore((s) => s.details);

  if (!details) return null;

  const reformat = (start) =>
    `${start.wdayname_short}, ${start.mday} ${start.mon_sh} - ${start.tm}`;

  const { channel } = details.tv_event;
  const channelLogo =
    channel.pic_url_128 || channel.pic_url_64 || channel.pic_url;

  return (
    <div
      className={styles.overlay}
      onClick={(ev) => ev.target === ev.currentTarget && toggle()}
    >
      <Centered position="absolute">
        <div className={styles.wrap}>
          {isLoading && (
            <Centered position="absolute">
              <Spinner />
            </Centered>
          )}
          {details && (
            <Stack direction="column">
              <Stack>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={channelLogo} alt="logo" />
                <Stack direction="column">
                  <h2>{details.tv_event.name}</h2>
                  <h2>{reformat(details.tv_event.start)}</h2>
                </Stack>
              </Stack>
              <div>
                {details.tv_event.near?.map((x) => (
                  <div key={x.id} onClick={() => toggle(x.id.toString())}>
                    {reformat(x.start)}
                  </div>
                ))}
              </div>
              <p>{details.tv_event.descr}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={details.tv_event.sm_image_url}
                alt="event image"
                className={styles.eventImage}
              />
            </Stack>
          )}
        </div>
      </Centered>
    </div>
  );
}
