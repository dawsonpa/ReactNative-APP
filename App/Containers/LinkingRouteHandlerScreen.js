import React, { Component } from 'react'
import { ScrollView, View, ActivityIndicator, Alert } from 'react-native'
import { connect } from 'react-redux'
import BarberActions, { BarberSelectors } from '../Redux/BarberRedux'
import Overlay from 'react-native-modal-overlay'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux''
import { Colors, Metrics, Fonts } from '../Themes'
// Styles
import styles from './Styles/LinkingRouteHandlerScreenStyle'

class LinkingRouteHandlerScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: true,
      error: false
    }
    this.stripeBarberSignUp = false
  }

  handleStripeBarberTokenErrorPress () {
    this.setState({visible: false, error: false}, () => {
      this.props.navigation.navigate('BarberStripeScreen')
      this.stripeBarberSignUp = false
    })
  }

  componentDidMount () {
    const params = this.props.navigation.state.params

    if (params.barber && params.signUp) {
      this.stripeBarberSignUp = true
      if (!params.error) {
        const { stripeId } = params
        this.props.updateBarber({ stripeId })
      } else {
        this.setState({ error: true })
        Alert.alert(
          'Stripe Error',
          'There was a problem creating and connecting your Stripe account.',
          [
            {text: 'Try Again', onPress: () => this.handleStripeBarberTokenErrorPress()}
          ]
        )
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(nextProps, this.props, this.state, 'interest')
    const { updateBarberError, updateBarberFetching } = nextProps
    if (!this.state.error && updateBarberError) {
      const { stripeId } = this.props.navigation.state.params
      const updateObj = stripeId ? { stripeId } : null
      Alert.alert(
        'API Error',
        updateBarberError,
        [
          {text: 'Try Again', onPress: () => this.props.updateBarber(updateObj)}
        ])
      this.setState({ error: true })
    }

    if (this.state.error && !updateBarberError) {
      this.setState({ error: false })
    }

    if (!updateBarberError && !updateBarberFetching && this.stripeBarberSignUp) {
      this.setState({ visible: false }, () => {
        this.stripeBarberSignUp = false
        console.log('barber home screen')
        this.props.navigation.navigate('BarberHomeScreen')
      })
    }
  }

  render () {
    return (
      <View style={{height: Metrics.screenHeight, width: Metrics.screenWidth}}>
        <Overlay
          visible={this.state.visible}
          containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
          childrenWrapperStyle={{backgroundColor: Colors.clear}}
        >
          {
            !this.state.error
              ? <ActivityIndicator size={'large'} color={Colors.switchOrange} />
              : null
          }
        </Overlay>
      </View>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(LinkingRouteHandlerScreen)
