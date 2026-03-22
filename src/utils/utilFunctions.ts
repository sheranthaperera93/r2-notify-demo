export function formatDate(unixTimestamp: number | null) {
  if (!unixTimestamp) return "Never";
  return new Date(unixTimestamp).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
