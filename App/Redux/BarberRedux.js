import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import moment from 'moment'
import 'moment-timezone'
/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  barberRequest: ['data'],
  barberSuccess: ['payload'],
  barberFailure: null,
  barberUpdate: ['barber'],
  barberSignUpRequest: ['data'],
  barberSignUpSuccess: ['barber'],
  barberSignUpFailure: ['error'],
  barberSignInRequest: ['data'],
  barberSignInSuccess: ['barber'],
  barberSignInFailure: ['error'],
  barberUpdateRequest: ['data'],
  barberUpdateSuccess: ['barber'],
  barberUpdateFailure: ['error']
})

export const BarberTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null,
  barber: {},
  updateError: null
})

/* ------------- Selectors ------------- */

export const BarberSelectors = {
  getData: state => state.data,
  getId: state => state.barber.barber._id,
  getJoined: state => {
    const { barber } = state.barber
    return moment(barber.created_at).tz(barber.timezone).format('LL')
  },
  getServices: state => state.barber.barber.services,
  getBarber: state => state.barber.barber || {},
  getBarberId: state => state.barber.barber._id
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

export const barberSignUpRequest = state =>
  state.merge({ fetching: true, barber: null, error: null })

export const barberSignUpSuccess = (state, action) => {
  const { barber } = action
  return state.merge({ fetching: false, error: null, barber })
}

export const barberSignUpfailure = (state, {error}) =>
  state.merge({ fetching: false, error, barber: {} })

export const barberSignInRequest = state =>
  state.merge({ fetching: true, barber: {}, error: null })

export const barberSignInSuccess = (state, { barber }) =>
  state.merge({ fetching: false, error: null, barber })

export const barberSignInfailure = (state, { error }) =>
  state.merge({ fetching: false, error, barber: {} })

export const barberUpdate = (state, { barber }) =>
  state.merge({ fetching: false, error: null, barber })

export const barberUpdateRequest = state =>
  state.merge({ updateError: null, fetching: true })

export const barberUpdateSuccess = (state, { barber }) =>
  state.merge({ updateError: null, barber, fetching: false })

export const barberUpdateFailure = (state, { updateError }) =>
  state.merge({ updateError, fetching: false })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.BARBER_REQUEST]: request,
  [Types.BARBER_SUCCESS]: success,
  [Types.BARBER_FAILURE]: failure,
  [Types.BARBER_UPDATE]: barberUpdate,
  [Types.BARBER_SIGN_UP_REQUEST]: barberSignUpRequest,
  [Types.BARBER_SIGN_UP_SUCCESS]: barberSignUpSuccess,
  [Types.BARBER_SIGN_UP_FAILURE]: barberSignUpfailure,
  [Types.BARBER_SIGN_IN_REQUEST]: barberSignInRequest,
  [Types.BARBER_SIGN_IN_SUCCESS]: barberSignInSuccess,
  [Types.BARBER_SIGN_IN_FAILURE]: barberSignInfailure,
  [Types.BARBER_UPDATE_REQUEST]: barberUpdateRequest,
  [Types.BARBER_UPDATE_SUCCESS]: barberUpdateSuccess,
  [Types.BARBER_UPDATE_FAILURE]: barberUpdateFailure
})
