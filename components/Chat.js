import React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';

const firebase = require('firebase');
require('firebase/firestore');

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
    }

    if (!firebase.apps.length) {
      // web app's Firebase configuration
      var firebaseConfig = {
        apiKey: "AIzaSyCQnKQuuwRa_Wt88zbS8u9tg-snsXBgkLM",
        authDomain: "chat-app-28cb2.firebaseapp.com",
        projectId: "chat-app-28cb2",
        storageBucket: "chat-app-28cb2.appspot.com",
        messagingSenderId: "825446560935",
        appId: "1:825446560935:web:3068f129e281b86d601782",
        measurementId: "G-X3G3H4TJDW"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
    }
    // reference to messages collection
    this.referenceMessages = firebase.firestore().collection('messages');
  }

  // upon loading the app
  componentDidMount() {
    let { name } = this.props.route.params;
    // set screen title
    this.props.navigation.setOptions({ title: name });
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      //update user state with currently active user data
      this.setState({
        user: {
          _id: user.uid,
          name,
          avatar: "https://placeimg.com/140/140/any",
        },
        loggedInText: `${name} has entered the chat`,
      });

      // observer to create an updated snapshot of the collection
      this.unsubscribe = this.referenceMessages
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  // update message state with recent data from database
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
      });
    });
    this.setState({
      messages,
    });
  };

  // function to add message to Firestore database
  addMessages = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
    });
  };

  // function to be called when a user sends a message to append the messages
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
      }
    );
  }

  // to render bubble
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  render() {
    let { backgroundColor } = this.props.route.params;

    return (
      // set chat screen background color
      <View style={[styles.chatBackground, { backgroundColor }]}>
        {/* chat interface */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />
        {/* keyboard out of position fix on Android */}
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  };
}

// styling
const styles = StyleSheet.create({
  chatBackground: {
    flex: 1,
  },
});