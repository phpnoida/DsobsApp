import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import YearSelection from '../../component/YearSelection';
import EditLinksExperience from '../../component/EditLinksExperience';
import Radio from '../../component/Radio';
import NextPreviousButton from '../../component/NextPreviousButton';
import {IconType} from '../../helper/Constants';
import {uploadProfilePic, updateUserProfile} from '../../Actions/UserActions';
import RNFetchBlob from 'rn-fetch-blob';
import ZoomImage from '../../component/ZoomImage';
import DatePickerView from '../../component/DatePickerView';
import UploadMedia from '../../component/UploadMedia';
import Helper from '../../helper/Helper';
import DateTimePicker from '@react-native-community/datetimepicker';

const createGenderRadioButtons = (value) => {
  return [
    {
      key: '1',
      label: 'Male',
      selected: value === '1' || false,
    },
    {
      key: '0',
      label: 'Female',
      selected: value === '0' || false,
    },
    {
      key: '2',
      label: 'LGBTQIA',
      selected: value === '2' || false,
    },
  ];
};

const generateOptionList = (defaultValue) => {
  let optionList = [];
  optionList.push({
    key: 'Single',
    text: 'Single',
    selected: defaultValue === 'Single' ? true : false,
  });
  optionList.push({
    key: 'Married',
    text: 'Married',
    selected: defaultValue === 'Married' ? true : false,
  });
  optionList.push({
    key: 'Divorced',
    text: 'Divorced',
    selected: defaultValue === 'Divorced' ? true : false,
  });
  optionList.push({
    key: 'Widowed',
    text: 'Widowed',
    selected: defaultValue === 'Widowed' ? true : false,
  });
  optionList.push({
    key: 'In a Relationship',
    text: 'In a Relationship',
    selected: defaultValue === 'In a Relationship' ? true : false,
  });
  optionList.push({
    key: 'Separated',
    text: 'Separated',
    selected: defaultValue === 'Separated' ? true : false,
  });
  return optionList;
};

var lastSelectedIndex = -1;
var requestPicker = -1;
var requestImagePicker = -1;
var profileUri = null;
var serverDate = '';
let imageArray = [];
let responseMessage = '';

const MyFamily = (props) => {
  const {profileData} = props;

  const uploadRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [showContactUsModal, setShowContactUsModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [relationShipStatus, setRelationShipStatus] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [spouseName, setSpouseName] = useState('');
  const [spousePhoto, setSpousePhoto] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateOfMarriage, setDateOfMarriage] = useState('');
  const [childGender, setChildGender] = useState('1');

  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [childName, setChildName] = useState('');
  const [childPhoto, setChildPhoto] = useState('');
  const [childBirthDate, setChildBirthDate] = useState('');
  const [childrens, setChildrens] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    setRelationShipStatus(profileData.relationsheepStatus);
    setSpouseName(profileData.spouseName);
    setSpousePhoto(profileData.spousePhoto);
    setDateOfMarriage(
      profileData.dateOfMarriage !== undefined &&
        profileData.dateOfMarriage !== null &&
        profileData.dateOfMarriage !== '' &&
        profileData.dateOfMarriage !== 'Invalid date'
        ? profileData.dateOfMarriage
        : '',
    );
    setFatherName(profileData.fatherName);
    setMotherName(profileData.motherName);
    setChildrens(profileData.children);
    return () => {};
  }, [profileData]);

  const updateProfileDetails = () => {
    let requestData = {
      relationsheepStatus: relationShipStatus,
      dateOfMarriage: dateOfMarriage,
      fatherName: fatherName,
      motherName: motherName,
      spousePhoto: spousePhoto,
      spouseName: spouseName,
      children: childrens,
    };
    if (global.isConnected) {
      setIsLoading(true);
      updateUserProfile(
        requestData,
        (response) => {
          setIsLoading(false);
          console.log('updateUserProfile', response);
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.response !== null
            ) {
              let data = response.data;
              if (data.status) {
                props.updateData(data.data);
                setTimeout(() => {
                  props.onSaveTab();
                }, 500);
              }
            }
          }
        },
        (error, message) => {
          setIsLoading(false);
          responseMessage = message;
          setShowContactUsModal(!showContactUsModal);
        },
      );
    }
  };

  const inputHandler = (fieldName, fieldValue) => {
    if (fieldName === 'spouseName') {
      setSpouseName(fieldValue);
    } else if (fieldName === 'fatherName') {
      setFatherName(fieldValue);
    } else if (fieldName === 'motherName') {
      setMotherName(fieldValue);
    } else if (fieldName === 'childName') {
      setChildName(fieldValue);
    }
  };

  const generateHeader = (title, required) => {
    return (
      <View style={[grid.rowdir, grid.alignItemsTop]}>
        <Text style={g.labeltext1}>{title}</Text>
        {required && <Text style={g.colorRed}>*</Text>}
      </View>
    );
  };

  const setSelectedDate = (dateVa) => {
    if (requestPicker === 1) {
      setDateOfMarriage(dateVa);
    } else if (requestPicker === 2) {
      setChildBirthDate(dateVa);
    }
  };

  const inflateLinks = ({index, item}) => {
    console.log('item', item);
    return (
      <EditLinksExperience
        indexName={index}
        mainTitle={item.childName}
        header={item.dob}
        subHeader={
          item.gender === '0'
            ? 'Female'
            : item.gender === '1'
            ? 'Male'
            : 'LGBTQIA'
        }
        image={item.childPhoto}
        onDeletePress={() => {
          lastSelectedIndex = index;
          props.removeIndex(() => {
            removeLink();
          });
        }}
        onEditPress={() => {
          setIsEdit(true);
          setErrorMessage({});
          lastSelectedIndex = index;
          setChildGender(item.gender);
          setChildName(item.childName);
          setChildPhoto(item.childPhoto);
          setChildBirthDate(item.dob);
          serverDate = item.dob;
        }}
        onImagePress={() => {
          imageArray = [{url: item.childPhoto}];
          setShowImageModal(!showImageModal);
        }}
      />
    );
  };

  const renderRadioButton = (radioObj) => {
    return radioObj.map((item, key) => {
      return (
        <View
          key={key}
          style={{
            marginEnd: scale(12),
            marginStart: scale(2),
            alignSelf: 'center',
          }}>
          <Radio
            item={item}
            title={item.label}
            onRadioSelect={(value) => {
              setChildGender(value.key);
            }}
            selected={item.selected}
            radioStyle={styles.radioCircle}
            selectedStyle={styles.selectedRb}
          />
        </View>
      );
    });
  };

  const addNewLink = (updateMode) => {
    if (childName.trim() === '') {
      setErrorMessage({childName: 'This field is required'});
      return;
    }
    let insertedItem = {
      childName: childName,
      dob: serverDate,
      gender: childGender,
      childPhoto: childPhoto,
    };
    if (updateMode) {
      let oldData = childrens;
      oldData[lastSelectedIndex] = insertedItem;
      setChildrens([...oldData]);
    } else {
      let oldData = childrens;
      oldData.push(insertedItem);
      setChildrens([...oldData]);
    }

    setIsEdit(false);
    setErrorMessage({});
    lastSelectedIndex = -1;
    requestPicker = -1;
    requestImagePicker = -1;
    profileUri = null;
    serverDate = '';
    setChildGender('1');
    setChildName('');
    setChildPhoto('');
    setChildBirthDate('');
  };

  const removeLink = () => {
    if (lastSelectedIndex > childrens.length) {
      return;
    }
    let oldData = childrens;
    oldData.splice(lastSelectedIndex, 1);
    setChildrens([...oldData]);
  };

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
      style={GlobalInclude.AppStyle.fill}>
      <View style={GlobalInclude.AppStyle.fill}>
        <KeyboardAwareScrollView
          style={[g.mt20, g.mb20]}
          showsVerticalScrollIndicator={false}>
          <View style={[grid.flex1, g.pb30]}>
            {showContactUsModal && (
              <GlobalInclude.ModalAlert
                status={showContactUsModal}
                header={responseMessage}
                okButton={'Okay'}
                okAction={() => {
                  setShowContactUsModal(false);
                }}
                closeAction={() => {
                  setShowContactUsModal(false);
                }}
              />
            )}

            {showDatePicker && Platform.OS === 'android' && (
              <DateTimePicker
                testID={'dateTimePicker'}
                value={new Date()}
                mode={'date'}
                display={'spinner'}
                maximumDate={new Date()}
                dateFormat={'day month year'}
                onChange={(event, selected) => {
                  const currentDate = selected || new Date();
                  let obj = Helper.formateDate(currentDate);
                  serverDate = obj.serverDate;
                  setShowDatePicker(Platform.OS === 'ios');
                  setSelectedDate(obj.serverDate);
                }}
                onTouchCancel={(event) => {
                  setShowDatePicker(false);
                }}
              />
            )}

            {showDatePicker && Platform.OS === 'ios' && (
              <DatePickerView
                onCloseAction={() => {
                  setShowDatePicker(false);
                }}
                onDateSelect={(obj) => {
                  serverDate = obj.serverDate;
                  setSelectedDate(obj.serverDate);
                  setShowDatePicker(false);
                }}
              />
            )}

            {showStatus && (
              <YearSelection
                title={'Relationship Status'}
                yearList={generateOptionList(relationShipStatus)}
                onItemSelect={(value) => {
                  setRelationShipStatus(value.key);
                  setShowStatus(false);
                }}
                onCloseAction={() => {
                  setShowStatus(false);
                }}
              />
            )}

            {generateHeader('Relationship Status', false)}
            <View style={{marginBottom: scale(5)}} />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setShowStatus(true);
              }}
              style={[grid.rowdir, grid.alignItems, g.inputWhite, g.mb15]}>
              <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
                {relationShipStatus}
              </Text>
              <View style={[styles.triangleShape, props.arrowColor]} />
            </TouchableOpacity>

            <View style={g.mb15}>
              {generateHeader('Spouse Name', false)}
              <View style={{marginBottom: scale(5)}} />
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Spouse Name'}
                value={spouseName}
                onChangeText={(value) => inputHandler('spouseName', value)}
              />
              {errorMessage.spouseName &&
                errorMessage.spouseName.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.spouseName}
                  </Text>
                )}
            </View>

            <View style={g.mb15}>
              {generateHeader('Spouse Photo', false)}
              <View style={{marginBottom: scale(5)}} />
              <TouchableOpacity
                onPress={() => {
                  requestImagePicker = 1;
                  if (
                    uploadRef &&
                    uploadRef !== null &&
                    uploadRef !== undefined &&
                    uploadRef.current !== undefined &&
                    uploadRef.current !== null
                  ) {
                    uploadRef.current.open();
                  }
                }}
                style={[grid.row, g.shareStyle, grid.alignItems, g.pr10]}>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={[g.inputWhite, g.bw0, grid.col]}
                  placeholder={'Spouse Photo'}
                  value={spousePhoto !== '' ? 'Image Uploaded' : 'Select Photo'}
                  editable={false}
                />
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(22), width: scale(22)}}
                  iconColor={'#bababa'}
                  iconName={'download'}
                  iconSize={scale(22)}
                  iconType={IconType[4]}
                />
              </TouchableOpacity>
              {errorMessage.spousePhoto &&
                errorMessage.spousePhoto.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.spousePhoto}
                  </Text>
                )}
            </View>

            <View style={g.mb15}>
              {generateHeader('Date of Marriage', false)}
              <View style={{marginBottom: scale(5)}} />
              <TouchableOpacity
                style={[g.inputWhite]}
                onPress={() => {
                  requestPicker = 1;
                  setShowDatePicker(true);
                }}>
                <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
                  {dateOfMarriage}
                </Text>
                <View
                  style={{position: 'absolute', right: 10, top: 12, zIndex: 2}}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(22), width: scale(22)}}
                    iconColor={'#bababa'}
                    iconName={'calendar'}
                    iconSize={scale(22)}
                    iconType={IconType[4]}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={g.mb15}>
              {generateHeader('Father Name', false)}
              <View style={{marginBottom: scale(5)}} />
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Father Name'}
                value={fatherName}
                onChangeText={(value) => inputHandler('fatherName', value)}
              />
              {errorMessage.fatherName &&
                errorMessage.fatherName.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.fatherName}
                  </Text>
                )}
            </View>

            <View style={g.mb15}>
              {generateHeader('Mother Name', false)}
              <View style={{marginBottom: scale(5)}} />
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Mother Name'}
                value={motherName}
                onChangeText={(value) => inputHandler('motherName', value)}
              />
              {errorMessage.motherName &&
                errorMessage.motherName.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.motherName}
                  </Text>
                )}
            </View>

            <View style={g.mb15}>
              {generateHeader('My Child Name', false)}
              <View style={{marginBottom: scale(5)}} />
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Child Name'}
                value={childName}
                onChangeText={(value) => inputHandler('childName', value)}
              />
              {errorMessage.childName && errorMessage.childName.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.childName}
                </Text>
              )}
            </View>

            <View style={g.mb15}>
              {generateHeader('Child Photo', false)}
              <View style={{marginBottom: scale(5)}} />
              <TouchableOpacity
                onPress={() => {
                  requestImagePicker = 2;
                  if (
                    uploadRef &&
                    uploadRef !== null &&
                    uploadRef !== undefined &&
                    uploadRef.current !== undefined &&
                    uploadRef.current !== null
                  ) {
                    uploadRef.current.open();
                  }
                }}
                style={[grid.row, g.shareStyle, grid.alignItems, g.pr10]}>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={[g.inputWhite, g.bw0, grid.col]}
                  placeholder={'Child Photo'}
                  value={childPhoto !== '' ? 'Image Uploaded' : 'Select Photo'}
                  editable={false}
                />
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(22), width: scale(22)}}
                  iconColor={'#bababa'}
                  iconName={'download'}
                  iconSize={scale(22)}
                  iconType={IconType[4]}
                />
              </TouchableOpacity>
              {errorMessage.childPhoto &&
                errorMessage.childPhoto.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.childPhoto}
                  </Text>
                )}
            </View>

            <View style={g.mb15}>
              {generateHeader('Date of Birth', false)}
              <View style={{marginBottom: scale(5)}} />
              <TouchableOpacity
                style={[g.inputWhite]}
                onPress={() => {
                  requestPicker = 2;
                  setShowDatePicker(true);
                }}>
                <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
                  {childBirthDate}
                </Text>
                <View
                  style={{position: 'absolute', right: 10, top: 12, zIndex: 2}}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(22), width: scale(22)}}
                    iconColor={'#bababa'}
                    iconName={'calendar'}
                    iconSize={scale(22)}
                    iconType={IconType[4]}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {generateHeader('Gender', false)}
            <View style={[grid.rowdir, grid.flex1, g.mt5]}>
              {renderRadioButton(createGenderRadioButtons(childGender))}
            </View>

            <View>
              <View style={[grid.row, g.mt20, grid.justifyContentRight]}>
                {!isEdit ? (
                  <Text
                    style={[g.btn, {width: scale(80)}]}
                    onPress={(e) => {
                      addNewLink(false);
                    }}>
                    Add
                  </Text>
                ) : (
                  <Text
                    style={g.btn}
                    onPress={(e) => {
                      addNewLink(true);
                    }}>
                    Update
                  </Text>
                )}
              </View>
            </View>

            {childrens.length > 0 && (
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={childrens}
                renderItem={inflateLinks}
              />
            )}
          </View>
        </KeyboardAwareScrollView>
        <NextPreviousButton
          isLoading={isLoading}
          nextTitle={'Finish'}
          onPreviuosTab={() => {
            props.onPreviuosTab();
          }}
          onSaveTab={() => {
            //props.onSaveTab();
            updateProfileDetails();
          }}
        />

        {showImageModal && (
          <ZoomImage
            mediaContent={imageArray}
            onClose={() => {
              setShowImageModal(!showImageModal);
            }}
          />
        )}

        <UploadMedia
          refRBSheet={uploadRef}
          media={{
            image: false,
            video: true,
            document: true,
            audio: true,
          }}
          navigation={props.navigation}
          supportMultiple={false}
          onPickMedia={(media) => {
            uploadRef.current.close();
            if (media !== undefined && media !== null) {
              console.log('media', media);
              if (requestImagePicker === 1) {
                setSpousePhoto(media[0].thumbnail);
              } else if (requestImagePicker === 2) {
                setChildPhoto(media[0].thumbnail);
              }
            }
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  radioCircle: {
    height: scale(13),
    width: scale(13),
    borderRadius: 100,
    borderWidth: scale(1.5),
    borderColor: GlobalInclude.Color.ColorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(5),
  },
  selectedRb: {
    height: scale(6),
    width: scale(6),
    borderRadius: scale(30),
    backgroundColor: GlobalInclude.Color.ColorPrimary,
  },
  triangleShape: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#dddddd',
    marginLeft: 8,
  },
});

export default MyFamily;
