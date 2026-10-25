/**
 * Timezone and countdown calculation utility for Lalee's Birthday.
 * Default target: 23 November in Asia/Kolkata timezone.
 */

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isBirthday: boolean;
  targetYear: number;
  targetDateISO: string;
  formattedTarget: string;
}

/**
 * Gets the current time in the specified IANA timezone as Date components.
 */
export function getZonedDateParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const partMap: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      partMap[part.type] = parseInt(part.value, 10);
    }
  }

  return {
    year: partMap.year,
    month: partMap.month, // 1 - 12
    day: partMap.day,     // 1 - 31
    hour: partMap.hour === 24 ? 0 : partMap.hour,
    minute: partMap.minute,
    second: partMap.second,
  };
}

/**
 * Determines whether the given year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Calculates countdown to next occurrence of targetDay & targetMonth in given timezone.
 * Handles the birthday day itself (isBirthday = true) and automatically rolls over to next year.
 */
export function calculateBirthdayCountdown(
  targetDay = 23,
  targetMonth = 11, // November (1-indexed)
  timeZone = 'Asia/Kolkata',
  currentDate = new Date()
): CountdownResult {
  const nowParts = getZonedDateParts(currentDate, timeZone);

  // Check if today is the birthday in the target timezone
  const isBirthday = nowParts.month === targetMonth && nowParts.day === targetDay;

  // Determine target year
  let targetYear = nowParts.year;
  if (!isBirthday) {
    // If the birthday this year has already passed
    if (
      nowParts.month > targetMonth ||
      (nowParts.month === targetMonth && nowParts.day > targetDay)
    ) {
      targetYear += 1;
    }
  }

  // To compute the exact millisecond difference accurately according to the timezone:
  // We find UTC timestamp when the zoned time matches the target midnight (00:00:00).
  // Asia/Kolkata is fixed UTC+05:30 (no daylight saving time shifts).
  // More generically, we can construct the ISO string for the target time in the timezone.
  
  // Format target date in target timezone at 00:00:00
  const targetDateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}T00:00:00`;
  
  // Create Date object representing that instant
  // Note: For Asia/Kolkata offset is +05:30
  let offsetString = '+05:30';
  if (timeZone === 'Asia/Kolkata' || timeZone === 'IST') {
    offsetString = '+05:30';
  } else {
    // Generic offset calculation
    try {
      const probe = new Date();
      const tzName = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' }).format(probe);
      const match = tzName.match(/GMT([+-]\d{2}:\d{2})/);
      if (match) offsetString = match[1];
    } catch {
      offsetString = '+05:30';
    }
  }

  const targetDate = new Date(`${targetDateStr}${offsetString}`);
  const diffMs = targetDate.getTime() - currentDate.getTime();

  if (isBirthday) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isBirthday: true,
      targetYear: nowParts.year,
      targetDateISO: targetDate.toISOString(),
      formattedTarget: `23 November ${nowParts.year}`,
    };
  }

  // If diffMs is negative (just in case), ensure non-negative
  const safeDiff = Math.max(0, diffMs);
  const totalSeconds = Math.floor(safeDiff / 1000);

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isBirthday: false,
    targetYear,
    targetDateISO: targetDate.toISOString(),
    formattedTarget: `23 November ${targetYear}`,
  };
}
