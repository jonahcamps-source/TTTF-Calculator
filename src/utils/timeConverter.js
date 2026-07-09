export function timeToSeconds(time) {
  if (!time) return 0;

  const parts = time.split(":");

  if (parts.length !== 3) return 0;

  const [hours, minutes, seconds] =
    parts.map(Number);

  return (
    hours * 3600 +
    minutes * 60 +
    seconds
  );
}