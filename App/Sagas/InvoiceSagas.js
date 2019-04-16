/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { call, put, select } from 'redux-saga/effects'
import InvoiceActions, { InvoiceSelectors } from '../Redux/InvoiceRedux'
// import { InvoiceSelectors } from '../Redux/InvoiceRedux'
import { BarberSelectors } from '../Redux/BarberRedux'
import { CustomerSelectors } from '../Redux/CustomerRedux'
import { API_ERROR_MESSAGE } from '../Lib/const'
import createInvoiceForAPI from '../Transforms/createInvoiceForAPI'

export function * getInvoice (api, { id }) {
  const customerId = yield select(CustomerSelectors.getCustomerId) || id
  // get current data from Store
  // const currentData = yield select(HaircutSelectors.getData)
  // make the call to the api
  const response = yield call(api.customerInvoices, customerId)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    console.log(response.data)
    yield put(InvoiceActions.invoiceCustomerSuccess(response.data))
  } else {
    yield put(InvoiceActions.invoiceCustomerFailure('Failed to get invoice Data. Check your Internet connection'))
  }
}

export function * dashboard (api) {
  const state = yield select()
  console.log(state, 'saga state')
  const barberId = BarberSelectors.getId(state)
  // get current data from Store
  // const currentData = yield select(InvoiceSelectors.getData)
  // make the call to the api
  const response = yield call(api.barberDashboard, barberId)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(InvoiceActions.invoiceDashboardSuccess(response.data))
  } else {
    yield put(InvoiceActions.invoiceDashboardFailure(API_ERROR_MESSAGE))
  }
}

export function * createInvoice (api, action) {
  const { data } = action
  const state = yield select()
  const barber = BarberSelectors.getBarber(state)
  const invoice = createInvoiceForAPI(data, barber)
  console.log(invoice, 'invoiceeeeeee')
  const response = yield call(api.newInvoice, invoice)

  if (response.ok) {
    yield put(InvoiceActions.invoiceCreateSuccess(response.data))
  } else {
    yield put(InvoiceActions.invoiceCreateFailure(response.data.message || response.data.statusDescription || API_ERROR_MESSAGE))
  }
}

export function * getCustomerInvoices (api, { id }) {
  const customerId = yield select(CustomerSelectors.getCustomerId) || id
  // get current data from Store
  // const currentData = yield select(HaircutSelectors.getData)
  // make the call to the api
  const response = yield call(api.customerInvoices, customerId)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    console.log(response.data)
    yield put(InvoiceActions.invoiceCustomerSuccess(response.data))
  } else {
    yield put(InvoiceActions.invoiceCustomerFailure('Failed to get invoice Data. Check your Internet connection'))
  }
}

export function * invoicePayment (api, { data }) {
  const invoiceId = yield select(InvoiceSelectors.getSelectedInvoiceId)
  const invoice = {
    ...data,
    paid: true
  }
  // get current data from Store
  // const currentData = yield select(HaircutSelectors.getData)
  // make the call to the api

  const response = yield call(api.invoicePayment, invoiceId, invoice)

  if (response.ok) {
    const invoiceResponse = yield call(api.customerInvoices, response.data.consumerId)
    if (invoiceResponse.ok) {
      yield put(InvoiceActions.invoiceCustomerSuccess(invoiceResponse.data))
    } else {
      yield put(InvoiceActions.invoiceCustomerFailure('Problem retrieving invoice data.'))
    }
    yield put(InvoiceActions.invoicePaymentSuccess())
  } else {
    yield put(InvoiceActions.invoicePaymentFailure('API Error.'))
  }

}
