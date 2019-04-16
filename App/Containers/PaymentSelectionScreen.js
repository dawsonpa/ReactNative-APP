import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Modal} from 'react-native'
import { connect } from 'react-redux'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { PaymentCardTextField } from 'tipsi-stripe'
import { Images, Metrics, Colors, Fonts } from '../Themes'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import RoundedButton from '../Components/RoundedButton'
// Styles
import styles from './Styles/PaymentSelectionScreenStyle'

class PaymentSelectionScreen extends Component {
  static navigationOptions =() => ({
    title: 'Select or Add Payment Method',
    headerMode: 'float'
  })
  constructor (props) {
    super(props)

    this.state = {
      visible: false
    }
  }
  openModal = () => {
    this.setState({visible: true})
  }
  render () {
    const {
      visible
    } = this.state
    return (
      <ScrollView style={[styles.container]} contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Modal
          visible={visible}
        >
          <KeyboardAwareScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
            <PaymentCardTextField
              style={{
                width: Metrics * 0.7,
                color: '#449aeb',
                borderColor: '#000',
                borderWidth: 1,
                borderRadius: 5
              }}
            />
          </KeyboardAwareScrollView>
        </Modal>
        <RoundedButton onPress={this.openModal} style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: Metrics.screenWidth * 0.80, borderWidth: 1, borderColor: Colors.panther}}>
          <FontAwesomeIcon
            name={'plus'}
            size={Metrics.icons.small}
            style={{marginRight: Metrics.baseMargin}}
          />
          <Text>ADD NEW CARD...</Text>
        </RoundedButton>
      </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSelectionScreen)
