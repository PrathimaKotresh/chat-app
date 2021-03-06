/* eslint linebreak-style: ["error", "windows"] */
/* eslint-disable react/jsx-filename-extension */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default class CustomActions extends React.Component {
  /**
  * on action press to show all options to select
  * @function onActionPress
  * @returns {actionSheet}
  */
  onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];

    const cancelButtonIndex = options.length - 1;
    const { actionSheet } = this.context;
    actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return this.pickImage();
          case 1:
            return this.takePhoto();
          case 2:
            return this.getLocation();
          default:
            return null;
        }
      },
    );
  };

  /**
  * requests image permission and allows to pick image and sends url to uploadImage & sends image
  * @async
  * @function pickImage
  */
  pickImage = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      const { onSend } = this.props;
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images',
        }).catch((error) => console.error(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
  * requests camera permission and allows to take photo, sends url to uploadImage and sends image
  * @async
  * @function takePhoto
  */
  takePhoto = async () => {
    try {
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA,
        Permissions.CAMERA_ROLL,
      );
      const { onSend } = this.props;

      if (status === 'granted') {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.error(error));

        if (!result.cancelled) {
          const imageUrlLink = await this.uploadImage(result.uri);
          onSend({ image: imageUrlLink });
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
  * @function uploadImage
  * @param {any} uri
  * @returns image download url
  */
  uploadImage = async (uri) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (error) => {
          console.error(error);
          reject(new TypeError('Network Request Failed!'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      const getImageName = uri.split('/');
      const imageArrayLength = getImageName[getImageName.length - 1];
      const ref = firebase
        .storage()
        .ref()
        .child(`images/${imageArrayLength}`);
      const snapshot = await ref.put(blob);
      blob.close();
      return await snapshot.ref.getDownloadURL();
    } catch (error) {
      console.error(error.message);
    }
    return null;
  };

  /**
  * requests permission for location and on request granted geo cordinates is sent
  * @async
  * @function getLocation
  */
  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    const { onSend } = this.props;
    if (status === 'granted') {
      try {
        const location = await Location.getCurrentPositionAsync({});
        if (location) {
          onSend({
            location: {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            },
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  render() {
    const { wrapperStyle, iconTextStyle } = this.props;
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel="Click for options"
        accessibilityHint="Let’s you choose to send an image or your geolocation"
        style={[styles.container]}
        onPress={this.onActionPress}
      >
        <View style={[styles.wrapper, wrapperStyle]}>
          <Text style={[styles.iconText, iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

CustomActions.propTypes = {
  onSend: PropTypes.func.isRequired,
  wrapperStyle: PropTypes.string.isRequired,
  iconTextStyle: PropTypes.string.isRequired,
};
