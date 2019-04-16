import { takeLatest, all } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { GithubTypes } from '../Redux/GithubRedux'
import { BarberTypes } from '../Redux/BarberRedux'
import { CustomerTypes } from '../Redux/CustomerRedux'
import { HaircutTypes } from '../Redux/HaircutRedux'
import { InvoiceTypes } from '../Redux/InvoiceRedux'
import { StripeTypes } from '../Redux/StripeRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { getUserAvatar } from './GithubSagas'
import { barberLogin, barberSignUp, updateBarber } from './BarberSagas'
import { customerLogin, customerSignUp, updateCustomer } from './CustomerSagas'
import {dashboard, createInvoice, getCustomerInvoices, invoicePayment } from './InvoiceSagas'
import { getBarberHaircuts, createHaircut, updateHaircut, getCustomerHaircuts } from './HaircutSagas'
import { getBarberToken } from './StripeSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action
    takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api),
    takeLatest(BarberTypes.BARBER_SIGN_IN_REQUEST, barberLogin, api),
    takeLatest(BarberTypes.BARBER_SIGN_UP_REQUEST, barberSignUp, api),
    takeLatest(CustomerTypes.CUSTOMER_SIGN_IN_REQUEST, customerLogin, api),
    takeLatest(CustomerTypes.CUSTOMER_SIGN_UP_REQUEST, customerSignUp, api),
    takeLatest(InvoiceTypes.INVOICE_DASHBOARD_REQUEST, dashboard, api),
    takeLatest(BarberTypes.BARBER_UPDATE_REQUEST, updateBarber, api),
    takeLatest(HaircutTypes.HAIRCUT_BARBER_REQUEST, getBarberHaircuts, api),
    takeLatest(HaircutTypes.HAIRCUT_CREATE_REQUEST, createHaircut, api),
    takeLatest(HaircutTypes.HAIRCUT_UPDATE_REQUEST, updateHaircut, api),
    takeLatest(InvoiceTypes.INVOICE_CREATE_REQUEST, createInvoice, api),
    takeLatest(HaircutTypes.HAIRCUT_CUSTOMER_REQUEST, getCustomerHaircuts, api),
    takeLatest(InvoiceTypes.INVOICE_CUSTOMER_REQUEST, getCustomerInvoices, api),
    takeLatest(CustomerTypes.CUSTOMER_UPDATE_REQUEST, updateCustomer, api),
    takeLatest(InvoiceTypes.INVOICE_PAYMENT_REQUEST, invoicePayment, api),
    takeLatest(StripeTypes.STRIPE_BARBER_TOKEN_REQUEST, getBarberToken, api)
  ])
}
