import create, { SetState, GetState, Mutate, StoreApi } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import shallow from "zustand/shallow";
import { lens, withLenses } from "@dhmk/zustand-lens";
import { isSameDay } from "date-fns";
import { byId, makeCancellable } from "@dhmk/utils";
import * as api from "api";

import { DetailsStore, ScheduleStore, Store, ScheduleData } from "types";

const initialState: ScheduleData = {
  channels: [],
  date: new Date(),
  region: undefined,
};

const createSchedule = ({ channels, date, region } = initialState) =>
  lens<ScheduleStore>((set, get) => ({
    isLoading: false,
    channels,
    date,
    region,

    selectChannels: makeCancellable<ScheduleStore["selectChannels"]>(
      (checkCancel) => async (ids, date, region) => {
        const currentData = get();
        const nextData = {
          date: date || currentData.date,
          region: region || currentData.region,
        };
        const force =
          !isSameDay(nextData.date, currentData.date) ||
          nextData.region !== currentData.region;

        const getId = (x) => x.channel.id;

        const cache = byId(get().channels, getId);
        const idsToFetch = force ? ids : ids.filter((id) => !cache[id]);

        const buildChannels = () => ids.map((id) => cache[id]);

        if (!force && ids.length && !idsToFetch.length) {
          set({ channels: buildChannels() });
        } else {
          try {
            set({ isLoading: true });

            let channels = await api
              .fetchChannels(idsToFetch, nextData.date, nextData.region)
              .then(checkCancel);

            if (ids.length) {
              Object.assign(cache, byId(channels, getId));
              channels = buildChannels();
            }

            set({ channels, ...nextData });
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
  ({ schedule: { channels, date, region } }) => ({ channels, date, region }),
  (ch) => {
    localStorage.setItem("schedule", JSON.stringify(ch));
  },
  { equalityFn: shallow }
);
