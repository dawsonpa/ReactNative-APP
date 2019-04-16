import React, { Component } from 'react'
import { ScrollView, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { Colors, Metrics } from '../Themes'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import autobind from 'autobind-decorator'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import { AsYouType } from 'libphonenumber-js'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import CustomerActions, { CustomerSelectors } from '../Redux/CustomerRedux'

// Styles
import styles from './Styles/CustomerEditProfileScreenStyle'
const innerWidth = Metrics.screenWidth - (Metrics.doubleBaseMargin * 2)
const adjustedHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight
const rowHeight = adjustedHeight * 0.075

class CustomerEditProfileScreen extends Component {
  constructor (props) {
    super(props)
    const { customer } = props
    this.customer = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      phoneNumber: new AsYouType('US').input(customer.phoneNumber),
      email: customer.email,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode
    }
    this.state = {
      ...this.customer,
      phoneNumber: this.customer.phoneNumber ? this.customer.phoneNumber.toString() : null,
      zipCode: this.customer.zipCode ? this.customer.zipCode.toString() : null
    }
  }
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerLeft: <TouchableOpacity onPress={() => navigation.navigate('CustomerProfileScreen')}>
      <FontAwesomeIcon style={{color: Colors.panther, marginLeft: Metrics.baseMargin}} name={'angle-left'} size={20} />
    </TouchableOpacity>,
    headerTintColor: Colors.snow,
    headerTitleStyle: {color: Colors.panther},
    tabBarVisible: false
  });

  @autobind
  updateCustomer () {
    if (!isEmpty(this.state) && !isEqual(this.state, this.barber)) {
      this.customer = this.state
      this.props.updateCustomer(this.state)
      this.props.navigation.navigate('CustomerProfileScreen')
    }
  }

  @autobind
  handleTextChange (text, key) {
    const state = {}
    if (key === 'phoneNumber') {
      text = new AsYouType('US').input(text)
    }
    state[key] = text
    this.setState(state)
  }

  render () {
    const { firstName, lastName, email, phoneNumber, city, zipCode, state } = this.state
    return (
      <View style={[styles.container, { padding: Metrics.baseMargin }]}>
        <View style={{ width: innerWidth, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={() => this.updateCustomer()}>
            <View style={{justifyContent: 'center', alignItems: 'center', height: rowHeight, width: rowHeight, borderRadius: rowHeight / 2, backgroundColor: Colors.greyBackground}}>
              <Text>Save</Text>
            </View>
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView style={{ padding: Metrics.baseMargin }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{ width: Metrics.screenWidth * 0.40, color: Colors.profileGrey }}
            >FIRST NAME</Text>
            <Text style={{ width: Metrics.screenWidth * 0.40, color: Colors.profileGrey }}
            >LAST NAME</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: Metrics.doubleBaseMargin}}>
            <TextInput
              ref='firstName'
              style={[{ height: 40, width: Metrics.screenWidth * 0.40, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginBottom: Metrics.baseMargin }]}
              value={firstName}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              onChangeText={text => this.handleTextChange(text, 'firstName')}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.lastName.focus()}
              placeholder='First Name'
              placeholderTextColor={Colors.placeholder}
            />
            <TextInput
              ref='lastName'
              style={[{ height: 40, width: Metrics.screenWidth * 0.40, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2 }]}
              value={lastName}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              onChangeText={text => this.handleTextChange(text, 'lastName')}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.workAddress.focus()}
              placeholder='Last Name'
              placeholderTextColor={Colors.placeholder}
            />
          </View>
          <Text style={{ color: Colors.profileGrey }}
          >PHONE NUMBER</Text>
          <TextInput
            ref='phoneNumber'
            style={[{ height: 40, width: Metrics.screenWidth - Metrics.doubleBaseMargin, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginBottom: Metrics.baseMargin }]}
            value={phoneNumber}
            keyboardType='default'
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={text => this.handleTextChange(text, 'phoneNumber')}
            underlineColorAndroid='transparent'
            onSubmitEditing={() => this.refs.phoneNumber.focus()}
            placeholder='(XXX) XXX - XXXX'
            placeholderTextColor={Colors.placeholder}
          />
          <Text style={{ color: Colors.profileGrey }}
          >EMAIL</Text>
          <TextInput
            ref='phoneNumber'
            style={[{ height: 40, width: Metrics.screenWidth - Metrics.doubleBaseMargin, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginBottom: Metrics.baseMargin }]}
            value={email}
            keyboardType='default'
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={text => this.handleTextChange(text, 'email')}
            underlineColorAndroid='transparent'
            placeholder='sampleemail@website.com'
            placeholderTextColor={Colors.placeholder}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: Metrics.baseMargin}}>
            <Text style={[{ width: Metrics.screenWidth * 0.50, color: Colors.profileGrey }]}
            >CITY</Text>
            <Text
              style={[{ width: Metrics.screenWidth * 0.13, color: Colors.profileGrey }]}
            >STATE</Text>
            <Text
              style={[{ width: Metrics.screenWidth * 0.20, color: Colors.profileGrey }]}
            >ZIPCODE</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: Metrics.doubleBaseMargin}}>
            <TextInput
              ref='workCity'
              style={[{ height: 40, width: Metrics.screenWidth * 0.50, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2 }]}
              value={city}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              onChangeText={text => this.handleTextChange(text, 'city')}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.workState.focus()}
              placeholder='City'
              placeholderTextColor={Colors.placeholder}
            />
            <TextInput
              ref='workState'
              style={[{ height: 40, width: Metrics.screenWidth * 0.13, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2 }]}
              value={state}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              onChangeText={text => this.handleTextChange(text, 'state')}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.workZipCode.focus()}
              placeholder='State'
              placeholderTextColor={Colors.placeholder}
            />
            <TextInput
              ref='workZipCode'
              style={[{ height: 40, width: Metrics.screenWidth * 0.20, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2 }]}
              value={zipCode}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              onChangeText={text => this.handleTextChange(text, 'zipCode')}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.website.focus()}
              placeholder='Zip Code'
              placeholderTextColor={Colors.placeholder}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    customer: CustomerSelectors.getCustomer(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCustomer: customer => dispatch(CustomerActions.customerUpdateRequest(customer))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerEditProfileScreen)
