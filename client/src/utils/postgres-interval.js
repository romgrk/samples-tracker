/*
 * postgres-interval.js
 */

const pattern = /^ *(\d+) *((?:year|month|mon|week|day|hour|min|minute|second|sec)s?) */

function tokenize(input) {
  const tokens = []

  let rest = input
  do {
    const match = rest.match(pattern)
    if (match === null)
      return undefined
    tokens.push({ value: match[1], unit: match[2] })
    rest = rest.slice(match[0].length)
  } while(rest.length > 0)

  return tokens
}

export function isValid(interval) {
  if (interval === undefined)
    return undefined

  const tokens = tokenize(interval)

  return tokens !== undefined
}

export function parse(interval) {
  const tokens = tokenize(interval)

  if (tokens === undefined)
    return undefined

  const result = {}

  tokens.forEach(({ unit, value }) => {
    switch(unit.slice(0, 3)) {
      case 'yea': result.years = value; break;
      case 'mon': result.months = value; break;
      case 'wee': result.weeks = value; break;
      case 'day': result.days = value; break;
      case 'hou': result.hours = value; break;
      case 'min': result.minutes = value; break;
      case 'sec': result.seconds = value; break;
      default: throw new Error('unreachable')
    }
  })

  return result
}
