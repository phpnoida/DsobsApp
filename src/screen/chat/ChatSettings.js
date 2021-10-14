import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  Text,
  Dimensions,
  Modal,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import RadioButton from '../../component/RadioButton';
import CommonButton from '../../component/CommonButton';
import HeaderBar from '../../component/HeaderBar';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {Switch} from 'react-native-elements';
import {showProgess} from '../../component/Common';
import {checkUserExist, updateUserObject} from '../../helper/ChatHelper';

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
const ChatSettings = ({route, navigation}) => {
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

    checkUserExist(global.userId, false).then(result => {
      setIsLoading(false);
      if (result !== undefined && result !== null) {
        /********************
         * {"_id": "602a65dca1714c5bd918612e", "batch": "2021", "blockedUser": [], "chatEnabled": true, "enableNotification": true, "firstName": "Android", "groups": [], "isOnline": true, "lastName": "Developer", "lastseen": 1628248094639, "notificationKey": 1, "prefix": "Mr", "profession": "Academia/Academics", "profileImg": "https://dsobs-new.s3.ap-south-1.amazonaws.com/1626522098_930706_1626522097479.jpg"}
         */
        setEnableChat(result.chatEnabled);
        setEnableNotification(result.enableNotification);
        setSelectedFilter(result.notificationKey);
        selectedSetting = result.notificationKey;
      }
    });
    return () => {};
  }, []);

  const setUserSettings = () => {
    setIsSubmitting(true);
    let object = {
      notificationKey: selectedSetting,
      chatEnabled: enableChat,
      enableNotification: enableNotification,
    };
    updateUserObject(object, global.userId, status => {
      if (status) {
        responseMessage = 'Updating information successfully!';
      } else {
        responseMessage = 'Error while updating information!';
      }
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigation.goBack();
      }, 2000);
      setIsSubmitting(false);
    });
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

export default ChatSettings;
