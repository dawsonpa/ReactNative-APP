import React from 'react'
import * as ReactNavigation from 'react-navigation'
import { connect } from 'react-redux'
import {InvoiceSelectors} from '../Redux/InvoiceRedux'
import AppNavigation from './AppNavigation'

// here is our redux-aware our smart component
function ReduxNavigation (props) {
  const { dispatch, nav, invoiceNumber } = props
  const navigation = ReactNavigation.addNavigationHelpers({
    dispatch,
    state: nav,
    invoiceNumber
  })

  return <AppNavigation navigation={navigation} />
}

const mapStateToProps = state => ({
  nav: state.nav,
  invoiceNumber: InvoiceSelectors.getUnPaidCustomerInvoiceNumber(state),
  selectedInvoice: InvoiceSelectors.getSelectedInvoice(state)
})
export default connect(mapStateToProps)(ReduxNavigation)
