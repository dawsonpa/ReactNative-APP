import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts} from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  appointmentButton: {
    width: Metrics.screenWidth * 0.35,
    backgroundColor: '#5FB13D'
  },
  buttonText: {
    color: Colors.snow,
    fontSize: Fonts.size.small,
    alignSelf: 'center'
  },
  estimationButton: {
    width: Metrics.screenWidth * 0.55,
    backgroundColor: Colors.agendaBorder,
    marginBottom: Metrics.doubleBaseMargin
  },
  estimationButtonText: {
    color: Colors.black,
    fontSize: Fonts.size.small,
    alignSelf: 'center'
  },
  invoiceButton: {
    width: Metrics.screenWidth * 0.45,
    backgroundColor: '#5FB13D'
  }
})
