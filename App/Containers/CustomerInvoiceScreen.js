import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import 'moment-timezone'
import autobind from 'autobind-decorator'
import sumBy from 'lodash/sumBy'
import isFinite from 'lodash/isFinite'
import roundTo from 'round-to'
import RounderButton from '../Components/RounderButton'
import { Metrics, Colors, Fonts } from '../Themes/'

// Styles
import styles from './Styles/CustomerInvoiceScreenStyle'
import InvoiceActions, {invoicePaymentRequest, InvoiceSelectors} from '../Redux/InvoiceRedux'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

const innerWidth = Metrics.screenWidth - Metrics.doubleBaseMargin;
class CustomerInvoiceScreen extends Component {
  constructor (props) {
    super(props)
    console.log(props, 'props')
    this.state = {
      saveTipPrefs: true,
      tip: 0,
      invoice: {
        ...props.invoice,
        total: props.invoice.total || 0,
        subTotal: props.invoice.subTotal || 0
      }
    }

    this.paymentRequest = false
  }

  componentDidMount () {
    this.handleTipButtonPress(18)
  }

  componentWillReceiveProps (nextProps) {
    const { fetching } = nextProps
    const { navigation } = this.props

    if (this.paymentRequest && !fetching) {
      navigation.navigate('CustomerHaircutsScreen')
      this.paymentRequest = false
    }
  }

  static navigationOptions = ({navigation, screenProps}) => ({
    headerLeft: <TouchableOpacity style={{marginLeft: Metrics.baseMargin}} onPress={() => navigation.navigate('CustomerNotificationsScreen')}>
      <FontAwesomeIcon
        name={'close'}
        size={30}
      />
    </TouchableOpacity>,
    headerTitle: <Text>Invoice</Text>,
    tabBarVisible: false,
    headerStyle: {
      backgroundColor: Colors.snow
    },
    headerMode: 'float'
  });

  @autobind
  handleTipChange (tip) {
    tip = isFinite(parseFloat(tip)) ? tip : 0
    this.setState({
      tip
    })
  }

  @autobind
  renderItem (item) {
    item = item.item
    return (
      <Text style={{alignSelf: 'flex-end'}}>{`${item.name} - $${item.price}`}</Text>
    )
  }

  @autobind
  convertDiscount (discount) {
    const subTotal = this.props.invoice.subTotal
    return roundTo((subTotal * (discount / 100)), 2)
  }

  get total () {
    const { subTotal, discounts } = this.props.invoice
    let totalDiscount = 0
    if (discounts && discounts.length) {
      totalDiscount = sumBy(discounts, discountObj =>
        this.convertDiscount(discountObj.discount)
      )
    }
    const total = (subTotal - totalDiscount + parseFloat(this.state.tip))
    return total
  }

  handleTipButtonPress (percentage) {
    const { subTotal } = this.props.invoice
    const tip = subTotal * (percentage / 100)

    this.setState({tip: tip.toFixed(2)})
  }

  @autobind
  handlePaymentButtonPress () {
    const { handlePayment } = this.props
    const invoice = {
      total: this.total,
      tip: this.state.tip,
      paid: true
    }
    this.paymentRequest = true
    handlePayment(invoice)
  }

  get tipPercentage () {
    const { subTotal } = this.props.invoice
    const { tip } = this.state
    const percentage = Math.round((parseFloat(tip) / subTotal) * 100)
    return percentage
  }
  renderDiscountInvoiceItem (item, total) {
    item = item.item
    return (
      <View style={{flexDirection: 'column', marginBottom: Metrics.baseMargin, width: innerWidth, marginHorizontal: Metrics.baseMargin}}>
        <View style={{flexDirection: 'row', width: innerWidth, justifyContent: 'space-between'}}>
          <Text>Discount @{item.discount}%</Text>
          <Text>(${this.convertDiscount(item.discount).toFixed(2)})</Text>
        </View>
        <Text style={{fontSize: Fonts.size.tiny}}>{item.reason}</Text>
      </View>
    )
  }
  render () {
    const { saveTipPrefs, tip, invoice } = this.state
    const parsedDate = moment.tz(invoice.start, invoice.barber.timezone)
    const date = parsedDate.format('MMMM DD, YYYY')
    const time = parsedDate.format('LT')
    return (
      <KeyboardAwareScrollView style={{backgroundColor: Colors.snow}}>
        <ScrollView style={{backgroundColor: Colors.snow, paddingBottom: Metrics.doubleBaseMargin * 4}}>
          <View style={{flexDirection: 'row', padding: Metrics.baseMargin}}>
            <FontAwesomeIcon
              name={'user-o'}
              size={100}
              style={{marginRight: Metrics.baseMargin}}
            />
            <View style={{flexDirection: 'column'}}>
              <Text style={{fontSize: Fonts.size.h4}}>{invoice.barber.firstName} {invoice.barber.lastName}</Text>
              {invoice.barber.workName && <Text>{invoice.barber.workName}</Text>}
              {invoice.barber.workAddress && <Text>{invoice.barber.workAddress}</Text>}
              {invoice.barber.workCity && invoice.barber.workState && <Text>{invoice.barber.workCity}, {invoice.barber.workState}, {invoice.barber.workZipCode}</Text>}
            </View>
          </View>
          <View >
            <View style={{ borderBottomColor: Colors.dashboardBorder, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, width: Metrics.screenWidth }} />
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Text>Order Summary</Text>
              <View style={{ borderBottomColor: Colors.dashboardBorder, marginTop: Metrics.baseMargin, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, width: 60 }} />
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: Metrics.baseMargin, width: innerWidth, justifyContent: 'space-between' }}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', width: innerWidth}}>
                <Text>Date</Text>
                <Text>{date}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: Metrics.baseMargin, width: innerWidth, justifyContent: 'space-between' }}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', width: innerWidth}}>
                <Text>Time</Text>
                <Text>{time}</Text>
              </View>
              <Text />
            </View>
            <View style={{ borderBottomColor: Colors.dashboardBorder, alignSelf: 'center', marginTop: Metrics.baseMargin, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, width: innerWidth }} />
            <View style={{flexDirection: 'row', marginHorizontal: Metrics.baseMargin, width: innerWidth, justifyContent: 'space-between' }}>
              <Text>Services</Text>
              <FlatList
                data={invoice.services}
                renderItem={this.renderItem}
              />
            </View>
            {/*<View style={{ borderBottomColor: Colors.dashboardBorder, alignSelf: 'center', marginTop: Metrics.baseMargin, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, width: innerWidth }} />*/}
            {/*<View style={{flexDirection: 'row', marginHorizontal: Metrics.baseMargin, width: innerWidth, justifyContent: 'space-between' }}>*/}
              {/*<View style={{flexDirection: 'row', marginBottom: Metrics.baseMargin, justifyContent: 'space-between', width: innerWidth * 0.8}}>*/}
                {/*<Text>Example Picture (Optional)</Text>*/}
                {/*<Text>Not uploaded</Text>*/}
              {/*</View>*/}
              {/*<FontAwesomeIcon*/}
                {/*name={'edit'}*/}
              {/*/>*/}
            {/*</View>*/}
          </View>
          <View style={{ borderBottomColor: Colors.dashboardBorder, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, width: Metrics.screenWidth }} />
          <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>Leave a Tip</Text>
          <Text style={{alignSelf: 'center', color: Colors.greyText, marginTop: Metrics.baseMargin}}>Subtotal is $ {invoice.subTotal.toFixed(2)}</Text>
          <View style={{borderBottomWidth: 1, marginBottom: Metrics.baseMargin, alignSelf: 'center', borderBottomColor: Colors.border, width: Metrics.screenWidth * 0.45, paddingBottom: Metrics.baseMargin}}>
            <TextInput
              style={{fontSize: Fonts.size.h2, alignSelf: 'center', marginTop: Metrics.doubleBaseMargin}}
              value={tip}
              onChangeText={this.handleTipChange}
            />
          </View>
          <Text style={{marginBottom: Metrics.doubleBaseMargin, alignSelf: 'center', color: Colors.greyText}}>({this.tipPercentage}% of subtotal)</Text>
          <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: Metrics.baseMargin}}>
            <RounderButton onPress={() => this.handleTipButtonPress(15)} style={{width: Metrics.screenWidth * 0.175, borderColor: Colors.checkGreen, marginRight: Metrics.baseMargin, backgroundColor: Colors.snow, borderWidth: 1}}>
              <Text style={{alignSelf: 'center', color: Colors.checkGreen}}>15%</Text>
            </RounderButton>
            <RounderButton onPress={() => this.handleTipButtonPress(18)} style={{width: Metrics.screenWidth * 0.175, borderColor: Colors.checkGreen, marginRight: Metrics.baseMargin, backgroundColor: Colors.snow, borderWidth: 1}}>
              <Text style={{alignSelf: 'center', color: Colors.checkGreen}}>18%</Text>
            </RounderButton>
            <RounderButton onPress={() => this.handleTipButtonPress(20)} style={{width: Metrics.screenWidth * 0.175, borderColor: Colors.checkGreen, marginRight: Metrics.baseMargin, backgroundColor: Colors.snow, borderWidth: 1}}>
              <Text style={{alignSelf: 'center', color: Colors.checkGreen}}>20%</Text>
            </RounderButton>
            <RounderButton onPress={() => this.handleTipButtonPress(25)} style={{width: Metrics.screenWidth * 0.175, borderColor: Colors.checkGreen, backgroundColor: Colors.snow, borderWidth: 1}}>
              <Text style={{alignSelf: 'center', color: Colors.checkGreen}}>25%</Text>
            </RounderButton>
          </View>
          <View style={{ justifyContent: 'center', marginBottom: Metrics.doubleBaseMargin * 2, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={{marginRight: Metrics.baseMargin}} onPress={() => this.setState({saveTipPrefs: !saveTipPrefs})}>
              {
                saveTipPrefs
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
            <Text>I would like to save tip preferences</Text>
          </View>
          <View style={{marginBottom: Metrics.doubleBaseMargin, flexDirection: 'row', justifyContent: 'space-between', width: innerWidth, marginHorizontal: Metrics.baseMargin}}>
            <Text>Subtotal</Text>
            <Text>${invoice.subTotal.toFixed(2)}</Text>
          </View>
          <FlatList
            data={invoice.discounts}
            contentContainerStyle={{maxHeight: Metrics.screenHeight * 0.60}}
            renderItem={(item) => this.renderDiscountInvoiceItem(item)}
          />
          <View style={{marginBottom: Metrics.doubleBaseMargin, flexDirection: 'row', justifyContent: 'space-between', width: innerWidth, marginHorizontal: Metrics.baseMargin}}>
            <Text>Tip @ {this.tipPercentage}%</Text>
            <Text>${tip}</Text>
          </View>
          <View style={{ borderBottomColor: Colors.dashboardBorder, alignSelf: 'center', marginTop: Metrics.baseMargin, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, width: innerWidth }} />
          <View style={{marginBottom: Metrics.doubleBaseMargin, flexDirection: 'row', justifyContent: 'space-between', width: innerWidth, marginHorizontal: Metrics.baseMargin}}>
            <Text>Total</Text>
            <Text>${this.total.toFixed(2)}</Text>
          </View>
          <View style={{marginBottom: Metrics.doubleBaseMargin, flexDirection: 'row', justifyContent: 'space-between', width: innerWidth, marginHorizontal: Metrics.baseMargin}}>
            <Text>Payment Method</Text>
            <View style={{flexDirection: 'row'}}>
              <FontAwesomeIcon
                name={'lock'}
                style={{marginRight: Metrics.baseMargin}}
                size={Metrics.icons.small}
              />
              <RounderButton style={{backgroundColor: Colors.stripeBlue}} onPress={() => console.log('pay with stripe')}>
                <View style={{flexDirection: 'row', width: Metrics.screenWidth * 0.30, justifyContent: 'center' }}>
                  <Text style={{color: Colors.snow}}>Pay via </Text>
                  <FontAwesomeIcon
                    color={Colors.snow}
                    name={'cc-stripe'}
                    size={Metrics.icons.small}
                  />
                </View>
              </RounderButton>
            </View>
          </View>
          <RounderButton style={{backgroundColor: Colors.checkGreen, width: Metrics.screenWidth * 0.35, marginBottom: Metrics.doubleBaseMargin * 2, alignSelf: 'center'}} onPress={() => this.handlePaymentButtonPress()}>
            <Text style={{color: Colors.snow, alignSelf: 'center'}}>Confirm & Pay</Text>
          </RounderButton>
        </ScrollView>
      </KeyboardAwareScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    invoice: InvoiceSelectors.getSelectedInvoice(state),
    selectedInvoiceId: InvoiceSelectors.getSelectedInvoiceId(state),
    fetching: InvoiceSelectors.getInvoiceFetching(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handlePayment: invoice => dispatch(InvoiceActions.invoicePaymentRequest(invoice))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerInvoiceScreen)
