import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, View, FlatList } from 'react-native'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import IconBadge from 'react-native-icon-badge'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import HaircutActions, {HaircutSelectors} from '../Redux/HaircutRedux'
import StarRating from 'react-native-star-rating'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import autobind from'autobind-decorator'
import constants from '../Config/constants'
import styles from './Styles/CustomerHaircutsScreenStyle'
import { Metrics, Colors, Fonts } from '../Themes/'
import moment from 'moment'
import 'moment-timezone'
// Styles
const innerWidth = Metrics.screenWidth - Metrics.doubleBaseMargin;
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
class CustomerHaircutsScreen extends Component {
  constructor (props) {
    super(props)
    props.getCustomerHaircuts()
  }

  static navigationOptions =({navigation, screenProps}) => ({
    headerRight: headerRight(navigation),
    headerLeft: null
  });

  @autobind
  renderUpcoming(item) {
    return this.renderItem(item, 'upcoming')
  }
  @autobind
  renderPast(item) {
    return this.renderItem(item, 'past')
  }

  @autobind
  renderItem (item, type) {
    item = item.item;
    const date = moment(item.start).local();
    const day = constants.dayDict[date.day()].short;
    const dayNum = date.date();
    const month = constants.monthDict[date.month()].short;
    const hour = date.hour();
    const minute = date.minutes();
    const suffix = hour >= 12 ? 'PM' : 'AM' ;
    const startTime = moment.tz(date, item.timezone).format('LT z')

    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('CustomerSessionDetailsScreen', {haircut: item, haircutType: type})}>
        <View style={{ flexDirection: 'row',borderWidth: 1,marginHorizontal: Metrics.baseMargin, borderColor: Colors.questionGrey,marginBottom: Metrics.baseMargin, height: Metrics.screenHeight * 0.15, width: innerWidth, backgroundColor: Colors.cardGrey }}>
          <View style={{flexDirection: 'column', borderRightWidth: 1, borderRightColor: Colors.questionGrey, justifyContent: 'space-between', alignItems: 'center',paddingVertical: Metrics.baseMargin, height: Metrics.screenHeight * 0.15, width: innerWidth * 0.15}}>
            <Text>{day}</Text>
            <Text style={{fontSize: Fonts.size.h4}}>{dayNum}</Text>
            <Text>{month}</Text>
          </View>
          <View style={{flexDirection: 'column', justifyContent: 'center', marginHorizontal: Metrics.baseMargin}}>
            <FontAwesomeIcon
              size={(Metrics.screenHeight * 0.15) - (Metrics.doubleBaseMargin * 1.5) }
              name={'user-circle-o'}
            />
          </View>
          <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingVertical: Metrics.baseMargin}}>
            <Text style={{fontSize: Fonts.size.small}}>{`${item.barber.firstName} ${item.barber.lastName}`}</Text>
            {
              item.barber.rating &&
              <View style={{flexDirection: 'row' }}>
                <StarRating
                  disabled
                  starColor={Colors.switchOrange}
                  starSize={Metrics.icons.tiny}
                  rating={item.barber.rating}
                  style={{marginRight: Metrics.baseMargin}}

                />
                <Text>{item.barber.reviews} Reviews</Text>
              </View>
            }
            {
              item.barber.workName &&
              <Text style={{fontSize: Fonts.size.small}}>{item.barber.workName}</Text>
            }
            <View style={{ flexDirection: 'row' }}>
              <FontAwesomeIcon
                name={'map-pin'}
                size={Metrics.icons.tiny}
                style={{marginRight: Metrics.baseMargin}}
              />
              <Text style={{fontSize: Fonts.size.small}}> {item.workAddress}</Text>
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
      </TouchableOpacity>
    )
  }
  render () {
    console.log(this.props.customerHaircuts, 'customer haircuts')
    const { future, past, present } = this.props.customerHaircuts
    return (
      <ScrollView style={[styles.container, { backgroundColor: Colors.snow }]}>
        <View style={{flexDirection: 'column'}}>
          {
            future && future.length ?
              <View style={{marginLeft: Metrics.baseMargin, marginVertical: Metrics.baseMargin, alignItems: 'center', flexDirection: 'row', width: Metrics.screenWidth - Metrics.baseMargin, justifyContent: 'space-between'}}>
                <Text style={{fontSize: Fonts.size.h5}}>Upcoming</Text>
                <View style={{width: Metrics.screenWidth * 0.70, borderBottomWidth: 1, borderBottomColor: Colors.greyText}} />
              </View>
              : null
          }
          {
           future && future.length ?
             <FlatList
               data={future}
               contentContainerStlye={{marginVertical: Metrics.baseMargin}}
               renderItem={(item) => this.renderUpcoming(item)}
             /> : null
          }
          {
            present && present.length ?
              <View style={{marginLeft: Metrics.baseMargin, marginVertical: Metrics.baseMargin, alignItems: 'center', flexDirection: 'row', width: Metrics.screenWidth - Metrics.baseMargin, justifyContent: 'space-between'}}>
                <Text style={{fontSize: Fonts.size.h5}}>Present</Text>
                <View style={{width: Metrics.screenWidth * 0.80, borderBottomWidth: 1, borderBottomColor: Colors.greyText}} />
              </View> : null
          }
          {
            present && present.length ?
              <FlatList
                data={present.reverse()}
                contentContainerStlye={{marginVertical: Metrics.baseMargin}}
                renderItem={(item) => this.renderUpcoming(item)}
              /> : null
          }
          {
            past && past.length ?
              <View style={{marginLeft: Metrics.baseMargin, marginVertical: Metrics.baseMargin, alignItems: 'center', flexDirection: 'row', width: Metrics.screenWidth - Metrics.baseMargin, justifyContent: 'space-between'}}>
                <Text style={{fontSize: Fonts.size.h5}}>Past</Text>
                <View style={{width: Metrics.screenWidth * 0.80, borderBottomWidth: 1, borderBottomColor: Colors.greyText}} />
              </View> : null
          }
          {
            past && past.length ?
              <FlatList
                data={past.reverse()}
                contentContainerStlye={{marginVertical: Metrics.baseMargin}}
                renderItem={(item) => this.renderPast(item)}
              /> : null
          }
          {
            isEmpty(this.props.customerHaircuts) ?
              <View style={{flexDirection: 'column',paddingHorizontal: Metrics.baseMargin, height: Metrics.screenHeight - Metrics.tabBarHeight -Metrics.navBarHeight, width: Metrics.screenWidth, justifyContent: 'center', alignItems: 'center'}}>
                <FontAwesomeIcon
                  name={'scissors'}
                  size={Metrics.icons.large}
                  color={Colors.questionGrey}
                />
                <Text style={{fontSize: Fonts.size.h5, marginVertical: Metrics.baseMargin}}>You Haven't Gotten a Haircut Yet</Text>
                <Text style={{fontSize: Fonts.size.small}}> You will see upcoming and past haircuts here. Rebook</Text>
                <Text style={{fontSize: Fonts.size.small}}>a past haircut or edit an upcoming haircut in this lab.</Text>
              </View> : null
          }
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    customerHaircuts: HaircutSelectors.getSortedCustomerHaircuts(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomerHaircuts: () => dispatch(HaircutActions.haircutCustomerRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerHaircutsScreen)
