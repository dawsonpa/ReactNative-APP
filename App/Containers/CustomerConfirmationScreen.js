import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { BlurView } from 'react-native-blur'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Images, Metrics, Colors, Fonts } from '../Themes'
import RounderButton from '../Components/RounderButton';

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/CustomerConfirmationScreenStyle'
const innerWidth = Metrics.screenWidth - Metrics.doubleBaseMargin


class CustomerConfirmationScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pictureUploaded: true,
      viewRef: null,
      comment: null,
    }
  }
  static navigationOptions = ({navigation, screenProps}) => ({
    tabBarVisible: false,
    header: null
  });
  handleCommentChange (comment) {
    this.setState({comment})
  }

  render () {
    const { navigation } = this.props
    const { pictureUploaded, comment } = this.state
    const title = pictureUploaded ? 'Selfie Uploaded!' : 'Upload Selfie for Future Reference'
    return (
      <View style={styles.background}>
        <BlurView
          style={styles.absolute}
          blurType='dark'
          blurAmount={0}
        />
        <View style={{flexDirection: 'row', width: Metrics.screenWidth, marginTop: Metrics.doubleBaseMargin, marginHorizontal: Metrics.baseMargin,alignItems: 'center', justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon
              name={'close'}
              size={Metrics.icons.medium}
              color={Colors.snow}
            />
          </TouchableOpacity>
          <Text style={{color: Colors.snow, fontSize: Fonts.size.h6}}>Thank You for your Payment!</Text>
          <View />
        </View>
        <View style={{ alignSelf: 'center', marginTop: Metrics.doubleBaseMargin, width: Metrics.screenWidth * 0.85, height: Metrics.screenHeight * 0.75, backgroundColor: Colors.snow }}>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{marginVertical: Metrics.doubleBaseMargin}}>{title}</Text>
            {
              pictureUploaded
                ? <View style={{flexDirection: 'column', width: innerWidth, alignItems: 'center', alignSelf: 'center'}}>
                  <FontAwesomeIcon
                    name={'user'}
                    size={Metrics.icons.large}
                    style={{marginBottom: Metrics.baseMargin}}
                  />
                  <TextInput
                    multiline
                    numberOfLines={50}
                    placeholder={'@ shout out your barber here'}
                    value={comment}
                    style={{height: Metrics.screenHeight * 0.10, width: innerWidth * 0.80, marginBottom: Metrics.baseMargin, borderColor: Colors.questionGrey,backgroundColor: Colors.greyBackground, borderWidth: 1}}
                    onChangeText={this.handleCommentChange.bind(this)}
                  />
                  <View style={{ width: innerWidth, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                    <RounderButton style={{marginRight: Metrics.baseMargin, justifyContent: 'center', borderWidth: 0.5, borderColor: Colors.panther, backgroundColor: Colors.socialBlue, width: innerWidth * 0.40}} onPress={() => console.log('post to facebook')}>
                      <View style={{flexDirection: 'row'}}>
                        <FontAwesomeIcon
                          name={'facebook-official'}
                          color={Colors.snow}
                          size={Metrics.icons.small}
                          style={{marginHorizontal: Metrics.baseMargin}}
                        />
                        <Text style={{color: Colors.snow, fontSize: Fonts.size.small}}>Post to Facebook</Text>
                      </View>
                    </RounderButton>
                    <RounderButton style={{borderWidth: 0.5, justifyContent: 'center', borderColor: Colors.panther, backgroundColor: Colors.socialBlue, width: innerWidth * 0.40}} onPress={() => console.log('post to twitter')} buttonTextStyle={{color: Colors.snow}}>
                      <View style={{flexDirection: 'row'}}>
                        <FontAwesomeIcon
                          name={'twitter'}
                          color={Colors.snow}
                          size={Metrics.icons.small}
                          style={{marginHorizontal: Metrics.baseMargin}}


                        />
                        <Text style={{color: Colors.snow, fontSize: Fonts.size.small}}>Post to Twitter</Text>
                      </View>
                    </RounderButton>
                  </View>
                </View>
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

          </View>
          <View style={{alignSelf: 'center', width: Metrics.screenWidth * 0.80, marginVertical: Metrics.doubleBaseMargin, borderColor: Colors.separator, borderWidth: 1, borderRadius: 1}} />
          <Text style={{alignSelf: 'center', fontWeight: 'bold', marginBottom: Metrics.doubleBaseMargin}}>Cedric Proposed a Recurring Appointment</Text>
          <View style={{flexDirection: 'row', width: Metrics.screenWidth * 0.80,alignSelf: 'center', paddingHorizontal: Metrics.doubleBaseMargin, marginBottom: Metrics.baseMargin, justifyContent: 'space-between'}}>
            <Text style={{color: Colors.infoGrey}}>Starting On:</Text>
            <Text style={{color: Colors.infoGrey}}>September 15, 2017</Text>
          </View>
          <View style={{flexDirection: 'row', width: Metrics.screenWidth * 0.80,alignSelf: 'center', paddingHorizontal: Metrics.doubleBaseMargin, marginBottom: Metrics.baseMargin, justifyContent: 'space-between'}}>
            <Text style={{color: Colors.infoGrey}}>Frequency:</Text>
            <Text style={{color: Colors.infoGrey}}>Every Two Weeks</Text>
          </View>
          <View style={{flexDirection: 'row', width: Metrics.screenWidth * 0.80,alignSelf: 'center', paddingHorizontal: Metrics.doubleBaseMargin, marginBottom: Metrics.baseMargin, justifyContent: 'space-between'}}>
            <Text style={{color: Colors.infoGrey}}>Day:</Text>
            <Text style={{color: Colors.infoGrey}}>Wednesday</Text>
          </View>
          <View style={{flexDirection: 'row', width: Metrics.screenWidth * 0.80,alignSelf: 'center', paddingHorizontal: Metrics.doubleBaseMargin, marginBottom: Metrics.baseMargin, justifyContent: 'space-between'}}>
            <Text style={{color: Colors.infoGrey}}>Time:</Text>
            <Text style={{color: Colors.infoGrey}}>4:15PM</Text>
          </View>
          <View style={{width: Metrics.screenWidth * 0.80, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center' }}>
            <RounderButton style={{marginRight: Metrics.baseMargin, borderWidth: 0.5, borderColor: Colors.panther, backgroundColor: Colors.checkGreen, width: Metrics.screenWidth * 0.20}} onPress={() => console.log('accept')}>
              <Text style={{ alignSelf: 'center',color: Colors.snow}}>Accept</Text>
            </RounderButton>
            <RounderButton style={{borderWidth: 0.5, borderColor: Colors.panther, backgroundColor: Colors.infoGrey, width: Metrics.screenWidth * 0.20}} onPress={() => console.log('decline')} buttonTextStyle={{color: Colors.snow}}>
              <Text style={{alignSelf: 'center', color: Colors.snow}}>Decline</Text>
            </RounderButton>
          </View>
        </View>
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerConfirmationScreen)
