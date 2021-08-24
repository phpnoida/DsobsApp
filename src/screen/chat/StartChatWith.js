import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Keyboard,
  Alert,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {IconType} from '../../helper/Constants';
import {getDirectory} from '../../Actions/DirectoryActions';
import AutoSuggestUser from '../../component/AutoSuggestUser';
import Helper from '../../helper/Helper';
import ProgresImage from '../../component/ProgresImage';
import ModelAlert from '../../component/ModalAlert';
import CommonButton from '../../component/CommonButton';
import {addUser, checkUserExist} from '../../helper/ChatHelper';
const {width} = Dimensions.get('window');

let searchVal = '';
let lastIndex = 1;
let challengerUser = null;

const StartChatWith = ({navigation}) => {
  const [chatType, setchatType] = useState(1);
  const [searchedUser, setSearchedUser] = useState([]);
  const [searchUserName, setSearchUserName] = useState('');
  const [selectedUser, setSelectedUser] = useState([]);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    /**
     * We get user own details also
     */
    checkUserExist(global.userId).then(result => {
      if (result !== undefined && result !== null) {
        challengerUser = result;
      }
    });
    return () => {};
  }, []);

  const validateUser = async () => {
    const result = await checkUserExist(selectedUser[0]._id);
    if (result === null) {
      addUser(selectedUser[0]._id, selectedUser[0], () => {
        createChatUser(selectedUser[0]);
      });
    } else {
      if (result !== undefined && result !== null) {
        if (
          result.chatEnabled &&
          result.chatEnabled !== undefined &&
          result.chatEnabled !== null &&
          result.chatEnabled
        ) {
          let blockedUser = result.blockedUser;

          if (blockedUser.indexOf(global.userId) > -1) {
            setIsLoading(false);
            Alert.alert(
              'You have been blocked',
              'user has blocked you on chat.',
            );
          } else {
            createChatUser(selectedUser[0]);
          }
        } else {
          setIsLoading(false);
          Alert.alert(
            'Feature not available',
            'user has disabled this feature.',
          );
        }
      } else {
        setIsLoading(false);
        Alert.alert('Feature not available', 'user has disabled this feature.');
      }
    }
  };

  const createChatUser = async opponentUser => {
    setIsLoading(false);
    let payload = {
      challenger: challengerUser,
      opponent: opponentUser || {},
      isGroup: false,
    };
    navigation.navigate('ChatScreen', payload);
    //navigation.replace('ChatScreen', payload);
  };

  // Filter section
  const changeText = text => {
    setSearchUserName(text);
    searchVal = text;
    if (text.length > 2) {
      setSearchedUser([]);
      doSearchUser(text);
    } else if (text.length < 2) {
      setSearchedUser([]);
    }
  };

  const doSearchUser = query => {
    getDirectory(
      '1',
      query,
      response => {
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
      error => {
        setSearchedUser([]);
        console.log('error', error);
      },
    );
  };

  const searchInput = () => {
    return (
      <View style={[grid.rowdir, g.mt10]}>
        <View style={[g.inputNew, grid.rowdir]}>
          <GlobalInclude.BaseIcon
            containerStyle={styles.searchIcon}
            iconColor={'#dddddd'}
            iconName={'search'}
            iconSize={scale(20)}
            iconType={IconType[4]}
          />
          <TextInput
            underlineColorAndroid="transparent"
            value={searchUserName}
            style={[g.pl0, g.fs14, grid.col, grid.justifyContentCenter]}
            keyboardType={'default'}
            placeholder={'Type more than 3 characters'}
            onChangeText={text => {
              changeText(text);
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar title={'Start Chat'} navigation={navigation} showBack={true} />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <View style={[grid.flex1, g.pl10, g.pr10, g.mt10]}>
          <Text
            numberOfLines={2}
            style={[
              g.FHNM,
              g.fs15,
              g.colorBlack,
              GlobalInclude.AppStyle.transform,
            ]}>
            Type of Message
          </Text>
          <View style={styles.buttonContainer}>
            <View style={grid.flex1}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  backgroundColor:
                    chatType === 1
                      ? GlobalInclude.Color.ColorPrimary
                      : '#f8f8f8',
                  textAlign: 'center',
                  fontSize: scale(16),
                  borderRadius: scale(8),
                  width: '100%',
                  height: scale(38),
                  justifyContent: 'center',
                }}
                onPress={() => {
                  setSearchUserName('');
                  setSearchedUser([]);
                  setSelectedUser([]);
                  setchatType(1);
                }}>
                <Text
                  style={{
                    fontSize: scale(14),
                    color:
                      chatType === 1
                        ? '#ffffff'
                        : GlobalInclude.Color.ColorPrimary,
                    fontFamily: 'Lato-Regular',
                    textAlign: 'center',
                  }}>
                  1 ON 1
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{marginHorizontal: scale(10)}} />
            <View style={grid.flex1}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  backgroundColor:
                    chatType === 2
                      ? GlobalInclude.Color.ColorPrimary
                      : '#f8f8f8',
                  textAlign: 'center',
                  fontSize: scale(16),
                  borderRadius: scale(8),
                  width: '100%',
                  height: scale(38),
                  justifyContent: 'center',
                }}
                onPress={() => {
                  setSearchUserName('');
                  setSearchedUser([]);
                  setSelectedUser([]);
                  setchatType(2);
                }}>
                <Text
                  style={{
                    fontSize: scale(14),
                    color:
                      chatType === 2
                        ? '#ffffff'
                        : GlobalInclude.Color.ColorPrimary,
                    fontFamily: 'Lato-Regular',
                    textAlign: 'center',
                  }}>
                  MULTI USER
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[g.mt10, g.mb5]} />
          {chatType === 1 ? (
            <View>
              <Text
                numberOfLines={2}
                style={[
                  g.FHNM,
                  g.fs15,
                  g.colorBlack,
                  GlobalInclude.AppStyle.transform,
                ]}>
                Send Message to
              </Text>
              {searchInput()}
            </View>
          ) : (
            <View>
              <View style={g.mb15}>
                <Text
                  numberOfLines={2}
                  style={[
                    g.FHNM,
                    g.fs15,
                    g.colorBlack,
                    GlobalInclude.AppStyle.transform,
                  ]}>
                  Set Group name
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={[g.inputWhite, g.mt10]}
                  maxLength={100}
                  keyboardType={'default'}
                  autoCapitalize={'words'}
                  returnKeyType={'done'}
                  placeholder={'Enter your text here'}
                  onChangeText={value => {}}
                />
              </View>

              <View style={g.mb15}>
                <Text
                  numberOfLines={2}
                  style={[
                    g.FHNM,
                    g.fs15,
                    g.colorBlack,
                    GlobalInclude.AppStyle.transform,
                  ]}>
                  Add Members
                </Text>
                {searchInput()}
              </View>
            </View>
          )}

          {searchedUser.length > 0 && (
            <AutoSuggestUser
              searchedUser={searchedUser}
              onPress={(row, index) => {
                if (chatType === 1) {
                  let itemArray = [];
                  itemArray.push(row);
                  setSelectedUser([...itemArray]);
                } else {
                  let oldData = selectedUser;
                  oldData.push(row);
                  setSelectedUser([...oldData]);
                }
                setSearchedUser([]);
                setSearchUserName('');
                Keyboard.dismiss();
              }}
            />
          )}

          <View style={g.mt15}>
            {selectedUser.length > 0 ? (
              <Text style={[g.fs14, g.FHNB, g.colordarkGray]}>Selected</Text>
            ) : null}
            <View
              style={[
                grid.row,
                selectedUser.length > 2 ? grid.justifyContent : '',
                grid.flexwrap,
              ]}>
              {selectedUser.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onLongPress={() => {
                      lastIndex = index;
                      setShowRemoveAlert(true);
                    }}
                    key={index}
                    style={[
                      {
                        marginLeft: 10,
                        width: width / 3 - 40,
                        marginRight: selectedUser.length > 2 ? 10 : 20,
                        paddingTop: scale(10),
                      },
                    ]}>
                    <View style={[g.bglightGray, g.oh, {borderRadius: 100}]}>
                      <ProgresImage
                        source={
                          item.profileImg != null && item.profileImg !== ''
                            ? {uri: item.profileImg}
                            : GlobalInclude.Assets.DefaultProfile
                        }
                        containerStyle={{
                          aspectRatio: 1 / 1,
                        }}
                        mode={'cover'}
                      />
                    </View>
                    <View style={{height: 80}}>
                      <Text
                        style={[
                          g.FHNR,
                          g.txtCenter,
                          g.colorBlack,
                          g.fs14,
                          g.mt8,
                        ]}
                        numberOfLines={2}>
                        {Helper.capitalize(Helper.concatName(item))}
                      </Text>

                      <Text
                        style={[
                          g.FHNR,
                          g.txtCenter,
                          g.colorGray,
                          g.fs12,
                          g.mt2,
                        ]}
                        numberOfLines={2}>
                        {item.designation}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* <View style={styles.postButtonContainer}>
          <CommonButton
            showLoader={false}
            title={'Start Chat'}
            onPress={() => {
              navigation.navigate('ChatScreen');
            }}
          />
        </View> */}

        <View style={styles.postButtonContainer}>
          {selectedUser.length > 0 && (
            <CommonButton
              showLoader={isLoading}
              title={'Start Chat'}
              onPress={() => {
                if (!isLoading) {
                  setIsLoading(true);
                  validateUser();
                }
              }}
            />
          )}
        </View>

        {showRemoveAlert && (
          <ModelAlert
            status={true}
            header={'Are you sure you would like to remove this user?'}
            okButton={'Okay'}
            okAction={() => {
              setShowRemoveAlert(false);
              let oldData = selectedUser;
              oldData.splice(lastIndex, 1);
              setSelectedUser([...oldData]);
            }}
            cancelButton={'Cancel'}
            cancelAction={() => {
              setShowRemoveAlert(false);
            }}
            closeAction={() => {
              setShowRemoveAlert(false);
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    paddingTop: scale(10),
    paddingBottom: scale(10),
  },
  postButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
  },
  searchIcon: {
    height: scale(20),
    width: scale(20),
    alignSelf: 'center',
    marginEnd: scale(6),
    marginStart: scale(6),
  },
});

export default StartChatWith;
