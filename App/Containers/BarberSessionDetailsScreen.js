import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity,View } from 'react-native'
import { connect } from 'react-redux'
import { Colors, Metrics, Fonts } from '../Themes'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { HaircutSelectors } from '../Redux/HaircutRedux'

// Styles
import styles from './Styles/BarberSessionDetailsScreenStyle'

class BarberSessionDetailsScreen extends Component {
  constructor (props) {
    super(props);
    this.editScreen = this.editScreen.bind(this)
  }
  editScreen () {
    console.log(this.props.navigation.state.params.session, 'session');
    this.props.navigation.navigate('EditSessionScreen')
  }
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerRight: <TouchableOpacity onPress={() => navigation.navigate('EditSessionScreen')}>
      <Text style={{color: '#E67650', fontSize: 20, marginRight: Metrics.baseMargin}}>Edit</Text>
    </TouchableOpacity>,
    headerLeft: <TouchableOpacity onPress={() => navigation.navigate('BarberScheduleScreen')}>
      <Text style={{color: '#E67650', fontSize: 20, marginLeft: Metrics.baseMargin}}>Calendar</Text>
    </TouchableOpacity>,
    headerTintColor: '#E67650',
    headerTitleStyle: {color: Colors.panther},
    tabBarVisible: false
  });

  render () {
    const { session } = this.props

    return (
      session &&
      <View style={[styles.mainContainer, {backgroundColor: Colors.snow}]}>
        <View style={{flexDirection: 'column', paddingBottom: Metrics.doubleBaseMargin, marginTop: Metrics.doubleBaseMargin, marginLeft: Metrics.doubleBaseMargin}}>
          <Text style={{fontSize: Fonts.size.medium, marginBottom: Metrics.baseMargin / 2, color: Colors.detailsGrey}}>{session.customerName}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: Fonts.size.medium, marginBottom: Metrics.baseMargin / 2, color: Colors.detailsGrey}}>Cell: </Text>
            <Text style={{fontSize: Fonts.size.medium, marginBottom: Metrics.baseMargin / 2, color: Colors.hyperlink}}>{session.customerNumber}</Text>
          </View>
          <Text style={{fontSize: Fonts.size.medium, marginBottom: Metrics.baseMargin / 2, color: Colors.infoGrey}}>{session.date}</Text>
          <Text style={{fontSize: Fonts.size.medium, marginBottom: Metrics.baseMargin / 2, color: Colors.infoGrey}} >From {session.start} to {session.end}</Text>
        </View>
        <View style={{borderBottomColor: Colors.separator, borderBottomWidth: 2, marginLeft: Metrics.doubleBaseMargin}} />
        <View style={{flexDirection: 'column', justifyContent: 'center', paddingVertical: Metrics.doubleBaseMargin, alignItems: 'center', width: Metrics.screenWidth}}>
          <View style={{width: Metrics.screenWidth * 0.90, backgroundColor: Colors.agendaGrey, paddingVertical: Metrics.doubleBaseMargin, borderWidth: 1, borderColor: Colors.agendaBorder, borderRadius: 5, flexDirection: 'column'}}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
              <Text style={{fontSize: Fonts.size.small, color: Colors.infoGrey}}>{session.start} </Text>
              <View style={{borderBottomColor: Colors.infoGrey, borderBottomWidth: 1, width: Metrics.screenWidth * 0.75}} />
            </View>
            <View style={{width: Metrics.screenWidth * 0.75, flexDirection: 'column', paddingLeft: Metrics.baseMargin, alignSelf: 'flex-end', backgroundColor: Colors.appointmentBlue}}>
              <Text style={{color: Colors.snow}}>{session.customerName}</Text>
              <Text style={{color: Colors.snow}}>{session.haircutType} | Last seen: {session.lastSeen}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
              <Text style={{fontSize: Fonts.size.small, color: Colors.infoGrey}}>{session.end} </Text>
              <View style={{borderBottomColor: Colors.infoGrey, borderBottomWidth: 1, width: Metrics.screenWidth * 0.75}} />
            </View>
          </View>
        </View>
        <View style={{borderBottomColor: Colors.separator, borderBottomWidth: 2, marginLeft: Metrics.doubleBaseMargin}} />
        <View style={{width: Metrics.screenWidth, marginVertical: Metrics.doubleBaseMargin, flexDirection: 'row', paddingHorizontal: Metrics.doubleBaseMargin, justifyContent: 'space-between'}}>
          <Text style={{fontSize: Fonts.size.medium}}>Calendar</Text>
          <Text style={{fontSize: Fonts.size.medium, color: Colors.infoGrey}}>{session.customerEmail}</Text>
        </View>
        <View style={{borderBottomColor: Colors.separator, borderBottomWidth: 2, marginLeft: Metrics.doubleBaseMargin}} />
        <View style={{width: Metrics.screenWidth, marginVertical: Metrics.doubleBaseMargin, flexDirection: 'row', paddingHorizontal: Metrics.doubleBaseMargin, justifyContent: 'space-between'}}>
          <Text style={{fontSize: Fonts.size.medium}}>Alert</Text>
          <Text style={{fontSize: Fonts.size.medium, color: Colors.infoGrey}}>1 hour before</Text>
        </View>
        <View style={{borderBottomColor: Colors.separator, borderBottomWidth: 2, marginLeft: Metrics.doubleBaseMargin}} />
        <Text style={{fontSize: Fonts.size.medium, marginLeft: Metrics.doubleBaseMargin, marginTop: Metrics.doubleBaseMargin}}>Client Notes</Text>
        <ScrollView contentContainerStyle={{margin: Metrics.doubleBaseMargin}}>
          <Text style={{color: Colors.infoGrey}}>{session.notes}</Text>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    session: HaircutSelectors.getSelectedAppointment(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarberSessionDetailsScreen)
