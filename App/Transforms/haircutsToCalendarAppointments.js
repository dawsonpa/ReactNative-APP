import moment from 'moment'
import 'moment-timezone'
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'
import sortBy from 'lodash/sortBy'

export const haircutToAppointment = haircut => {
  let haircutType = haircut.services.map(service => service.name)
  haircutType = haircutType.join(', ')

  const transformed = {
    notes: haircut.notes,
    start: moment(haircut.start).format('LT'),
    end: moment(haircut.end).format('LT'),
    date: moment(haircut.start).format('dddd, MMMM D, YYYY'),
    haircutStart: haircut.start,
    customerNumber: haircut.consumer.phoneNumber,
    haircutType,
    customerEmail: haircut.consumer.email,
    customerName: `${haircut.consumer.firstName} ${haircut.consumer.lastName}`,
    haircutId: haircut._id,
    calendarDate: moment(haircut.start).format('YYYY-MM-DD')
  }
  // console.log(transformed, haircut, 'compare')
  return transformed
}
export default haircuts => {
  const transformedHaircuts = haircuts.map(haircut => haircutToAppointment(haircut))
  let grouped = groupBy(transformedHaircuts, 'calendarDate')
  grouped = mapValues(grouped, appointments => {
    return sortBy(appointments, appointment => {
      return moment(appointment.haircutStart)
    })
  })
  return grouped
}
