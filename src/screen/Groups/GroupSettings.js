import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Dimensions,
  Modal,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import CommonButton from '../../component/CommonButton';
import HeaderBar from '../../component/HeaderBar';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {Switch} from 'react-native-elements';
import {showProgess} from '../../component/Common';
import {doGetGroupSetting, doSetGroupSetting} from '../../Actions/GroupActions';

const {width} = Dimensions.get('window');

let responseMessage = '';

const GroupSettings = ({route, navigation}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enableNotification, setEnableNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (global.isConnected) {
      getSettings();
    }
    return () => {};
  }, []);

  const getSettings = () => {
    doGetGroupSetting(
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              if (data.settings !== undefined && data.settings !== null) {
                let status =
                  data.settings[0]?.unreadMessageNotificationSettings;
                setEnableNotification(status === 1);
              }
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
  };

  const setUserSettings = () => {
    setIsSubmitting(true);
    let params = {
      status: enableNotification,
    };
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
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar
        title={'Group Settings'}
        navigation={navigation}
        showBack={true}
      />
      {showProgess(isLoading)}
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <View style={[grid.flex1, g.pl10, g.pr10, g.mt10]}>
          <View style={grid.flex1}>
            <View style={[grid.rowdir, grid.alignItems, g.pt10, g.pb10]}>
              <Text
                numberOfLines={1}
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
          </View>
          <View style={[styles.filterButton, g.mb10]}>
            <CommonButton
              showLoader={isSubmitting}
              title={'Apply'}
              onPress={() => {
                setUserSettings();
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

export default GroupSettings;
