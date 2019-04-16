import React, { Component } from 'react'
import { FlatList, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import BarberActions, { BarberSelectors } from '../Redux/BarberRedux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Colors, Metrics, Fonts } from '../Themes'
// Styles
import styles from './Styles/BarberEditServicesScreenStyle'

const adjustedHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight
const innerWidth = Metrics.screenWidth - (Metrics.doubleBaseMargin * 2)

class BarberEditServicesScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      services: props.services.asMutable() || []
    }

  }
  static navigationOptions = ({navigation, screenProps}) => ({
    tabBarLabel: 'Services',
    tabBarIcon: ({tintColor}) => (
      <FontAwesomeIcon
        name={'scissors'}
        style={styles.icon}
        color={Colors.panther}
        size={26}
      />
    ),
    tabBarVisible: false,
    headerLeft: <TouchableOpacity onPress={() => navigation.goBack()}>
      <FontAwesomeIcon name={'angle-left'} size={26} style={{marginLeft: Metrics.baseMargin}} />
    </TouchableOpacity>
  })
  saveServices () {
    const { services } = this.state

    const { navigation, updateBarber } = this.props

    if (services && services.length && !isEqual(this.props.services, services)) {
      updateBarber({services})
    }
    navigation.goBack()
  }

  addService () {
    const { services } = this.state
    const serviceObject = {
      price: 10,
      time: 15,
      name: 'New Service'
    }
    const newServices = services.concat(serviceObject)
    this.setState({ services: newServices })
  }

  removeService(index) {
    const { services } = this.state
    services.splice(index, 1)
    this.setState({services})

  }
  handleNameChange (name, index) {
    let { services } = this.state
    services[index] = { ...services[index], name }
    this.setState({ services })
  }

  handleTimeChange (time, index) {
    let { services } = this.state
    services[index] = { ...services[index], time }
    this.setState({ services })
  }

  handlePriceChange (price, index) {
    const { services } = this.state
    services[index] = { ...services[index], price }
    this.setState({ services })
  }

  renderItem (item) {
    const index = item.index
    item = item.item
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', width: innerWidth * 0.45, height: adjustedHeight * 0.10 }}>
        <TextInput
          value={item.name.toString()}
          ref={`${index}-name`}
          style={{fontSize: Fonts.size.small, color: Colors.questionGrey, width: innerWidth * 0.45, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, height: 40, marginRight: Metrics.screenWidth * 0.075}}
          onChangeText={name => this.handleNameChange(name, index)}
        />
        <TextInput
          value={item.price.toString()}
          style={{fontSize: Fonts.size.small, color: Colors.questionGrey, width: innerWidth * 0.20, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, height: 40, marginRight: Metrics.screenWidth * 0.075}}
          onChangeText={price => this.handlePriceChange(price, index)}
          OnEndEditing={e => console.log('end price editing', e)}

        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: innerWidth * 0.20}}>
          <TextInput
            value={item.time.toString()}
            style={{fontSize: Fonts.size.small, color: Colors.questionGrey, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, height: 40, width: innerWidth * 0.15}}
            onChangeText={time => this.handleTimeChange(time, index)}
            OnEndEditing={e => console.log('end time editing', e)}
          />
          <TouchableOpacity onPress={() => this.removeService(index)}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', width: 0.05 * innerWidth, borderBottomColor: Colors.questionGrey, alignItems: 'center', height: 40, borderBottomWidth: 2}}>
              <FontAwesomeIcon
                name={'times-circle'}
                size={20}
                color={Colors.infoGrey}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  render () {
    const { services } = this.state
    const rowHeight = adjustedHeight * 0.075
    return (
      <ScrollView contentContainerStyle={[styles.mainContainer, { padding: Metrics.baseMargin, height: adjustedHeight, backgroundColor: Colors.snow }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: rowHeight, width: innerWidth}}>
          <TouchableOpacity onPress={() => this.addService()}>
            <View style={{justifyContent: 'center', alignItems: 'center', height: rowHeight, width: rowHeight, borderRadius: rowHeight / 2, backgroundColor: Colors.greyBackground}}>
              <FontAwesomeIcon
                name={'plus'}
                size={25}
                color={Colors.questionGrey}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.saveServices(services)}>
            <View style={{justifyContent: 'center', alignItems: 'center', height: rowHeight, width: rowHeight, borderRadius: rowHeight / 2, backgroundColor: Colors.greyBackground}}>
              <Text>Save</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: innerWidth, height: adjustedHeight * 0.10 }}>
          <Text style={{fontSize: Fonts.size.small, color: Colors.questionGrey, width: innerWidth * 0.45, marginRight: Metrics.screenWidth * 0.075}}>SERVICE NAME</Text>
          <Text style={{fontSize: Fonts.size.small, color: Colors.questionGrey, width: innerWidth * 0.20, marginRight: Metrics.screenWidth * 0.075}}>PRICING ($)</Text>
          <Text style={{fontSize: Fonts.size.small, color: Colors.questionGrey, width: innerWidth * 0.20}}>TIME EST. (Mins)</Text>
        </View>
        <KeyboardAwareFlatList
          data={services}
          contentContainerStyle={{height: adjustedHeight * 0.80}}
          renderItem={(item) => this.renderItem(item)}
          key={'name'}
        />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    services: BarberSelectors.getServices(state),
    barber: BarberSelectors.getBarber(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateBarber: barber => dispatch(BarberActions.barberUpdateRequest(barber))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarberEditServicesScreen)
