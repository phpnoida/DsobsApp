import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Keyboard,
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {APP_NAME} from '../../helper/Constants';
import grid from '../../theme/grid';
import g from '../../theme/global';
import {scale} from '../../theme/Scalling';
import CommonButton from '../../component/CommonButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {generateHeader} from '../../component/Common';
import UploadMedia from '../../component/UploadMedia';
import ProgressImage from '../../component/ProgresImage';
import {uploadMediaButton} from '../../component/Common';
import {doCreateGroup, doUpdateGroup} from '../../Actions/GroupActions';
import {useDispatch} from 'react-redux';
import {refreshPreviousScreen} from '../../reducer/NotificationReducer';

let responseMessage = '';
let isSuccess = false;
let inEditMode = false;
let groupId = '';

const CreateGroup = ({route, navigation}) => {
  const uploadRef = useRef();
  const dispatch = useDispatch();

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [aboutGroup, setAboutGroup] = useState('');
  const [mediaData, setMediaData] = useState(null);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  useEffect(() => {
    responseMessage = '';
    isSuccess = false;
    inEditMode = false;

    if (route.params !== undefined && route.params !== null) {
      if (route.params.data !== undefined && route.params.data !== null) {
        inEditMode = route.params.data.inEditMode;
        if (inEditMode) {
          setupDefaultData(route.params.data.data);
        }
      }
    }

    return () => {};
  }, [route.params]);

  const setupDefaultData = defaultData => {
    if (defaultData && defaultData !== undefined && defaultData !== null) {
      console.log('defaultData', JSON.stringify(defaultData));
      groupId = defaultData._id;
      setGroupName(defaultData.name);
      setAboutGroup(defaultData.description);

      let mediaPath = {
        thumbnail: defaultData.profilePicture,
        fileName: defaultData.profilePicture,
        type: 1,
      };
      setMediaData(mediaPath);
      setMyComment(defaultData.firstComment);
    }
  };

  /*****
   *
   * API Section
   *
   */

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

    if (inEditMode) {
      updateGroupData(requestObject);
    } else {
      uploadPostData(requestObject);
    }
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
                dispatch(refreshPreviousScreen());
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

  const updateGroupData = requestObject => {
    setSubmitting(true);
    doUpdateGroup(
      groupId,
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
                'You have successfully updated group information';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
                dispatch(refreshPreviousScreen());
                navigation.goBack();
              }, 2500);
            } else {
              responseMessage = 'Error while updating your request!';
              setShowErrorMessage(true);
              setTimeout(() => {
                setShowErrorMessage(false);
              }, 2500);
            }
          }
        }
      },
      (code, error) => {
        console.log('====================================');
        console.log(code, error);
        console.log('====================================');
        //setSubmitting(false);
        Alert.alert('Something went wrong', error);
      },
    );
  };

  /*****
   *
   * API Section
   *
   */

  const isValidMedia = imageMedia => {
    if (imageMedia !== undefined && imageMedia !== null) {
      let info = imageMedia.imageInfo;
      let cropRect = info.cropRect;
      let ratio = cropRect.width / cropRect.height;

      let result =
        Math.abs(ratio - 4 / 3) < Math.abs(ratio - 16 / 9) ? '4:3' : '16:9';

      if (result === '16:9') {
        return true;
      }
      return false;
    }
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

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar
        title={inEditMode ? 'Update Group' : 'Create Group'}
        navigation={navigation}
        showBack={true}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <View
          style={[
            GlobalInclude.AppStyle.fill,
            GlobalInclude.AppStyle.contentSpace,
          ]}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            style={[grid.flex1]}
            showsVerticalScrollIndicator={false}>
            <View style={{paddingBottom: scale(60)}}>
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
                {uploadMediaButton(() => {
                  if (uploadRef.current !== null) {
                    uploadRef.current.open();
                  }
                })}
                {errorMessage.mediaData && errorMessage.mediaData !== '' ? (
                  <Text style={g.errorMsg}>{errorMessage.mediaData}</Text>
                ) : null}

                {mediaData !== undefined && mediaData !== null && (
                  <ProgressImage
                    source={{
                      uri: mediaData.thumbnail,
                    }}
                    containerStyle={styles.imageStyle}
                    imageStyle={styles.imageStyle}
                    mode={'cover'}
                  />
                )}
              </View>

              <View style={g.mb15}>
                {generateHeader('Your first comment in the group', false)}
                <TextInput
                  underlineColorAndroid="transparent"
                  numberOfLines={1}
                  style={g.inputWhite}
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
              title={inEditMode ? 'Update' : 'Create Now'}
              onPress={e => {
                e.preventDefault();
                validateInput();
              }}
            />
          </View>
        </View>
      </SafeAreaView>

      <UploadMedia
        navigation={navigation}
        refRBSheet={uploadRef}
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
            if (!isValidMedia(media[0])) {
              setErrorMessage({mediaData: 'Photo must be in 16:9 ratio'});
            } else {
              setErrorMessage({});
              setMediaData(media[0]);
            }
          }
        }}
      />

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
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    marginTop: scale(3),
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: scale(10),
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

export default CreateGroup;
