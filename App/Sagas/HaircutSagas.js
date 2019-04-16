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
import flattenDeep from 'lodash/flattenDeep'
import HaircutActions, { HaircutSelectors } from '../Redux/HaircutRedux'
import { BarberSelectors } from '../Redux/BarberRedux'
import { CustomerSelectors } from '../Redux/CustomerRedux'
import createNewHaircutForAPI from '../Transforms/createNewHaircutForAPI'

export function * getHaircut (api, action) {
  const { data } = action
  // get current data from Store
  // const currentData = yield select(HaircutSelectors.getData)
  // make the call to the api
  const response = yield call(api.gethaircut, data)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(HaircutActions.haircutSuccess(response.data))
  } else {
    yield put(HaircutActions.haircutFailure())
  }
}

export function * getBarberHaircuts (api) {
  const barberId = yield select(BarberSelectors.getBarberId)
  // get current data from Store
  // const currentData = yield select(HaircutSelectors.getData)
  // make the call to the api
  const response = yield call(api.barberHaircuts, barberId)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    console.log(response.data)
    yield put(HaircutActions.haircutBarberSuccess(response.data))
  } else {
    yield put(HaircutActions.haircutBarberFailure('Failed to get haircut Data. Check your Internet connection'))
  }
}

export function * getCustomerHaircuts (api) {
  const customerId = yield select(CustomerSelectors.getCustomerId)
  // get current data from Store
  // const currentData = yield select(HaircutSelectors.getData)
  // make the call to the api
  const response = yield call(api.customerHaircuts, customerId)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    console.log(response.data)
    yield put(HaircutActions.haircutCustomerSuccess(response.data))
  } else {
    yield put(HaircutActions.haircutCustomerFailure('Failed to get haircut Data. Check your Internet connection'))
  }
}

export function * createHaircut (api) {
  // get current data from Store
  const currentHaircuts = yield select(HaircutSelectors.getBarberHaircuts)
  const currentHaircut = yield select(HaircutSelectors.getHaircut)
  const barber = yield select(BarberSelectors.getBarber)
  const haircut = createNewHaircutForAPI(currentHaircut, barber)
  console.log(currentHaircut, 'current', haircut)
  // make the call to the api

  const response = yield call(api.createHaircut, haircut)
  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    const responseData = flattenDeep(response.data)
    let newHaircuts = currentHaircuts.asMutable()
    newHaircuts = flattenDeep([newHaircuts, responseData])
    console.log(newHaircuts, 'newwewewewew', currentHaircuts)
    yield put(HaircutActions.haircutCreateSuccess(newHaircuts))
    yield put(HaircutActions.setSelectedHaircutId(responseData[0]._id))
    yield put(HaircutActions.setSelectedDate(responseData[0].start))
  } else {
    yield put(HaircutActions.haircutCreateFailure('Error creating haircut'))
  }
}

export function * updateHaircut (api) {
  // get current data from Store
  console.log('update')
  const currentHaircuts = yield select(HaircutSelectors.getBarberHaircuts)
  const currentHaircut = yield select(HaircutSelectors.getHaircut)
  const selectedHaircut = yield select(HaircutSelectors.getSelectedHaircut)
  const barber = yield select(BarberSelectors.getBarber)
  let haircut = createNewHaircutForAPI(currentHaircut, barber)
  console.log(haircut, 'poeepddd')
  haircut = selectedHaircut.merge(haircut)
  console.log(currentHaircut, 'current', haircut)
  // make the call to the api

  const response = yield call(api.updateHaircut, haircut)
  console.log(response, 'responseeee')
  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    console.log(response.data, 'loolllooool')
    let newHaircuts = currentHaircuts.asMutable()
    newHaircuts = newHaircuts.concat(response.data)
    console.log(newHaircuts, 'oooooooo', currentHaircuts)
    yield put(HaircutActions.haircutUpdateSuccess(newHaircuts))
    yield put(HaircutActions.setSelectedHaircutId(response.data._id))
    yield put(HaircutActions.setSelectedDate(response.data.start))
  } else {
    yield put(HaircutActions.haircutUpdateFailure('Error creating haircut'))
  }
}
