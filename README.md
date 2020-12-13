# Chat App

Chat app is a React-Native app that  provide users with a chat interface and the possibility to share images and their location.

## Database configuration

Firebase’s Cloud Firestore database is used for this chat app to get real-time data.
1. Head over to Google Firebase and click on “Sign in”
2. Click on the “Go to console” link and click on "Create Project"
3. A form will appear asking you to fill basic in information about your new project.
4. Give your project a name.
5. With the default settings selected, agree to the terms and click “Create Project.”
6. Create a database, so click on “Develop” from the menu on the left-hand side.
7. From the additional menu that appears, select “Database”.
8. Choose “Create database” in the Cloud Firestore section.
9. Make sure that you’re creating a Firestore Database—NOT a “Realtime Database.”

# Setting up the development environment

1. Make sure latest LTS Node version installed.
2. Install expo-cli. expo-cli is required to create new projects and start running Expo.
```bash
npm install expo-cli --global
```
3. Create an Expo account [Expo sign-up page](https://expo.io/). Log in to your account when using Expo CLI.
4. Expo app is required for your phone to run your project on.
5. To install the app first run the following command into the terminal

```bash
npm install 
```
To run the app locally, run command into the terminal
```bash
npm start 
```
or
```bash
expo start 
```
6. Browser will be opened with with Metro Bundler options to run the app on your mobile via tunnel, lan or local. Select either one of it and open the app in expo app in mobile.
7. To test app on a simulator instead of mobile device use either iOS simulator on Mac for iOS devices or Android Emulator using Android Studio for Android devices. Follow steps 3 to 6 for Simulator as well.

## Project dependencies

```
"@react-native-community/async-storage"
"@react-native-community/masked-view"
"@react-native-community/netinfo"
"@react-navigation/native"
"@react-navigation/stack"
"expo"
"expo-image-picker"
"expo-location"
"expo-permissions"
"expo-status-bar"
"firebase"
"react"
"react-dom"
"react-native"
"react-native-gesture-handler"
"react-native-gifted-chat"
"react-native-maps"
"react-native-reanimated"
"react-native-safe-area-context"
"react-native-screens"
"react-native-web"
"react-navigation"
```

## Kanban board
[Chat app Kanban](https://trello.com/b/6d1lDWQu/react-native-chat-app)
