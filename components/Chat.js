/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unused-state */
/* eslint linebreak-style: ["error", "windows"] */
/* eslint-disable react/jsx-filename-extension */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import React from 'react';
import PropTypes from 'prop-types';
import NetInfo from '@react-native-community/netinfo';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import MapView from 'react-native-maps';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  AsyncStorage,
} from 'react-native';
import CustomActions from './CustomActions';

const firebase = require('firebase');
require('firebase/firestore');

// styling
const styles = StyleSheet.create({
  chatBackground: {
    flex: 1,
  },
});

// chat screen component
export default class Chat extends React.Component {
  // initialization state message to send, receive, and display messages
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      loggedInText: '',
      isConnected: false,
      image: null,
      location: null,
    };

    if (!firebase.apps.length) {
      // web app's Firebase configuration
      const firebaseConfig = {
        apiKey: 'AIzaSyCQnKQuuwRa_Wt88zbS8u9tg-snsXBgkLM',
        authDomain: 'chat-app-28cb2.firebaseapp.com',
        projectId: 'chat-app-28cb2',
        storageBucket: 'chat-app-28cb2.appspot.com',
        messagingSenderId: '825446560935',
        appId: '1:825446560935:web:3068f129e281b86d601782',
        measurementId: 'G-X3G3H4TJDW',
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
    }
    // reference to messages collection
    this.referenceMessages = firebase.firestore().collection('messages');
  }

  // upon loading the app
  componentDidMount() {
    const { route, navigation } = this.props;
    const { name } = route.params;
    // set screen title
    navigation.setOptions({ title: name });
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            try {
              await firebase.auth().signInAnonymously();
            } catch (error) {
              console.error(`Sign in failed: ${error.message}`);
            }
          }

          // update user state with currently active user data
          this.setState({
            user: {
              _id: user.uid,
              name,
              avatar: 'https://placeimg.com/140/140/any',
            },
            loggedInText: `${name} has entered the chat`,
            isConnected: true,
          });

          // observer to create an updated snapshot of the collection
          this.unsubscribe = this.referenceMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  /**
  * update message state with recent data from database and
  * param querySnapshot contains documents with the following params
  * @function onCollectionUpdate
  * @param {string} _id - message id
  * @param {string} text - content
  * @param {date} cratedAt - date and time sent
  * @param {string} user - user data
  * @param {string} image - image sent
  * @param {number} location - geographical coordinates
  */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // loop through documents
    querySnapshot.forEach((doc) => {
      // get data snapshot
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || '',
        location: data.location,
      });
    });
    this.setState({
      messages,
    });
  };

  /**
  * sends a message to append the messages
  * @async
  * @function onSend
  * @param {string} messages
  */
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
        this.saveMessages();
      },
    );
  }

  /**
  * loads all messages from AsyncStorage
  * @async
  * @function getMessages
  * @return {Promise<string>} The data from the storage
  */
  getMessages = async () => {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
  * adds message to Firestore database
  * @function addMessage
  */
  addMessages = () => {
    const { messages } = this.state;
    const message = messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || '',
      location: message.location || null,
    });
  };

  /**
  * save all messages to AsyncStorage
  * @async
  * @function saveMessages
  */
  saveMessages = async () => {
    try {
      const { messages } = this.state;
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (error) {
      console.error(error.message);
    }
  }

  /**
  * delete messages from async storage
  * @async
  * @function deleteMessages
  * @param {string} messages
  */
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  /**
  * input toolbar to render bubble and is only rendered if online
  * @function renderBubble
  * @param {*} props
  */
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
        }}
      />
    );
  }

  /**
  * input toolbar to show only for online
  * @function renderInputToolbar
  * @param {*} props
  * @returns {InputToolbar}
  */
  renderInputToolbar = (props) => {
    const { isConnected } = this.state;
    if (isConnected === true) {
      return <InputToolbar {...props} />;
    }
    return null;
  };

  /**
  * renders pickImage, takePhoto and getLocation
  * @function renderCustomActions
  * @param {*} props
  * @returns {CustomActions}
  */
  renderCustomActions = (props) => <CustomActions {...props} />;

  /**
  * to check if currentMessage contains location data and render map view
  * @function renderCustomView
  * @param {*} props
  * @returns {MapView}
  */
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    const { route } = this.props;
    const { backgroundColor } = route.params;
    const { image, messages, user } = this.state;

    return (
      // set chat screen background color
      <View style={[styles.chatBackground, { backgroundColor }]}>
        {image && (
          // eslint-disable-next-line react/jsx-no-undef
          <Image
            source={{ uri: image.uri }}
            style={{ width: 200, height: 200 }}
          />
        )}
        {/* chat interface */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          renderCustomView={this.renderCustomView.bind(this)}
          messages={messages}
          image={image}
          onSend={(messagesToSend) => this.onSend(messagesToSend)}
          user={user}
        />
        {/* keyboard out of position fix on Android */}
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
}

Chat.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
      backgroundColor: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
