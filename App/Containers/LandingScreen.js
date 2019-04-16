import React, { Component } from 'react'
import { View, Text,Image, ImageBackground, findNodeHandle } from 'react-native'
import { BlurView } from 'react-native-blur'
import { connect } from 'react-redux'
import { Images, Metrics,Colors } from '../Themes'
import Swiper from 'react-native-swiper';
import RoundedButton from '../Components/RoundedButton'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/LandingScreenStyle'

class LandingScreen extends Component {
  constructor (props) {
    super(props);
    this.state = { viewRef: null }
  }
  imageLoaded () {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) })
  }

  render () {
    const { navigate } = this.props.navigation;
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
        <View style={[styles.container, {flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around'}]}>
          <View style={styles.titleContainer}>
            <Image source={Images.landing} style={styles.landing} />
            <Text style={styles.title}> BarberMe </Text>
            <Text style={styles.titleText}> Haircuts made easy </Text>
          </View>
          <View style={styles.infoContainer}>
            <Swiper
              height={Metrics.screenHeight * 0.2}
              index={0}
              dot={<View style={{backgroundColor: Colors.clear, width: 8, height: 8, borderColor: Colors.snow, borderWidth: 1, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
              activeDot={<View style={{backgroundColor: Colors.snow, width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
            >
              <View style={styles.slideContainer}>
                <Text style={styles.infoTitle}> Set and Forget</Text>
                <View>
                  <Text style={styles.infoText}>Schedule recurring haircuts so that you can stay</Text>
                  <Text style={styles.infoText}>sharp. Get reminders before your haircuts.</Text>
                </View>
              </View>
              <View style={styles.slideContainer}>
                <Text style={styles.infoTitle}> Document Perfection</Text>
                <View>
                  <Text style={styles.infoText}>Upload poctures of your best haircuts for your barber to</Text>
                  <Text style={styles.infoText}>see. Use them as examples!</Text>
                </View>
              </View>
              <View style={styles.slideContainer}>
                <Text style={styles.infoTitle}>Easy Payments</Text>
                <View>
                  <Text style={styles.infoText}>Save your tip preferences and pay easily right in the</Text>
                  <Text style={styles.infoText}>seat.</Text>
                </View>
              </View>
            </Swiper>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <RoundedButton style={{width: Metrics.screenWidth * 0.40, borderColor: Colors.snow, borderWidth: 1}} onPress={() => navigate('SignInScreen', {userType: 'customer'})}>Customer</RoundedButton>
              <RoundedButton style={{width: Metrics.screenWidth * 0.40, borderColor: Colors.snow, borderWidth: 1}} onPress={() => navigate('SignInScreen', {userType: 'barber'})}>Barber</RoundedButton>
            </View>
          </View>
        </View>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingScreen)
