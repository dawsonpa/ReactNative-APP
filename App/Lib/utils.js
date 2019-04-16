import moment from 'moment'
import 'moment-timezone'
import sortBy from 'lodash/sortBy'
export const diffToday = date =>
  moment().startOf('day').diff(moment(date).startOf('day'), 'days')
export const diffNow = (date, timezone) =>
  moment().tz(timezone).diff(moment.tz(date, timezone), 'minutes')

export const sortHaircuts = haircuts =>
  sortBy(haircuts, haircut => moment.utc(haircut.start))
export const sortHaircutsByDate = (haircuts) => {
  let past = []
  let present = []
  let future = []
  haircuts.map(haircut => {
    const haircutStart = moment.utc(haircut.start).format('YYYY-MM-DD')
    const diff = diffToday(haircutStart)
    if (diff === 0) {
      present.push(haircut)
    } else if (diff > 0) {
      past.push(haircut)
    } else {
      future.push(haircut)
    }
  })

  past = past.length ? sortHaircuts(past) : []
  present = present.length ? sortHaircuts(present) : []
  future = future.length ? sortHaircuts(future) : []

  return {
    past,
    present,
    future
  }
}

export const sortHaircutsByMinute = (haircuts) => {
  let past = []
  let present = []
  let future = []
  haircuts.map(haircut => {
    const diff = diffNow(haircut.start, haircut.timezone)
    console.log(diff, 'diffff')
    if (diff === 0) {
      future.push(haircut)
    } else if (diff > 0) {
      past.push(haircut)
    } else {
      future.push(haircut)
    }
  })

  past = past.length ? sortHaircuts(past) : []
  present = present.length ? sortHaircuts(present) : []
  future = future.length ? sortHaircuts(future) : []

  return {
    past,
    present,
    future
  }
}
