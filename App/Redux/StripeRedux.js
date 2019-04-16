import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  stripeRequest: ['data'],
  stripeSuccess: ['payload'],
  stripeFailure: null,
  stripeBarberTokenRequest: ['authCode'],
  stripeBarberTokenSuccess: ['stripeId'],
  stripeBarbeTokenError: ['error']
})

export const StripeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null,
  authCode: null,
  stripeId: null,
  barberTokenFetching: null,
  barberTokenError: null
})

/* ------------- Selectors ------------- */

export const StripeSelectors = {
  getData: state => state.data,
  getStripeBarberTokenFetching: state => state.barberTokenFetching,
  getStripeBarberTokenError: state => state.stripe.barberTokenError
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
export const stripeBarberTokenRequest = (state, { authCode }) =>
  state.merge({ fetching: true, authCode, stripeId: null })

// successful api lookup
export const stripeBarberTokenSuccess = (state, {stripeId}) => {
  return state.merge({ fetching: false, barberTokenError: null, authCode: null, stripeId })
}

// Something went wrong somewhere.
export const stripeBarberTokenFailure = (state, { error }) =>
  state.merge({ fetching: false, barberTokenError: error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.STRIPE_REQUEST]: request,
  [Types.STRIPE_SUCCESS]: success,
  [Types.STRIPE_FAILURE]: failure,
  [Types.STRIPE_BARBER_TOKEN_REQUEST]: stripeBarberTokenRequest,
  [Types.STRIPE_BARBER_TOKEN_SUCCESS]: stripeBarberTokenSuccess,
  [Types.STRIPE_BARBER_TOKEN_FAILURE]: stripeBarberTokenFailure
})
