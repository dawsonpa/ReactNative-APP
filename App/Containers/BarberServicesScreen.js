import React, { Component } from 'react'
import { FlatList, Text, View, TouchableOpacity, TextInput } from 'react-native'
import { connect } from 'react-redux'
import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import isNumber from 'lodash/isNumber'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import BarberActions, { BarberSelectors } from '../Redux/BarberRedux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Colors, Metrics, Fonts } from '../Themes'
// Styles
import styles from './Styles/BarberServicesScreenStyle'

const adjustedHeight = Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight
const innerWidth = Metrics.screenWidth - (Metrics.doubleBaseMargin * 2);

class BarberServicesScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      services: props.services
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
    )
  })

  renderItem (item) {
    item = item.item
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', width: innerWidth * 0.45, height: adjustedHeight * 0.10 }}>
        <Text
          style={{fontSize: Fonts.size.small, color: Colors.questionGrey, width: innerWidth * 0.45, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginRight: Metrics.screenWidth * 0.075}}
        >{item.name}</Text>
        <Text
          style={{fontSize: Fonts.size.small, color: Colors.questionGrey, width: innerWidth * 0.20, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, marginRight: Metrics.screenWidth * 0.075}}
        > {item.price}</Text>
        <Text
          style={{fontSize: Fonts.size.small, color: Colors.questionGrey, borderBottomColor: Colors.questionGrey, borderBottomWidth: 2, width: innerWidth * 0.20}}
        >{item.time}</Text>
      </View>
    )
  }
  render () {
    const { navigation, services } = this.props
    const rowHeight = adjustedHeight * 0.075
    return (
      <View style={[styles.mainContainer, { padding: Metrics.baseMargin, height: adjustedHeight, backgroundColor: Colors.snow }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: rowHeight, width: innerWidth}}>
          <Text style={{alignSelf: 'center', color: Colors.greyText, fontWeight: 'bold'}}>Standard Services </Text>
          <TouchableOpacity onPress={() => navigation.navigate('BarberEditServicesScreen')}>
            <View style={{justifyContent: 'center', alignItems: 'center', height: rowHeight, width: rowHeight, borderRadius: rowHeight / 2, backgroundColor: Colors.greyBackground}}>
              <FontAwesomeIcon
                name={'edit'}
                size={25}
                color={Colors.questionGrey}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: innerWidth, height: adjustedHeight * 0.10 }}>
          <Text style={{fontSize: Fonts.size.small, color: Colors.questionGrey, width: innerWidth * 0.45, marginRight: Metrics.screenWidth * 0.075}}>SERVICE NAME</Text>
          <Text style={{fontSize: Fonts.size.small, color: Colors.questionGrey, width: innerWidth * 0.20, marginRight: Metrics.screenWidth * 0.075}}>PRICING ($)</Text>
          <Text style={{fontSize: Fonts.size.small, color: Colors.questionGrey, width: innerWidth * 0.20}}>TIME EST. (Mins)</Text>
        </View>
        <FlatList
          data={services}
          contentContainerStyle={{height: adjustedHeight * 0.80}}
          renderItem={(item) => this.renderItem(item)}
          key={'name'}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    services: BarberSelectors.getServices(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarberServicesScreen)
