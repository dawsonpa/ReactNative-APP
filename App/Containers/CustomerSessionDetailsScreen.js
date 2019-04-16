import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, TouchableOpacity, View, FlatList } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import HaircutActions, {HaircutSelectors} from '../Redux/HaircutRedux'
import StarRating from 'react-native-star-rating'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import IconBadge from 'react-native-icon-badge'
import constants from '../Config/constants'
import RoundedButton from '../Components/RoundedButton'

// Styles
import styles from './Styles/CustomerSessionDetailsScreenStyle'
import { Metrics, Colors, Fonts } from '../Themes/'
import moment from 'moment'
import 'moment-timezone'
const innerWidth = Metrics.screenWidth - Metrics.doubleBaseMargin
const adjustedHeight = Metrics.screenHeight - Metrics.navBarHeight
const headerRight = (navigation) => {
  return navigation.invoiceNumber
    ? <TouchableOpacity style={{marginRight: Metrics.baseMargin}} onPress={() => navigation.navigate('CustomerNotificationsScreen')}>
      <IconBadge
        MainElement={
          <FontAwesomeIcon
            size={30}
            name={'bell-o'}
          />
        }
        BadgeElement={
          <Text style={{color: Colors.snow}}>{navigation.invoiceNumber}</Text>
        }
        IconBadgeStyle={{backgroundColor: Colors.switchOrange}}
        Hidden={navigation.invoiceNumber === 0}
      />
    </TouchableOpacity>
    : <FontAwesomeIcon
      size={30}
      name={'bell-o'}
      style={{ marginRight: Metrics.baseMargin }}
    />
}

class CustomerSessionDetailsScreen extends Component {
  static navigationOptions =({navigation, screenProps}) => ({
    headerRight: headerRight(navigation),
    title: navigation.state.params.haircutType === 'past'
      ? 'Past Detail'
      : 'Upcoming Detail',
    headerLeft: <TouchableOpacity onPress={() => navigation.navigate('CustomerHaircutsScreen')}>
      <FontAwesomeIcon style={{color: Colors.panther, marginLeft: Metrics.baseMargin}} name={'angle-left'} size={30} />
    </TouchableOpacity>,
    headerStyle: {
      backgroundColor: Colors.snow,
      borderBottomColor: Colors.dashboardBorder
    },
    tabBarVisible: false
  });

  renderItem (item) {
    item = item.item
    return (
      <Text style={{alignSelf: 'flex-end', marginBottom: Metrics.baseMargin}}>{`${item.name} - $${item.price}`}</Text>
    )
  }

  render () {
    const haircut = this.props.navigation.state.params.haircut
    const date = moment(haircut.start).local();
    const day = constants.dayDict[date.day()].short;
    const dayNum = date.date();
    const month = constants.monthDict[date.month()].short;
    const hour = date.hour();
    const minute = date.minutes()
    const suffix = hour >= 12 ? 'PM' : 'AM'
    const startTime = moment.tz(date, haircut.timezone).format('LT z')
    const parsedDate = moment.tz(haircut.start, haircut.barber.timezone)
    const formattedDate = parsedDate.format('MMMM DD, YYYY')
    const time = parsedDate.format('LT')
    return (
      <View style={[{backgroundColor: Colors.snow, flexDirection: 'column', flex: 1}]}>
        <View style={{ height: adjustedHeight * 0.20, flexDirection: 'column', justifyContent: 'center',borderTopWidth: 1, borderColor: Colors.dashboardBorder,  borderBottomWidth: 1, borderBottomColor: Colors.dashboardBorder, width: Metrics.screenWidth }}>
          <View style={{ flexDirection: 'row', marginHorizontal: Metrics.baseMargin, height: adjustedHeight * 0.15, width: innerWidth, backgroundColor: Colors.snow }}>
            <View style={{flexDirection: 'column', justifyContent: 'center', marginHorizontal: Metrics.baseMargin}}>
              <FontAwesomeIcon
                size={(adjustedHeight * 0.15) - (Metrics.doubleBaseMargin * 1.5)}
                name={'user-circle-o'}
              />
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingVertical: Metrics.baseMargin}}>
              <Text style={{fontSize: Fonts.size.small}}>{`${haircut.barber.firstName} ${haircut.barber.lastName}`}</Text>
              {
                haircut.barber.rating &&
                <View style={{ flexDirection: 'row' }}>
                  <StarRating
                    disabled
                    starColor={Colors.switchOrange}
                    starSize={Metrics.icons.tiny}
                    rating={haircut.barber.rating}
                    style={{marginRight: Metrics.baseMargin}}

                  />
                  <Text>{haircut.barber.reviews} Reviews</Text>
                </View>
              }
              {
                haircut.barber.workName &&
                <Text style={{fontSize: Fonts.size.small}}>{haircut.barber.workName}</Text>
              }
              <View style={{ flexDirection: 'row' }}>
                <FontAwesomeIcon
                  name={'map-pin'}
                  size={Metrics.icons.tiny}
                  style={{marginRight: Metrics.baseMargin}}
                />
                <Text style={{fontSize: Fonts.size.small}}> {haircut.workAddress}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <FontAwesomeIcon
                  size={Metrics.icons.tiny}
                  name={'clock-o'}
                  style={{marginRight: Metrics.baseMargin}}

                />
                <Text style={{fontSize: Fonts.size.small}}>{startTime} </Text>
              </View>
            </View>
          </View>
        </View>
        <ScrollView style={{height: adjustedHeight * 0.6, backgroundColor: Colors.scrollGrey}}>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{marginTop: Metrics.baseMargin}}>Order Summary</Text>
            <View style={{ borderBottomColor: Colors.dashboardBorder, marginTop: Metrics.baseMargin, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, width: 60 }} />
          </View>
          <View style={{flexDirection: 'row', marginHorizontal: Metrics.baseMargin, width: innerWidth, justifyContent: 'space-between' }}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: innerWidth}}>
              <Text style={{marginTop: Metrics.baseMargin}}>Date</Text>
              <Text>{formattedDate}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginHorizontal: Metrics.baseMargin, width: innerWidth, justifyContent: 'space-between' }}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: innerWidth, marginTop: Metrics.baseMargin}}>
              <Text>Time</Text>
              <Text>{time}</Text>
            </View>
            <Text />
          </View>
          <View style={{ borderBottomColor: Colors.dashboardBorder, alignSelf: 'center', marginTop: Metrics.baseMargin, borderBottomWidth: 1, marginBottom: Metrics.baseMargin, width: innerWidth }} />
          <View style={{flexDirection: 'row', marginHorizontal: Metrics.baseMargin, width: innerWidth, justifyContent: 'space-between' }}>
            <Text>Services</Text>
            <FlatList
              data={haircut.services}
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
        </ScrollView>
        {
          this.props.navigation.state.params.haircutType === 'upcoming' &&
          <View style={{backgroundColor: Colors.snow, width: Metrics.screenWidth, borderTopWidth: 1, borderTopColor: Colors.questionGrey, height: adjustedHeight * 0.20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <RoundedButton onPress={() => console.log('canceling appointment')} style={{width: Metrics.screenWidth * 0.35, height: 30, backgroundColor: Colors.checkGreen, borderWidth: 1, borderColor: Colors.panther, marginRight: Metrics.baseMargin}} buttonTextStyle={{ color: Colors.snow, fontSize: Fonts.size.tiny }} text={'Cancel Appointment'} />
            <RoundedButton buttonTextProps={{ellipsizeMode: 'tail',}} onPress={() => console.log('Chat about appointment')} style={{width: Metrics.screenWidth * 0.35,height: 30, backgroundColor: Colors.checkGreen, borderWidth: 1, borderColor: Colors.panther}} buttonTextStyle={{color: Colors.snow, flexShrink: 1, fontSize: Fonts.size.tiny}} text={`Chat with ${haircut.barber.firstName}`} />
          </View>
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerSessionDetailsScreen)
