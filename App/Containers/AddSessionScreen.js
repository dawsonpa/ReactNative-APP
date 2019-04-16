import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, TextInput, View, ActivityIndicator, Switch, FlatList, Picker, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Overlay from 'react-native-modal-overlay'
import isEqual from 'lodash/isEqual'
import remove from 'lodash/remove'
import autobind from 'autobind-decorator'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AsYouType } from 'libphonenumber-js'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import HaircutActions, { HaircutSelectors } from '../Redux/HaircutRedux'
import BarberActions, { BarberSelectors} from '../Redux/BarberRedux'
import { SearchBar } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'
import { filter, some, includes } from 'lodash/collection'
import { debounce } from 'lodash/function'
import moment from 'moment'
// Styles
import { Colors, Metrics,Fonts } from '../Themes'
import styles from './Styles/AddSessionScreenStyle'
class AddSessionScreen extends Component {
  constructor (props) {
    super(props)
    const selectedDate = props.selectedDate
    this.state = {
      fetching: props.fetching,
      results: [],
      searchFocused: false,
      items: [{notes: 'bump on head', start: '3:30 am', end: '4:00am', date: 'Friday, December 8, 2017', customerNumber: '888-888-8888', haircutType: 'Fade, shampoo', customerEmail: 'test@gmail.com', lastSeen: 'November 5, 2017', customerName: 'Test user'}],
      searchInput: null,
      firstName: null,
      lastName: null,
      phoneNumber: null,
      email: null,
      customerInvite: false,
      recurringAppointment: false,
      recurringDay: 1,
      recurringTime: 1,
      recurringStartDate: moment(selectedDate).format('dddd, MMMM, D, YYYY'),
      startDate: moment(selectedDate).format('dddd, MMMM, D, YYYY'),
      endDate: moment(selectedDate).add(30, 'm').format('dddd, MMMM, D, YYYY'),
      start: moment().format('LT'),
      end: moment().add(30, 'm').format('LT'),
      customerId: null,
      services: props.services.map(service => {
        service = service.asMutable()
        service.selected = false
        return service
      })
    }
    const { startDate, endDate, start, end, recurringStartDate, customerId, recurringDay, recurringTime } = this.state
    props.updateHaircut({ startDate, endDate, start, end, recurringStartDate, recurringTime, recurringDay, customerId })
    props.setCreateFlag(false)
  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    headerRight: <TouchableOpacity onPress={() => {
      navigation.dispatch(HaircutActions.haircutCreateRequest())
    }}>
      <Text style={{color: '#E67650', fontSize: 20, marginRight: Metrics.baseMargin}}>Add</Text>
    </TouchableOpacity>,
    headerLeft: <TouchableOpacity onPress={() => navigation.goBack()}>
      <Text style={{color: '#E67650', fontSize: 20, marginLeft: Metrics.baseMargin}}>Cancel</Text>
    </TouchableOpacity>,
    headerTintColor: '#E67650',
    headerTitleStyle: {color: Colors.panther},
    tabBarVisible: false
  });

  componentWillReceiveProps (nextProps) {
    const { createFlag, createError, fetching } = nextProps
    const { navigation, setCreateFlag } = this.props
    if (createFlag && !createError && !fetching) {
      setCreateFlag(false)
      this.setState({ fetching: false }, () => {
        navigation.navigate('BarberScheduleScreen')
      })
    }

    if (createError) {
      setCreateFlag(false)
      this.setState({ fetching: false })
    }
  }

  _handleResults (results) {
    this.setState({results})
  }
  _onFocus () {
    this.setState({searchFocused: true})
  }
  _onBlur () {
    this.setState({searchFocused: false})
  }
  _onChangeText = searchInput => {
    this.setState({ searchInput });
    debounce(() => {
      // use internal search logic (depth first)!
      const results = this._internalSearch(searchInput);
      this.setState({results})
    }, 500)();
  };

  _internalSearch = input => {
    if (input === '') {
      return [];
    }
    return filter(this.state.items, item => {
      return this._depthFirstSearch(item, input);
    });
  };

  _depthFirstSearch = (collection, input) => {
    // let's get recursive boi
    let type = typeof collection;
    // base case(s)
    if (type === 'string' || type === 'number' || type === 'boolean') {
      return includes(
        collection.toString().toLowerCase(),
        input.toString().toLowerCase()
      );
    }
    return some(collection, item => this._depthFirstSearch(item, input));
  };

  getSelectedServicesArray () {
    const { services } = this.state
    if (services && services.length) {
      return services.map(service => service.name)
    } else {
      return []
    }
  }

  @autobind
  handleServiceClick (selectedService) {
    const { services } = this.state
    console.log(services, 'to serveee')
    const selectedServices = services.map(service => {
      service = service.asMutable()
      const isMatch = isEqual(service, selectedService)
      if (isMatch) {
        service.selected = !service.selected
      }
      return service
    })
    console.log(selectedService, 'selec', selectedServices)
    this.setState({ services: selectedServices })
    this._updateHaircut({services: selectedServices})
  }

  @autobind
  handleCustomerInviteChange (customerInvite) {
    this.setState({customerInvite})
    this._updateHaircut({customerInvite})

  }

  @autobind
  handleRecurringAppointmentChange (recurringAppointment) {
    this.setState({recurringAppointment})
    this._updateHaircut({recurringAppointment})
  }

  @autobind
  handleFirstNameChange (firstName) {
    this.setState({firstName})
    debounce(() => {
      this._updateHaircut({firstName})
    }, 500)()
  }

  @autobind
  handleLastNameChange (lastName) {
    this.setState({lastName})
    debounce(() => {
      this._updateHaircut({lastName})
    }, 500)()
  }

  @autobind
  handleEmailChange (email) {
    this.setState({email})
    debounce(() => {
      this._updateHaircut({email})
    }, 500)()
  }

  @autobind
  handlePhoneNumberChange (phoneNumber) {
    const formattedNum = new AsYouType('US').input(phoneNumber)
    this.setState({phoneNumber: formattedNum})
    debounce(() => {
      this._updateHaircut({phoneNumber: formattedNum})
    }, 500)()
  }

  _updateHaircut = (haircut) => {
    let { haircut: oldHaircut } = this.props
    const newHaircut = {...oldHaircut, ...haircut}
    this.props.updateHaircut(newHaircut)
  }

  @autobind
  handleStartDateChange (startDate) {
    this.setState({startDate})
    this._updateHaircut({startDate})
  }

  @autobind
  handleRecurringStartDateChange(recurringStartDate){
    this.setState({recurringStartDate})
    this._updateHaircut({recurringStartDate})
  }

  @autobind
  handleRecurringTimeChange(recurringTime) {
    this.setState({recurringTime})
    this._updateHaircut({recurringTime})
  }

  @autobind
  handleRecurringDayChange(recurringDay) {
    this.setState({recurringDay})
    this._updateHaircut({recurringDay})
  }

  @autobind
  handleEndDateChange(endDate) {
    this.setState({endDate})
    this._updateHaircut({endDate})
  }
  @autobind
  handleStartChange (start) {
    this.setState({start})
    this._updateHaircut({start})
  }
  @autobind
  handleEndChange (end) {
    this.setState({end})
    this._updateHaircut({end})
  }
  renderItem (item) {
    const length = this.state.services.length;
    const internalStyle = {height: 40, flexDirection: 'row', justifyContent: 'space-between', marginBottom: Metrics.doubleBaseMargin, width: Metrics.screenWidth - Metrics.doubleBaseMargin, borderBottomWidth: 2, borderBottomColor: Colors.dashboardBorder};
    const endStyle = {height: 40, flexDirection: 'row', justifyContent: 'space-between', marginBottom: Metrics.doubleBaseMargin, width: Metrics.screenWidth - Metrics.doubleBaseMargin};
    const containerStyle = item.index === (length - 1) ? endStyle : internalStyle;
    const selectedServices = this.getSelectedServicesArray()
    item = item.item
    const selected = selectedServices.indexOf(item.name) !== -1
    return (
      <View style={containerStyle}>
        <Text>{item.name}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: Metrics.screenWidth * 0.25}}>
          <Text>{item.time} min</Text>
          <TouchableOpacity onPress={() => this.handleServiceClick(item)}>
            {
              item.selected
                ? <FontAwesomeIcon
                  size={20}
                  color={Colors.checkGreen}
                  name={'check-circle-o'}
                />
                : <FontAwesomeIcon
                  size={20}
                  color={Colors.questionGrey}
                  name={'circle-o'}
                />
            }
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render () {
    const { searchFocused, results, searchInput, fetching, services, phoneNumber, email, recurringTime, recurringDay, recurringStartDate, lastName, firstName, customerInvite, recurringAppointment, startDate, endDate, start, end } = this.state
    return (
      <KeyboardAwareScrollView contentStyle={{height: Metrics.screenHeight, width: Metrics.screenWidth}} style={[{backgroundColor: Colors.snow}]}>
        <Overlay
          visible={this.state.fetching}
          closeOnTouchOutside
          containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
          childrenWrapperStyle={{backgroundColor: Colors.clear}}
        >
          <ActivityIndicator size={'large'} color={Colors.switchOrange} />
        </Overlay>
        <View style={{padding: Metrics.baseMargin}}>
          <View>
            <Text style={{marginBottom: Metrics.baseMargin}}>CUSTOMER INFORMATION*</Text>
          </View>
          <SearchBar
            containerStyle={{backgroundColor: Colors.clear, borderBottomColor: Colors.clear, marginBottom: Metrics.baseMargin, paddingHorizontal: 0, marginHorizontal: 0, borderTopColor: Colors.clear}}
            inputStyle={{backgroundColor: Colors.clear, borderWidth: 1, marginLeft: 5, borderColor: Colors.questionGrey}}
            ref={(ref) => this.searchBar = ref}
            placeholder={'Search by customer phone number'}
            placeholderTextColor={Colors.placeholder}
            icon={{color: Colors.questionGrey, style: {paddingRight: 10}}}
            round
            onChangeText={this._onChangeText}
            value={searchInput}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            autoCorrect={false}
          />
          {
            searchFocused && results.length ? results.map((customer, i) => {
              return (
                <Text key={i}>{customer.customerNumber} : {customer.customerName}</Text>
              )
            }) : null
          }
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: Metrics.baseMargin}}>
            <TextInput
              ref='firstName'
              style={[{ height: 40, width: Metrics.screenWidth * 0.40, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2 }]}
              value={firstName}
              keyboardType='default'
              returnKeyType='next'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={this.handleFirstNameChange.bind(this)}
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
              autoCorrect={false}
              onChangeText={this.handleLastNameChange.bind(this)}
              underlineColorAndroid='transparent'
              onSubmitEditing={() => this.refs.phoneNumber.focus()}
              placeholder='Last Name'
              placeholderTextColor={Colors.placeholder}
            />
          </View>
          <TextInput
            ref='phoneNumber'
            style={[{ height: 40, width: Metrics.screenWidth - Metrics.doubleBaseMargin, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginBottom: Metrics.baseMargin }]}
            value={phoneNumber}
            keyboardType='default'
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handlePhoneNumberChange}
            underlineColorAndroid='transparent'
            onSubmitEditing={() => this.refs.phoneNumber.focus()}
            placeholder='(XXX) XXX - XXXX'
            placeholderTextColor={Colors.placeholder}
          />
          <TextInput
            ref='phoneNumber'
            style={[{ height: 40, width: Metrics.screenWidth - Metrics.doubleBaseMargin, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginBottom: Metrics.baseMargin }]}
            value={email}
            keyboardType='default'
            returnKeyType='done'
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handleEmailChange}
            underlineColorAndroid='transparent'
            placeholder='sampleemail@website.com'
            placeholderTextColor={Colors.placeholder}
          />
          <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: Metrics.baseMargin}}>
            <Text style={{fontSize: Fonts.size.small}}>Send Customer Invite? </Text>
            <Switch value={customerInvite} onValueChange={(changed) => this.handleCustomerInviteChange(changed)} />
          </View>
        </View>
        <View style={{ borderBottomColor: Colors.dashboardBorder, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, width: Metrics.screenWidth }} />
        <View style={{padding: Metrics.baseMargin}}>
          <Text style={{marginBottom: Metrics.doubleBaseMargin}}>EXPECTED SERVICE(S)</Text>
          <FlatList
            data={services}
            contentContainerStyle={{maxHeight: Metrics.screenHeight * 0.60}}
            renderItem={(item) => this.renderItem(item)}
          />
        </View>
        <View style={{ borderBottomColor: Colors.dashboardBorder, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, width: Metrics.screenWidth }} />
        <View style={{padding: Metrics.baseMargin}}>
          <Text style={{marginBottom: Metrics.doubleBaseMargin}}>DATE / TIME OF APPOINTMENT</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: Metrics.baseMargin}}>
            <Text style={{fontSize: Fonts.size.small}}>Recurring appointment?  </Text>
            <Switch value={recurringAppointment} onValueChange={(changed) => this.handleRecurringAppointmentChange(changed)} />
          </View>
          {
            !recurringAppointment
              ?
              <View>
                <Text style={{marginBottom: Metrics.doubleBaseMargin, fontSize: Fonts.size.small}}>START TIME OF SERVICE(S)</Text>
                <View style={{flexDirection: 'row', marginBottom: Metrics.doubleBaseMargin}}>
                  <DatePicker
                    style={{width: Metrics.screenWidth * 0.50, borderWidth: 1, paddingRight: 5, borderColor: Colors.questionGrey}}
                    format={'dddd, MMMM D, YYYY'}
                    mode={'date'}
                    date={startDate}
                    minDate={moment().format('dddd, MMMM, D, YYYY')}
                    confirmBtnText='Confirm'
                    cancelBtnText='Cancel'
                    iconComponent={
                      <FontAwesomeIcon
                        name={'angle-down'}
                      />
                    }
                    customStyles={{
                      dateText: {
                        fontSize: Fonts.size.small
                      },
                      dateInput: {
                        borderWidth: 0
                      }
                    }}
                    onDateChange={this.handleStartDateChange}
                  />
                  <DatePicker
                    style={{width: Metrics.screenWidth * 0.30, borderWidth: 1, paddingRight: 5, borderColor: Colors.questionGrey}}
                    format={'h:mm a'}
                    mode={'time'}
                    date={start}
                    confirmBtnText='Confirm'
                    cancelBtnText='Cancel'
                    iconComponent={
                      <FontAwesomeIcon
                        name={'angle-down'}
                      />
                    }
                    customStyles={{
                      dateText: {
                        fontSize: Fonts.size.small
                      },
                      dateInput: {
                        borderWidth: 0
                      }
                    }}
                    onDateChange={this.handleStartChange}
                  />
                </View>
                <Text style={{marginBottom: Metrics.doubleBaseMargin, fontSize: Fonts.size.small}}>END TIME OF SERVICE(S)</Text>
                <View style={{flexDirection: 'row', marginBottom: Metrics.doubleBaseMargin}}>
                  <DatePicker
                    style={{width: Metrics.screenWidth * 0.50, borderWidth: 1, paddingRight: 5, borderColor: Colors.questionGrey}}
                    format={'dddd, MMMM D, YYYY'}
                    mode={'date'}
                    date={endDate}
                    minDate={moment().format('dddd, MMMM, D, YYYY')}
                    confirmBtnText='Confirm'
                    cancelBtnText='Cancel'
                    iconComponent={
                      <FontAwesomeIcon
                        name={'angle-down'}
                      />
                    }
                    customStyles={{
                      dateText: {
                        fontSize: Fonts.size.small
                      },
                      dateInput: {
                        borderWidth: 0
                      }
                    }}
                    onDateChange={this.handleEndDateChange}
                  />
                  <DatePicker
                    style={{width: Metrics.screenWidth * 0.30, borderWidth: 1, paddingRight: 5, borderColor: Colors.questionGrey}}
                    format={'h:mm a'}
                    mode={'time'}
                    date={end}
                    confirmBtnText='Confirm'
                    cancelBtnText='Cancel'
                    iconComponent={
                      <FontAwesomeIcon
                        name={'angle-down'}
                      />
                    }
                    customStyles={{
                      dateText: {
                        fontSize: Fonts.size.small
                      },
                      dateInput: {
                        borderWidth: 0
                      }
                    }}
                    onDateChange={this.handleEndChange}
                  />
                </View>
              </View>
              : <View>
                <Text style={{marginBottom: Metrics.doubleBaseMargin, fontSize: Fonts.size.small}}>RECURRENCE OF SERVICE(S)</Text>
                <View style={{flexDirection: 'row', marginBottom: Metrics.doubleBaseMargin}}>
                  <Picker
                    style={{width: Metrics.screenWidth * 0.375, borderWidth: 1, borderColor: Colors.questionGrey}}
                    selectedValue={recurringTime}
                    label={'Recurring Time'}
                    itemStyle={{fontSize: Fonts.size.small}}

                    onValueChange={this.handleRecurringTimeChange}
                  >
                    <Picker.Item label={'Every Week'} value={1} />
                    <Picker.Item label={'Every Two Weeks'} value={2} />
                    <Picker.Item label={'Every Three Weeks'} value={3} />
                    <Picker.Item label={'Every Four Weeks'} value={4} />
                  </Picker>
                  <Picker
                    style={{width: Metrics.screenWidth * 0.375, borderWidth: 1, borderColor: Colors.questionGrey}}
                    selectedValue={recurringDay}
                    label={'Recurring Day'}
                    itemStyle={{fontSize: Fonts.size.small}}
                    onValueChange={this.handleRecurringDayChange}
                  >
                    <Picker.Item label={'Monday'} value={1} />
                    <Picker.Item label={'Tuesday'} value={2} />
                    <Picker.Item label={'Wednesday'} value={3} />
                    <Picker.Item label={'Thursday'} value={4} />
                    <Picker.Item label={'Friday'} value={5} />
                    <Picker.Item label={'Saturday'} value={6} />
                    <Picker.Item label={'Sunday'} value={7} />
                  </Picker>
                </View>
                <Text style={{marginBottom: Metrics.doubleBaseMargin, fontSize: Fonts.size.small}}>TIME OF SERVICE(S) START - END</Text>
                <View style={{flexDirection: 'row', marginBottom: Metrics.doubleBaseMargin, alignItems: 'center'}}>
                  <Text>Start: </Text>
                  <DatePicker
                    style={{width: Metrics.screenWidth * 0.30, borderWidth: 1, paddingRight: 5, borderColor: Colors.questionGrey}}
                    format={'h:mm a'}
                    mode={'time'}
                    date={start}
                    confirmBtnText='Confirm'
                    cancelBtnText='Cancel'
                    iconComponent={
                      <FontAwesomeIcon
                        name={'angle-down'}
                      />
                    }
                    customStyles={{
                      dateText: {
                        fontSize: Fonts.size.small
                      },
                      dateInput: {
                        borderWidth: 0
                      }
                    }}
                    onDateChange={this.handleStartChange}
                  />
                  <Text>    End: </Text>
                  <DatePicker
                    style={{width: Metrics.screenWidth * 0.30, borderWidth: 1, paddingRight: 5, borderColor: Colors.questionGrey}}
                    format={'h:mm a'}
                    mode={'time'}
                    date={end}
                    confirmBtnText='Confirm'
                    cancelBtnText='Cancel'
                    iconComponent={
                      <FontAwesomeIcon
                        name={'angle-down'}
                      />
                    }
                    customStyles={{
                      dateText: {
                        fontSize: Fonts.size.small
                      },
                      dateInput: {
                        borderWidth: 0
                      }
                    }}
                    onDateChange={this.handleEndChange}
                  />
                </View>
                <Text style={{marginBottom: Metrics.doubleBaseMargin, fontSize: Fonts.size.small}}>DATE OF SERVICE(S)</Text>
                <View style={{flexDirection: 'row', marginBottom: Metrics.doubleBaseMargin}}>
                  <DatePicker
                    style={{width: Metrics.screenWidth * 0.50, borderWidth: 1, paddingRight: 5, borderColor: Colors.questionGrey}}
                    format={'dddd, MMMM D, YYYY'}
                    mode={'date'}
                    date={recurringStartDate}
                    minDate={moment().format('dddd, MMMM, D, YYYY')}
                    confirmBtnText='Confirm'
                    cancelBtnText='Cancel'
                    iconComponent={
                      <FontAwesomeIcon
                        name={'angle-down'}
                      />
                    }
                    customStyles={{
                      dateText: {
                        fontSize: Fonts.size.small
                      },
                      dateInput: {
                        borderWidth: 0
                      }
                    }}
                    onDateChange={this.handleRecurringStartDateChange}
                  />
                </View>
              </View>
          }
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    haircuts: HaircutSelectors.getBarberHaircuts(state),
    haircut: HaircutSelectors.getHaircut(state),
    services: BarberSelectors.getServices(state),
    createFlag: HaircutSelectors.getCreateFlag(state),
    fetching: HaircutSelectors.getFetching(state),
    error: HaircutSelectors.getCreateError(state),
    selectedDate: HaircutSelectors.getSelectedDate(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateHaircut: haircut => dispatch(HaircutActions.updateHaircut(haircut)),
    createHaircut: () => dispatch(HaircutActions.haircutCreateRequest()),
    setCreateFlag: flag => dispatch(HaircutActions.setHaircutCreateRequest(flag))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSessionScreen)
