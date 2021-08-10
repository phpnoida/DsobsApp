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
import ProgressImage from '../../component/ProgresImage';
import HeaderBar from '../../component/HeaderBar';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {Switch} from 'react-native-elements';
import {showProgess} from '../../component/Common';
import {checkUserExist, updateUserObject} from '../../helper/ChatHelper';
import Helpers from '../../helper/Helper';

const {width} = Dimensions.get('window');

const ChatUserProfile = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    /**
     * We get user own details also
     */

    if (route !== undefined && route !== null) {
      if (route.params !== undefined && route.params !== null) {
        let userId = route.params.userId;
        checkUserExist(userId).then((result) => {
          setIsLoading(false);
          if (result !== undefined && result !== null) {
            setProfileData(result);
          }
        });
      }
    }

    return () => {};
  }, [route]);

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar title={'Settings'} navigation={navigation} showBack={true} />
      {showProgess(isLoading)}
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        {profileData !== null ? (
          <View style={[grid.flex1, g.pl10, g.pr10, g.mt10]}>
            <View style={styles.headerContainer}>
              <ProgressImage
                source={profileData.profileImg}
                containerStyle={{
                  aspectRatio: 1 / 1,
                  height: scale(90),
                  width: scale(90),
                  borderRadius: scale(90),
                }}
                mode={'cover'}
              />
              <View style={[g.ml15, grid.col]}>
                <View style={[grid.rowrow, grid.justifyContent]}>
                  <View style={[g.pr10, grid.col]}>
                    <Text
                      style={[g.colordarkGray, g.fs18, g.FHNB]}
                      onPress={() => {}}>
                      {Helpers.concatName(profileData)}
                    </Text>
                    {profileData.batch ? (
                      <Text
                        style={[
                          g.colorLightGray,
                          g.fs14,
                          g.FHNR,
                          g.mt5,
                          GlobalInclude.AppStyle.transform,
                        ]}>{`${profileData.schoolNo} ${profileData.house} ${profileData.section} ${profileData.batch}`}</Text>
                    ) : null}
                  </View>
                </View>
                <Text style={[g.colorLightGray, g.fs14, g.FHNR, g.mt5]}>
                  {profileData.profession}
                </Text>
                <Text
                  style={[
                    g.colorLightGray,
                    g.fs14,
                    g.FHNR,
                    g.mt5,
                    {textTransform: 'capitalize'},
                  ]}>
                  {profileData.city}
                </Text>
                {/* <Text style={[g.colorLightGray, g.fs14, g.FHNR, g.mt5]}>
                  {showLastSeen(props.lastseen)}
                </Text> */}
              </View>
            </View>
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: scale(15),
    paddingBottom: scale(10),
    flexDirection: 'row',
  },
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

export default ChatUserProfile;
