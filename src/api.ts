import { Id, Channel, EventDetails, Search } from "types";

const toJson = (r) => r.json();

let _region = "";

export const fetchChannels = (ids: Id[], date: Date, region: Id = "") => {
  _region = _region || region;

  const query = new URLSearchParams();
  query.append("ids", ids.join(","));
  query.append("date", date.toISOString().split("T")[0]);
  query.append("region", _region);

  return fetch(`/api/tv/?${query}`).then<Channel[]>(toJson);
};

export const fetchDetails = (id: Id) =>
  fetch(`/api/tv/?eventId=${id}&region=${_region}`)
    .then<EventDetails | undefined>(toJson)
    .then((x) => (Object.keys(x!).length ? x : undefined));

export const search = (q: string) =>
  fetch(`/api/tv/?q=${q}&region=${_region}`).then<Search>(toJson);
