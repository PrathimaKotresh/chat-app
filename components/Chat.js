import React from 'react';
import NetInfo from '@react-native-community/netinfo';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { View, StyleSheet, Platform, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

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
      isConnected: false,
      image: null,
      location: null,
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
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            try {
              await firebase.auth().signInAnonymously();
            } catch (error) {
              console.log(`Sign in failed: ${error.message}`);
            }
          }

          //update user state with currently active user data
          this.setState({
            user: {
              _id: user.uid,
              name,
              avatar: "https://placeimg.com/140/140/any",
            },
            loggedInText: `${name} has entered the chat`,
            isConnected: true,
          });

          // observer to create an updated snapshot of the collection
          this.unsubscribe = this.referenceMessages
            .orderBy("createdAt", "desc")
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
        image: data.image || '',
        location: data.location,
      });
    });
    this.setState({
      messages,
    });
  };

  // function to get messages from asny storage and set to
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // function to add message to Firestore database
  addMessages = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || '',
      location: message.location || null,
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
        this.saveMessages();
      }
    );
  }

  // function to same messages in async storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // function to delete messages from async storage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
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

  // function to show input toolbar for offline
  renderInputToolbar = (props) => {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  // function to render CustomActions
  renderCustomActions = (props) => <CustomActions {...props} />;

  // function to check if currentMessage contains location data and render map view
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
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
    let { backgroundColor } = this.props.route.params;

    return (
      // set chat screen background color
      <View style={[styles.chatBackground, { backgroundColor }]}>
        {this.state.image && (
          <Image
            source={{ uri: this.state.image.uri }}
            style={{ width: 200, height: 200 }}
          />
        )}
        {/* chat interface */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          renderCustomView={this.renderCustomView.bind(this)}
          messages={this.state.messages}
          image={this.state.image}
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