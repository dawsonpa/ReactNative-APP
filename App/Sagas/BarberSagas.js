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
import BarberActions, { BarberSelectors } from '../Redux/BarberRedux'

export function * barberLogin (api, action) {
  const { data } = action
  // get current data from Store
  // const currentData = yield select(BarberSelectors.getData)
  // make the call to the api
  const { phoneNumber, password } = data

  if (phoneNumber && password) {
    if (!phoneNumber) {
      yield put(BarberActions.barberSignInFailure('Must Provide Valid Phone Number'))
    } else if (!password) {
      console.log('no password')
      yield put(BarberActions.barberSignInFailure('Must Provide Password'))
    } else {
      const response = yield call(api.barberLogin, data)

      // success?
      if (response.ok) {
        // You might need to change the response here - do this with a 'transform',
        // located in ../Transforms/. Otherwise, just pass the data back from the api.
        yield put(BarberActions.barberSignInSuccess(response.data))
        try {
          const user = JSON.stringify({
            userType: 'barber',
            phoneNumber: response.data.phoneNumber
          })
          AsyncStorage.setItem('@BarberMe:user', user)
        } catch (err) {
          console.log(err, 'failed to save user')
        }
      } else {
        yield put(BarberActions.barberSignInFailure('Invalid Credentials. Make sure you have created an Account'))
      }
    }
  } else {
    yield put(BarberActions.barberSignInFailure('Must Provide valid phone number and password'))
  }
}

export function * barberSignUp (api, action) {
  const { data } = action
  const { firstName, lastName, phoneNumber, email, password } = data
  if (firstName && lastName && phoneNumber && email && password) {
    const timezone = moment.tz.guess()
    const signUp = { ...data, timezone }
    console.log(signUp, 'signing up')
    const response = yield call(api.barberUpsert, signUp)
    if (response.ok) {
      yield put(BarberActions.barberSignUpSuccess(response.data))
      try {
        const user = JSON.stringify({
          userType: 'barber',
          phoneNumber: response.data.phoneNumber
        })
        AsyncStorage.setItem('@BarberMe:user', user)
      } catch (err) {
        console.log(err, 'failed to save user')
      }
    } else {
      console.log(response, 'error')
      if (response.data) {
        const message = response.data.message || response.data.statusDescription

        yield put(BarberActions.barberSignUpFailure(message))
      } else {
        yield put(BarberActions.barberSignUpFailure('There was a problem signing you up. Check Your Internet Connection'))
      }
    }
  } else {
    yield put(BarberActions.barberSignUpFailure('All fields required'))
  }
}

export function * updateBarber (api, { data }) {
  const oldBarber = yield select(BarberSelectors.getBarber)
  console.log(data, 'barbr')
  console.log({ ...oldBarber.asMutable(), ...data }, 'new barb')
  const updatedBarber = data ? { ...oldBarber.asMutable(), ...data } : oldBarber
  const response = yield call(api.barberUpdate, updatedBarber)

  if (response.ok) {
    yield put(BarberActions.barberUpdateSuccess(response.data))
  } else {
    yield put(BarberActions.barberUpdateFailure('Failed to Update data. Make sure you are connected to the Internet'))
  }
}
