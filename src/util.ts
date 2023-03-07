export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function clamp({
  min,
  max,
  value,
}: {
  min: number;
  max: number;
  value: number;
}) {
  return Math.min(Math.max(value, min), max);
}
