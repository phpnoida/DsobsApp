import React, {Component} from 'react';
import {StyleSheet, Button, Text, View} from 'react-native';
import SmsRetriever from 'react-native-sms-retriever';

const WELCOME_TEXT = 'React Native SMS Retriever';
const PHONE_NUMBER_TITLE = 'Request phone number';
const ADD_SMS_LISTENER_TITLE = 'Add SMS listener';

const PhoneNumberDemo = ({params}) => {
  const _onPhoneNumberPressed = async () => {
    try {
      const phoneNumber = await SmsRetriever.requestPhoneNumber();
      alert(`Phone Number: ${phoneNumber}`);
    } catch (error) {
      alert(`Phone Number Error: ${JSON.stringify(error)}`);
    }
  };

  const _onSmsListenerPressed = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();

      if (registered) {
        SmsRetriever.addSmsListener(_onReceiveSms);
      }

      alert(`SMS Listener Registered: ${registered}`);
    } catch (error) {
      alert(`SMS Listener Error: ${JSON.stringify(error)}`);
    }
  };

  // Handlers

  const _onReceiveSms = (event) => {
    alert(event.message);
    console.log('====================================');
    console.log(
      'event.message',
      event.message.toString().split(' ')[1].replace(/\D/g, ''),
    );
    console.log('====================================');
    SmsRetriever.removeSmsListener();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>{WELCOME_TEXT}</Text>

      <View style={styles.space} />

      <Button
        style={styles.button}
        title={PHONE_NUMBER_TITLE}
        onPress={_onPhoneNumberPressed}
      />

      <View style={styles.space} />

      <Button
        style={styles.button}
        title={ADD_SMS_LISTENER_TITLE}
        onPress={_onSmsListenerPressed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
  },
  space: {
    margin: 20,
  },
});

export default PhoneNumberDemo;
