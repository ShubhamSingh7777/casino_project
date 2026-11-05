import React from 'react'
import moment from 'moment'
import { TimezoneOption } from '../utils/format'

/** Live clock in the selected timezone, ticking every second. */
export const useClock = (tz: TimezoneOption) => {
  const [now, setNow] = React.useState(() => Date.now())

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const m = moment.utc(now).add(tz.offsetMinutes, 'minutes')
  return { date: m.format('MMM DD, YYYY'), time: m.format('HH:mm:ss') }
}
