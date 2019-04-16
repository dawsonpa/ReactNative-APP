import React, { Component } from 'react'
import { ScrollView, Text, ActivityIndicator, TouchableOpacity, TextInput, View, Switch, FlatList, Picker, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'
import autobind from 'autobind-decorator'
import RounderButton from '../Components/RounderButton'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Overlay from 'react-native-modal-overlay'
import { AsYouType } from 'libphonenumber-js'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import HaircutActions, {HaircutSelectors} from '../Redux/HaircutRedux'
import InvoiceActions, { InvoiceSelectors } from '../Redux/InvoiceRedux'
import BarberActions, { BarberSelectors } from '../Redux/BarberRedux'
import { SearchBar } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'
import { some, includes } from 'lodash/collection'
import { debounce } from 'lodash/function'
import { Colors, Metrics, Fonts } from '../Themes'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import filter from 'lodash/filter'
import sumBy from 'lodash/sumBy'
import get from 'lodash/get'
import roundTo from 'round-to'
import { diffToday } from '../Lib/utils'
// Styles
import styles from './Styles/BarberInvoiceScreenStyle'
const innerWidth = Metrics.screenWidth - (Metrics.doubleBaseMargin * 2)
class BarberInvoiceScreen extends Component {
  constructor (props) {
    super(props)
    const { selectedHaircut, selectedHaircutId } = props
    console.log(selectedHaircut, selectedHaircutId, 'selectedddddd')
    this.state = {
      results: [],
      searchFocused: false,
      items: [selectedHaircut],
      searchInput: null,
      firstName: selectedHaircut.consumer.firstName,
      lastName: selectedHaircut.consumer.lastName,
      phoneNumber: new AsYouType('US').input(selectedHaircut.consumer.phoneNumber),
      email: selectedHaircut.consumer.email,
      customerInvite: false,
      recurringAppointment: false,
      startDate: moment(selectedHaircut.start).format('dddd, MMMM D, YYYY'),
      endDate: moment(selectedHaircut.end).format('dddd, MMMM D, YYYY'),
      start: moment(selectedHaircut.start).format('h:mm a'),
      end: selectedHaircut.end ? moment(selectedHaircut.end).format('h:mm a') : moment().add(30, 'm').format('h:mm a'),
      services: props.services.asMutable().map(service => {
        service = service.asMutable()
        const isSelected = find(selectedHaircut.services, service)
        service.selected = !!isSelected
        return service
      }),
      discounts: [],
      haircutId: selectedHaircutId,
      notes: null,
      recurringValue: 1,
      recurringTime: 1,
      recurringStartDate: moment().format('dddd, MMMM, D, YYYY'),
      futureAppointmentDate: null,
      futureStartDate: moment().format('dddd, MMMM, D, YYYY'),
      futureEndDate: moment().format('dddd, MMMM, D, YYYY'),
      futureStart: moment(selectedHaircut.start).format('LT'),
      futureEnd: moment(selectedHaircut.end).format('LT'),
      futureDate: moment().format('dddd, MMMM D, YYYY'),
      recurringDay: 1,
      proposeAppointment: false,
      total: 0,
      fetching: props.fetching
    }

    this._handleResults = this._handleResults.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this.invoiceRequest = false
  }
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerLeft: <TouchableOpacity onPress={() => navigation.navigate('BarberDashboardScreen')}>
      <FontAwesomeIcon style={{color: Colors.panther, marginLeft: Metrics.baseMargin}} name={'angle-left'} size={20} />
    </TouchableOpacity>,
    headerTintColor: '#E67650',
    headerTitleStyle: {color: Colors.panther},
    tabBarVisible: false
  });

  componentWillReceiveProps (nextProps) {
    const { navigation } = this.props
    const { error, fetching } = nextProps

    if (fetching !== this.state.fetching) {
      this.setState({fetching})
    }

    if (!fetching && !error && this.invoiceRequest) {
      this.invoiceRequest = false
      navigation.navigate('BarberDashboardScreen')
    }

    if(error) {
      this.invoiceRequest = false
      console.log(error)
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
    this.setState({ searchInput })
    debounce(() => {
      // use internal search logic (depth first)!
      const results = this._internalSearch(searchInput)
      this.setState({results})
    }, 500)()
  }

  _internalSearch = input => {
    if (input === '') {
      return []
    }
    return filter(this.state.items, item => {
      return this._depthFirstSearch(item, input);
    })
  }

  @autobind
  handleRecurringDayChange (recurringDay) {
    this.setState({recurringDay})
  }

  @autobind
  handleRecurringTimeChange(recurringTime) {
    this.setState({recurringTime})
  }

  _depthFirstSearch = (collection, input) => {
    // let's get recursive boi
    let type = typeof collection
    // base case(s)
    if (type === 'string' || type === 'number' || type === 'boolean') {
      return includes(
        collection.toString().toLowerCase(),
        input.toString().toLowerCase()
      )
    }
    return some(collection, item => this._depthFirstSearch(item, input));
  };
  get selectedServices () {
    const { services } = this.state
    if (services && services.length) {
      return filter(services, service => service.selected)
    }

    return null
  }
  get subtotal () {
    const selected = this.selectedServices
    if (selected && selected.length) {
      const subTotal = sumBy(selected, service => parseInt(service.price))
      return roundTo(subTotal, 2)
    }
    return 0.00
  }

  @autobind
  convertDiscount (discount) {
    const subTotal = this.subtotal
    return roundTo((subTotal * (discount / 100)), 2)
  }

  get total () {
    const subTotal = this.subtotal
    const discounts = this.state.discounts
    if (discounts && discounts.length) {
      const totalDiscount = sumBy(discounts, discountObj =>
        this.convertDiscount(discountObj.discount)
      )
      return roundTo(subTotal - totalDiscount, 2)
    }
    return subTotal
  }

  @autobind
  handleInvoiceButtonPress () {
    const invoice = {
      ...this.state,
      subTotal: this.subtotal,
      total: this.total,
      present: diffToday(this.state.startDate) === 0
    }

    this.props.createInvoice(invoice)
    this.invoiceRequest = true
  }

  handleCustomerInviteChange (customerInvite) {
    this.setState({customerInvite})
  }
  handleRecurringAppointmentChange (recurringAppointment) {
    this.setState({recurringAppointment})
  }
  handleFirstNameChange (firstName) {
    this.setState({firstName})
  }
  handleLastNameChange (lastName) {
    this.setState({lastName})
  }
  handlePhoneNumberChange (phoneNumber) {
    const formattedNum = new AsYouType('US').input(phoneNumber)
    this.setState({phoneNumber: formattedNum})
  }

  @autobind
  handleDiscountChange (discount, index) {
    let { discounts } = this.state
    discounts[index] = {...discounts[index], discount}
    this.setState({ discounts })
  }

  @autobind
  handleServiceNameChange (name, index) {
    let { services } = this.state
    services[index] = {...services[index], name}
    this.setState({ services })
  }

  @autobind
  handleServicePriceChange(price, index) {
    let { services } = this.state
    services[index] = {...services[index], price}
    this.setState({ services })
  }

  @autobind
  handleServiceTimeChange (time, index) {
    let { services } = this.state
    services[index] = {...services[index], time}
    this.setState({ services })
  }
  @autobind
  handleReasonChange (reason, index) {
    let { discounts } = this.state
    discounts[index] = {...discounts[index], reason}
    this.setState({ discounts })
  }

  @autobind
  handleEmailChange (email) {
    this.setState({email})
  }

  @autobind
  handleServiceClick (selectedService) {
    const { services } = this.state
    console.log(services, 'to serveee')
    const selectedServices = services.map(service => {
      const isMatch = isEqual(service, selectedService)
      if (isMatch) {
        service.selected = !service.selected
      }
      return service
    })
    console.log(selectedService, 'selec', selectedServices)
    this.setState({ services: selectedServices })
  }

  @autobind
  handleProposeAppointmentButtonPress() {
    this.setState({proposeAppointment: !this.state.proposeAppointment})
  }

  @autobind
  addService () {
    const { services } = this.state
    const serviceObject = {
      price: 10,
      time: 15,
      name: 'New Service'
    }
    const newServices = services.concat(serviceObject)
    this.setState({ services: newServices })
  }
  @autobind
  addDiscount () {
    const { discounts } = this.state
    const discountObj = {
      discount: 10,
      reason: 'generic discount'
    }
    const newDiscounts = discounts.concat(discountObj)
    this.setState({ discounts: newDiscounts })
  }

  @autobind
  removeDiscount (index) {
    const { discounts } = this.state
    discounts.splice(index, 1)
    this.setState({ discounts })
  }

  @autobind
  handleRecurringStartDateChange(recurringStartDate){
    this.setState({recurringStartDate})
  }

  @autobind
  handleFutureStartChange (futureStart) {
    this.setState({futureStart})
  }
  @autobind
  handleFutureEndChange (futureEnd) {
    this.setState({futureEnd})
  }

  @autobind
  handleFutureStartDateChange (futureStartDate) {
    this.setState({futureStartDate})
  }

  @autobind
  handleFutureEndDateChange (futureEndDate) {
    this.setState({futureEndDate})
  }

  @autobind
  renderItem (item) {
    const length = this.state.services.length;
    const internalStyle = {height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Metrics.doubleBaseMargin, width: Metrics.screenWidth - Metrics.doubleBaseMargin, borderBottomWidth: 2, borderBottomColor: Colors.dashboardBorder}
    const endStyle = {height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Metrics.doubleBaseMargin, width: Metrics.screenWidth - Metrics.doubleBaseMargin};
    const containerStyle = item.index === (length - 1) ? endStyle : internalStyle
    const index = item.index
    item = item.item
    return (
      <View style={endStyle}>
        <TextInput
          value={`${item.name}`}
          style={[{ height: 40, width: Metrics.screenWidth * 0.45, marginRight: 10, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2 }]}
          onChangeText={name => this.handleServiceNameChange(name, index)}
        />
        <View style={{flexDirection: 'row', height: 40, alignItems: 'center', justifyContent: 'space-between', width: Metrics.screenWidth * 0.40}}>
          <TextInput
            value={`${item.price}`}
            style={[{ height: 40, width: Metrics.screenWidth * 0.15, marginRight: 10, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2 }]}
            onChangeText={price => this.handleServicePriceChange(price, index)}
          />
          <TextInput
            value={`${item.time}`}
            style={[{ height: 40, width: Metrics.screenWidth * 0.15, marginRight: 10, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2 }]}
            onChangeText={time => this.handleServiceTimeChange(time, index)}
          />
          <TouchableOpacity style={{width: Metrics.screenWidth * 0.1}} onPress={() => this.handleServiceClick(item)}>
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
  renderDiscountItem (item) {
    const index = item.index
    item = item.item
    return (
      <View style={{flexDirection: 'row', width: innerWidth}}>
        <TextInput
          value={`${item.discount}`}
          style={[{ height: 40, width: innerWidth * 0.25, marginRight: 10, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2 }]}
          onChangeText={discount => this.handleDiscountChange(discount, index)}
        />
        <TextInput
          value={item.reason}
          style={[{ height: 40, width: innerWidth * 0.65, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2 }]}
          onChangeText={reason => this.handleReasonChange(reason, index)}
        />
        <TouchableOpacity onPress={() => this.removeDiscount(index)}>
          <View style={{height: 40, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', width: 0.05 * innerWidth, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2}}>
            <FontAwesomeIcon
              name={'times-circle'}
              size={20}
              color={Colors.infoGrey}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  renderDiscountInvoiceItem (item, total) {
    item = item.item
    return (
      <View style={{flexDirection: 'column', marginBottom: Metrics.baseMargin}}>
        <View style={{flexDirection: 'row', width: innerWidth, justifyContent: 'space-between'}}>
          <Text>Discount @{item.discount}%</Text>
          <Text>(${this.convertDiscount(item.discount)})</Text>
        </View>
        <Text style={{fontSize: Fonts.size.tiny}}>{item.reason}</Text>
      </View>
    )
  }
  render () {
    const { searchFocused, endDate, startDate, fetching, recurringTime, recurringStartDate, total, proposeAppointment, results, futureStart, futureEnd, recurringDay, futureStartDate, futureEndDate, searchInput, phoneNumber, lastName, firstName, customerInvite, services, discounts, recurringAppointment,recurringValue, date, start, end, notes, email } = this.state;
    return (
      <KeyboardAwareScrollView style={[{backgroundColor: Colors.snow}]}>
        <Overlay
          visible={this.state.fetching}
          closeOnTouchOutside
          containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
          childrenWrapperStyle={{backgroundColor: Colors.clear}}
        >
          <ActivityIndicator size={'large'} color={Colors.switchOrange} />
        </Overlay>
        <View style={{padding: Metrics.baseMargin}}>
          <View style={{flexDirection: 'row', width: innerWidth, justifyContent: 'space-between'}}>
            <Text style={{marginBottom: Metrics.baseMargin}}>CUSTOMER INFORMATION*</Text>
            <RounderButton onPress={() => this.props.navigation.navigate('BarberImportAppointmentScreen')} style={styles.appointmentButton}>
              <Text style={styles.buttonText}>Import Appointment</Text>
            </RounderButton>
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
            onChangeText={this.handlePhoneNumberChange.bind(this)}
            underlineColorAndroid='transparent'
            onSubmitEditing={() => this.refs.phoneNumber.focus()}
            placeholder='(XXX) XXX - XXXX'
            placeholderTextColor={Colors.placeholder}
          />
          <TextInput
            ref='email'
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
          <View style={{flexDirection: 'row',alignItems: 'center', marginVertical: Metrics.baseMargin}}>
            <Text style={{fontSize: Fonts.size.small}}>Send Customer Invoice?</Text>
            <Switch value={customerInvite} onValueChange={(changed) => this.handleCustomerInviteChange(changed)} />
          </View>
        </View>
        <View style={{ borderBottomColor: Colors.dashboardBorder, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, width: Metrics.screenWidth }} />
        <View style={{padding: Metrics.baseMargin}}>
          <View style={{flexDirection: 'row', height: 50, alignItems: 'center'}}>
            <Text style={{marginBottom: Metrics.doubleBaseMargin, marginRight: 10}}>SERVICE(S) RENDERED*</Text>
            <TouchableOpacity onPress={() => this.addService()}>
              <View style={{justifyContent: 'center', alignItems: 'center', height: 50, width: 50, borderRadius: 25, backgroundColor: Colors.greyBackground}}>
                <FontAwesomeIcon
                  name={'plus'}
                  size={25}
                  color={Colors.questionGrey}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={{ fontWeight: 'bold', marginBottom: Metrics.baseMargin}}>Popular Services</Text>
          <View style={{flexDirection: 'row', width: Metrics.screenWidth - Metrics.doubleBaseMargin, justifyContent: 'space-between'}}>
            <Text style={{width: Metrics.screenWidth * 0.45}}>Name</Text>
            <View style={{flexDirection: 'row', width: Metrics.screenWidth * 0.40 }}>
              <Text style={{ width: Metrics.screenWidth * 0.15, marginRight: 10 }}>Price($)</Text>
              <Text style={{width: Metrics.screenWidth * 0.23, marginRight: 10}}>Time(Min)</Text>
            </View>
          </View>
          <FlatList
            data={services}
            contentContainerStyle={{maxHeight: Metrics.screenHeight * 0.60}}
            renderItem={(item) => this.renderItem(item)}
          />
        </View>
        <View style={{ borderBottomColor: Colors.dashboardBorder, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, width: Metrics.screenWidth }} />
        <View style={{padding: Metrics.baseMargin}}>
          <Text style={{marginBottom: Metrics.doubleBaseMargin}}>DATE / TIME OF SERVICES*</Text>
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
              onDateChange={(date) => {this.setState({startDate: date})}}
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
              onDateChange={(start) => {this.setState({start})}}
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
              onDateChange={(date) => {this.setState({endDate: date})}}
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
              onDateChange={(end) => {this.setState({end})}}
            />
          </View>
        </View>
        <View style={{ borderBottomColor: Colors.dashboardBorder, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, width: Metrics.screenWidth }} />
        <View style={{padding: Metrics.baseMargin}}>
          <View style={{flexDirection: 'row', alignItems: 'center', width: innerWidth, height: 50}}>
            <Text>ADD DISCOUNTS (OPTIONAl) </Text>
            <TouchableOpacity onPress={() => this.addDiscount()}>
              <View style={{justifyContent: 'center', alignItems: 'center', height: 50, width: 50, borderRadius: 25, backgroundColor: Colors.greyBackground}}>
                <FontAwesomeIcon
                  name={'plus'}
                  size={25}
                  color={Colors.questionGrey}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', width: innerWidth}}>
            <View style={{width: Metrics.screenWidth * 0.30, marginRight: 10}}>
              <Text>DISCOUNT(%)</Text>
            </View>
            <View style={{width: Metrics.screenWidth * 0.65}}>
              <Text>REASON</Text>
            </View>
          </View>
          <FlatList
            data={discounts}
            contentContainerStyle={{maxHeight: Metrics.screenHeight * 0.60}}
            renderItem={(item) => this.renderDiscountItem(item)}
          />
        </View>
        <View style={{ borderBottomColor: Colors.dashboardBorder, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin * 2, width: Metrics.screenWidth }} />
        <View style={{padding: Metrics.baseMargin}}>
          <Text style={{marginBottom: Metrics.baseMargin}}>ADD CLIENT NOTES (OPTIONAL)</Text>
          <TextInput
            multiline
            numberOfLines={4}
            onChangeText={notesText => this.setState({notes: notesText})}
            value={notes}
            style={{backgroundColor: Colors.agendaBorder,height: Metrics.screenHeight*0.2, borderWidth: 1, borderColor: Colors.questionGrey, marginBottom: Metrics.baseMargin}}
            placeholder={'write notes about the client here...(e.g. how long they want their haircut, bumps, irregularities....)'}
            placeholderText={Colors.placeholder}
          />
        </View>
        <View style={{ borderBottomColor: Colors.dashboardBorder, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin * 2, width: Metrics.screenWidth }} />
        <View style={{padding: Metrics.baseMargin}}>
          <Text style={{marginBottom: Metrics.baseMargin}}>BOOK FUTURE APPOINTMENT (OPTIONAL)</Text>
          <Text style={{marginBottom: Metrics.baseMargin}}>You can also book your next appointments for your customer</Text>
          <View style={{width: innerWidth, flexDirection: 'row', marginBottom: Metrics.baseMargin}}>
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
                      date={futureStartDate}
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
                      onDateChange={this.handleFutureStartDateChange}
                    />
                    <DatePicker
                      style={{width: Metrics.screenWidth * 0.30, borderWidth: 1, paddingRight: 5, borderColor: Colors.questionGrey}}
                      format={'h:mm a'}
                      mode={'time'}
                      date={futureStart}
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
                      onDateChange={this.handleFutureStartChange}
                    />
                  </View>
                  <Text style={{marginBottom: Metrics.doubleBaseMargin, fontSize: Fonts.size.small}}>END TIME OF SERVICE(S)</Text>
                  <View style={{flexDirection: 'row', marginBottom: Metrics.doubleBaseMargin}}>
                    <DatePicker
                      style={{width: Metrics.screenWidth * 0.50, borderWidth: 1, paddingRight: 5, borderColor: Colors.questionGrey}}
                      format={'dddd, MMMM D, YYYY'}
                      mode={'date'}
                      date={futureEndDate}
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
                      onDateChange={this.handleFutureEndDateChange}
                    />
                    <DatePicker
                      style={{width: Metrics.screenWidth * 0.30, borderWidth: 1, paddingRight: 5, borderColor: Colors.questionGrey}}
                      format={'h:mm a'}
                      mode={'time'}
                      date={futureEnd}
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
                      onDateChange={this.handleFutureEndChange}
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
                      date={futureStart}
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
                      onDateChange={this.handleFutureStartChange}
                    />
                    <Text>    End: </Text>
                    <DatePicker
                      style={{width: Metrics.screenWidth * 0.30, borderWidth: 1, paddingRight: 5, borderColor: Colors.questionGrey}}
                      format={'h:mm a'}
                      mode={'time'}
                      date={futureEnd}
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
                      onDateChange={this.handleFutureEndChange}
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
          <View style={{width: innerWidth,marginBottom: Metrics.baseMargin, alignItems: 'center', flexDirection: 'row'}}>
            <Text style={{marginRight: Metrics.baseMargin}}>Recurring appointment?</Text>
            <Switch
              value={recurringAppointment}
              onValueChange={val => this.setState({recurringAppointment: val})}
            />
          </View>
          <View style={{marginBottom: Metrics.baseMargin, flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity style={{marginRight: Metrics.baseMargin}} onPress={this.handleProposeAppointmentButtonPress}>
              {
                proposeAppointment ?
                  <FontAwesomeIcon
                    size={20}
                    color={Colors.checkGreen}
                    name={'check-circle-o'}
                  /> :
                  <FontAwesomeIcon
                    size={20}
                    color={Colors.questionGrey}
                    name={'circle-o'}
                  />
              }
            </TouchableOpacity>
            {
              recurringAppointment ?
                <Text >Propose recurring appointment with this invoice</Text>:
                <Text >Propose appointment with this invoice</Text>
            }
          </View>
        </View>
        <View style={{ borderBottomColor: Colors.dashboardBorder, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, marginTop: Metrics.doubleBaseMargin * 2, width: Metrics.screenWidth }} />
        <View style={{padding: Metrics.baseMargin}}>
          <Text style={{marginBottom: Metrics.doubleBaseMargin * 2}}>INVOICE TOTAL</Text>
          <View style={{flexDirection: 'row', width: innerWidth, justifyContent: 'space-between', marginBottom: Metrics.doubleBaseMargin}}>
            <Text>Subtotal</Text>
            <Text>${this.subtotal}</Text>
          </View>
          <FlatList
            data={discounts}
            contentContainerStyle={{maxHeight: Metrics.screenHeight * 0.60}}
            renderItem={(item) => this.renderDiscountInvoiceItem(item, total)}
          />
          <View style={{ borderBottomColor: Colors.dashboardBorder, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, marginTop: Metrics.baseMargin, width: innerWidth }} />
          <View style={{width: innerWidth, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontWeight: 'bold'}}>
              Total
            </Text >

            <Text style={{fontWeight: 'bold'}}>
              ${this.total}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginVertical: Metrics.doubleBaseMargin * 2, justifyContent: 'center'}}>
          <RounderButton onPress={() => this.handleInvoiceButtonPress()} style={styles.invoiceButton}>
            <Text style={styles.buttonText}>Send Invoice</Text>
          </RounderButton>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedHaircut: HaircutSelectors.getSelectedHaircut(state),
    services: BarberSelectors.getServices(state),
    selectedHaircutId: HaircutSelectors.getSelectedHaircutId(state),
    fetching: state.invoice.fetching,
    error: state.invoice.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createInvoice: invoice => dispatch(InvoiceActions.invoiceCreateRequest(invoice))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarberInvoiceScreen)
