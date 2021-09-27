import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Text,
  Dimensions,
  TextInput,
  Keyboard,
  Alert,
} from 'react-native';

import OptionsSheet from 'react-native-raw-bottom-sheet';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';

import {IconType, APP_NAME} from '../../helper/Constants';

import {
  generateMenuOption,
  uploadMediaButton,
  generateHeader,
} from '../../component/Common';
import UploadMedia from '../../component/UploadMedia';
import TopHeaderView from '../../component/TopHeaderView';
import CommonButton from '../../component/CommonButton';
import SingleSearchWithFilter from '../../component/SingleSearchWithFilter';

import MyGroups from './MyGroups';
import DiscoverGroups from './DiscoverGroups';
import BatchGroups from './BatchGroups';
import {
  doJoinGroup,
  doCreateGroup,
  doGetUserStatusForGroup,
} from '../../Actions/GroupActions';
import {useDispatch} from 'react-redux';
import {refreshScreen} from '../../reducer/GroupReducer';

let responseMessage = '';
let isSuccess = false;
let initialPage = 0;
let seletedItem = null;

const {height} = Dimensions.get('window');

const GroupsList = ({route, navigation}) => {
  const refOptions = useRef();
  const refJoinGroup = useRef();
  const createGroupRef = useRef();
  const uploadRef = useRef();

  const tabRef = useRef();
  const dispatch = useDispatch();

  const [filterQuery, setFilterQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  /**
   * Create Group
   *
   */

  const [groupName, setGroupName] = useState('');
  const [aboutGroup, setAboutGroup] = useState('');
  const [mediaData, setMediaData] = useState(null);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initialPage = 0;
      setCurrentTab(0);
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  /**
   *
   * @API Section
   */
  const joinGroupRequest = () => {
    if (selectedGroup === undefined || selectedGroup === null) {
      console.log('====================================');
      console.log('56 ');
      console.log('====================================');
      return;
    }
    let groupId = selectedGroup._id;
    global.loader_ref.show_loader(1);
    doJoinGroup(
      groupId,
      response => {
        //You have successfully submitted your request to start a new group
        global.loader_ref.show_loader(0);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              isSuccess = true;
              responseMessage =
                'You have successfully submitted your request to join group';
              setShowErrorMessage(true);
              setTimeout(() => {
                dispatch(refreshScreen());
                setShowErrorMessage(false);
              }, 2500);
            } else {
              responseMessage = 'Error while posting your request!';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
              }, 2500);
            }
          }
        }
      },
      (code, error) => {
        console.log('error: ' + error);
        console.log('code: ' + code);
        global.loader_ref.show_loader(0);
      },
    );
  };

  const getUserStatus = groupId => {
    global.loader_ref.show_loader(1);
    doGetUserStatusForGroup(
      groupId,
      response => {
        global.loader_ref.show_loader(0);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data && data !== null && data !== undefined) {
              if (data.status) {
                //{"status": true, "userStatus": 1}
                let userStatus = data.userStatus;
                /*
                      -1 = unjoin
                      0 = pending
                      1 = active
                      2 = rejected
                      3 = removed
                    */
                if (userStatus === 1) {
                  navigation.navigate('StartGroupChat', {
                    groupId: seletedItem._id,
                    groupInfo: seletedItem,
                  });
                } else {
                  setSelectedGroup(seletedItem);
                  if (
                    refJoinGroup.current !== undefined &&
                    refJoinGroup.current !== null
                  ) {
                    refJoinGroup.current.open();
                  }
                }
              }
            }
            console.log('====================================');
            console.log('user status', data);
            console.log('====================================');
          }
        }
      },
      (code, error) => {
        global.loader_ref.show_loader(0);
        Alert.alert('something wrong', error);
        console.log('====================================');
        console.log('code ,error', code, error);
        console.log('====================================');
      },
    );
  };

  const validateInput = () => {
    if (groupName.trim() === '' || groupName.length === 0) {
      setErrorMessage({groupName: 'This field is required'});
    } else if (aboutGroup.trim() === '' || aboutGroup.length === 0) {
      setErrorMessage({aboutGroup: 'This field is required'});
    } else if (mediaData === undefined || mediaData === null) {
      setErrorMessage({mediaData: 'This field is required'});
    } else {
      saveGroup();
    }
  };

  const saveGroup = () => {
    let requestObject = {
      name: groupName,
      description: aboutGroup,
      profilePicture: mediaData.thumbnail,
      firstComment: myComment,
    };

    console.log('====================================');
    console.log('requestObject', JSON.stringify(requestObject));
    console.log('====================================');
    Keyboard.dismiss();

    uploadPostData(requestObject);
  };

  const uploadPostData = requestObject => {
    setSubmitting(true);
    doCreateGroup(
      requestObject,
      response => {
        setSubmitting(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              isSuccess = true;
              responseMessage =
                'You have successfully submitted your request to start a new group';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
                navigation.goBack();
              }, 2500);
            } else {
              responseMessage = 'Error while posting your request!';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
              }, 2500);
            }
          }
        }
      },
      (code, error) => {
        setSubmitting(false);
        Alert.alert('Something went wrong', error);
      },
    );
  };
  /**
   *
   * @API Section
   */

  const createNewGroup = () => {
    return (
      <OptionsSheet
        ref={createGroupRef}
        minClosingHeight={50}
        height={height / 2 + 150}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View style={GlobalInclude.AppStyle.fill}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            style={[grid.flex1]}
            showsVerticalScrollIndicator={false}>
            <View>
              <View style={g.mb15}>
                {generateHeader('Set Group Name', true)}
                <TextInput
                  underlineColorAndroid="transparent"
                  numberOfLines={1}
                  style={g.inputWhite}
                  value={groupName}
                  keyboardType={'default'}
                  autoCapitalize={'words'}
                  multiline={false}
                  blurOnSubmit={true}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  returnKeyType="done"
                  placeholder={'Type here'}
                  onChangeText={value => {
                    setErrorMessage({});
                    setGroupName(value);
                  }}
                />
                {errorMessage.groupName && errorMessage.groupName !== '' ? (
                  <Text style={g.errorMsg}>{errorMessage.groupName}</Text>
                ) : null}
              </View>

              <View style={g.mb15}>
                {generateHeader('About Group', true)}
                <TextInput
                  underlineColorAndroid="transparent"
                  numberOfLines={6}
                  style={styles.commentInput}
                  value={aboutGroup}
                  keyboardType={'default'}
                  autoCapitalize={'words'}
                  multiline={true}
                  blurOnSubmit={true}
                  maxLength={500}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  returnKeyType="done"
                  placeholder={'Type here'}
                  onChangeText={value => {
                    setErrorMessage({});
                    setAboutGroup(value);
                  }}
                />
                {errorMessage.aboutGroup && errorMessage.aboutGroup !== '' ? (
                  <Text style={g.errorMsg}>{errorMessage.aboutGroup}</Text>
                ) : null}
              </View>

              <View style={g.mb15}>
                {generateHeader('Upload Pic', true)}
                {uploadMediaButton(
                  () => {
                    if (uploadRef.current !== null) {
                      uploadRef.current.open();
                    }
                  },
                  mediaData !== undefined && mediaData !== null
                    ? 'Image Uploaded successfully'
                    : 'Upload Pic',
                )}
                {errorMessage.mediaData && errorMessage.mediaData !== '' ? (
                  <Text style={g.errorMsg}>{errorMessage.mediaData}</Text>
                ) : null}
              </View>

              <View style={g.mb15}>
                {generateHeader('Your first comment in the group', false)}
                <TextInput
                  underlineColorAndroid="transparent"
                  numberOfLines={1}
                  style={styles.commentInput}
                  value={myComment}
                  keyboardType={'default'}
                  autoCapitalize={'words'}
                  multiline={true}
                  blurOnSubmit={true}
                  maxLength={200}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  returnKeyType="done"
                  placeholder={'Type here'}
                  onChangeText={value => {
                    setErrorMessage({});
                    setMyComment(value);
                  }}
                />
                {errorMessage.myComment && errorMessage.myComment !== '' ? (
                  <Text style={g.errorMsg}>{errorMessage.inputValue}</Text>
                ) : null}
              </View>
            </View>
          </KeyboardAwareScrollView>
          <View style={styles.buttonContainer}>
            <CommonButton
              showLoader={submitting}
              title={'Create Now'}
              onPress={e => {
                e.preventDefault();
                validateInput();
              }}
            />
          </View>
        </View>
      </OptionsSheet>
    );
  };

  const userOptions = () => {
    return (
      <OptionsSheet
        ref={refOptions}
        minClosingHeight={50}
        height={260}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View stylre={[grid.flex1, g.mb10]}>
          {generateMenuOption('Start a New Group', 'add-to-list', 9, () => {
            refOptions.current.close();
            setGroupName('');
            setAboutGroup('');
            setMediaData(null);
            setMyComment('');
            setSubmitting(false);
            setErrorMessage({});
            setTimeout(() => {
              if (
                createGroupRef.current !== undefined &&
                createGroupRef.current !== null
              ) {
                createGroupRef.current.open();
              }
              //navigation.navigate('CreateGroup');
            }, 220);
          })}

          {generateMenuOption('Group Settings', 'setting', 10, () => {
            refOptions.current.close();
            setTimeout(() => {
              navigation.navigate('GroupSettings');
            }, 220);
          })}

          {generateMenuOption('About Groups', 'exclamationcircleo', 10, () => {
            refOptions.current.close();
            // setTimeout(() => {
            //   navigation.navigate('ChatEtiquette');
            // }, 220);
          })}
        </View>
      </OptionsSheet>
    );
  };

  const joinGroup = () => {
    /*
      -1 = unjoin
      0 = pending
      1 = active
      2 = rejected
      3 = removed
    */

    let title = '';
    let groupStatus = selectedGroup.status;
    switch (selectedGroup.status) {
      case -1:
        title = 'Join Group';
        break;
      case 0:
        title = 'Join Group (Request Pending)';
        break;
      case 1:
        title = 'Join Group (Member)';
        break;
      case 2:
        title = 'Join Group (Request Rejected)';
        break;
      case 3:
        title = 'Join Group (Member Removed)';
        break;
      default:
        break;
    }

    return (
      <OptionsSheet
        ref={refJoinGroup}
        minClosingHeight={50}
        height={160}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View stylre={[grid.flex1, g.mb10]}>
          {groupStatus === -1
            ? generateMenuOption('Join Group', 'add-to-list', 9, () => {
                refJoinGroup.current.close();
                setTimeout(() => {
                  joinGroupRequest();
                }, 200);
              })
            : generateMenuOption(title, 'add-to-list', 9, () => {
                refJoinGroup.current.close();
                if (groupStatus === 2 || groupStatus === 3) {
                  setTimeout(() => {
                    joinGroupRequest();
                  }, 200);
                }
              })}
        </View>
      </OptionsSheet>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <TopHeaderView
        navigation={navigation}
        index={13}
        customIcon={{
          containerStyle: {height: scale(24), width: scale(24)},
          iconColor: GlobalInclude.Color.ColorPrimary,
          iconName: 'dots-horizontal',
          size: scale(24),
          type: IconType[1],
        }}
        customIconPress={() => {
          if (refOptions.current !== undefined && refOptions.current !== null) {
            refOptions.current.open();
          }
        }}
      />

      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={[GlobalInclude.AppStyle.fill]}>
          <View style={[GlobalInclude.AppStyle.fill, g.pt10]}>
            <View style={GlobalInclude.AppStyle.contentSpaceHorizonta}>
              <SingleSearchWithFilter
                placeholder={'Type more than three Characters'}
                filterQuery={filterQuery}
                changeText={text => {
                  setFilterQuery(text);
                }}
                showGoButton={false}
                onFilterPress={() => {}}
                hideFilter={true}
              />
            </View>

            <ScrollableTabView
              ref={tabRef}
              underlineColor={'#ffffff'}
              initialPage={initialPage}
              tabBarActiveTextColor={GlobalInclude.Color.ColorPrimary}
              tabBarInactiveTextColor={'#bababa'}
              tabBarTextStyle={{
                fontSize: scale(15),
                fontFamily: 'Lato-Regular',
                margin: -5,
              }}
              onChangeTab={e => {
                setCurrentTab(e.i);
              }}
              tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
              renderTabBar={() => (
                <ScrollableTabBar style={styles.tabBarStyle} />
              )}>
              <MyGroups
                isActive={currentTab === 1}
                tabLabel={'My Groups'}
                onTap={(item, index) => {
                  seletedItem = item;
                  getUserStatus(item._id);
                }}
              />
              <DiscoverGroups
                isActive={currentTab === 2}
                tabLabel={'Discover More'}
                onTap={(item, index) => {
                  seletedItem = item;
                  getUserStatus(item._id);
                }}
              />
              <BatchGroups
                isActive={currentTab === 3}
                tabLabel={'Batch Groups'}
              />
            </ScrollableTabView>
          </View>
        </View>
        {userOptions()}
        {createNewGroup()}
        {selectedGroup !== undefined && selectedGroup !== null && joinGroup()}

        {showErrorMessage && (
          <GlobalInclude.ModalAlert
            status={showErrorMessage}
            header={responseMessage}
            okButton={isSuccess ? 'Okay' : `Contact ${APP_NAME}`}
            okAction={() => {
              setShowErrorMessage(!showErrorMessage);
              if (isSuccess) {
                navigation.goBack();
              }
            }}
            closeAction={() => {
              setShowErrorMessage(!showErrorMessage);
            }}
          />
        )}
      </SafeAreaView>

      <UploadMedia
        navigation={navigation}
        refRBSheet={uploadRef}
        currentModule={'groups'}
        media={{
          image: false,
          video: true,
          document: true,
          audio: true,
        }}
        supportMultiple={false}
        onPickMedia={media => {
          uploadRef.current.close();
          if (media !== undefined && media !== null) {
            console.log('media', JSON.stringify(media));
            setErrorMessage({});
            setMediaData(media[0]);
          }
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  tabBarStyle: {borderBottomWidth: 0, margin: 0},
  tabBarUnderlineStyle: {
    borderBottomColor: 'transparent',
    backgroundColor: 'white',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
  },
  commentInput: {
    height: scale(90),
    color: 'black',
    textAlignVertical: 'top',
    backgroundColor: '#f8f8f8',
    padding: scale(10),
    margin: 0,
    fontSize: scale(12),
    borderRadius: scale(8),
    fontFamily: 'Lato-Regular',
    justifyContent: 'center',
  },
});

export default GroupsList;
