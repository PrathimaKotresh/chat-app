/* eslint linebreak-style: ["error", "windows"] */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import PropTypes from 'prop-types';
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const backgroundImage = require('../assets/background-image.png');

// styling
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 75,
    marginBottom: 150,
  },
  inputSectionContainer: {
    width: '88%',
    height: '44%',
    backgroundColor: '#FFFFFF',
  },
  content: {
    margin: '12%',
  },
  name: {
    padding: 20,
    height: 60,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    borderWidth: 1,
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginTop: 40,
  },
  colorSelection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 15,
    marginBottom: 40,
  },
  colorDefaultWrapper: {
    marginRight: 10,
  },
  colorWrapper: {
    height: 42,
    width: 42,
    borderRadius: 70,
    borderWidth: 1,
    padding: 2,
    marginRight: 10,
  },
  colorButton: {
    height: 35,
    width: 35,
    borderRadius: 70,
  },
  color1: {
    backgroundColor: '#090C08',
  },
  color2: {
    backgroundColor: '#474056',
  },
  color3: {
    backgroundColor: '#8A95A5',
  },
  color4: {
    backgroundColor: '#B9C6AE',
  },
  button: {
    backgroundColor: '#757083',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

// start screen component
export default class Start extends React.Component {
  constructor(props) {
    super(props);
    // initializing the state of the app
    this.state = {
      name: '',
      color: '',
      colorSelection: 0,
    };
  }

  render() {
    /**
    * User can add name in TextInput for the chat
    * TouchableOpacity sets the Chat background color
    */
    const { name, colorSelection, color } = this.state;
    const { navigation } = this.props;
    return (
      // setting background image
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        {/* start screen container view */}
        <View style={styles.container}>
          {/* app title */}
          <Text style={styles.title}>Chat App</Text>
          {/* user input section container view */}
          <View style={styles.inputSectionContainer}>
            {/* user input box */}
            <View style={styles.content}>
              {/* input field for username */}
              <TextInput
                accessible
                accessibilityLabel="Input name"
                style={styles.name}
                onChangeText={(username) => this.setState({ name: username })}
                value={name}
                placeholder="Your name"
              />
              {/* backgroud color text */}
              <Text style={styles.text}>
                Choose Background Color:
              </Text>
              {/* background color selection view */}
              <View style={styles.colorSelection}>
                <View
                  style={colorSelection === 1 ? styles.colorWrapper : styles.colorDefaultWrapper}
                >
                  <TouchableOpacity
                    onPress={() => this.setState({ color: '#090C08', colorSelection: 1 })}
                    style={[styles.colorButton, styles.color1]}
                  />
                </View>
                <View
                  style={colorSelection === 2 ? styles.colorWrapper : styles.colorDefaultWrapper}
                >
                  <TouchableOpacity
                    onPress={() => this.setState({ color: '#474056', colorSelection: 2 })}
                    style={[styles.colorButton, styles.color2]}
                  />
                </View>
                <View
                  style={colorSelection === 3 ? styles.colorWrapper : styles.colorDefaultWrapper}
                >
                  <TouchableOpacity
                    onPress={() => this.setState({ color: '#8A95A5', colorSelection: 3 })}
                    style={[styles.colorButton, styles.color3]}
                  />
                </View>
                <View
                  style={colorSelection === 4 ? styles.colorWrapper : styles.colorDefaultWrapper}
                >
                  <TouchableOpacity
                    onPress={() => this.setState({ color: '#B9C6AE', colorSelection: 4 })}
                    style={[styles.colorButton, styles.color4]}
                  />
                </View>
              </View>
              {/* start chat button */}
              <View style={styles.button}>
                <TouchableOpacity
                  // navigates to chat view
                  onPress={() => navigation.navigate('Chat', {
                    // set username as per user's input
                    name,
                    // set background color as per user's choice
                    backgroundColor: color,
                  })}
                >
                  {/* text on the button */}
                  <Text style={styles.buttonText}>
                    Start Chatting
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

Start.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
