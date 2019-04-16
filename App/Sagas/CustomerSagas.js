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
import { AsyncStorage } from 'react-native'
import { call, put, select } from 'redux-saga/effects'
import * as moment from 'moment-timezone'
import CustomerActions, { CustomerSelectors } from '../Redux/CustomerRedux'
import InvoiceActions from '../Redux/InvoiceRedux'

export function * customerLogin (api, action) {
  const { data } = action
  // get current data from Store
  // const currentData = yield select(CustomerSelectors.getData)
  // make the call to the api
  const { phoneNumber, password } = data

  if (phoneNumber && password) {
    const response = yield call(api.customerLogin, data)

    // success?
    if (response.ok) {
      // You might need to change the response here - do this with a 'transform',
      // located in ../Transforms/. Otherwise, just pass the data back from the api.
      const invoiceResponse = yield call(api.customerInvoices, response.data._id)
      if (invoiceResponse.ok) {
        yield put(InvoiceActions.invoiceCustomerSuccess(invoiceResponse.data))
      } else {
        yield put(InvoiceActions.invoiceCustomerFailure('Problem retrieving invoice data.'))
      }
      yield put(CustomerActions.customerSignInSuccess(response.data))
      try {
        const user = JSON.stringify({
          userType: 'customer',
          phoneNumber: response.data.phoneNumber
        })
        AsyncStorage.setItem('@BarberMe:user', user)
      } catch (err) {
        console.log(err, 'failed to save user')
      }
    } else {
      yield put(CustomerActions.customerSignInFailure('Invalid Credentials. Make sure you have created an Account'))
    }
  } else {
    if (!phoneNumber) {
      yield put(CustomerActions.customerSignInFailure('Must Provide Valid Phone Number'))
    } else if (!password) {
      yield put(CustomerActions.customerSignInFailure('Must Provide Password'))
    }
  }
}

export function * customerSignUp (api, action) {
  const { data } = action
  const { firstName, lastName, phoneNumber, email, password } = data
  if (firstName && lastName && phoneNumber && email && password) {
    const timezone = moment.tz.guess()
    const signUp = { ...data, timezone }
    console.log(signUp, 'signing up')
    const response = yield call(api.customerUpsert, signUp)
    if (response.ok) {
      const invoiceResponse = yield call(api.customerInvoices, response.data._id)
      if (invoiceResponse.ok) {
        yield put(InvoiceActions.invoiceCustomerSuccess(invoiceResponse.data))
      } else {
        yield put(InvoiceActions.invoiceCustomerFailure('Problem retrieving invoice data.'))
      }
      yield put(CustomerActions.customerSignUpSuccess(response.data))
      try {
        const user = JSON.stringify({
          userType: 'customer',
          phoneNumber: response.data.phoneNumber
        })
        AsyncStorage.setItem('@BarberMe:user', user)
      } catch (err) {
        console.log(err, 'failed to save user')
      }
    } else {
      console.log(response, 'error')
      yield put(CustomerActions.customerSignUpFailure(response.data.message || response.data.statusDescription || 'There was an error signing you up'))
    }
  } else {
    yield put(CustomerActions.customerSignUpFailure('All fields required'))
  }
}

export function * updateCustomer (api, { data }) {
  const oldCustomer = yield select(CustomerSelectors.getCustomer)
  console.log(data, 'customer')
  console.log({ ...oldCustomer.asMutable(), ...data }, 'new barb')
  const updatedCustomer = data ? { ...oldCustomer.asMutable(), ...data } : oldCustomer
  const response = yield call(api.customerUpdate, updatedCustomer)

  if (response.ok) {
    yield put(CustomerActions.customerUpdateSuccess(response.data))
  } else {
    yield put(CustomerActions.customerUpdateFailure('Failed to Update data. Make sure you are connected to the Internet'))
  }
}
