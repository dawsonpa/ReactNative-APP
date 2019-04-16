import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Fonts, Colors } from '../../Themes/'

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
  titleText: {
    color: Colors.snow,
    ...Fonts.style.h4
  },
  title: {
    color: Colors.snow,
    ...Fonts.style.h2
  },
  bodyContainer: {
    marginTop: Metrics.screenHeight * 0.2,
    flexDirection: 'column',
    alignItems: 'center',
    height: Metrics.screenHeight * 0.3,
    justifyContent: 'space-between'
  },
  bodyTitleText: {
    color: Colors.snow,
    ...Fonts.style.h7
  }
})
