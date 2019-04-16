import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  customerRequest: ['data'],
  customerSuccess: ['payload'],
  customerFailure: null,
  customerSignUpRequest: ['data'],
  customerSignUpSuccess: ['customer'],
  customerSignUpFailure: ['error'],
  customerSignInRequest: ['data'],
  customerSignInSuccess: ['customer'],
  customerSignInFailure: ['error'],
  customerUpdateRequest: ['data'],
  customerUpdateSuccess: ['customer'],
  customerUpdateFailure: ['error']
})

export const CustomerTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null,
  customer: {}
})

/* ------------- Selectors ------------- */

export const CustomerSelectors = {
  getData: state => state.data,
  getCustomerId: state => state.customer.customer._id,
  getCustomer: state => state.customer.customer || {}
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

export const customerSignUpRequest = state =>
  state.merge({ fetching: true, customer: {}, error: null })

export const customerSignUpSuccess = (state, action) => {
  const { customer } = action
  return state.merge({ fetching: false, error: null, customer })
}
export const customerSignUpfailure = (state, {error}) =>
  state.merge({ fetching: false, error, customer: {} })

export const customerSignInRequest = state =>
  state.merge({ fetching: true, customer: {}, error: null })

export const customerSignInSuccess = (state, { customer }) =>
  state.merge({ fetching: false, error: null, customer })
export const customerSignInfailure = (state, { error }) =>
  state.merge({ fetching: false, error, customer: {} })
export const customerUpdateRequest = state =>
  state.merge({ fetching: true, error: null })
export const customerUpdateSuccess = (state, action) => {
  const { customer } = action
  return state.merge({ fetching: false, error: null, customer })
}
export const customerUpdateFailure = (state, { error }) =>
  state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CUSTOMER_REQUEST]: request,
  [Types.CUSTOMER_SUCCESS]: success,
  [Types.CUSTOMER_FAILURE]: failure,
  [Types.CUSTOMER_SIGN_UP_REQUEST]: customerSignUpRequest,
  [Types.CUSTOMER_SIGN_UP_SUCCESS]: customerSignUpSuccess,
  [Types.CUSTOMER_SIGN_UP_FAILURE]: customerSignUpfailure,
  [Types.CUSTOMER_SIGN_IN_REQUEST]: customerSignInRequest,
  [Types.CUSTOMER_SIGN_IN_SUCCESS]: customerSignInSuccess,
  [Types.CUSTOMER_SIGN_IN_FAILURE]: customerSignInfailure,
  [Types.CUSTOMER_UPDATE_REQUEST]: customerUpdateRequest,
  [Types.CUSTOMER_UPDATE_SUCCESS]: customerUpdateSuccess,
  [Types.CUSTOMER_UPDATE_FAILURE]: customerUpdateFailure
})
