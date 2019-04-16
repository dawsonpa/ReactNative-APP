import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  backgroundImage: {
    flex: 1,
    width: null,
    height: null
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  inputContainer: {
    paddingHorizontal: 30
  },
  landing: {
    resizeMode: 'contain',
    height: 115,
    width: 115
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: Metrics.screenHeight * 0.3,
    alignItems: 'center'
  },
  slideContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 45,
    height: Metrics.screenHeight * 0.2
  },
  titleText: {
    color: Colors.snow,
    ...Fonts.style.h4
  },
  title: {
    color: Colors.snow,
    ...Fonts.style.h2
  },
  infoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    height: Metrics.screenHeight * 0.4

  },
  infoTitle: {
    color: Colors.snow,
    ...Fonts.style.h6
  },
  infoText: {
    color: Colors.snow,
    alignSelf: 'center'
  }

})
