import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Id } from "types";
import { useStore } from "store";

export const formatDate: typeof format = (d, f, o) =>
  format(d, f, { locale: ru, ...o });

export const getChannels = () => useStore.getState().schedule.channels;

export function selectChannelsHelper(id: Id, refId?: Id, replace = false) {
  const old = getChannels();
  const next = old.map((x) => x.channel.id);
  const refi = next.findIndex((x) => x === refId);
  const idi = next.findIndex((x) => x === id);

  if (replace && refi !== -1) next[refi] = id;
  if (idi !== -1) next.splice(idi, 1);
  if (refi === -1) return [id].concat(next);

  next.splice(refi, 0, id);
  return next;
}
