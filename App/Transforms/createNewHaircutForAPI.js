import moment from 'moment'
import 'moment-timezone'
import filter from 'lodash/filter'

export const getDateTimeFromAppointment = (date, time, timezone) => {
  date = moment(date)
  date = date.tz(timezone)
  time = moment(time, 'h:mm a')
  date = date.set('hour', time.get('hour'))
  date = date.set('minute', time.get('minute'))
  return date.format()
}
export const getRecurringStartDate = (recurringStartDate, recurringDay) => {
  const recurringStartDay = moment(recurringStartDate).isoWeekday()
  if (recurringStartDay <= recurringDay) {
    return moment(recurringStartDate).isoWeekday(recurringDay)
  } else {
    recurringStartDate = moment(recurringStartDate).isoWeekday(1).add(1, 'weeks')
    return recurringStartDate.day(recurringDay)
  }
}

export default (haircut, barber) => {
  const { timezone, workAddress, _id } = barber
  const { recurringAppointment, services, recurringTime, recurringDay, recurringStartDate, start, end, startDate, endDate, customerId, phoneNumber, firstName, lastName, email } = haircut
  return {
    recurring: recurringAppointment,
    recurringTime: recurringAppointment ? recurringTime : null,
    recurringStartDate: recurringAppointment
      ? getDateTimeFromAppointment(getRecurringStartDate(recurringStartDate, recurringDay), start, timezone)
      : null,
    start: recurringAppointment
      ? getDateTimeFromAppointment(recurringStartDate, start, timezone)
      : getDateTimeFromAppointment(startDate, start, timezone),
    end: recurringAppointment
      ? getDateTimeFromAppointment(recurringStartDate, end, timezone)
      : getDateTimeFromAppointment(endDate, end, timezone),
    workAddress,
    timezone,
    barberId: _id,
    consumerId: customerId,
    consumer: {
      phoneNumber,
      firstName,
      lastName,
      email
    },
    services: filter(services, 'selected'),

  }
}
