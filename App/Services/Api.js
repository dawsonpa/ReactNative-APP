// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import AppConfig from '../Config/AppConfig'
import { baseURL } from '../Config/APIConfig'

// our "constructor"
const create = () => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json'
    },
    // 10 second timeout...
    timeout: 10000
  })

  const apiStripe = apisauce.create({
    // base URL is read from the "constructor"
    baseURL: AppConfig.stripeBaseUrl,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json'
    },
    // 10 second timeout...
    timeout: 10000
  })

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  const barberLogin = credentials => api.post('/authentication/barber/login', credentials)
  const customerLogin = credentials => api.post('/authentication/consumer/login', credentials)
  const barberUpsert = barber => api.post('/authentication/barber/signup', barber)
  const customerUpsert = customer => api.post('/authentication/consumer/signup', customer)
  const customerHaircuts = customerId => api.get(`/haircuts/consumer/${customerId}`)
  const barberHaircuts = barberId => api.get(`/haircuts/barber/${barberId}`)
  const barberDashboard = barberId => api.get(`/invoices/barber/dashboard/${barberId}`)
  const createHaircut = haircut => api.post(`/haircuts/new`, haircut)
  const updateHaircut = haircut => api.put(`/haircuts/update`, haircut)
  const deleteHaircut = haircutId => api.delete(`/haircuts/${haircutId}`)
  const newInvoice = invoice => api.post('/invoices/invoice/new', invoice)
  const customerInvoices = customerId => api.get(`/invoices/consumer/${customerId}`)
  const invoicePayment = (id, invoice) => api.put(`/invoices/payment/${id}`, invoice)
  const barberUpdate = barber => api.put('/barbers/update', barber)
  const customerUpdate = customer => api.put('/consumers/update', customer)
  const getRoot = () => api.get('')
  const getRate = () => api.get('rate_limit')
  const getUser = (username) => api.get('search/users', {q: username})

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    getRoot,
    getRate,
    getUser,
    barberLogin,
    customerLogin,
    barberUpsert,
    customerUpsert,
    customerUpdate,
    customerHaircuts,
    barberHaircuts,
    barberDashboard,
    barberUpdate,
    createHaircut,
    updateHaircut,
    deleteHaircut,
    newInvoice,
    customerInvoices,
    invoicePayment
  }
}

// let's return back our create method as the default.
export default {
  create
}
