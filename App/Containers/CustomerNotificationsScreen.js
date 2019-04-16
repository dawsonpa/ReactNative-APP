import React, { Component } from 'react'
import { ScrollView, Text, FlatList, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { diffToday } from '../Lib/utils'
import moment from 'moment'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { Colors, Metrics, Fonts } from '../Themes'
import RounderButton from '../Components/RounderButton'
import Mailer from 'react-native-mail'

// Styles
import styles from './Styles/CustomerNotificationsScreenStyle'
import InvoiceActions, { InvoiceSelectors } from '../Redux/InvoiceRedux'
const innerWidth = Metrics.screenWidth - (Metrics.doubleBaseMargin * 2)
class CustomerNotificationsScreen extends Component {
  constructor (props) {
    super(props)
    props.getCustomerInvoices()
    props.setSelectedInvoiceId(null)
    this.invoiceId = null
  }
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerLeft: <TouchableOpacity onPress={() => navigation.navigate('CustomerHaircutsScreen')}>
      <FontAwesomeIcon style={{color: Colors.panther, marginLeft: Metrics.baseMargin}} name={'angle-left'} size={20} />
    </TouchableOpacity>,
    headerStyle: {
      backgroundColor: Colors.snow
    },
    headerTitleStyle: {color: Colors.panther},
    tabBarVisible: false
  });

  handleEmail = invoiceId => {
    Mailer.mail({
      subject: `Contest Invoice - ${invoiceId}`,
      recipients: ['hello@barberme.io'],
      ccRecipients: [],
      bccRecipients: [],
      body: 'Explain your contest here',
      isHTML: true
    }, (error, event) => {
      if (error) console.log(`There was an error sending the email. ${error}`)
      if (event) console.log(`${event}`)
    })
  }

  @autobind
  handleInvoiceButtonPress (id) {
    const { setSelectedInvoiceId, navigation } = this.props
    this.invoiceId = id
    setSelectedInvoiceId(id)
    navigation.navigate('CustomerInvoiceScreen')
  }

  @autobind
  renderItem (item) {
    item = item.item
    const formattedDate = moment(item.start).format('MMMM DD')
    const daysAgo = Math.abs(diffToday(item.start))

    return (
      <View style={{flexDirection: 'column'}}>
        <View style={{flexDirection: 'column', marginHorizontal: Metrics.doubleBaseMargin}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', width: innerWidth, marginTop: Metrics.doubleBaseMargin}}>
            <Text>Invoice for {formattedDate}</Text>
            <Text style={{color: Colors.greyText}}>{daysAgo} days ago</Text>
          </View>
          <View style={{width: innerWidth, justifyContent: 'center', height: Metrics.screenHeight * 0.15, borderWidth: 0.5, marginVertical: Metrics.baseMargin, alignItems: 'center', borderColor: Colors.panther, padding: Metrics.baseMargin, flexDirection: 'column'}}>
            <View style={{flexDirection: 'row'}}>
              <FontAwesomeIcon
                name={'file-text-o'}
                size={Metrics.icons.xl}
                style={{marginRight: Metrics.doubleBaseMargin}}
              />
              <View style={{flexDirection: 'column'}}>
                <Text style={{fontSize: Fonts.size.h6}}>${item.total.toFixed(2)} Due for Services</Text>
                <Text style={{color: Colors.greyText}}>{item.barber.firstName} {item.barber.lastName} { item.barber.workName ? `of ${item.barber.workName}` : null}</Text>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row', width: innerWidth, justifyContent: 'space-between'}}>
            <RounderButton style={{backgroundColor: Colors.agendaGrey, justifyContent: 'center', alignItems: 'center', width: Metrics.screenWidth * 0.35, borderColor: Colors.panther, borderWidth: 0.5 }} onPress={() => this.handleEmail(item._id)}>
              <Text>Contest Amount</Text>
            </RounderButton>
            <RounderButton style={{backgroundColor: Colors.checkGreen, justifyContent: 'center', alignItems: 'center', borderColor: Colors.panther, borderWidth: 0.5, width: Metrics.screenWidth * 0.35 }} onPress={() => this.handleInvoiceButtonPress(item._id)}>
              <Text style={{color: Colors.snow }} >Pay ${item.total.toFixed(2)}</Text>
            </RounderButton>
          </View>
        </View>
        <View style={{marginTop: Metrics.doubleBaseMargin, borderColor: Colors.agendaBorder, borderWidth: 1}} />
      </View>
    )
  }
  render () {
    const { invoices } = this.props
    return (
      <ScrollView style={[styles.container, {backgroundColor: Colors.snow}]}>
        <FlatList
          data={invoices}
          renderItem={this.renderItem}
        />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    invoices: InvoiceSelectors.getUnPaidCustomerInvoices(state),
    selectedInvoiceId: InvoiceSelectors.getSelectedInvoiceId(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomerInvoices: () => dispatch(InvoiceActions.invoiceCustomerRequest()),
    setSelectedInvoiceId: id => dispatch(InvoiceActions.setSelectedInvoiceId(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerNotificationsScreen)
