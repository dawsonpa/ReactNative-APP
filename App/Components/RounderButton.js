import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text } from 'react-native'
import styles from './Styles/RounderButtonStyle'

export default class RounderButton extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string,
    navigator: PropTypes.object,
    style: PropTypes.object
  }

  getText () {
    const buttonText = this.props.text || this.props.children || '';
    return buttonText
  }

  render () {
    return (
      <TouchableOpacity style={[styles.button, this.props.style]} onPress={this.props.onPress}>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}
