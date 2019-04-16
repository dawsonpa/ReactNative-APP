import React, { Component } from 'react'
import { View, Text, Image, ImageBackground, findNodeHandle, Linking } from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { BlurView } from 'react-native-blur'
import auotbind from 'autobind-decorator'
import RoundedButton from '../Components/RoundedButton'
import AppConfig from '../Config/AppConfig'
import BarberActions, { BarberSelectors } from '../Redux/BarberRedux'


// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { Images, Colors, Metrics } from '../Themes'

// Styles
import styles from './Styles/BarberStripeScreenStyle'

class BarberStripeScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      viewRef: null,
    }
  }

  imageLoaded () {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) })
  }

  @auotbind
  openStripeSignUp () {
    console.log(this.props, 'propsss')
    const { firstName, lastName, phoneNumber, email } = this.props.barber
    Linking.openURL(`https://connect.stripe.com/express/oauth/authorize?state=${AppConfig.securityToken}&redirect_uri=${AppConfig.stripeBarberRedirect}&client_id=${AppConfig.stripeTestClientId}&stripe_user[email]=${email}&stripe_user[first_name]=${firstName}&stripe_user[last_name]=${lastName}&stripe_user[phone_number]=${phoneNumber}stripe_user[business_type]=individual`)
  }

  render () {
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
        <KeyboardAwareScrollView contentContainerStyle={[styles.container, {flexDirection: 'column', alignItems: 'center'}]}>
          <View style={styles.titleContainer}>
            <Image source={Images.landing} style={styles.landing} />
            <Text style={styles.title}> BarberMe </Text>
            <Text style={styles.titleText}> Haircuts made easy </Text>
          </View>
          <View style={styles.bodyContainer}>
            <View style={{flexDirection: 'column', marginBottom: Metrics.doubleBaseMargin, alignItems: 'center'}}>
              <Text style={styles.bodyTitleText}>Connect Your BarberMe Account to Stripe</Text>
              <Text style={{ color: Colors.snow, marginTop: Metrics.baseMargin }}> We use Stripe to make payments easy and keep your</Text>
              <Text style={{ color: Colors.snow }}> personal and bank details secure.</Text>
            </View>
            <RoundedButton onPress={() => this.openStripeSignUp()} text={'Setup Payments on Stripe >'} style={{ backgroundColor: Colors.snow, width: Metrics.screenWidth * 0.80 }} buttonTextStyle={{color: Colors.panther}} />
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarberStripeScreen)
