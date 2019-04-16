import React, { Component } from 'react'
import { View, Text, Alert, Image, ImageBackground, TextInput, findNodeHandle, Switch, TouchableHighlight, KeyboardAvoidingView } from 'react-native'
import { BlurView } from 'react-native-blur'
import { connect } from 'react-redux'
import { Images, Metrics, Colors, Fonts } from '../Themes'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { AsYouType } from 'libphonenumber-js'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import BarberActions from '../Redux/BarberRedux'
import CustomerActions from '../Redux/CustomerRedux'

// Styles
import styles from './Styles/SignUpScreenStyle'
import RoundedButton from '../Components/RoundedButton';

class SignUpScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      viewRef: null,
      touchId: false,
      phoneNumber: null,
      password: null,
      showPassword: false,
      firstName: null,
      lastName: null,
      email: null
    }

    this.signUpRequest = false
  }
  componentWillReceiveProps (nextProps) {
    if (!nextProps.barber.error && !nextProps.customer.error && this.signUpRequest && !nextProps.barber.fetching && !nextProps.customer.fetching) {
      const { state, navigate } = this.props.navigation
      if (state.params.userType === 'barber') {
        navigate('BarberStripeScreen')
      } else {
        navigate('CustomerHomeScreen', {invoiceNumber: 2})
      }
      this.signUpRequest = false
    } else if ((nextProps.barber.error || nextProps.customer.error) && this.signUpRequest) {
      Alert.alert(
        'Error Logging In',
        nextProps.barber.error || nextProps.customer.error,
        [
          { text: 'OK' }
        ]
      )
      this.signUpRequest = false
    }
  }
  imageLoaded () {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) })
  }
  handleNumberChange (phoneNumber) {
    const formattedNum = new AsYouType('US').input(phoneNumber)
    this.setState({phoneNumber: formattedNum})
  }
  handleFirstNameChange (firstName) {
    this.setState({firstName})
  }
  handleLastNameChange (lastName) {
    this.setState({lastName})
  }
  handlePasswordChange (password) {
    this.setState({password})
  }

  handleTouchIdChange (touchId) {
    this.setState({touchId})
  }

  handleEmailChange (email) {
    this.setState({email})
  }
  handleSignUpPress = () => {
    const { params } = this.props.navigation.state
    const { phoneNumber, email, password, firstName, lastName } = this.state
    const credentials = { phoneNumber, email, password, firstName, lastName }
    this.signUpRequest = true
    params.userType === 'barber' ? this.props.barberSignUp(credentials) : this.props.customerSignUp(credentials)
  }
  render () {
    const { navigate } = this.props.navigation
    const { userType } = this.props
    const { phoneNumber, email, password, touchId, showPassword, firstName, lastName } = this.state;
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
                name={'user-o'}
                size={20}
                color={Colors.snow}
                style={{width: 40}}
              />
              <TextInput
                ref='firstName'
                style={[{ height: 40, width: Metrics.screenWidth - 40 - 60, color: Colors.snow }]}
                value={firstName}
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handleFirstNameChange.bind(this)}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.lastName.focus()}
                placeholder='first name...'
                placeholderTextColor={Colors.placeholder}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'center', borderBottomColor: Colors.snow, borderBottomWidth: 1}}>
              <FontAwesomeIcon
                name={'user-o'}
                size={20}
                color={Colors.snow}
                style={{width: 40}}
              />
              <TextInput
                ref='lastName'
                style={[{ height: 40, width: Metrics.screenWidth - 40 - 60, color: Colors.snow }]}
                value={lastName}
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handleLastNameChange.bind(this)}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.phoneNumber.focus()}
                placeholder='last name...'
                placeholderTextColor={Colors.placeholder}
              />
            </View>
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
                onSubmitEditing={() => this.refs.email.focus()}
                placeholder='phone number...'
                placeholderTextColor={Colors.placeholder}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'center', borderBottomColor: Colors.snow, borderBottomWidth: 1}}>
              <FontAwesomeIcon
                name={'envelope'}
                size={20}
                color={Colors.snow}
                style={{width: 40}}
              />
              <TextInput
                ref='email'
                style={[{ height: 40, width: Metrics.screenWidth - 40 - 60, color: Colors.snow }]}
                value={email}
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={this.handleEmailChange.bind(this)}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.password.focus()}
                placeholder='email...'
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
                style={[{ height: 40, color: Colors.snow, width: Metrics.screenWidth - 40 - 60}]}
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
              <RoundedButton onPress={() => this.handleSignUpPress()} text={'Sign Up'} style={{width: Metrics.screenWidth * 0.45, borderColor: Colors.snow, borderWidth: 1}}> Log In</RoundedButton>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center', width: Metrics.screenWidth}} >
              <View style={{flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 5, width: Metrics.screenWidth * 0.45}}>
                <Text style={{color: Colors.infoGrey}}>Returning?</Text>
                <TouchableHighlight overlayColor={Colors.transparent} onPress={() => navigate('SignInScreen', { userType: userType })}>
                  <Text style={{color: Colors.snow}}> Log In</Text>
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
    barberSignUp: data => dispatch(BarberActions.barberSignUpRequest(data)),
    customerSignUp: data => dispatch(CustomerActions.customerSignUpRequest(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen)
