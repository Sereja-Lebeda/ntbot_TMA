interface isInPeriodProps {
  createStamp: number;
  from: number | null;
  to: number | null;
}

function isInPeriod({ createStamp, from, to }: isInPeriodProps): boolean {
  if (from !== null && createStamp < from) return false;
  if (to !== null) {
    const endDay = new Date(to).setHours(23, 59, 59, 999);
    if (createStamp > endDay) return false;
  }

  return true;
}

export default isInPeriod;
