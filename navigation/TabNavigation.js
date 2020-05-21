import * as React from 'react';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Matches from '../screens/Matches';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const Tab = createMaterialTopTabNavigator();



function TabNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home" tabBarOptions={{tabStyle: { height: 70 }}}>
        <Tab.Screen name="Profile" component={Profile} />
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Matches" component={Matches} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default TabNavigation


// const TabNavigator = createMaterialTopTabNavigator({
//   Profile: {
//     screen: Profile,
//     navigationOptions: {
//       tabBarLabel: 'Profile',
//     },
//   },
//   Home: {
//     screen: Home,
//     navigationOptions: {
//       tabBarLabel: 'Home',
//     }
//   },
//   Matches: {
//     screen: Matches,
//     navigationOptions: {
//       tabBarLabel: 'Matches',
//     },
//   },
// },
// {
//   navigationOptions: {
//     header: null
//   },
//   tabBarPosition: 'top',
//   initialRouteName: 'Home',
//   animationEnabled: true,
//   swipeEnabled: false,
//   tabBarOptions: {
//     style: {
//       height: 75
//     },
//   }
// });

// export default createAppContainer(TabNavigator);