import type _Schedule from "pages/api/fixtures/schedule.json";
import type _EventDetails from "pages/api/fixtures/event-details.json";
import type _Search from "pages/api/fixtures/search.json";

export type Schedule = typeof _Schedule;
export type Channel = Schedule["schedule"][number];
export type TvEvent = Channel["event"][number];
export type EventDetails = typeof _EventDetails;
export type Search = typeof _Search;

export type Id = string;

export enum SearchType {
  Channel = "Каналы",
  Event = "Передачи",
  All = "Все",
}

export type ScheduleStore = {
  isLoading: boolean;
  channels: Channel[];
  date: Date;

  selectChannels(ids: Id[], date?: Date, force?: boolean);
};

export type DetailsStore = {
  isLoading: boolean;
  details?: EventDetails;

  toggle(id?: Id);
};

export type Store = {
  schedule: ScheduleStore;
  details: DetailsStore;

  search(q: string): Promise<Search>;
};
