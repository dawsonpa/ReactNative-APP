import filter from 'lodash/filter'
import createNewHaircutForAPI, { getDateTimeFromAppointment } from './createNewHaircutForAPI'

const createFutureHaircutFromInvoice = (invoice, barber) => {
  const futureHaircut = {
    ...invoice,
    start: invoice.futureStart,
    end: invoice.futureEnd,
    startDate: invoice.futureStartDate,
    endDate: invoice.futureEndDate,
  }

  return createNewHaircutForAPI(futureHaircut, barber)
}

export default (invoice, barber) => {
  const { timezone, _id } = barber
  const { phoneNumber, firstName, lastName, email, services } = invoice

  const futureHaircut = createFutureHaircutFromInvoice(invoice, barber)

  return {
    ...invoice,
    barberId: _id,
    consumerId: invoice.customerId,
    start: getDateTimeFromAppointment(invoice.startDate, invoice.start, timezone),
    end: getDateTimeFromAppointment(invoice.endDate, invoice.end, timezone),
    future: invoice.proposeAppointment,
    futureHaircut,
    consumer: {
      phoneNumber,
      firstName,
      lastName,
      email
    },
    services: filter(services, 'selected')
  }
}
