import React, { Component } from 'react'
import { ScrollView, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { Colors, Metrics } from '../Themes'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import autobind from 'autobind-decorator'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import { AsYouType } from 'libphonenumber-js'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import BarberActions, { BarberSelectors } from '../Redux/BarberRedux'

// Styles
import styles from './Styles/BarberEditProfileScreenStyle'
const innerWidth = Metrics.screenWidth - (Metrics.doubleBaseMargin * 2)
const adjustedHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight
const rowHeight = adjustedHeight * 0.075

class BarberEditProfileScreen extends Component {
  constructor (props) {
    super(props)
    const { barber } = props
    this.barber = {
      firstName: barber.firstName,
      lastName: barber.lastName,
      phoneNumber: new AsYouType('US').input(barber.phoneNumber),
      email: barber.email,
      workName: barber.workName,
      workAddress: barber.workAddress,
      workCity: barber.workCity,
      workState: barber.workState,
      workZipCode: barber.workZipCode,
      website: barber.website,
      instagram: barber.instagram,
      facebook: barber.facebook,
      twitter: barber.twitter,
      youtube: barber.youtube,
      linkedIn: barber.linkedIn
    }
    this.state = {
      ...this.barber
    }
  }
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerLeft: <TouchableOpacity onPress={() => navigation.navigate('BarberProfileScreen')}>
      <FontAwesomeIcon style={{color: Colors.panther, marginLeft: Metrics.baseMargin}} name={'angle-left'} size={20} />
    </TouchableOpacity>,
    headerTintColor: Colors.snow,
    headerTitleStyle: {color: Colors.panther},
    tabBarVisible: false
  });

  @autobind
  updateBarber () {
    if (!isEmpty(this.state) && !isEqual(this.state, this.barber)) {
      this.barber = this.state
      this.props.updateBarber(this.state)
      this.props.navigation.navigate('BarberProfileScreen')
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
    const { firstName, lastName, email, phoneNumber, workAddress, workCity, workZipCode, workState, website, workName, facebook, twitter, instagram, youtube, linkedIn } = this.state
    return (
      <View style={[styles.container, { padding: Metrics.baseMargin }]}>
        <View style={{ width: innerWidth, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={() => this.updateBarber()}>
            <View style={{justifyContent: 'center', alignItems: 'center', height: rowHeight, width: rowHeight, borderRadius: rowHeight / 2, backgroundColor: Colors.greyBackground}}>
              <Text>Save</Text>
            </View>
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView>
          <View style={{ padding: Metrics.baseMargin }}>
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
            <Text style={{ color: Colors.profileGrey }}
            >BARBERSHOP NAME</Text>
            <TextInput
              ref='workName'
              style={[{ height: 40, width: innerWidth, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginBottom: Metrics.doubleBaseMargin }]}
              value={workName}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={text => this.handleTextChange(text, 'workName')}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.workAddress.focus()}
              placeholder='Barbershop Name'
              placeholderTextColor={Colors.placeholder}
            />
            <Text style={{ color: Colors.profileGrey }}
            >BARBERSHOP STREET ADDRESS</Text>
            <TextInput
              ref='workAddress'
              style={[{ height: 40, width: innerWidth, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginBottom: Metrics.doubleBaseMargin }]}
              value={workAddress}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={text => this.handleTextChange(text, 'workAddress')}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.workCity.focus()}
              placeholder='Address'
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
                value={workCity}
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                onChangeText={text => this.handleTextChange(text, 'workCity')}
                autoCorrect={false}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.workState.focus()}
                placeholder='City'
                placeholderTextColor={Colors.placeholder}
              />
              <TextInput
                ref='workState'
                style={[{ height: 40, width: Metrics.screenWidth * 0.13, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2 }]}
                value={workState}
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                onChangeText={text => this.handleTextChange(text, 'workState')}
                autoCorrect={false}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.workZipCode.focus()}
                placeholder='State'
                placeholderTextColor={Colors.placeholder}
              />
              <TextInput
                ref='workZipCode'
                style={[{ height: 40, width: Metrics.screenWidth * 0.20, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2 }]}
                value={workZipCode}
                keyboardType='default'
                returnKeyType='next'
                autoCapitalize='none'
                onChangeText={text => this.handleTextChange(text, 'workZipCode')}
                autoCorrect={false}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.refs.website.focus()}
                placeholder='Zip Code'
                placeholderTextColor={Colors.placeholder}
              />
            </View>
            <Text style={{ color: Colors.profileGrey }}
            >WEBSITE</Text>
            <TextInput
              ref='website'
              style={[{ height: 40, width: innerWidth, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginBottom: Metrics.doubleBaseMargin }]}
              value={website}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              onChangeText={text => this.handleTextChange(text, 'website')}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.facebook.focus()}
              placeholder='Website URL'
              placeholderTextColor={Colors.placeholder}
            />
            <Text style={{ color: Colors.profileGrey }}
            >FACEBOOK</Text>
            <TextInput
              ref='facebook'
              style={[{ height: 40, width: innerWidth, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginBottom: Metrics.doubleBaseMargin }]}
              value={facebook}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              onChangeText={text => this.handleTextChange(text, 'facebook')}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.phoneNumber.focus()}
              placeholder='Facebook URL'
              placeholderTextColor={Colors.placeholder}
            />
            <Text style={{ color: Colors.profileGrey }}
            >TWITTER</Text>
            <TextInput
              ref='twitter'
              style={[{ height: 40, width: innerWidth, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginBottom: Metrics.doubleBaseMargin }]}
              value={twitter}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              onChangeText={text => this.handleTextChange(text, 'twitter')}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.twitter.focus()}
              placeholder='Twitter URL'
              placeholderTextColor={Colors.placeholder}
            />
            <Text style={{ color: Colors.profileGrey }}
            >INSTAGRAM</Text>
            <TextInput
              ref='instagram'
              style={[{ height: 40, width: innerWidth, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginBottom: Metrics.doubleBaseMargin }]}
              value={instagram}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              onChangeText={text => this.handleTextChange(text, 'instagram')}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.phoneNumber.focus()}
              placeholder='Instagram URL'
              placeholderTextColor={Colors.placeholder}
            />
            <Text style={{ color: Colors.profileGrey }}
            >YOUTUBE</Text>
            <TextInput
              ref='youtube'
              style={[{ height: 40, width: innerWidth, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginBottom: Metrics.doubleBaseMargin }]}
              value={youtube}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              onChangeText={text => this.handleTextChange(text, 'youtube')}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.phoneNumber.focus()}
              placeholder='Youtube URL'
              placeholderTextColor={Colors.placeholder}
            />
            <Text style={{ color: Colors.profileGrey }}
            >LINKED IN</Text>
            <TextInput
              ref='linkedIn'
              style={[{ height: 40, width: innerWidth, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginBottom: Metrics.doubleBaseMargin }]}
              value={linkedIn}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              onChangeText={text => this.handleTextChange(text, 'linkedIn')}
              autoCorrect={false}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.phoneNumber.focus()}
              placeholder='Linked In URL'
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
    barber: BarberSelectors.getBarber(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateBarber: barber => dispatch(BarberActions.barberUpdateRequest(barber))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarberEditProfileScreen)
