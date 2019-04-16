import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import filter from 'lodash/filter'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  invoiceRequest: ['data'],
  invoiceSuccess: ['payload'],
  invoiceFailure: null,
  invoiceCreateRequest: ['data'],
  invoiceCreateSuccess: ['invoice'],
  invoiceCreateFailure: ['error'],
  invoiceUpdateRequest: ['data'],
  invoiceUpdateSuccess: ['invoice'],
  invoiceUpdateFailure: ['error'],
  invoiceDeleteRequest: ['data'],
  invoiceDeleteSuccess: ['invoice'],
  invoiceDeleteFailure: ['error'],
  invoiceNewInvoiceRequest: ['data'],
  invoiceNewInvoiceSuccess: ['invoice'],
  invoiceNewInvoiceFailure: ['error'],
  invoiceDashboardRequest: ['data'],
  invoiceDashboardSuccess: ['dashboard'],
  invoiceDashboardFailure: ['error'],
  invoiceBarberRequest: ['data'],
  invoiceBarberSuccess: ['barberInvoices'],
  invoiceBarberFailure: ['error'],
  invoiceCustomerRequest: ['id'],
  invoiceCustomerSuccess: ['customerInvoices'],
  invoiceCustomerFailure: ['error'],
  invoicePaymentRequest: ['data'],
  invoicePaymentSuccess: [],
  invoicePaymentFailure: ['paymentError'],
  setSelectedInvoiceId: ['id']

})

export const InvoiceTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null,
  invoices: null,
  invoice: null,
  customerInvoices: null,
  dashboard: {
    sessions: 0,
    customers: 0,
    totalIncome: 0
  },
  selectedInvoiceId: null,
  paymentError: null
})

/* ------------- Selectors ------------- */

export const InvoiceSelectors = {
  getData: state => state.data,
  getDashboard: state => state.invoice.dashboard,
  getCustomerInvoices: state => state.invoice.customerInvoices,
  getInvoiceFetching: state => state.invoice.fetching,
  getUnPaidCustomerInvoiceNumber: state => {
    const invoices = filter(state.invoice.customerInvoices, invoice => {
      return !invoice.paid
    })

    if (invoices && invoices.length) {
      return invoices.length
    } else {
      return 0
    }
  },
  getUnPaidCustomerInvoices: state => {
    const invoices = filter(state.invoice.customerInvoices, invoice => {
      return !invoice.paid
    })

    if (invoices && invoices.length) {
      return invoices
    } else {
      return []
    }
  },
  getSelectedInvoiceId: state => state.invoice.selectedInvoiceId,
  getSelectedInvoice: state => {
    const { customerInvoices, selectedInvoiceId } = state.invoice
    if (customerInvoices && customerInvoices.length && selectedInvoiceId) {
      const invoice = find(customerInvoices, {'_id': selectedInvoiceId})
      console.log(invoice, 'invoice')
      return invoice
    } else {
      return {
        consumer: {},
        barber: {}
      }
    }
  }
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) =>
  state.merge({ fetching: true, data, payload: null })

// successful api lookup
export const success = (state, action) => {
  const { payload } = action
  return state.merge({ fetching: false, error: null, payload })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null })

// request the data from an api
export const invoiceCreateRequest = state =>
  state.merge({ fetching: true, invoice: null, error: null })

// successful api lookup
export const invoiceCreateSuccess = (state, action) => {
  const { invoice } = action
  return state.merge({ fetching: false, error: null, invoice })
}

// Something went wrong somewhere.
export const invoiceCreateFailure = (state, { error }) =>
  state.merge({ fetching: false, error, payload: null })

// request the data from an api
export const invoiceUpdateRequest = state =>
  state.merge({ fetching: true, invoice: null })

// successful api lookup
export const invoiceUpdateSuccess = (state, action) => {
  const { invoice } = action
  return state.merge({ fetching: false, error: null, invoice })
}

// Something went wrong somewhere.
export const invoiceUpdateFailure = (state, { error }) =>
  state.merge({ fetching: false, error, invoice: null })

// request the data from an api
export const invoicePaymentRequest = state =>
  state.merge({ fetching: true, paymentError: null })

// successful api lookup
export const invoicePaymentSuccess = state => {
  return state.merge({ fetching: false, paymentError: null })
}

// Something went wrong somewhere.
export const invoicePaymentFailure = (state, { paymentError }) =>
  state.merge({ fetching: false, paymentError })

// request the data from an api
export const invoiceDeleteRequest = state =>
  state.merge({ fetching: true, invoice: null })

// successful api lookup
export const invoiceDeleteSuccess = (state, action) => {
  const { invoice } = action
  return state.merge({ fetching: false, error: null, invoice })
}

// Something went wrong somewhere.
export const invoiceDeleteFailure = (state, { error }) =>
  state.merge({ fetching: false, error, invoice: null })
export const setSelectedInvoiceId = (state, { id }) =>
  state.merge({selectedInvoiceId: id})
// request the data from an api
export const invoiceDashboardRequest = state =>
  state.merge({ fetching: true, dashboard: INITIAL_STATE.dashboard })

// successful api lookup
export const invoiceDashboardSuccess = (state, action) => {
  const { dashboard } = action
  return state.merge({ fetching: false, error: null, dashboard })
}

// Something went wrong somewhere.
export const invoiceDashboardFailure = (state, { error }) =>
  state.merge({ fetching: false, error, dashboard: INITIAL_STATE.dashboard })
// request the data from an api
export const invoiceBarberRequest = state =>
  state.merge({ fetching: true, barberInvoices: null })

// successful api lookup
export const invoiceBarberSuccess = (state, action) => {
  const { barberInvoices } = action
  return state.merge({ fetching: false, error: null, barberInvoices })
}

// Something went wrong somewhere.
export const invoiceBarberFailure = (state, { error }) =>
  state.merge({ fetching: false, error, barberInvoices: null })
// request the data from an api
export const invoiceCustomerRequest = state =>
  state.merge({ fetching: true, customerInvoices: null })

// successful api lookup
export const invoiceCustomerSuccess = (state, action) => {
  const { customerInvoices } = action
  return state.merge({ fetching: false, error: null, customerInvoices })
}

// Something went wrong somewhere.
export const invoiceCustomerFailure = (state, { error }) =>
  state.merge({ fetching: false, error, customerInvoices: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INVOICE_REQUEST]: request,
  [Types.INVOICE_SUCCESS]: success,
  [Types.INVOICE_FAILURE]: failure,
  [Types.INVOICE_CREATE_REQUEST]: invoiceCreateRequest,
  [Types.INVOICE_CREATE_SUCCESS]: invoiceCreateSuccess,
  [Types.INVOICE_CREATE_FAILURE]: invoiceCreateFailure,
  [Types.INVOICE_UPDATE_REQUEST]: invoiceUpdateRequest,
  [Types.INVOICE_UPDATE_SUCCESS]: invoiceUpdateSuccess,
  [Types.INVOICE_UPDATE_FAILURE]: invoiceUpdateFailure,
  [Types.INVOICE_DELETE_REQUEST]: invoiceDeleteRequest,
  [Types.INVOICE_DELETE_SUCCESS]: invoiceDeleteSuccess,
  [Types.INVOICE_DELETE_FAILURE]: invoiceDeleteFailure,
  [Types.INVOICE_DASHBOARD_REQUEST]: invoiceDashboardRequest,
  [Types.INVOICE_DASHBOARD_SUCCESS]: invoiceDashboardSuccess,
  [Types.INVOICE_DASHBOARD_FAILURE]: invoiceDashboardFailure,
  [Types.INVOICE_BARBER_REQUEST]: invoiceBarberRequest,
  [Types.INVOICE_BARBER_SUCCESS]: invoiceBarberSuccess,
  [Types.INVOICE_BARBER_FAILURE]: invoiceBarberFailure,
  [Types.INVOICE_CUSTOMER_REQUEST]: invoiceCustomerRequest,
  [Types.INVOICE_CUSTOMER_SUCCESS]: invoiceCustomerSuccess,
  [Types.INVOICE_CUSTOMER_FAILURE]: invoiceCustomerFailure,
  [Types.INVOICE_PAYMENT_REQUEST]: invoicePaymentRequest,
  [Types.INVOICE_PAYMENT_SUCCESS]: invoicePaymentSuccess,
  [Types.INVOICE_PAYMENT_FAILURE]: invoicePaymentFailure,
  [Types.SET_SELECTED_INVOICE_ID]: setSelectedInvoiceId
})
