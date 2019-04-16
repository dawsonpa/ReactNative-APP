// Simple React Native specific changes

import '../I18n/I18n'
import { baseURL } from './APIConfig'

export default {
  // font scaling override - RN default is on
  allowTextFontScaling: false,
  stripeTestClientId: 'ca_DIG0fPJz10Wb2VPBWbuAschp3TcTJPHu',
  stripeLiveClientId: 'ca_DIG0QUEDCFd65N7GniHg2ydAKnqsvPGr',
  securityToken: 'a8fcba2f92bfa7e5d18da97d322227795b5905e8',
  stripeTestSecretKey: 'sk_test_aoGeNmvnIHau8UB4ZRc0MWn6',
  stripeBarberRedirect: __DEV__ ? 'https://192.168.1.207:8443/stripe/signup/token' : `${baseURL}/stripe/signup/token`,
  stripeBaseUrl: 'https://connect.stripe.com'
}
