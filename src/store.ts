import create, { SetState, GetState, Mutate, StoreApi } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import shallow from "zustand/shallow";
import { lens, withLenses } from "@dhmk/zustand-lens";
import { isSameDay } from "date-fns";
import { byId, makeCancellable } from "@dhmk/utils";
import * as api from "api";

import { DetailsStore, ScheduleStore, Store, Channel } from "types";

const initialState = {
  channels: [] as Channel[],
  date: new Date(),
};

const createSchedule = ({ channels, date } = initialState) =>
  lens<ScheduleStore>((set, get) => ({
    isLoading: false,
    channels,
    date,

    selectChannels: makeCancellable<ScheduleStore["selectChannels"]>(
      (checkCancel) => async (ids, date, force) => {
        const currentDate = get().date;
        if (date && !isSameDay(date, currentDate)) force = true;

        const getId = (x) => x.channel.id;

        const cache = byId(get().channels, getId);
        const idsToFetch = force ? ids : ids.filter((id) => !cache[id]);
        const dateToFetch = date || currentDate;

        const buildChannels = () => ids.map((id) => cache[id]);

        if (!force && ids.length && !idsToFetch.length) {
          set({ channels: buildChannels() });
        } else {
          try {
            set({ isLoading: true });

            let channels = await api
              .fetchChannels(idsToFetch, dateToFetch)
              .then(checkCancel);

            if (ids.length) {
              Object.assign(cache, byId(channels, getId));
              channels = buildChannels();
            }

            set({ channels, date: dateToFetch });
          } finally {
            set({ isLoading: false });
          }
        }
      }
    ),
  }));

const createDetails = () =>
  lens<DetailsStore>((set) => ({
    isLoading: false,
    details: undefined,

    toggle: makeCancellable<DetailsStore["toggle"]>(
      (checkCancel) => async (id) => {
        if (!id) return set({ isLoading: false, details: undefined });

        try {
          set({ isLoading: true });
          set({ details: await api.fetchDetails(id).then(checkCancel) });
        } finally {
          set({ isLoading: false });
        }
      }
    ),
  }));

// not SSR
const savedSchedule: typeof initialState =
  (global.localStorage && JSON.parse(localStorage.getItem("schedule")!)) ||
  undefined;

export const useStore = create<
  Store,
  SetState<Store>,
  GetState<Store>,
  Mutate<StoreApi<Store>, [["zustand/subscribeWithSelector", never]]>
>(
  devtools(
    subscribeWithSelector(
      withLenses(() => ({
        schedule: createSchedule(savedSchedule),
        details: createDetails(),
        search: api.search,
      }))
    )
  )
);

useStore.subscribe(
  ({ schedule: { channels, date } }) => ({ channels, date }),
  (ch) => {
    localStorage.setItem("schedule", JSON.stringify(ch));
  },
  { equalityFn: shallow }
);
