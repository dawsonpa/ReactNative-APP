import React, { Component } from 'react'
import { ScrollView,View, Text, KeyboardAvoidingView, TouchableOpacity, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import isEqual from 'lodash/isEqual'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import HaircutActions, {HaircutSelectors} from '../Redux/HaircutRedux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Colors, Metrics, Fonts } from '../Themes'
import { Agenda } from 'react-native-calendars'

// Styles
import moment from 'moment'
import styles from './Styles/BarberScheduleScreenStyle'
const adjustedHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight

class BarberScheduleScreen extends Component {
  constructor (props) {
    super(props)
    console.log(props.selectedHaircut, 'props select')
    const selectedDate = props.selectedHaircut
      ? props.selectedHaircut.date
      : moment().local().format()

    this.state = {
      items: props.barberHaircuts || {},
      minDate: this.timeToString(moment().subtract(1, 'months').format()),
      maxDate: this.timeToString(moment().add(3, 'months').format()),
      selectedDate: this.timeToString(selectedDate),
      selectedMonth: moment(selectedDate).format('MMMM'),
      showMonth: true
    }
    props.getBarberHaircuts()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.selectedDate !== this.props.selectedDate) {
      this.setState({
        selectedDate: nextProps.selectedDate,
        selectedMonth: moment(nextProps.selectedDate).format('MMMM')
      })
    }
  }

  @autobind
  handleAppointmentClick (appointment) {
    const { setSelectedHaircutId, navigation, setSelectedDate } = this.props
    setSelectedHaircutId(appointment.haircutId)
    setSelectedDate(appointment.date)
    navigation.navigate('BarberSessionDetailsScreen')
  }

  render () {
    const { maxDate, minDate, items, selectedDate, selectedMonth, showMonth } = this.state
    const { barberHaircuts, selectedHaircut } = this.props
    const dateSelected = this.timeToString(selectedDate)
    return (
      <View style={styles.mainContainer}>
        <View style={{flexDirection: 'row', backgroundColor: Colors.snow, justifyContent: 'space-between', alignItems: 'center', width: Metrics.screenWidth, paddingHorizontal: Metrics.baseMargin, height: adjustedHeight * 0.10}}>
          <View />
          {
          showMonth
            ? <Text style={{fontSize: Fonts.size.h4 }}>{selectedMonth}</Text>

            : <View />
          }
          <TouchableOpacity onPress={() => this.props.navigation.navigate('AddSessionScreen', {selectedDate})}>
            <FontAwesomeIcon
              size={26}
              name={'plus'}
              color={Colors.panther}
            />
          </TouchableOpacity>
        </View>
        <Agenda
          items={items}
          loadItemsForMonth={day => this.loadItems(day.timestamp, barberHaircuts)}
          selected={dateSelected}
          maxDate={maxDate}
          minDate={minDate}
          onDaychange={day => {
            this.props.setSelectedDate(day.dateString)
          }}
          onCalendarToggled={calendarOpened => {
            this.setState({ showMonth: !calendarOpened })
          }}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          onDayPress={(selectedDate) => {
            this.props.setSelectedDate(selectedDate.dateString)
          }
          }
          pastScrollRange={1}
          futureScrollRange={3}
        />
      </View>
    )
  }

  @autobind
  loadItems (timestamp, barberHaircuts) {
    const items = {...barberHaircuts}

    for (let i = -15; i < 90; i++) {
      const time = moment(timestamp + i * 24 * 60 * 60 * 1000).format();
      const strtime = this.timeToString(time)
      if (!items[strtime]) {
        items[strtime] = []
      }
    }

    this.setState({
      items
    })
  }

  renderItem (item) {
    return (
      <TouchableHighlight underlayColor={'white'} activeOpacity={0.3} onPress={() => this.handleAppointmentClick(item)} style={{backgroundColor: 'white', flex:1, borderRadius: 5, padding: 10, marginRight: 10, marginTop: 5}} >
        <View style={{flexDirection: 'column'}}>
          <Text>{item.customerName}</Text>
          <Text>Start: {item.start} | End: {item.end}</Text>
          <Text>{item.haircutType} | Last seen: {item.lastSeen}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  renderEmptyDate () {
    return (
      <View style={{height: 15, flex: 1, paddingTop: 30}}>
        <TouchableOpacity onPress={() => this.props.setSelectedHaircutId()}>
          <Text>No appointments for this date!</Text>
        </TouchableOpacity>
      </View>
    )
  }

  rowHasChanged (r1, r2) {
    return r1.name !== r2.name
  }

  timeToString (time) {
    return moment(time).format('YYYY-MM-DD').toString()
  }
}

const mapStateToProps = (state) => {
  return {
    barberHaircuts: HaircutSelectors.getBarberCalendarAppointments(state),
    selectedHaircut: HaircutSelectors.getSelectedHaircut(state),
    selectedDate: HaircutSelectors.getSelectedDate(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getBarberHaircuts: () => dispatch(HaircutActions.haircutBarberRequest()),
    setSelectedHaircutId: id => dispatch(HaircutActions.setSelectedHaircutId(id)),
    setSelectedDate: date => dispatch(HaircutActions.setSelectedDate(date))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarberScheduleScreen)
