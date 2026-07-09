import { timeToSeconds } from "./timeConverter";

export function getTimeDifference(
  athleteTime,
  standardTime
) {
  if (!athleteTime || !standardTime)
    return "";

  const athleteSeconds =
    timeToSeconds(athleteTime);

  const standardSeconds =
    timeToSeconds(standardTime);

  const difference =
    athleteSeconds -
    standardSeconds;

  const sign =
    difference <= 0 ? "-" : "+";

  const absDiff =
    Math.abs(difference);

  const minutes =
    Math.floor(absDiff / 60);

  const seconds =
    absDiff % 60;

  return `${sign}${String(
    minutes
  ).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}
