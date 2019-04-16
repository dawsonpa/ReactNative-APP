import React, { Component } from 'react'
import { View, Text, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native'
import branch from 'react-native-branch'
import queryString from 'query-string'
import { connect } from 'react-redux'
import { Colors, Metrics,Fonts } from '../Themes'
import BarberActions, { BarberSelectors } from '../Redux/BarberRedux'
import Overlay from 'react-native-modal-overlay'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/LinkingScreenStyle'

class LinkingScreen extends Component {
  constructor (props) {
    super(props)
    this._unsubscribeFromBranch = null
  }

  componentDidMount () {
    branch.skipCachedEvents()
    this._unsubscribeFromBranch = branch.subscribe(({ error, params }) => {
      if (error) {
        console.error('Error from Branch: ' + error)
        this.props.navigation.navigate('LandingScreen')
        return
      }

      // params will never be null if error is null

      if (params['+non_branch_link']) {
        // Route non-Branch URL if appropriate.
        const nonBranchUrl = params['+non_branch_link']
        const route = nonBranchUrl.replace(/.*?:\/\//g, '')
        const routeName = route.split('?')[0]
        const routeQuery = route.split('?')[1]
        const parsedQuery = queryString.parse(`?${routeQuery}`)
        console.log(route, 'route', routeName, routeQuery, parsedQuery)
        console.log(nonBranchUrl, 'urlllll', params)
        if (routeName === 'stripe') {
          if (parsedQuery.signup === 'true' && parsedQuery.barber === 'true') {
            if (!parsedQuery.error) {
              const stripeId = parsedQuery.stripeId
              this.barberStripeId = stripeId
              this.props.navigation.navigate('LinkingRouteHandlerScreen', { stripeId, signUp: true, barber: true, error: false })
            } else {
              this.props.navigation.navigate('LinkingRouteHandlerScreen', { signUp: true, barber: true, error: true })
            }
            return
          }
        }
        return
      }

      if (!params['+clicked_branch_link']) {
        console.log('clicked branch')
        // Indicates initialization success and some other conditions.
        // No link was opened.
        return
      }

      // A Branch link was opened.
      // Route link based on data in params.
      console.log('branch link clicked', params)
    })

    this.props.navigation.navigate('LandingScreen')
  }

  componentWillUnmount () {
    if (this._unsubscribeFromBranch) {
      this._unsubscribeFromBranch()
      this._unsubscribeFromBranch = null
    }
  }

  render () {
    return null
  }
}

const mapStateToProps = (state) => {
  return {
    updateBarberError: state.barber.updateError,
    updateBarberFetching: state.barber.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateBarber: barber => dispatch(BarberActions.barberUpdateRequest(barber))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkingScreen)
