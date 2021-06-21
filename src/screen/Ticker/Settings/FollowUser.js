import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
  Keyboard,
} from 'react-native';
import {scale} from '../../../theme/Scalling';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {IconType} from '../../../helper/Constants';
import AutoSuggestUser from '../../../component/AutoSuggestUser';
import ProgressImage from '../../../component/ProgresImage';
import CommonButton from '../../../component/CommonButton';
import Helpers from '../../../helper/Helper';
import {
  getUserFollowing,
  doFollowUser,
  doUnFollowUser,
} from '../../../Actions/TickerActions';
import {getDirectory} from '../../../Actions/DirectoryActions';

const {width: displayWidth} = Dimensions.get('window');
let searchVal = '';

let responseMessage = '';
let selectedUser = null;

const FollowUser = ({params}) => {
  const [searchedUser, setSearchedUser] = useState([]);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [removeFollowing, setRemoveFollowing] = useState(false);
  const [showNoFollowing, setShowNoFollowing] = useState(false);
  const [myFollowing, setMyFollowing] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (global.isConnected) {
      getMyFollowing();
    }
    return () => {};
  }, []);

  /*****
   *
   * API Section
   *
   */

  const doSearchUser = (query) => {
    getDirectory(
      '1',
      query,
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (searchVal.length > 0) {
              for (var i = data.data.length - 1; i >= 0; i--) {
                const element = data.data[i];
                if (element._id === global.userId) {
                  data.data.splice(i, 1);
                  break;
                }
              }
              setSearchedUser([...data.data]);
            } else {
              setSearchedUser([]);
            }
          }
        }
      },
      (error) => {
        setSearchedUser([]);
        console.log('error', error);
      },
    );
  };

  const getMyFollowing = () => {
    getUserFollowing(
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              if (data.data !== null && data.data.following.length > 0) {
                setMyFollowing([...data.data.following]);
              } else {
                setShowNoFollowing(true);
              }
            }
          }
        }
      },
      (error) => {},
    );
  };

  const followUser = (userId) => {
    let requestObject = {
      userId: userId,
    };
    doFollowUser(
      requestObject,
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              responseMessage = `You're now successfully following ${Helpers.concatName(
                selectedUser,
              )}!`;

              getMyFollowing();
            } else {
              responseMessage = 'Error while following!';
            }

            setShowModal(true);
            setTimeout(() => {
              setShowModal(false);
            }, 2000);
          }
        }
      },
      (error) => {
        console.log('err', error);
      },
    );
  };

  const unFollowUser = (userId) => {
    let requestObject = {
      userId: userId,
    };
    doUnFollowUser(
      requestObject,
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              responseMessage = `You have successfully unfollowed ${Helpers.concatName(
                selectedUser,
              )}!`;

              getMyFollowing();
            } else {
              responseMessage = 'Error while following!';
            }

            setShowModal(true);
            setTimeout(() => {
              setShowModal(false);
            }, 2000);
          }
        }
      },
      (error, statusCode) => {
        console.log('error', error);
        console.log('statusCode', statusCode);
      },
    );
  };

  const removeIndex = () => {
    Alert.alert(
      `Are you sure you would like to unfollow ${Helpers.concatName(
        selectedUser,
      )}`,
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => {
            removeUser();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const removeUser = () => {
    console.log('====================================');
    console.log('selectedUser', selectedUser);
    console.log('====================================');
    unFollowUser(selectedUser._id);
  };

  const showFollowing = (index, item) => {
    return (
      <View style={[grid.rowdir, g.p10, g.pl5, g.pr5]}>
        <TouchableOpacity style={[grid.row]} activeOpacity={0.9}>
          <View
            style={[
              g.mr10,
              g.bggray,
              g.oh,
              {
                width: scale(40),
                height: scale(40),
                borderRadius: scale(50),
              },
            ]}>
            {item.profileImg !== undefined &&
            item.profileImg !== null &&
            item.profileImg !== '' ? (
              <ProgressImage
                source={{uri: item.profileImg}}
                containerStyle={styles.imageStyle}
                mode={'cover'}
              />
            ) : (
              <ProgressImage
                source={GlobalInclude.Assets.DefaultProfile}
                containerStyle={styles.imageStyle}
                mode={'cover'}
              />
            )}
          </View>
          <View style={[grid.justifyContentCenter]}>
            <Text style={[g.fs15, g.FHNM, g.colorBlue]}>
              {Helpers.concatName(item)}
            </Text>
            <Text
              style={[
                g.fs14,
                g.FHNR,
                g.colorBlack,
                grid.justifyContentCenter,
                grid.alignItems,
                g.txtCenterVertical,
                g.mt5,
              ]}>
              Batch - {item.batch}
            </Text>
          </View>
        </TouchableOpacity>

        {removeFollowing && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              selectedUser = item;
              removeIndex(index);
            }}
            style={[g.mr7, grid.justifyContentCenter, grid.alignItems]}>
            <GlobalInclude.BaseIcon
              containerStyle={{height: scale(22), width: scale(22)}}
              iconColor={GlobalInclude.Color.ColorPrimary}
              iconName={'remove-user'}
              iconSize={scale(22)}
              iconType={IconType[9]}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const checkFollow = (row) => {
    let oldData = myFollowing;
    let found = false,
      ownUser = false;
    for (let i = 0; i < oldData.length; i++) {
      const element = oldData[i];
      if (element._id === row._id) {
        found = true;
        break;
      } else if (row._id === global.userId) {
        ownUser = true;
        break;
      }
    }
    if (found) {
      Alert.alert(
        'Already Follow',
        `You already follow ${Helpers.concatName(row)}`,
      );
    } else if (ownUser) {
      Alert.alert('Error', 'You cannot follow your self!');
    } else {
      selectedUser = row;
      setSearchUserQuery('');
      setSearchedUser([]);
      Keyboard.dismiss();
      setTimeout(() => {
        followUser(row._id);
      }, 200);
    }
  };

  return (
    <View style={[grid.flex1, g.pl10, g.pr10]}>
      {showNoFollowing ? (
        <View style={GlobalInclude.AppStyle.fillCenter}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            You are currently not following any users. Click the Follow Button
            to start.
          </Text>
          <View style={[styles.filterButton, g.mt10]}>
            <CommonButton
              showLoader={false}
              title={'Follow'}
              onPress={() => {
                setSearchedUser([]);
                setSearchUserQuery('');
                setMyFollowing([]);
                setShowNoFollowing(false);
              }}
            />
          </View>
        </View>
      ) : (
        <View style={[grid.flex1]}>
          <View style={g.mb15}>
            <View style={[grid.rowdir, grid.alignItemsTop]}>
              <Text style={g.labeltext1}>Search User</Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[g.inputWhite]}
              autoCapitalize={'words'}
              value={searchUserQuery}
              placeholder={'Search user here'}
              onChangeText={(value) => {
                searchVal = value;
                setSearchUserQuery(value);
                if (value.length > 0) {
                  doSearchUser(value);
                } else {
                  setSearchedUser([]);
                }
              }}
            />
          </View>
          {searchedUser.length > 0 && (
            <AutoSuggestUser
              searchedUser={searchedUser}
              onPress={(row, index) => {
                checkFollow(row);
              }}
            />
          )}

          <View style={grid.flex1}>
            <ScrollView>
              <View style={[g.mt10]}>
                {myFollowing.map((item, index) => {
                  return <View>{showFollowing(index, item)}</View>;
                })}
              </View>
            </ScrollView>
          </View>
          {myFollowing.length > 0 && (
            <View style={[styles.filterButton, g.mb10]}>
              <CommonButton
                showLoader={false}
                title={removeFollowing ? 'Done' : 'Remove User'}
                onPress={() => {
                  setRemoveFollowing(!removeFollowing);
                }}
              />
            </View>
          )}
        </View>
      )}

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
            <View style={styles.responseMessage}>
              <Text style={styles.headerText}>{responseMessage}</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    width: scale(40),
    justifyContent: 'center',
  },
  fitImage: {
    borderRadius: scale(10),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
    backgroundColor: 'rgba(62,62,62,0.5)',
    flex: 1,
    width: '100%',
  },
  responseMessage: {
    width: displayWidth - 50,
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

export default FollowUser;
