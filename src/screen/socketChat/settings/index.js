import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  Text,
  Dimensions,
  Modal,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import RadioButton from '../../../component/RadioButton';
import CommonButton from '../../../component/CommonButton';
import HeaderBar from '../../../component/HeaderBar';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {Switch} from 'react-native-elements';
import {showProgess} from '../../../component/Common';
import {
  doGetGroupSetting,
  doSetGroupSetting,
} from '../../../Actions/SocketChatActions';

const {width} = Dimensions.get('window');

let responseMessage = '';

let itemArray = [
  {text: 'On All Conversation', key: 1, value: 1},
  {text: 'Once a day', key: 2, value: 2},
  {text: 'Twice a day', key: 3, value: 3},
  {text: 'Every Hour', key: 4, value: 4},
  {text: 'Every 2 Hours', key: 5, value: 5},
];

let selectedSetting = '';
let defaultSelected = '';
let isUserConnected = false;

const ChatUserSettings = ({route, navigation}) => {
  const socketRef = useRef();

  const [selectedFilter, setSelectedFilter] = useState(3);
  const [filterList] = useState(itemArray);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enableChat, setEnableChat] = useState(false);
  const [enableNotification, setEnableNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    /**
     * We get user own details also
     */
    if (route.params !== undefined && route.params !== null) {
      socketRef.current = route.params.socket;
    }

    console.log('isConnected', socketRef.current.connected);
    isUserConnected = socketRef.current.connected;
    if (socketRef.current.connected) {
      socketRef.current.on('error', attempt => {
        console.log('errror', attempt);
      });

      socketRef?.current?.on('disconnect', () => {
        isUserConnected = false;
        console.log('socket disconnected'); // undefined
      });

      socketRef?.current?.on('reconnect', attempt => {
        console.log('attempt', attempt);
      });
      socketRef?.current?.on('reconnect_error', attempt => {
        console.log('reconnect_error', attempt);
        isUserConnected = false;
      });
      socketRef?.current?.on('reconnect_attempt', attempt => {
        console.log('reconnect_attempt', attempt);
      });

      socketRef?.current?.removeListener('user-connected');
      socketRef?.current?.on('user-connected', event => {
        console.log('connected', event);
        isUserConnected = JSON.parse(event.status);
      });

      // socketRef?.current?.removeListener('chat-enabled');
      // socketRef?.current?.on('chat-enabled', event => {
      //   console.log('chat-enabled', event);
      //   if (event.status) {
      //     infoUpdated();
      //     setIsSubmitting(false);
      //   }
      // });

      // socketRef?.current?.removeListener('chat-disabled');
      // socketRef?.current?.on('chat-disabled', event => {
      //   console.log('chat-disabled', event);
      //   //{"status": true, "userId": "602a65dca1714c5bd918612e"}
      //   if (event.status) {
      //     infoUpdated();
      //     setIsSubmitting(false);
      //   }
      // });

      // socketRef?.current?.removeListener('chat-status-ack');
      // socketRef.current.on('chat-status-ack', event => {
      //   console.log('chat-status-ack', event);
      //   //{"chatStatus": 1, "status": true}

      //   if (event.status) {
      //     if (event?.chatStatus === 1) {
      //       setEnableChat(true);
      //     } else {
      //       setEnableChat(false);
      //     }
      //   }
      //   setIsLoading(false);
      // });
    }

    getSettings();

    return () => {
      disconnectAllEvents();
    };
  }, [route.params, infoUpdated]);

  const disconnectAllEvents = () => {
    socketRef?.current?.removeListener('user-connected');
    socketRef?.current?.removeListener('chat-enabled');
    socketRef?.current?.removeListener('chat-disabled');
    socketRef?.current?.removeListener('chat-status-ack');
  };

  const setUserSettings = () => {
    setIsSubmitting(true);

    // if (socketRef?.current !== undefined && socketRef?.current !== null) {
    //   let payload = {
    //     userId: global.userId,
    //   };
    //   console.log('update data', payload);
    //   if (enableChat) {
    //     socketRef.current.emit('chat-enable', payload);
    //   } else {
    //     socketRef.current.emit('chat-disable', payload);
    //   }
    // }

    let params = {
      chatNotificationSettings: enableNotification ? 1 : 0,
      enableChat: enableChat ? 1 : 0,
    };

    console.log('params', params);

    doSetGroupSetting(
      params,
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            console.log('====================================');
            console.log('response: ' + data);
            console.log('====================================');
            if (data.status) {
              responseMessage = 'Updating information successfully!';
              setShowModal(true);
              setIsSubmitting(false);
              setTimeout(() => {
                setShowModal(false);
                disconnectAllEvents();
                navigation.goBack();
              }, 2000);
            }
          }
        }
      },
      (error, message) => {
        console.log('====================================');
        console.log('error: ' + error, message);
        console.log('====================================');
      },
    );

    // updateUserObject(object, global.userId, status => {
    //   if (status) {
    //     responseMessage = 'Updating information successfully!';
    //   } else {
    //     responseMessage = 'Error while updating information!';
    //   }
    //   setShowModal(true);

    //   setTimeout(() => {
    //     setShowModal(false);
    //     navigation.goBack();
    //   }, 2000);
    //   setIsSubmitting(false);
    // });
  };

  const infoUpdated = useCallback(() => {
    responseMessage = 'Updating information successfully!';
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      disconnectAllEvents();
      navigation.goBack();
    }, 2000);
    setIsSubmitting(false);
  }, [navigation]);

  const getSettings = () => {
    doGetGroupSetting(
      response => {
        setIsLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              console.log('data', JSON.stringify(data));
              if (data.settings !== undefined && data.settings !== null) {
                let status = data.settings?.enableChat;
                let notification = data.settings?.chatNotificationSettings;
                setEnableChat(status === 1);
                setEnableNotification(notification === 1);
              }
            }
          }
        }
      },
      (error, message) => {
        setIsLoading(false);
        console.log('====================================');
        console.log('error: ' + error, message);
        console.log('====================================');
      },
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar title={'Settings'} navigation={navigation} showBack={true} />
      {showProgess(isLoading)}
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <View style={[grid.flex1, g.pl10, g.pr10, g.mt10]}>
          <View style={[grid.rowdir, grid.alignItems, g.pt10, g.pb10]}>
            <Text
              numberOfLines={2}
              style={[
                g.FHNM,
                g.fs15,
                g.colorBlack,
                GlobalInclude.AppStyle.transform,
              ]}>
              Enable Chat
            </Text>
            <View style={[grid.col, g.ml5]}>
              <Switch
                value={enableChat}
                onValueChange={() => {
                  setEnableChat(!enableChat);
                }}
                trackColor={{
                  false: '#767577',
                  true: GlobalInclude.Color.ColorPrimaryTooLight,
                }}
                thumbColor={
                  enableChat ? GlobalInclude.Color.ColorPrimary : '#f4f3f4'
                }
                ios_backgroundColor={GlobalInclude.Color.ColorPrimary}
              />
            </View>
          </View>
          <View style={[grid.rowdir, grid.alignItems, g.pt10, g.pb10]}>
            <Text
              numberOfLines={2}
              style={[
                g.FHNM,
                g.fs15,
                g.colorBlack,
                GlobalInclude.AppStyle.transform,
              ]}>
              Enable Notification
            </Text>
            <View style={[grid.col, g.ml5]}>
              <Switch
                value={enableNotification}
                onValueChange={() => {
                  setEnableNotification(!enableNotification);
                }}
                trackColor={{
                  false: '#767577',
                  true: GlobalInclude.Color.ColorPrimaryTooLight,
                }}
                thumbColor={
                  enableNotification
                    ? GlobalInclude.Color.ColorPrimary
                    : '#f4f3f4'
                }
                ios_backgroundColor={GlobalInclude.Color.ColorPrimary}
              />
            </View>
          </View>

          <View style={grid.flex1}>
            {enableNotification && (
              <RadioButton
                defaultSelected={selectedFilter}
                PROP={filterList}
                onRadioSelect={item => {
                  defaultSelected = '';
                  selectedSetting = item.key;
                  setSelectedFilter(item.key);
                }}
              />
            )}
          </View>
          <View style={[styles.filterButton, g.mb10]}>
            <CommonButton
              showLoader={isSubmitting}
              title={'Apply'}
              onPress={() => {
                if (enableNotification && selectedSetting === '') {
                  Alert.alert(
                    'Required Selection',
                    'You must select one setting',
                  );
                } else if (
                  enableNotification &&
                  defaultSelected === selectedSetting
                ) {
                  Alert.alert('Already Selected', 'Settings already selected');
                } else {
                  setUserSettings();
                }
              }}
            />
          </View>
        </View>
      </SafeAreaView>

      {showModal && (
        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setShowModal(!showModal);
          }}
          hardwareAccelerated={true}
          visible={showModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.headerText}>{responseMessage}</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: width - 50,
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
    minHeight: scale(60),
    alignContent: 'center',
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
});

export default ChatUserSettings;
