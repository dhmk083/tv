import { NextApiResponse } from "next";
import type _Schedule from "./fixtures/schedule.json";

const jfetch = (url) => fetch(url).then((r) => r.json());

export default async function handler(req, res: NextApiResponse) {
  let data;

  if (req.query.channelId) {
    data = await jfetch(
      `https://tv.mail.ru/ajax/index/?period=all&in=${req.query.channelId}`
    );
  } else if (req.query.eventId) {
    data = await jfetch(
      `https://tv.mail.ru/ajax/event/?id=${req.query.eventId}`
    );
  } else if (req.query.q) {
    const search = new URLSearchParams();
    search.set("q", req.query.q);

    data = await jfetch(`https://tv.mail.ru/ajax/suggest_tv?${search}`);
  } else {
    const { date, ids } = req.query;

    if (ids) {
      const batches = partition(ids.split(","), 24).map((x) =>
        search24(date, x)
      );

      data = (await Promise.all(batches)).flat();
    } else {
      data = await search24(date, undefined);
    }
  }

  res
    .status(200)
    .setHeader("Cache-Control", `max-age=${60 * 15}`)
    .json(data);
}

// no more than 24 ids :/
function search24(date, ids) {
  const search = new URLSearchParams("channel_type=all&period=all");

  if (date) search.set("date", date);
  if (ids) search.set("in", ids);

  const url = `https://tv.mail.ru/ajax/index/?${search}`;

  return fetch(url)
    .then<typeof _Schedule>((r) => r.json())
    .then((x) => x.schedule);
}

const partition = (arr, n) =>
  Array.from({ length: Math.ceil(arr.length / n) }, (_, i) =>
    arr.slice(n * i, n * (i + 1))
  );
