import { timeToSeconds } from "./timeConverter";

export function metAutomaticStandard(
  athleteTime,
  standardTime
) {
  if (!athleteTime) return false;

  return (
    timeToSeconds(athleteTime) <=
    timeToSeconds(standardTime)
  );
}