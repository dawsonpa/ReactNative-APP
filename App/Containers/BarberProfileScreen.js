import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity, FlatList, Linking, Alert } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import BarberActions, { BarberSelectors } from '../Redux/BarberRedux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors, Metrics, Fonts } from '../Themes'
// Styles
import styles from './Styles/BarberProfileScreenStyle'
const innerWidth = Metrics.screenWidth - (Metrics.doubleBaseMargin * 2);

class BarberProfileScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      services: [{name: 'Fade', key: 'fade', price: 20}, {name: 'Shampoo', key: 'shampoo', price: 10}, {name: 'Coloring', key: 'coloring', price: 10}]

    }
  }
  static navigationOptions = ({navigation, screenProps}) =>({
    tabBarLabel: 'Profile',
    tabBarIcon: ({tintColor}) => (
      <FontAwesomeIcon
        name={'user-o'}
        style={styles.icon}
        color={Colors.panther}
        size={26}
      />
    ),
    headerLeft: <TouchableOpacity onPress={() => navigation.navigate('BarberSettingsScreen')}>
      <FontAwesomeIcon name={'gear'} size={26} style={{marginLeft: Metrics.baseMargin}} />
    </TouchableOpacity>
  });

  handleLinkPress(uri) {
    if(uri) {
      Linking.openURL(uri)
        .catch(() => {
          Alert.alert(
            'Error Opening URL',
            'Make sure it is a valid URL and it starts with http:// or https://',
            [
              { text: 'OK' }
            ]
          )
        })
    }
  }

  renderItem (item) {
    item = item.item;
    console.log(item, 'otekm 456')
    return (
      <View style={{width: innerWidth, justifyContent: 'space-between',flexDirection: 'row', marginBottom: Metrics.doubleBaseMargin }}>
        <Text>{item.name}</Text>
        <Text>${item.price}</Text>
      </View>
    )
  }
  render () {
    const {
      services,
      workZipCode,
      workState,
      workCity,
      workAddress,
      workName,
      firstName,
      lastName,
      website,
      facebook,
      instagram,
      twitter,
      linkedIn,
      youtube
    } = this.props.barber;
    return (
      <ScrollView style={[styles.container,{backgroundColor: Colors.snow}]}>
        <View style={{alignItems: 'center', paddingTop: Metrics.baseMargin, paddingHorizontal: Metrics.doubleBaseMargin}}>
          <View style={{width: innerWidth, flexDirection: 'row', justifyContent: 'space-between', marginBottom: Metrics.baseMargin}}>
            <View />
            <FontAwesomeIcon name={'user-circle-o'} size={60} />
            <TouchableOpacity onPress={() => this.props.navigation.navigate('BarberEditProfileScreen')}>
              <FontAwesomeIcon name={'edit'} size={20} color={Colors.questionGrey} />

            </TouchableOpacity>
          </View>
          {firstName && lastName && <Text style={{ fontSize: Fonts.size.h2, marginBottom: Metrics.baseMargin }}>{`${firstName} ${lastName}`}</Text>}
          {workName && <Text style={{marginBottom: Metrics.baseMargin, color: Colors.detailsGrey}}>{workName}</Text>}
          {workAddress && <Text style={{marginBottom: Metrics.baseMargin, color: Colors.detailsGrey}}>{`${workAddress}, ${workCity}`}</Text>}
          {workCity && workState && workZipCode && <Text style={{marginBottom: Metrics.baseMargin, color: Colors.detailsGrey}}>{`${workCity}, ${workState} ${workZipCode}`}</Text>}

          <View style={{flexDirection: 'row', marginBottom: Metrics.baseMargin}}>
            <TouchableOpacity style={{marginRight: Metrics.baseMargin}} onPress={() => this.handleLinkPress(website) }>
              <MaterialCommunityIconsIcon name={'web'} color={website ? Colors.hyperlink : Colors.dashboardBorder} size={35}/>
            </TouchableOpacity>
            <TouchableOpacity style={{marginRight: Metrics.baseMargin}} onPress={() => this.handleLinkPress(facebook)}>
              <FontAwesomeIcon name={'facebook-square'} color={facebook ? Colors.hyperlink : Colors.dashboardBorder} size={35}/>
            </TouchableOpacity>
            <TouchableOpacity style={{marginRight: Metrics.baseMargin}} onPress={() => this.handleLinkPress(twitter)}>
              <FontAwesomeIcon name={'twitter-square'} color={twitter ? Colors.hyperlink : Colors.dashboardBorder} size={35}/>
            </TouchableOpacity>
            <TouchableOpacity style={{marginRight: Metrics.baseMargin}} onPress={() => this.handleLinkPress(instagram)}>
              <FontAwesomeIcon name={'instagram'} color={instagram ? Colors.hyperlink : Colors.dashboardBorder} size={35}/>
            </TouchableOpacity>
            <TouchableOpacity style={{marginRight: Metrics.baseMargin}} onPress={() => this.handleLinkPress(youtube)}>
              <FontAwesomeIcon name={'youtube'} color={youtube ? Colors.hyperlink : Colors.dashboardBorder} size={35}/>
            </TouchableOpacity>
            <TouchableOpacity style={{marginRight: Metrics.baseMargin}} onPress={() => this.handleLinkPress(linkedIn)}>
              <FontAwesomeIcon name={'linkedin-square'} color={linkedIn ? Colors.hyperlink : Colors.dashboardBorder} size={35}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ borderBottomColor: Colors.dashboardBorder, borderBottomWidth: 2, marginBottom: Metrics.baseMargin, width: Metrics.screenWidth }} />
        {/*<View style={{paddingHorizontal: Metrics.doubleBaseMargin, marginBottom: Metrics.baseMargin}}>*/}
          {/*<View style={{width: innerWidth, marginBottom: Metrics.baseMargin, flexDirection: 'row', justifyContent: 'space-between'}}>*/}
            {/*<Text>HAPPY CLIENTS</Text>*/}
            {/*<TouchableOpacity onPress={() => console.log('See All Happy Clients')}>*/}
              {/*<Text>SEE ALL ></Text>*/}
            {/*</TouchableOpacity>*/}
          {/*</View>*/}
          {/*<View style={{flexDirection: 'row', width: innerWidth, marginBottom: Metrics.baseMargin, justifyContent: 'space-between'}}>*/}
            {/*<View style={{flexDirection: 'column'}}>*/}
              {/*<FontAwesomeIcon style={{alignSelf:'center'}} name={'user'} size={40} />*/}
              {/*<Text style={{color: Colors.hyperlink}}>@CedricSmith</Text>*/}
              {/*<Text>good job!</Text>*/}
            {/*</View>*/}
            {/*<View style={{flexDirection: 'column'}}>*/}
              {/*<FontAwesomeIcon style={{alignSelf:'center'}} name={'user'} size={40} />*/}
              {/*<Text style={{color: Colors.hyperlink}}>@AnthonyJohns</Text>*/}
              {/*<Text>killin it!</Text>*/}
            {/*</View>*/}
            {/*<View style={{flexDirection: 'column'}}>*/}
              {/*<FontAwesomeIcon style={{alignSelf:'center'}} name={'user'} size={40} />*/}
              {/*<Text style={{color: Colors.hyperlink}}>Dwon Murphy</Text>*/}
              {/*<Text>so smooth!</Text>*/}
            {/*</View>*/}
          {/*</View>*/}
        {/*</View>*/}
        {/*<View style={{ borderBottomColor: Colors.dashboardBorder, borderBottomWidth: 2, marginBottom: Metrics.baseMargin, width: Metrics.screenWidth }} />*/}
        <View style={{paddingHorizontal: Metrics.doubleBaseMargin}}>
          <Text style={{marginBottom: Metrics.doubleBaseMargin}}>SERVICES & PRICING</Text>
          {services && <FlatList
            data={services}
            renderItem={(item) => this.renderItem(item)}
          />}
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    barber: BarberSelectors.getBarber(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarberProfileScreen)
