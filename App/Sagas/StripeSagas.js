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
import StripeActions from '../Redux/StripeRedux'
import BarberActions, { BarberSelectors } from '../Redux/BarberRedux'

// import { StripeSelectors } from '../Redux/StripeRedux'

export function * getStripe (api, action) {
  const { data } = action
  // get current data from Store
  // const currentData = yield select(StripeSelectors.getData)
  // make the call to the api
  const response = yield call(api.getstripe, data)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(StripeActions.stripeSuccess(response.data))
  } else {
    yield put(StripeActions.stripeFailure())
  }
}

export function * getBarberToken (api, action) {
  const { authCode } = action

  const response = yield call(api.barberStripeToken, authCode)

  if (response.ok) {
    const oldBarber = yield select(BarberSelectors.getBarber)
    const updatedBarber = {...oldBarber.asMutable(), stripeId: response.data.stripe_user_id}

    const updateResponse = yield call(api.barberUpdate, updatedBarber)
    if (updateResponse.ok) {
      yield put(BarberActions.barberUpdateSuccess(updateResponse.data))
    } else {
      yield put(BarberActions.barberUpdateFailure('There was a problem associating your BarberMe Account with your Stripe Account. Please contact Customer Service'))
    }
    yield put(StripeActions.stripeBarberTokenSuccess())
  } else {
    yield put(StripeActions.stripeBarbeTokenError('Stripe Error. There was an problem connecting your Stripe account to the BarberMe platform. Please try again.'))
  }
}
