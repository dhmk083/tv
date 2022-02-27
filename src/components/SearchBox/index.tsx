import React from "react";
import { debounced, cancellableEffect, ArrayItem } from "@dhmk/utils";
import { usePromise, useOnBlur, useInput } from "@dhmk/react";
import { Stack, Spinner } from "components/Misc";
import Popup from "components/Popup";
import { useStore } from "store";
import { Id, Search, SearchType } from "types";
import styles from "./styles.module.css";

type TvSearchItems = ArrayItem<Search["items"][number]["items"]>[];

const selectItem = (id: Id, type: SearchType) => {};

export default function SearchBox({
  type = SearchType.Channel,
  onSelect = selectItem,
}) {
  const input = useInput();
  const [{ isPending, value: results }, capture] = usePromise<TvSearchItems>();
  const search = useStore((s) => s.search);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const runSearch = React.useMemo(() => debounced(search, 2000), []);

  React.useEffect(
    () =>
      cancellableEffect((checkCancel) => {
        if (!input.value) return capture();

        capture(
          runSearch(input.value)
            .then(checkCancel)
            .then((x) =>
              x.items.flatMap<any>((x) =>
                x.title === type || type === SearchType.All ? x.items : []
              )
            )
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input.value, type]
  );

  return (
    <div className={styles.wrap} {...useOnBlur(() => capture())}>
      <div className={styles.inputWrap}>
        <input {...input} autoFocus />
        <div className={styles.spinnerWrap}>
          {isPending && <Spinner className={styles.spinner} />}
        </div>
      </div>

      {results && (
        <Popup>
          <Stack
            direction="column"
            className={styles.results}
            align="stretch"
            gap="0"
          >
            {results.map((x) => (
              <Stack
                key={x.id}
                className={styles.item}
                justify="flex-start"
                onClick={() => {
                  onSelect(
                    x.id.toString(),
                    "alias" in x && x.alias === "tv_event"
                      ? SearchType.Event
                      : SearchType.Channel
                  );
                  capture();
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {"pic" in x && <img src={x.pic} alt="logo" />}
                {x.text}
              </Stack>
            ))}
            {results && !results.length && (
              <div className={styles.item}>Ничего не найдено</div>
            )}
          </Stack>
        </Popup>
      )}
    </div>
  );
}
