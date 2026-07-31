const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function getOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) {
    return 'th'
  }

  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

const UTC_TO_EST_OFFSET_HOURS = 5

/**
 * Converts 24-hour hour/minute values into a 12-hour "HH:MM AM/PM" string.
 */
function to12HourTime(hour24, minute) {
  const period = hour24 >= 12 ? 'PM' : 'AM'
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
  const paddedHour = String(hour12).padStart(2, '0')
  const paddedMinute = String(minute).padStart(2, '0')

  return `${paddedHour}:${paddedMinute} ${period}`
}

/**
 * Formats an ISO-like UTC timestamp string (e.g. "2026-07-31T05:50:00") into
 * "HH:MM AM/PM EST on July 31st 2026". The timestamp is treated as UTC and
 * shifted back 5 hours to Eastern Standard Time before formatting.
 */
export function formatNoticeDate(createdAt) {
  if (!createdAt) {
    return ''
  }

  // Ensure the string is parsed as UTC, even if it has no timezone suffix.
  const hasTimezone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(createdAt)
  const utcDate = new Date(hasTimezone ? createdAt : `${createdAt}Z`)

  if (Number.isNaN(utcDate.getTime())) {
    return createdAt
  }

  const estDate = new Date(
    utcDate.getTime() - UTC_TO_EST_OFFSET_HOURS * 60 * 60 * 1000,
  )

  const year = estDate.getUTCFullYear()
  const monthName = MONTH_NAMES[estDate.getUTCMonth()]
  const dayNumber = estDate.getUTCDate()
  const suffix = getOrdinalSuffix(dayNumber)
  const time = to12HourTime(estDate.getUTCHours(), estDate.getUTCMinutes())

  return `${time} EST on ${monthName} ${dayNumber}${suffix} ${year}`
}
