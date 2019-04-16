import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  mainContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  icon: {
    width: 26,
    height: 26
  },
  invoiceButton: {
    width: Metrics.screenWidth * 0.31,
    backgroundColor: '#5FB13D'
  },
  buttonText: {
    color: Colors.snow,
    fontSize: Fonts.size.small
  },
  metricsButton: {
    width: Metrics.screenWidth * 0.62,
    backgroundColor: Colors.questionGrey
  }
})

export default Object.keys(styles).reduce((newObject, key) => ({
  ...newObject,
  [key]: StyleSheet.flatten(styles[key])
}), {})
