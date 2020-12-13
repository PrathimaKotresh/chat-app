/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import react native gesture handler
import 'react-native-gesture-handler';

// Create the navigator
const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          // first screen to load upon launching the app
          initialRouteName="Start"
        >
          <Stack.Screen
            // start screen
            name="Start"
            component={Start}
          />
          <Stack.Screen
            // chat screen
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
