import React from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';

// chat screen component
export default class Chat extends React.Component {

  // initialization state message to send, receive, and display messages
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }

  // upon loading the app
  componentDidMount() {
    let { name } = this.props.route.params;
    // set screen title
    this.props.navigation.setOptions({ title: name });
    // sample message in GiftedChat message format is set on mount
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello ' + name,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'Welcome to the chat room',
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  }

  // function to be called when a user sends a message to append the messages
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
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
          user={{
            _id: 1,
          }}
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