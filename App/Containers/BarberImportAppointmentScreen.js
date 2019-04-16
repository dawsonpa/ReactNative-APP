import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, TouchableOpacity, View, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { SearchBar } from 'react-native-elements';
import {Metrics, Colors, Fonts} from '../Themes'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import autobind from 'autobind-decorator'

import flatten from 'lodash/flatten'

import { filter, some, includes } from 'lodash/collection';
import { debounce } from 'lodash/function';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux''
import HaircutActions, { HaircutSelectors } from '../Redux/HaircutRedux'

// Styles
import styles from './Styles/BarberImportAppointmentScreenStyle'

class BarberImportAppointmentScreen extends Component {
  constructor (props) {
    super(props);
    const { past, present } = props.appointments
    this.state = {
      searchInput: null,
      today: present,
      past: past,
      appointments: flatten([present, past])
    };
    this._onBlur = this._onBlur.bind(this);
    this._onFocus = this._onFocus.bind(this);
  }
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerLeft: <TouchableOpacity style={{ marginLeft: Metrics.baseMargin }} onPress={() => navigation.goBack()}>
      <Text style={{color: Colors.hyperlink}}>Cancel</Text>
    </TouchableOpacity>,
    headerRight: <TouchableOpacity style={{ marginRight: Metrics.baseMargin }} onPress={() => navigation.navigate('BarberInvoiceScreen')}>
      <Text style={{color: Colors.hyperlink}}>Import</Text>
    </TouchableOpacity>,
    headerTintColor: '#E67650',
    headerTitleStyle: {color: Colors.panther},
    tabBarVisible: false
  });

  componentWillMount () {
    this.props.getBarberHaircuts()
  }
  _onFocus () {
    this.setState({searchFocused: true})
  }
  _onBlur () {
    this.setState({searchFocused: false})
  }
  _onChangeText = searchInput => {
    this.setState({ searchInput });
    debounce(() => {
      // use internal search logic (depth first)!
      const results = this._internalSearch(searchInput);
      this.setState({results})
    }, 500)();
  };
  _internalSearch = input => {
    if (input === '') {
      return [];
    }
    return filter(this.state.appointments, appointment => {
      return this._depthFirstSearch(appointment, input);
    });
  };

  _depthFirstSearch = (collection, input) => {
    // let's get recursive boi
    let type = typeof collection;
    // base case(s)
    if (type === 'string' || type === 'number' || type === 'boolean') {
      return includes(
        collection.toString().toLowerCase(),
        input.toString().toLowerCase()
      );
    }
    return some(collection, item => this._depthFirstSearch(item, input));
  };

  @autobind
  handleAppointmentPress (id) {
    this.setState({ selectedId: id})
    this.props.setSelectedHaircutId(id)
  }

  @autobind
  renderItem (item) {
    item = item.item
    const { selectedId } = this.state
    return (
      <TouchableOpacity onPress={() => this.handleAppointmentPress(item.haircutId)}>
        <View style={{flexDirection: 'row', backgroundColor: Colors.snow, paddingHorizontal: Metrics.baseMargin, justifyContent: 'space-between',alignItems: 'center', width: Metrics.screenWidth, height: Metrics.screenHeight * 0.10, borderBottomColor: Colors.questionGrey, borderBottomWidth: 1}}>
          <Text>{item.customerName}</Text>
          <View style={{ flexDirection: 'row'}}>
            <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
              <Text>{item.date}</Text>
              <Text style={{color: Colors.questionGrey}}>{item.start}</Text>
            </View>
            <View style={{ width: Metrics.screenWidth * 0.17, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {
                selectedId === item.haircutId
                  ? <FontAwesomeIcon
                    name={'check'}
                    color={Colors.checkGreen}
                    size={20}
                  />
                  : null
              }
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  render () {
    const { present, past } = this.props.appointments;
    console.log(present, past, 'the best')
    const { searchInput } = this.state
    return (
      <ScrollView style={{flex: 1, backgroundColor: Colors.snow}}>
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: Metrics.screenWidth, height: Metrics.screenHeight * 0.08, borderColor: Colors.questionGrey, borderWidth: 1, backgroundColor: Colors.snow}}>
          <SearchBar
            containerStyle={{width: Metrics.screenWidth * 0.95, backgroundColor: Colors.clear, borderBottomColor: Colors.clear, height: Metrics.screenHeight * 0.06, marginBottom: Metrics.baseMargin, paddingHorizontal: 0, marginHorizontal: 0, borderTopColor: Colors.clear}}
            inputStyle={{backgroundColor: Colors.clear, borderWidth: 1, marginLeft: 5, borderColor: Colors.questionGrey}}
            ref={(ref) => this.searchBar = ref}
            placeholder={'Search Your Appointments'}
            placeholderTextColor={Colors.placeholder}
            icon={{color: Colors.questionGrey, style: {paddingRight: 10}}}
            round
            onChangeText={this._onChangeText}
            value={searchInput}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            autoCorrect={false}
          />
        </View>
        <View style={{height: Metrics.screenHeight * 0.10, borderBottomColor: Colors.questionGrey, backgroundColor: Colors.greyBackground, borderBottomWidth: 1, flexDirection: 'column', justifyContent: 'center'}} >
          <Text style={{ marginLeft: Metrics.baseMargin, fontWeight: 'bold' }}>Today</Text>
        </View>
        <FlatList
          data={present}
          renderItem={item => this.renderItem(item)}
        />
        <View style={{height: Metrics.screenHeight * 0.10, flexDirection: 'column',borderBottomColor: Colors.questionGrey, backgroundColor: Colors.greyBackground, borderBottomWidth: 1, justifyContent: 'center'}} >
          <Text style={{ marginLeft: Metrics.baseMargin, fontWeight: 'bold' }}>Past Appointments</Text>
        </View>
        <FlatList
          data={past}
          renderItem={item => this.renderItem(item)}
        />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    appointments: HaircutSelectors.getImportedAppointments(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getBarberHaircuts: () => dispatch(HaircutActions.haircutBarberRequest()),
    setSelectedHaircutId: id => dispatch(HaircutActions.setSelectedHaircutId(id))

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BarberImportAppointmentScreen)
