import React, { Component } from 'react'
import { TouchableOpacity, Alert, Text, View } from 'react-native'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import RounderButton from '../Components/RounderButton'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import InvoiceActions, { InvoiceSelectors } from '../Redux/InvoiceRedux'
import HaircutActions, {HaircutSelectors} from '../Redux/HaircutRedux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Colors, Metrics, Fonts } from '../Themes'
import Mailer from 'react-native-mail'

// Styles
import styles from './Styles/BarberDashboardScreenStyle'
import {BarberSelectors} from '../Redux/BarberRedux'
const adjustedHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight;

class BarberDashboardScreen extends Component {
  componentWillMount () {
    this.props.getDashboard()
  }
  handleEmail = () => {
    Mailer.mail({
      subject: 'Feedback / Additional Metrics',
      recipients: ['hello@barberme.io'],
      ccRecipients: [],
      bccRecipients: [],
      body: 'Write the additional metrics you want here...',
      isHTML: true
    }, (error, event) => {
      if (error) console.log(`There was an error sending the email. ${error}`)
      if (event) console.log(`${event}`)
    });
  }

  @autobind
  handleInvoiceButtonClick () {
    const { navigation, setSelectedHaircutId } = this.props
    setSelectedHaircutId(null)
    navigation.navigate('BarberInvoiceScreen')
  }

  componentDidMount () {
    if (!this.props.barber.stripeId) {
      Alert.alert(
        '!Important: Please create an Stripe Account now.',
        'You will not be able to create invoices and receive payments until you have signed',
        [
          { text: 'Create Account', onPress: () => this.props.navigation.navigate('BarberStripeScreen') }
        ]
      )
    }
  }

  render () {
    const { dashboard, joined } = this.props
    const { sessions, customers, totalIncome } = dashboard
    return (
      <View style={styles.mainContainer}>
        <View style={{flexDirection: 'column', justifyContent: 'space-between', height: adjustedHeight * 0.25, width: Metrics.screenWidth, padding: Metrics.baseMargin}}>
          <RounderButton style={styles.invoiceButton} onPress={() => this.handleInvoiceButtonClick()}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <FontAwesomeIcon
                name={'file-text-o'}
                size={16}
                color={Colors.snow}
              />
              <Text style={styles.buttonText}> + New Invoice</Text>
            </View>
          </RounderButton>
          <View style={{flexDirection: 'column'}}>
            <Text style={{ color: Colors.greyText, fontWeight: 'bold' }}>Metrics Since Joined</Text>
            <Text style={{color: Colors.questionGrey, fontSize: Fonts.size.small}}>Joined { joined }</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', backgroundColor: Colors.snow, borderWidth: 1, borderColor: Colors.dashboardBorder, justifyContent: 'space-around', alignItems: 'center', height: adjustedHeight * 0.15, width: Metrics.screenWidth}}>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{fontSize: Fonts.size.h3, color: Colors.greyText}}>{ customers }</Text>
            <Text style={{fontSize: Fonts.size.small, color: Colors.questionGrey}}>customers</Text>
          </View>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{fontSize: Fonts.size.h3, color: Colors.greyText}}>{ totalIncome.toFixed(2) }</Text>
            <Text style={{fontSize: Fonts.size.small, color: Colors.questionGrey}}>total income</Text>
          </View>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{fontSize: Fonts.size.h3, color: Colors.greyText}}>{ sessions }</Text>
            <Text style={{fontSize: Fonts.size.small, color: Colors.questionGrey}}>sessions</Text>
          </View>
        </View>
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: adjustedHeight * 0.60, width: Metrics.screenWidth}}>
          <FontAwesomeIcon
            name={'question-circle-o'}
            size={120}
            color={Colors.questionGrey}
            style={{marginBottom: 20}}
          />
          <Text style={{marginBottom: 20}}>What metrics would help you run your business?</Text>
          <RounderButton style={styles.metricsButton} onPress={() => this.handleEmail()}>
            <Text style={[styles.buttonText, {textAlign: 'center'}]}>Request Additional Metrics</Text>
          </RounderButton>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  console.log(state, 'state', state.invoice.dashboard)
  return {
    dashboard: InvoiceSelectors.getDashboard(state),
    joined: BarberSelectors.getJoined(state),
    barber: BarberSelectors.getBarber(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getDashboard: () => dispatch(InvoiceActions.invoiceDashboardRequest()),
    setSelectedHaircutId: id => dispatch(HaircutActions.setSelectedHaircutId(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarberDashboardScreen)
