import React from 'react';
import { View, StyleSheet } from 'react-native';

// chat screen component
export default class Chat extends React.Component {

  // upon loading the app
  componentDidMount() {
    let { name } = this.props.route.params;
    // set screen title
    this.props.navigation.setOptions({ title: name });
  }

  render() {
    let { backgroundColor } = this.props.route.params;

    return (
      // set chat screen background color
      <View style={[styles.chatBackground, { backgroundColor }]}>
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