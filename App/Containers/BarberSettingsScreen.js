import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/BarberSettingsScreenStyle'
import { Colors, Metrics, Fonts } from '../Themes'

class BarberSettingsScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerLeft: <TouchableOpacity onPress={() => navigation.goBack()}>
      <FontAwesomeIcon style={{color: Colors.panther, marginLeft: Metrics.baseMargin}} name={'angle-left'} size={20} />
    </TouchableOpacity>,
  });
  render () {
    return (
      <View style={[styles.container,{backgroundColor: Colors.steel}]}>
        <TouchableOpacity style={{width: Metrics.screenWidth, borderWidth: 1, backgroundColor: Colors.snow, borderColor: Colors.questionGrey, height: 40, justifyContent: 'center', alignItems: 'center'}} onPress={() => this.props.navigation.navigate('LandingScreen')} >
          <Text>Logout</Text>
        </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(BarberSettingsScreen)
