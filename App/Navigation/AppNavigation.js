import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import ExistingCardScreen from '../Containers/ExistingCardScreen'
import AddCardScreen from '../Containers/AddCardScreen'
import AndroidPayScreen from '../Containers/AndroidPayScreen'
import ApplePayScreen from '../Containers/ApplePayScreen'
import PaymentSelectionScreen from '../Containers/PaymentSelectionScreen'
import LinkingRouteHandlerScreen from '../Containers/LinkingRouteHandlerScreen'
import LinkingScreen from '../Containers/LinkingScreen'
import CustomerStripeScreen from '../Containers/CustomerStripeScreen'
import CustomerCompleteProfileScreen from '../Containers/CustomerCompleteProfileScreen'
import BarberCompleteProfileScreen from '../Containers/BarberCompleteProfileScreen'
import BarberStripeScreen from '../Containers/BarberStripeScreen'
import CustomerSessionDetailsScreen from '../Containers/CustomerSessionDetailsScreen'
import CustomerNotificationsScreen from '../Containers/CustomerNotificationsScreen'
import CustomerEditProfileScreen from '../Containers/CustomerEditProfileScreen'
import BarberEditProfileScreen from '../Containers/BarberEditProfileScreen'
import BarberEditServicesScreen from '../Containers/BarberEditServicesScreen'
import CustomerSettingsScreen from '../Containers/CustomerSettingsScreen'
import BarberSettingsScreen from '../Containers/BarberSettingsScreen'
import CustomerConfirmationScreen from '../Containers/CustomerConfirmationScreen'
import CustomerAppointmentScreen from '../Containers/CustomerAppointmentScreen'
import CustomerInvoiceScreen from '../Containers/CustomerInvoiceScreen'
import CustomerProfileScreen from '../Containers/CustomerProfileScreen'
import CustomerHaircutsScreen from '../Containers/CustomerHaircutsScreen'
import ImportAppointmentScreen from '../Containers/ImportAppointmentScreen'
import BarberImportAppointmentScreen from '../Containers/BarberImportAppointmentScreen'
import AddSessionScreen from '../Containers/AddSessionScreen'
import EditSessionScreen from '../Containers/EditSessionScreen'
import BarberNewSessionScreen from '../Containers/BarberNewSessionScreen'
import BarberSessionDetailsScreen from '../Containers/BarberSessionDetailsScreen'
import BarberInvoiceScreen from '../Containers/BarberInvoiceScreen'
import BarberProfileScreen from '../Containers/BarberProfileScreen'
import BarberScheduleScreen from '../Containers/BarberScheduleScreen'
import BarberServicesScreen from '../Containers/BarberServicesScreen'
import BarberDashboardScreen from '../Containers/BarberDashboardScreen'
import SignUpScreen from '../Containers/SignUpScreen'
import SignInScreen from '../Containers/SignInScreen'
import LandingScreen from '../Containers/LandingScreen'
import LaunchScreen from '../Containers/LaunchScreen'
import { Colors, ApplicationStyles } from '../Themes'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import React, { Component } from 'react'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  ExistingCardScreen: { screen: ExistingCardScreen },
  AddCardScreen: { screen: AddCardScreen },
  AndroidPayScreen: { screen: AndroidPayScreen },
  ApplePayScreen: { screen: ApplePayScreen },
  PaymentSelectionScreen: { screen: PaymentSelectionScreen },
  LinkingRouteHandlerScreen: { screen: LinkingRouteHandlerScreen },
  LinkingScreen: { screen: LinkingScreen },
  CustomerStripeScreen: { screen: CustomerStripeScreen },
  CustomerCompleteProfileScreen: { screen: CustomerCompleteProfileScreen },
  BarberCompleteProfileScreen: { screen: BarberCompleteProfileScreen },
  BarberStripeScreen: { screen: BarberStripeScreen },
  CustomerSessionDetailsScreen: { screen: CustomerSessionDetailsScreen },
  CustomerNotificationsScreen: { screen: CustomerNotificationsScreen },
  CustomerEditProfileScreen: { screen: CustomerEditProfileScreen },
  BarberEditProfileScreen: { screen: BarberEditProfileScreen },
  BarberEditServicesScreen: { screen: BarberEditServicesScreen },
  CustomerSettingsScreen: { screen: CustomerSettingsScreen },
  BarberSettingsScreen: { screen: BarberSettingsScreen },
  CustomerConfirmationScreen: { screen: CustomerConfirmationScreen },
  CustomerAppointmentScreen: { screen: CustomerAppointmentScreen },
  CustomerInvoiceScreen: { screen: CustomerInvoiceScreen },
  CustomerProfileScreen: { screen: CustomerProfileScreen },
  CustomerHaircutsScreen: { screen: CustomerHaircutsScreen },
  ImportAppointmentScreen: { screen: ImportAppointmentScreen },
  BarberImportAppointmentScreen: { screen: BarberImportAppointmentScreen },
  AddSessionScreen: { screen: AddSessionScreen },
  EditSessionScreen: { screen: EditSessionScreen },
  BarberNewSessionScreen: { screen: BarberNewSessionScreen },
  BarberSessionDetailsScreen: { screen: BarberSessionDetailsScreen },
  BarberInvoiceScreen: { screen: BarberInvoiceScreen },
  BarberProfileScreen: { screen: BarberProfileScreen },
  BarberScheduleScreen: { screen: BarberScheduleScreen },
  BarberServicesScreen: { screen: BarberServicesScreen },
  BarberDashboardScreen: { screen: BarberDashboardScreen },
  BarberHomeScreen: { screen: TabNavigator({
    BarberDashboardScreen: {
      screen: StackNavigator({
        BarberDashboardScreen: {
          screen: BarberDashboardScreen,
          navigationOptions: {
            title: 'Dashboard',
            headerLeft: null
          }
        },
        BarberInvoiceScreen: {
          screen: BarberInvoiceScreen,
          navigationOptions: {
            title: 'Invoice a Customer'
          }
        },
        BarberImportAppointmentScreen: {
          screen: BarberImportAppointmentScreen,
          navigationOptions: {
            title: 'Import an Appointment'
          }
        }
      }, {
        headerMode: 'float',
        initialRouteName: 'BarberDashboardScreen'
      }),
      navigationOptions: {
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({tintColor}) => (
          <FontAwesomeIcon
            name={'dashboard'}
            style={styles.icon}
            size={26}
          />
        )
      }
    },
    BarberServicesScreen: {
      screen: StackNavigator({
        BarberServicesScreen: {
          screen: BarberServicesScreen,
          navigationOptions: {
            title: 'Service Menu'
          }},
        BarberEditServicesScreen: {
          screen: BarberEditServicesScreen,
          navigationOptions: {
            title: 'Edit Services'
          }
        }
      }, {
        headerMode: 'float',
        initialRouteName: 'BarberServicesScreen'
      }),
      navigationOptions: {
        tabBarLabel: 'Services',
        tabBarIcon: ({tintColor}) => (
          <FontAwesomeIcon
            name={'scissors'}
            style={styles.icon}
            size={26}
          />
        )
      }
    },
    BarberScheduleScreen: {
      screen: StackNavigator({
        BarberScheduleScreen: {
          screen: BarberScheduleScreen,
          navigationOptions: {
            title: 'Calendar',
            headerLeft: null
          }
        },
        BarberSessionDetailsScreen: {
          screen: BarberSessionDetailsScreen,
          navigationOptions: {
            title: 'Session Details'
          }
        },
        AddSessionScreen: {
          screen: AddSessionScreen,
          navigationOptions: {
            title: 'Add Session'
          }
        },
        EditSessionScreen: {
          screen: EditSessionScreen,
          navigationOptions: {
            title: 'Edit Session'
          }
        }
      }, {
        headerMode: 'float',
        initialRouteName: 'BarberScheduleScreen'
      }),
      navigationOptions: {
        tabBarLabel: 'Schedule',
        tabBarIcon: ({tintColor}) => (
          <FontAwesomeIcon
            name={'calendar'}
            style={styles.icon}
            size={26}
          />
        )
      }
    },
    BarberProfileScreen: {
      screen: StackNavigator({
        BarberProfileScreen: {
          screen: BarberProfileScreen,
          navigationOptions: {
            title: 'Profile'
          }},
        BarberSettingsScreen: {
          screen: BarberSettingsScreen,
          navigationOptions: {
            title: 'Settings',
            headerStyle: {
              backgroundColor: Colors.snow
            },
            tabBarVisible: false
          }
        },
        BarberEditProfileScreen: {
          screen: BarberEditProfileScreen,
          navigationOptions: {
            title: 'Edit Your Profile',
            headerStyle: {
              backgroundColor: Colors.snow
            },
            tabBarVisible: false
          }
        }
      }, {
        headerMode: 'float',
        initialRouteName: 'BarberProfileScreen'
      }),
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({tintColor}) => (
          <FontAwesomeIcon
            name={'user-o'}
            style={styles.icon}
            size={26}
          />
        )
      }
    }
  }, {
    tabBarComponent: TabBarBottom,
    initialRouteName: 'BarberDashboardScreen',
    tabBarPosition: 'bottom',
    animationEnabled: true,
    headerMode: 'float',
    tabBarOptions: {
      activeBackgroundColor: Colors.steel,
      activeTintColor: Colors.panther,
      inactiveTintColor: Colors.infoGrey
    }
  })},
  CustomerHomeScreen: { screen: TabNavigator({
    CustomerHaircutsScreen: {
      screen: StackNavigator({
        CustomerHaircutsScreen: {
          screen: CustomerHaircutsScreen,
          navigationOptions: {
            title: 'Haircuts',
            headerStyle: {
              backgroundColor: Colors.snow
            }
          }
        },
        CustomerNotificationsScreen: {
          screen: CustomerNotificationsScreen,
          navigationOptions: {
            title: 'Notifications'
          }
        },
        CustomerInvoiceScreen: {
          screen: CustomerInvoiceScreen
        },
        CustomerAppointmentScreen: {
          screen: CustomerAppointmentScreen
        },
        CustomerSessionDetailsScreen: {
          screen: CustomerSessionDetailsScreen
        },
        CustomerConfirmationScreen: {
          screen: CustomerConfirmationScreen,
          headerMode: 'none',
          tabBarVisible: false
        }
      }, {
        headerMode: 'float',
        initialRouteName: 'CustomerHaircutsScreen'
      }),
      navigationOptions: {
        tabBarLabel: 'Haircuts',
        tabBarIcon: ({tintColor}) => (
          <FontAwesomeIcon
            name={'scissors'}
            style={styles.icon}
            size={26}
          />
        )
      }
    },
    CustomerProfileScreen: {
      screen: StackNavigator({
        CustomerProfileScreen: {
          screen: CustomerProfileScreen,
          navigationOptions: {
            title: 'Profile'
          }
        },
        CustomerSettingsScreen: {
          screen: CustomerSettingsScreen,
          navigationOptions: {
            title: 'Settings',
            headerStyle: {
              backgroundColor: Colors.snow
            },
            tabBarVisible: false
          }
        },
        CustomerEditProfileScreen: {
          screen: CustomerEditProfileScreen,
          navigationOptions: {
            title: 'Edit Your Profile',
            headerStyle: {
              backgroundColor: Colors.snow
            },
            tabBarVisible: false
          }
        }
      }),
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({tintColor}) => (
          <FontAwesomeIcon
            name={'user-o'}
            style={styles.icon}
            size={26}
          />
        )
      }
    }
  }, {
    tabBarComponent: TabBarBottom,
    initialRouteName: 'CustomerHaircutsScreen',
    tabBarPosition: 'bottom',
    animationEnabled: true,
    headerMode: 'float',
    tabBarOptions: {
      activeBackgroundColor: Colors.steel,
      activeTintColor: Colors.panther,
      inactiveTintColor: Colors.infoGrey
    }
  })},
  SignUpScreen: { screen: SignUpScreen },
  SignInScreen: { screen: SignInScreen },
  LandingScreen: { screen: LandingScreen },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'PaymentSelectionScreen',
  navigationOptions: {
    headerStyle: styles.header
  },
  headerStyle: {
    backgroundColor: Colors.snow
  }
})

export default PrimaryNav
