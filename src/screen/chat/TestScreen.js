import React, {Component} from 'react';
import {View, Text} from 'react-native';
// Firestore
import firestore from '@react-native-firebase/firestore';

class TestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.chatListener = firestore()
      .collection('Chats')
      .doc('K07eXjw3ELKIT2edEzPe')
      .onSnapshot((dataSource) => {
        //console.log('dataSource: ', dataSource.data());
        console.log('messageThreadId: ');
      });
  }

  componentWillUnmount() {
    this.chatListener();
  }

  render() {
    return (
      <View>
        <Text> TestScreen </Text>
      </View>
    );
  }
}

export default TestScreen;
