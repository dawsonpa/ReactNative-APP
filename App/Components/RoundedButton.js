import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text } from 'react-native'
import styles from './Styles/RoundedButtonStyles'
import ExamplesRegistry from '../Services/ExamplesRegistry'

// Note that this file (App/Components/RoundedButton) needs to be
// imported in your app somewhere, otherwise your component won't be
// compiled and added to the examples dev screen.

// Ignore in coverage report
/* istanbul ignore next */
ExamplesRegistry.addComponentExample('Rounded Button', () =>
  <RoundedButton
    text='real buttons have curves'
    onPress={() => window.alert('Rounded Button Pressed!')}
  />
)

export default class RoundedButton extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string,
    children: PropTypes.any,
    navigator: PropTypes.object,
    style: PropTypes.object,
    buttonTextStyle: PropTypes.object,
    buttonTextProps: PropTypes.object
  }

  getChlidren () {
    const text = this.props.text
      ? <Text {...this.props.buttonTextProps} style={[styles.buttonText, this.props.buttonTextStyle]}>{this.props.text.toUpperCase()}</Text>
      : null
    const children = text || this.props.children || ''
    return children
  }

  render () {
    return (
      <TouchableOpacity style={[styles.button, this.props.style]} onPress={this.props.onPress}>
        {this.getChlidren()}
      </TouchableOpacity>
    )
  }
}
