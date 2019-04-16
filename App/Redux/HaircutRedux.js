import { createReducer, createActions } from 'reduxsauce'
import moment from 'moment'
import Immutable from 'seamless-immutable'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import filter from 'lodash/filter'
import { sortHaircutsByDate, sortHaircuts, sortHaircutsByMinute } from '../Lib/utils'
import haircutsToCalendarAppointments, { haircutToAppointment } from '../Transforms/haircutsToCalendarAppointments'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  haircutRequest: ['data'],
  haircutSuccess: ['haircut'],
  haircutFailure: ['error'],
  haircutCreateRequest: ['data'],
  haircutCreateSuccess: ['haircuts', 'selectedHaircutId'],
  haircutCreateFailure: ['error'],
  setHaircutCreateRequest: ['data'],
  setHaircutUpdateRequest: ['data'],
  setSelectedHaircutId: ['id'],
  setSelectedDate: ['date'],
  haircutUpdateRequest: ['data'],
  haircutUpdateSuccess: ['haircuts'],
  haircutUpdateFailure: ['error'],
  haircutDeleteRequest: ['data'],
  haircutDeleteSuccess: ['haircut'],
  haircutDeleteFailure: ['error'],
  haircutDashboardRequest: ['data'],
  haircutDashboardSuccess: ['dashboard'],
  haircutDashboardFailure: ['error'],
  haircutBarberRequest: ['data'],
  haircutBarberSuccess: ['barberHaircuts'],
  haircutBarberFailure: ['error'],
  haircutCustomerRequest: ['data'],
  haircutCustomerSuccess: ['customerHaircuts'],
  haircutCustomerFailure: ['error'],
  updateHaircut: ['haircut']
})

export const HaircutTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null,
  haircut: null,
  barberHaircuts: [],
  customerHaircuts: [],
  haircutCreateRequest: false,
  haircutUpdateRequest: false,
  selectedHaircutId: null,
  createError: null,
  updateError: null,
  selectedDate: null
})

/* ------------- Selectors ------------- */

export const HaircutSelectors = {
  getData: state => state.data,
  getBarberHaircuts: state => state.haircut.barberHaircuts,
  getBarberCalendarAppointments: state => {
    const appointments = haircutsToCalendarAppointments(state.haircut.barberHaircuts)
    return !isEmpty(appointments) ? appointments : null
  },
  getHaircutById: (state, id) => {
    const { barberHaircuts } = state.haircut
    return find(barberHaircuts, {'_id': id})
  },
  getImportedAppointments: state => {
    const timezone = state.barber.barber.timezone
    const haircuts = filter(state.haircut.barberHaircuts, haircut => {
      return !haircut.completed
    })

    const sorted = sortHaircutsByDate(haircuts, timezone)
    sorted.past = sorted.past.map(haircut => haircutToAppointment(haircut)).reverse()
    sorted.present = sorted.present.map(haircut => haircutToAppointment(haircut)).reverse()
    return sorted
  },
  getSelectedHaircutId: state => state.haircut.selectedHaircutId,
  getSelectedAppointment: state => {
    const { barberHaircuts, selectedHaircutId } = state.haircut
    if (barberHaircuts && barberHaircuts.length && selectedHaircutId) {
      return haircutToAppointment(find(barberHaircuts, {'_id': selectedHaircutId}))
    } else {
      return null
    }
  },
  getSelectedHaircut: state => {
    const { barberHaircuts, selectedHaircutId } = state.haircut
    if (barberHaircuts && barberHaircuts.length && selectedHaircutId) {
      return find(barberHaircuts, {'_id': selectedHaircutId})
    } else {
      return {
        consumer: {},
        barber: {}
      }
    }
  },
  getHaircut: state => state.haircut.haircut,
  getCreateFlag: state => state.haircut.haircutCreateRequest,
  getUpdateFlag: state => state.haircut.haircutUpdateRequest,
  getFetching: state => state.haircut.fetching,
  getCreateError: state => state.haircut.createError,
  getUpdateError: state => state.haircut.updateError,
  getSelectedDate: state => {
    return state.haircut.selectedDate ? moment(state.haircut.selectedDate).format('YYYY-MM-DD') : moment().local().format('YYYY-MM-DD')
  },
  getCustomerHaircuts: state => state.haircut.customerHaircuts,
  getSortedCustomerHaircuts: state => {
    const customerHaircuts = state.haircut.customerHaircuts
    if (customerHaircuts && customerHaircuts.length) {
      return sortHaircutsByMinute(customerHaircuts)
    } else {
      return {}
    }
  }

}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = state =>
  state.merge({ fetching: true, payload: null })

// successful api lookup
export const success = (state, action) => {
  const { payload } = action
  return state.merge({ fetching: false, error: null, payload })
}

// Something went wrong somewhere.
export const failure = (state, { error }) =>
  state.merge({ fetching: false, error, payload: null })

// request the data from an api
export const haircutCreateRequest = state =>
  state.merge({ fetching: true, haircutCreateRequest: true, createError: null })

// successful api lookup
export const haircutCreateSuccess = (state, action) => {
  const { haircuts } = action
  return state.merge({ fetching: false, haircutCreateRequest: false, createError: null, barberHaircuts: haircuts })
}

export const setSelectedHaircutId = (state, { id }) =>
  state.merge({selectedHaircutId: id})
export const setSelectedDate = (state, { date }) =>
  state.merge({selectedDate: date})

export const setHaircutCreateRequest = (state, { data }) =>
  state.merge({haircutCreateRequest: data})
export const setHaircutUpdateRequest = (state, { data }) =>
  state.merge({haircutUpdateRequest: data})

// Something went wrong somewhere.
export const haircutCreateFailure = (state, { error }) =>
  state.merge({ fetching: false, createError: error, haircutCreateRequest: false })

// request the data from an api
export const haircutUpdateRequest = state =>
  state.merge({ fetching: true, haircutUpdateRequest: true, updateError: null })

// successful api lookup
export const haircutUpdateSuccess = (state, action) => {
  const { haircuts } = action
  return state.merge({ fetching: false, updateError: null, barberHaircuts: haircuts })
}
// successful api lookup
export const updateHaircut = (state, action) => {
  const { haircut } = action
  return state.merge({ haircut })
}
// Something went wrong somewhere.
export const haircutUpdateFailure = (state, { error }) =>
  state.merge({ fetching: false, haircutUpdateRequest: false, updateError: error })

// request the data from an api
export const haircutDeleteRequest = state =>
  state.merge({ fetching: true, haircut: null })

// successful api lookup
export const haircutDeleteSuccess = (state, action) => {
  const { haircut } = action
  return state.merge({ fetching: false, error: null, haircut })
}

// Something went wrong somewhere.
export const haircutDeleteFailure = (state, { error }) =>
  state.merge({ fetching: false, error, haircut: null })

// request the data from an api
export const haircutBarberRequest = state =>
  state.merge({ fetching: true })

// successful api lookup
export const haircutBarberSuccess = (state, action) => {
  const { barberHaircuts } = action
  return state.merge({ fetching: false, error: null, barberHaircuts })
}

// Something went wrong somewhere.
export const haircutBarberFailure = (state, { error }) =>
  state.merge({ fetching: false, error })
// request the data from an api
export const haircutCustomerRequest = state =>
  state.merge({ fetching: true, customerHaircuts: null })

// successful api lookup
export const haircutCustomerSuccess = (state, action) => {
  const { customerHaircuts } = action
  return state.merge({ fetching: false, error: null, customerHaircuts })
}

// Something went wrong somewhere.
export const haircutCustomerFailure = (state, { error }) =>
  state.merge({ fetching: false, error, customerHaircuts: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.HAIRCUT_REQUEST]: request,
  [Types.HAIRCUT_SUCCESS]: success,
  [Types.HAIRCUT_FAILURE]: failure,
  [Types.UPDATE_HAIRCUT]: updateHaircut,
  [Types.HAIRCUT_CREATE_REQUEST]: haircutCreateRequest,
  [Types.HAIRCUT_CREATE_SUCCESS]: haircutCreateSuccess,
  [Types.HAIRCUT_CREATE_FAILURE]: haircutCreateFailure,
  [Types.HAIRCUT_UPDATE_REQUEST]: haircutUpdateRequest,
  [Types.HAIRCUT_UPDATE_SUCCESS]: haircutUpdateSuccess,
  [Types.HAIRCUT_UPDATE_FAILURE]: haircutUpdateFailure,
  [Types.HAIRCUT_DELETE_REQUEST]: haircutDeleteRequest,
  [Types.HAIRCUT_DELETE_SUCCESS]: haircutDeleteSuccess,
  [Types.HAIRCUT_DELETE_FAILURE]: haircutDeleteFailure,
  [Types.HAIRCUT_BARBER_REQUEST]: haircutBarberRequest,
  [Types.HAIRCUT_BARBER_SUCCESS]: haircutBarberSuccess,
  [Types.HAIRCUT_BARBER_FAILURE]: haircutBarberFailure,
  [Types.HAIRCUT_CUSTOMER_REQUEST]: haircutCustomerRequest,
  [Types.HAIRCUT_CUSTOMER_SUCCESS]: haircutCustomerSuccess,
  [Types.HAIRCUT_CUSTOMER_FAILURE]: haircutCustomerFailure,
  [Types.SET_HAIRCUT_CREATE_REQUEST]: setHaircutCreateRequest,
  [Types.SET_SELECTED_HAIRCUT_ID]: setSelectedHaircutId,
  [Types.SET_SELECTED_DATE]: setSelectedDate,
  [Types.SET_HAIRCUT_UPDATE_REQUEST]: setHaircutUpdateRequest

})
