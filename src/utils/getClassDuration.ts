export function getClassDuration(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const start = new Date();
  start.setHours(startHour ?? 0, startMinute, 0, 0);

  const end = new Date();
  end.setHours(endHour ?? 0, endMinute, 0, 0);

  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}
