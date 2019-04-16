import React, { Component } from 'react'
import { View, Text, Image, ImageBackground, TextInput, findNodeHandle, Switch, TouchableHighlight, Alert, KeyboardAvoidingView  } from 'react-native'
import { BlurView } from 'react-native-blur'
import { connect } from 'react-redux'
import { AsYouType } from 'libphonenumber-js'
import { Images, Metrics, Colors, Fonts } from '../Themes'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// Add Actions - replace 'Your' with whatever your reducer is called :)
import BarberActions from '../Redux/BarberRedux'
import CustomerActions from '../Redux/CustomerRedux'

// Styles
import styles from './Styles/SignInScreenStyle'
import RoundedButton from '../Components/RoundedButton'

class SignInScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      viewRef: null,
      touchId: false,
      phoneNumber: null,
      password: null,
      showPassword: false
    }

    this.loginRequest = false
  }
  componentWillReceiveProps (nextProps) {
    if (!nextProps.barber.error && !nextProps.customer.error && this.loginRequest && !nextProps.barber.fetching && !nextProps.customer.fetching) {
      const { state, navigate } = this.props.navigation
      if (state.params.userType === 'barber') {
        navigate('BarberHomeScreen')
      } else {
        navigate('CustomerHomeScreen', {invoiceNumber: 2})
      }
      this.loginRequest = false
    } else if ((nextProps.barber.error || nextProps.customer.error) && this.loginRequest) {
      Alert.alert(
        'Error Logging In',
        nextProps.barber.error || nextProps.customer.error,
        [
          { text: 'OK' }
        ]
      )
      this.loginRequest = false
    }
  }
  imageLoaded () {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) })
  }
  handleNumberChange (phoneNumber) {
    const formattedNum = new AsYouType('US').input(phoneNumber)
    this.setState({phoneNumber: formattedNum})
  }
  handlePasswordChange (password) {
    this.setState({password})
  }

  handleTouchIdChange = touchId => {
    this.setState({touchId})
  }
  handleLoginPress = () => {
    const { state } = this.props.navigation
    const { password, phoneNumber } = this.state
    const credentials = { password, phoneNumber }
    this.loginRequest = true
    state.params.userType === 'barber' ? this.props.barberLogin(credentials) : this.props.customerLogin(credentials)
  }
  render () {
    const { navigate, state } = this.props.navigation
    const { phoneNumber, password, touchId, showPassword } = this.state
    return (
      <ImageBackground
        source={Images.landingBg}
        style={styles.backgroundImage}
        ref={(img) => { this.backgroundImage = img }}
        onLoadEnd={this.imageLoaded.bind(this)}
      >
        <BlurView
          style={styles.absolute}
          viewRef={this.state.viewRef}
          blurType='dark'
          blurAmount={0}
        />
        <KeyboardAwareScrollView contentContainerStyle={[styles.container, {flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around'}]}>
          <View style={styles.titleContainer}>
            <Image source={Images.landing} style={styles.landing} />
            <Text style={styles.title}> BarberMe </Text>
            <Text style={styles.titleText}> Haircuts made easy </Text>
          </View>
          <View style={styles.inputContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'center', borderBottomColor: Colors.snow, borderBottomWidth: 1}}>
              <FontAwesomeIcon
                name={'phone'}
                size={20}
                color={Colors.snow}
                style={{width: 40}}
              />
              <TextInput
                ref='phoneNumber'
                style={[{ height: 40, width: Metrics.screenWidth - 40 - 60, color: Colors.snow }]}
                value={phoneNumber}
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handleNumberChange.bind(this)}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.password.focus()}
                placeholder='phone number...'
                placeholderTextColor={Colors.placeholder}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'center', borderBottomColor: Colors.snow, borderBottomWidth: 1}}>
              <FontAwesomeIcon
                name={'lock'}
                size={20}
                color={Colors.snow}
                style={{width: 40}}
              />
              <TextInput
                ref='password'
                style={[{ height: 40, color: Colors.snow, width: Metrics.screenWidth - 40 - 60 }]}
                value={password}
                keyboardType='default'
                returnKeyType='done'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handlePasswordChange.bind(this)}
                underlineColorAndroid='transparent'
                secureTextEntry={!showPassword}
                onSubmitEditing={() => this.refs.password.focus()}
                placeholder='password...'
                placeholderTextColor={Colors.placeholder}
              />
            </View>
            <View style={{flexDirection: 'row', width: Metrics.screenWidth - 60, justifyContent: 'space-between'}}>
              <Text style={{fontSize: Fonts.size.input, color: Colors.infoGrey}}>Enable Touch Id</Text>
              <Switch value={touchId} onValueChange={(changed) => this.handleTouchIdChange(changed)} />
            </View>
          </View>
          <View style={{flexDirection: 'column'}}>
            <View style={{flexDirection: 'row', justifyContent: 'center', width: Metrics.screenWidth}}>
              <RoundedButton onPress={() => this.handleLoginPress()} text={'Log In'} style={{width: Metrics.screenWidth * 0.45, borderColor: Colors.snow, borderWidth: 1}}> Log In</RoundedButton>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center', width: Metrics.screenWidth}} >
              <View style={{flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 5, width: Metrics.screenWidth * 0.45}}>
                <Text style={{color: Colors.infoGrey}}>New Here?</Text>
                <TouchableHighlight overlayColor={Colors.transparent} onPress={() => navigate('SignUpScreen', { userType: state.params.userType })}>
                  <Text style={{color: Colors.snow}}> Sign Up</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    barber: state.barber,
    customer: state.customer
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    barberLogin: credentials => dispatch(BarberActions.barberSignInRequest(credentials)),
    customerLogin: credentials => dispatch(CustomerActions.customerSignInRequest(credentials))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen)
