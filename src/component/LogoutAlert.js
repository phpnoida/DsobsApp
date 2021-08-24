import React, {Component} from 'react';
import {
  Text,
  View,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import g from '../theme/global';
import {scale} from '../theme/Scalling';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import {CommonActions} from '@react-navigation/native';
import GlobalInclude from '../globalInclude/Globalinclude';
const windowWidth = Dimensions.get('window').width;

class LogoutAlert extends Component {
  constructor(props) {
    super(props);
    console.log('props', global.navigationRef);
    this.state = {
      is_loading: 0,
    };
    this.show_loader = this.show_loader.bind(this);
  }

  componentDidMount() {
    // ADD ORIENTATION LISTENER
  }
  componentWillUnmount() {
    // REMOVE ORIENTATION LISTENER
  }
  show_loader(is_loader) {
    this.setState({is_loading: is_loader});
  }

  render() {
    if (!this.state.is_loading) {
      return <View />;
    } else {
      return (
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            hardwareAccelerated={true}
            visible={this.state.is_loading}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.headerText}>
                  You are currently logged in on another device. To re-login to
                  this device please click ok.
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: scale(6),
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      let fcmTopic = '';

                      if (
                        global.userDetails !== undefined &&
                        global.userDetails !== null
                      ) {
                        fcmTopic = global.userDetails.fcmTopic;
                      }
                      AsyncStorage.clear().then(() => {
                        global.userDetails = null;
                        global.accessToken = null;
                        global.userId = null;
                        global.firstName = null;
                        global.lastName = null;

                        if (
                          fcmTopic !== undefined &&
                          fcmTopic !== null &&
                          fcmTopic !== ''
                        ) {
                          PushNotification.unsubscribeFromTopic(fcmTopic).then(
                            () => {
                              this.setState({is_loading: false}, () => {
                                global.navigationRef.current.dispatch(
                                  CommonActions.reset({
                                    index: 0,
                                    routes: [{name: 'Login'}],
                                  }),
                                );
                              });
                            },
                          );
                        } else {
                          this.setState({is_loading: false}, () => {
                            global.navigationRef.current.dispatch(
                              CommonActions.reset({
                                index: 0,
                                routes: [{name: 'Login'}],
                              }),
                            );
                          });
                        }
                      });
                    }}
                    style={styles.buttonBlue}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    <Text style={{color: '#ffffff', fontSize: scale(14)}}>
                      Ok
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: windowWidth - 50,
    backgroundColor: 'white',
    borderRadius: scale(6),
    padding: scale(7),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerText: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: scale(16),
    textAlign: 'center',
    ...g.FHNR,
    ...g.colorBlue,
  },
  modalText: {
    fontSize: scale(12),
    textAlign: 'center',
    marginLeft: scale(10),
    marginRight: scale(10),
    marginBottom: scale(10),
    marginTop: scale(5),
    textAlignVertical: 'center',
    ...g.FHNR,
    ...g.colorBlue,
  },
  buttonBlue: {
    borderRadius: scale(5),
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    minWidth: scale(100),
    height: scale(35),
    paddingStart: scale(15),
    paddingEnd: scale(15),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',

    margin: scale(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  buttonCircle: {
    width: 24,
    height: 24,
    borderRadius: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
});

export default LogoutAlert;
