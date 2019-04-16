import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { CustomerSelectors } from '../Redux/CustomerRedux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import RounderButton from '../Components/RounderButton';
import { Colors, Metrics, Fonts, Images } from '../Themes'
// Styles
import styles from './Styles/CustomerProfileScreenStyle'
const innerWidth = Metrics.screenWidth - (Metrics.doubleBaseMargin * 2);

class CustomerProfileScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      profilePicUploaded: true,
      haircutPicsUploaded: true
    }
  }
  static navigationOptions =({navigation, screenProps}) => ({
    headerLeft: <TouchableOpacity onPress={() => navigation.navigate('CustomerSettingsScreen')}>
      <FontAwesomeIcon name={'gear'} size={26} style={{marginLeft: Metrics.baseMargin}} />
    </TouchableOpacity>,
    headerStyle: {
      backgroundColor: Colors.snow
    }
  });

  render () {
    const { profilePicture, haircutPictures, city, state, zipCode, firstName, lastName, email, phoneNumber } = this.props.customer
    return (
      <ScrollView style={[styles.container, {backgroundColor: Colors.snow}]}>
        <View style={{alignItems: 'center', paddingTop: Metrics.baseMargin, paddingHorizontal: Metrics.doubleBaseMargin}}>
          <View style={{width: innerWidth, flexDirection: 'row', justifyContent: 'space-between', marginBottom: Metrics.baseMargin}}>
            <View />
            {
              profilePicture
                ? <FontAwesomeIcon name={'user-circle-o'} size={60} />
                : <View style={{width: 150, height: 150, borderRadius: 75, borderWidth: 1, borderColor: Colors.panther, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.agendaBorder}}>
                  <View />
                  <FontAwesomeIcon
                    name={'user'}
                    size={Metrics.icons.xxl}
                    color={Colors.questionGrey}
                  />
                  <View style={{position: 'absolute', bottom: 0}}>
                    <TouchableOpacity onPress={() => console.log('upload a selfie')}>
                      <View style={{ height: 50, width: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.greyText, borderWidth: 1, borderColor: Colors.snow }}
                      >
                        <FontAwesomeIcon
                          name={'camera'}
                          size={Metrics.icons.small}
                          color={Colors.snow}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
            }
            <TouchableOpacity onPress={() => this.props.navigation.navigate('CustomerEditProfileScreen')}>
              <FontAwesomeIcon name={'edit'} size={20} color={Colors.questionGrey} />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: Fonts.size.h2, marginBottom: Metrics.baseMargin }}>{`${firstName} ${lastName}`}</Text>
          {
            city && state &&
            <Text style={{marginBottom: Metrics.baseMargin, color: Colors.detailsGrey}}>{`${city}, ${state} ${zipCode}`}</Text>
          }
          <Text style={{marginBottom: Metrics.baseMargin, color: Colors.detailsGrey}}>{phoneNumber}</Text>
          <Text style={{marginBottom: Metrics.baseMargin, color: Colors.detailsGrey}}>{email}</Text>
        </View>
        <View style={{ borderBottomColor: Colors.dashboardBorder, borderBottomWidth: 2, marginBottom: Metrics.baseMargin, width: Metrics.screenWidth }} />
        <View style={{paddingHorizontal: Metrics.doubleBaseMargin, marginBottom: Metrics.doubleBaseMargin}}>
          {
            haircutPictures && haircutPictures.length
              ? <View>
                <View style={{width: innerWidth, marginVertical: Metrics.baseMargin, flexDirection: 'row', justifyContent: 'flex-start'}}>
                  <Text>PICTURES OF PRIOR HAIRCUTS</Text>
                </View>
                <View style={{flexDirection: 'row', width: innerWidth, justifyContent: 'space-between'}}>
                  <View style={{flexDirection: 'column'}}>
                    <FontAwesomeIcon style={{alignSelf: 'center'}} name={'user'} size={40} />
                    <Text style={{color: Colors.hyperlink}}>@CedricSmith</Text>
                    <Text>good job!</Text>
                  </View>
                  <View style={{flexDirection: 'column'}}>
                    <FontAwesomeIcon style={{alignSelf: 'center'}} name={'user'} size={40} />
                    <Text style={{color: Colors.hyperlink}}>@AnthonyJohns</Text>
                    <Text>killin it!</Text>
                  </View>
                  <View style={{flexDirection: 'column'}}>
                    <FontAwesomeIcon style={{alignSelf: 'center'}} name={'user'} size={40} />
                    <Text style={{color: Colors.hyperlink}}>Dwon Murphy</Text>
                    <Text>so smooth!</Text>
                  </View>
                </View>
              </View>
              : <View style={{ width: innerWidth, flexDirection: 'column', alignItems: 'center' }}>
                <Image
                  source={Images.userHaircut}
                  style={{height: Metrics.screenHeight * 0.1, width: Metrics.screenHeight * 0.1, marginTop: Metrics.doubleBaseMargin * 2, marginBottom: Metrics.baseMargin }}
                />
                <Text style={{color: Colors.detailsGrey, fontSize: Fonts.size.h6, marginVertical: Metrics.baseMargin}}>Give Barbers Examples of Good Haircuts</Text>
                <Text style={{color: Colors.profileGrey, fontSize: Fonts.size.small}}>Tap the button to upload past haircuts that were</Text>
                <Text style={{color: Colors.profileGrey, fontSize: Fonts.size.small}}>awesome. Or just keep posting pictures of your</Text>
                <Text style={{color: Colors.profileGrey, marginBottom: Metrics.doubleBaseMargin, fontSize: Fonts.size.small}}>barber's awesome work. Your barbe will appreciate it.</Text>
                <RounderButton style={{borderWidth: 0.5, borderColor: Colors.panther, backgroundColor: Colors.checkGreen, width: Metrics.screenWidth * 0.35}} onPress={() => console.log('Upload Selfie')}>
                  <Text style={{ alignSelf: 'center', color: Colors.snow}}>Upload a Selfie</Text>
                </RounderButton>
              </View>
          }
        </View>
      </ScrollView>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerProfileScreen)
