import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {launchImageLibrary} from 'react-native-image-picker';
import GlobalInclude from '../../globalInclude/Globalinclude';
import Helper from '../../helper/Helper';
import {IconType} from '../../helper/Constants';
import Radio from '../../component/Radio';
import CommonButton from '../../component/CommonButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BloodGroupSheet from 'react-native-raw-bottom-sheet';
import ProfessionSheet from 'react-native-raw-bottom-sheet';
import CountryListSheet from 'react-native-raw-bottom-sheet';
import StateListSheet from 'react-native-raw-bottom-sheet';
import CityListSheet from 'react-native-raw-bottom-sheet';
import RadioButton from '../../component/RadioButton';
import BottomSheetHeader from '../../component/BottomSheetHeader';
import CountryPicker from 'react-native-country-picker-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePickerView from '../../component/DatePickerView';
import RNFetchBlob from 'rn-fetch-blob';
import {getCountries, getStates, getCities} from '../../Actions/CommonActions';
import {
  getProfessionList,
  uploadProfilePic,
  updateUserProfile,
} from '../../Actions/UserActions';

let profileUri = null;
let stringDate = '';
let birthDate = '';
let bloodGroupSheet = null;
let professionSheet = null;
let countryListSheet = null;
let stateListSheet = null;
let cityListSheet = null;

let professionListMain = [];
let countryListMain = [],
  selectedCountryItem = null,
  stateListMain = [],
  selectedStateItem = null,
  cityListMain = [],
  selectedCityItem = null;

let isCountrySelected = false,
  isStateSelected = false,
  isCitySelected = false;

let pickerSelectionType = -1;
let responseMessage = '';
let height = Dimensions.get('window').height;

const options = {
  title: 'Select Image',
  noData: true,
  maxWidth: 720,
  maxHeight: 1024,
  allowsEditing: false,
  storageOptions: {
    skipBackup: true,
    path: 'images',
    cameraRoll: true,
    waitUntilSaved: true,
  },
};

const concatSchoolAndHouse = (profileData) => {
  let string = '';

  string =
    profileData.house.toLowerCase().charAt(0).toUpperCase() +
    profileData.house.toLowerCase().slice(1);

  if (profileData.section && profileData.section !== undefined) {
    string = string + ' ' + profileData.section;
  }
  return string;
};

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
  ];
};

const createPrimaryVisibilityRadio = (value) => {
  //0- no one 1 - everyone 2 - batchonly
  return [
    {
      key: '1',
      label: 'Everyone',
      selected: value === 1 || false,
    },
    {
      key: '2',
      label: 'Batch Only',
      selected: value === 2 || false,
    },
    {
      key: '0',
      label: 'No One',
      selected: value === 0 || false,
    },
  ];
};

const BasicProfile = (props) => {
  const {profileData} = props;

  // step 1
  const [prefix, setPrefix] = useState('');
  const [petName, setPetName] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bloodGroup, setBloodGroup] = useState('');
  const [lgbtqia, setLgbtqia] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [selectedDate, setSelectedDate] = useState('N/A');
  const [professionList, setProfessionList] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [designation, setDesignation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [showCodePicker, setShowCodePicker] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [phoneScope, setPhoneScope] = useState('');
  const [email, setEmail] = useState('');
  const [emailScope, setEmailScope] = useState('');
  const [secondaryCountryCode, setSecondaryCountryCode] = useState('');
  const [secondaryPhoneScope, setSecondaryPhoneScope] = useState('');
  const [secondaryPhone, setsecondaryPhone] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [secondaryEmailScope, setSecondaryEmailScope] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [isSameAddress, setIsSameAddress] = useState('');
  const [correspondenceAddress, setCorrespondenceAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [showContactUsModal, setShowContactUsModal] = useState(false);

  useEffect(() => {
    profileUri = null;
    stringDate = 'N/A';
    birthDate = '';
    professionListMain = [];
    countryListMain = [];
    selectedCountryItem = null;
    stateListMain = [];
    selectedStateItem = null;
    cityListMain = [];
    selectedCityItem = null;
    isCountrySelected = false;
    isStateSelected = false;
    isCitySelected = false;
    pickerSelectionType = -1;
    responseMessage = '';

    setPrefix(profileData.prefix);
    setPetName(profileData.petName);

    let group = '';
    if (profileData.bloodGroup === "i don't know") {
      group = "I Don't Know";
    } else {
      group = profileData.bloodGroup.toUpperCase();
    }
    setBloodGroup(group);
    setLgbtqia(profileData.lgbtqia);
    setSelectedGender(profileData.gender.toString());
    setProfileImg(profileData.profileImg);
    if (
      profileData.dob &&
      profileData.dob !== undefined &&
      profileData.dob !== '' &&
      profileData.dob !== 'Invalid date'
    ) {
      var formatedDate = new Date(profileData.dob);
      let month = '';
      if (formatedDate.getMonth() + 1 < 10) {
        month = '0' + (formatedDate.getMonth() + 1).toString();
      } else {
        month = (formatedDate.getMonth() + 1).toString();
      }
      let date = '';

      if (formatedDate.getDate() < 10) {
        date = '0' + formatedDate.getDate().toString();
      } else {
        date = formatedDate.getDate().toString();
      }
      stringDate = `${date}/${month}/${formatedDate.getFullYear()}`;

      birthDate = `${formatedDate.getFullYear()}/${month}/${date}`;
      console.log('sample', birthDate);
      setSelectedDate(stringDate);
    }

    let profession = '';
    if (profileData.profession.includes('-')) {
      let profArray = profileData.profession.split('-');
      profession = profArray.length > 2 ? profArray[2] : profileData.profession;
    } else {
      profession = profileData.profession;
    }
    setSelectedProfession(profession);
    setDesignation(profileData.designation);
    setCompanyName(profileData.company);
    setLinkedInUrl(profileData.linkedinUrl);
    setSelectedCountry(profileData.country);
    setSelectedState(profileData.state);
    setSelectedCity(profileData.city);
    setPincode(profileData.pincode);
    setCountryCode(profileData.countryCode);
    setPrimaryPhone(profileData.phone);
    setPhoneScope(profileData.phoneScope);
    setEmail(profileData.email);
    setEmailScope(profileData.emailScope);
    setSecondaryCountryCode(
      profileData.secondaryCountryCode === undefined
        ? ''
        : profileData.secondaryCountryCode,
    );
    setSecondaryPhoneScope(profileData.secondaryPhoneScope);
    setsecondaryPhone(profileData.secondaryPhone);

    setSecondaryEmail(
      profileData.secondaryEmail === undefined
        ? ''
        : profileData.secondaryEmail,
    );
    setSecondaryEmailScope(profileData.secondaryEmailScope);

    setPermanentAddress(profileData.permanentAddress);
    setIsSameAddress(profileData.isSameAddress);
    setCorrespondenceAddress(
      profileData.isSameAddress
        ? profileData.permanentAddress
        : profileData.correspondenceAddress,
    );

    if (global.isConnected) {
      getProfession();

      selectedStateItem = profileData.state;
      if (profileData.state.trim() !== '') {
        isStateSelected = true;
      }

      selectedCityItem = profileData.city;
      if (profileData.city.trim() !== '') {
        isCitySelected = true;
      }

      selectedCountryItem = profileData.country;
      if (profileData.country.trim() !== '') {
        isCountrySelected = true;
      }
      getCountryList();
    }
  }, [profileData]);

  /**
   *
   * API Section start
   *
   */

  const getProfession = () => {
    getProfessionList(
      (response) => {
        //console.log('getProfessionList', response);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let professions = [];
              if (data.data !== null) {
                data.data.map((item, index) => {
                  professions.push({key: index, text: item});
                });
              }
              professionListMain = professions;
              setProfessionList(professions);
            }
          }
        }
      },
      (error) => {
        console.log('error', error);
      },
    );
  };

  const uploadProfile = () => {
    let body = [];

    if (profileUri !== null) {
      setIsLoading(true);
      var path = profileUri.uri;
      let imageName = '';
      if (
        profileUri.fileName === undefined ||
        profileUri.fileName == null ||
        profileUri.fileName === ''
      ) {
        var getFilename = path.split('/');
        imageName = getFilename[getFilename.length - 1];
        var extension = imageName.split('.')[1];
        imageName = new Date().getTime() + '.' + extension;
      } else {
        imageName = profileUri.fileName;
      }

      let imagePath =
        Platform.OS === 'ios' ? path.replace('file://', '') : path;

      let imageType = profileUri.type;

      var imageData = {
        name: 'image',
        filename: imageName,
        type: imageType,
        data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
      };
      body.push(imageData);

      uploadProfilePic(
        body,
        (response) => {
          setIsLoading(false);
          //console.log('response', response);
          if (response && response !== undefined && response !== null) {
            if (response.status) {
              if (response.data && response.data !== null) {
                let childData = response.data.data;
                setProfileImg(childData);
                //props.updateData('profileImg', childData);
              }
            }
          }
        },
        (error) => {
          setIsLoading(false);
          console.log('error', error);
        },
      );
    }
  };

  const getCountryList = () => {
    if (!isCountrySelected) {
      setIsLoading(true);
    }

    getCountries(
      (response) => {
        setIsLoading(false);
        //console.log('getCountryList', response);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let countries = [];
              if (data.data.data !== null) {
                data.data.data.map((item, index) => {
                  countries.push({key: item.id, text: item.name});
                });
              }
              countryListMain = countries;
              setCountryList(countries);
            }
          }
        }
        isCountrySelected = false;
        if (isStateSelected) {
          getStateList();
        }
      },
      (error) => {
        isCountrySelected = false;
        console.log('error', error);
        setIsLoading(false);
      },
    );
  };

  const getStateList = () => {
    if (!isStateSelected) {
      setIsLoading(true);
    }

    getStates(
      selectedCountryItem,
      (response) => {
        //console.log('getStateList', response);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let states = [];
              if (data.data !== null) {
                data.data.map((item, index) => {
                  states.push({key: item.id, text: item.name});
                });
              }
              stateListMain = states;
              setStateList(states);
            }
          }
        }
        setIsLoading(false);
        isStateSelected = false;
        if (isCitySelected) {
          getCityList();
        }
      },
      (error) => {
        isStateSelected = false;
        console.log('error', error);
        setIsLoading(false);
      },
    );
  };

  const getCityList = () => {
    if (!isCitySelected) {
      setIsLoading(true);
    }

    getCities(
      selectedStateItem,
      (response) => {
        //console.log('getCityList', response);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let cities = [];
              if (data.data !== null) {
                data.data.map((item, index) => {
                  cities.push({key: item.id, text: item.name});
                });
              }
              cityListMain = cities;
              setCityList(cities);
            }
          }
        }
        setIsLoading(false);
        isCitySelected = false;
      },
      (error) => {
        console.log('error', error);
        setIsLoading(false);
        isCitySelected = false;
      },
    );
  };

  const updateProfileDetails = () => {
    setErrorMessage({});
    /*
      if (selectedDate.trim() === '') {
      setErrorMessage({emptyBirthDate: 'This field is required!'});
    } else
    */

    if (selectedGender === '') {
      setErrorMessage({emptyGender: 'This field is required!'});
    } else if (selectedProfession === '') {
      setErrorMessage({profession: 'This field is required!'});
    } else if (selectedCountry === '') {
      setErrorMessage({country: 'This field is required!'});
    } else if (selectedState === '') {
      setErrorMessage({state: 'This field is required!'});
    } else if (selectedCity === '') {
      setErrorMessage({city: 'This field is required!'});
    } else {
      let requestData = {
        dob: birthDate,
        lgbtqia: lgbtqia,
        gender: selectedGender, // default will be male 0= female ,1= male
        profession: selectedProfession,
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
        phoneScope: phoneScope,
        emailScope: emailScope,
        secondaryPhoneScope: secondaryPhoneScope,
        secondaryEmailScope: secondaryEmailScope,
        isSameAddress: isSameAddress,
      };

      if (prefix !== undefined && prefix !== null) {
        requestData.prefix = prefix;
      }

      if (petName !== undefined && petName !== null) {
        requestData.petName = petName;
      }

      if (bloodGroup !== undefined && bloodGroup !== null) {
        requestData.bloodGroup = bloodGroup;
      }

      if (designation !== undefined && designation !== null) {
        requestData.designation = designation;
      }

      if (companyName !== undefined && companyName !== null) {
        requestData.company = companyName;
      }

      if (linkedInUrl !== undefined && linkedInUrl !== null) {
        requestData.linkedinUrl = linkedInUrl;
      }

      if (pincode !== undefined && pincode !== null) {
        requestData.pincode = pincode;
      }

      if (profileImg !== undefined && profileImg !== null) {
        requestData.profileImg = profileImg;
      }

      if (secondaryCountryCode !== undefined && secondaryCountryCode !== null) {
        requestData.secondaryCountryCode = secondaryCountryCode;
      }

      if (secondaryPhone !== undefined && secondaryPhone !== null) {
        requestData.secondaryPhone = secondaryPhone;
      }

      if (secondaryEmail !== undefined && secondaryEmail !== null) {
        requestData.secondaryEmail = secondaryEmail;
      }

      if (permanentAddress !== undefined && permanentAddress !== null) {
        requestData.permanentAddress = permanentAddress;
      }

      if (
        correspondenceAddress !== undefined &&
        correspondenceAddress !== null
      ) {
        requestData.correspondenceAddress = correspondenceAddress;
      }

      if (global.isConnected) {
        setIsLoading(true);
        updateUserProfile(
          requestData,
          (response) => {
            setIsLoading(false);
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
    }
  };

  /**
   *
   * API Section end
   *
   */

  const updateAddress = () => {
    var isSame = isSameAddress;
    setIsSameAddress(isSame ? false : true);
    if (!isSame) {
      setCorrespondenceAddress(permanentAddress);
    }
  };

  const launchImagePicker = () => {
    launchImageLibrary(options, (res) => {
      if (res) {
        if (res !== null) {
          if (res.didCancel) {
            Alert.alert('Cancel Image Selection!');
          } else {
            profileUri = res;
            if (global.isConnected) {
              uploadProfile();
            }
          }
        }
      }
    });
  };

  const renderRadioButton = (radioObj, type) => {
    return radioObj.map((item, key) => {
      return (
        <View key={key} style={styles.radioStyle}>
          <Radio
            item={item}
            title={item.label}
            onRadioSelect={(value) => {
              if (type === 1) {
                setSelectedGender(value.key);
              } else if (type === 2) {
                setPhoneScope(value.key);
              } else if (type === 3) {
                setEmailScope(value.key);
              } else if (type === 4) {
                setSecondaryPhoneScope(value.key);
              } else if (type === 5) {
                setSecondaryEmailScope(value.key);
              }
            }}
            selected={item.selected}
            radioStyle={styles.radioCircle}
            selectedStyle={styles.selectedRb}
          />
        </View>
      );
    });
  };

  const inputHandler = (fieldName, fieldValue) => {
    if (fieldName === 'prefix') {
      setPrefix(fieldValue);
    } else if (fieldName === 'petName') {
      setPetName(fieldValue);
    } else if (fieldName === 'company') {
      setCompanyName(fieldValue);
    } else if (fieldName === 'designation') {
      setDesignation(fieldValue);
    } else if (fieldName === 'pinCode') {
      setPincode(fieldValue);
    } else if (fieldName === 'email') {
      setEmail(fieldValue);
    } else if (fieldName === 'secondaryEmail') {
      setSecondaryEmail(fieldValue);
    } else if (fieldName === 'permanentAddress') {
      setPermanentAddress(fieldValue);
    } else if (fieldName === 'correspondenceAddress') {
      setCorrespondenceAddress(fieldValue);
    } else if (fieldName === 'primaryPhone') {
      setPrimaryPhone(fieldValue);
    } else if (fieldName === 'secondaryPhone') {
      setsecondaryPhone(fieldValue);
    } else if (fieldName === 'linkedin') {
      setLinkedInUrl(fieldValue);
    }
  };

  /*
   * search section
   */
  const searchProfession = (searchText) => {
    let oldContent = professionList;
    var list = [];
    if (searchText.length > 0) {
      oldContent.forEach((element) => {
        if (element.text.toLowerCase().includes(searchText.toLowerCase())) {
          list.push(element);
        }
      });
      setProfessionList([...list]);
    } else {
      setProfessionList([...professionListMain]);
    }
  };

  const searchCountry = (searchText) => {
    let oldContent = countryList;
    var list = [];
    if (searchText.length > 0) {
      oldContent.forEach((element) => {
        if (element.text.toLowerCase().includes(searchText.toLowerCase())) {
          list.push(element);
        }
      });
      setCountryList([...list]);
    } else {
      setCountryList([...countryListMain]);
    }
  };

  const searchState = (searchText) => {
    let oldContent = stateList;
    var list = [];
    if (searchText.length > 0) {
      oldContent.forEach((element) => {
        if (element.text.toLowerCase().includes(searchText.toLowerCase())) {
          list.push(element);
        }
      });
      setStateList([...list]);
    } else {
      setStateList([...stateListMain]);
    }
  };

  const searchCity = (searchText) => {
    let oldContent = cityList;
    var list = [];
    if (searchText.length > 0) {
      oldContent.forEach((element) => {
        if (element.text.toLowerCase().includes(searchText.toLowerCase())) {
          list.push(element);
        }
      });
      setCityList([...list]);
    } else {
      setCityList([...cityListMain]);
    }
  };
  /*
   * search section end
   */

  const openCounryCodePicker = (type) => {
    pickerSelectionType = type;
    setShowCodePicker(!showCodePicker);
  };

  const closeCodePicker = () => {
    setShowCodePicker(!showCodePicker);
  };

  const onSelectCountry = (country) => {
    setShowCodePicker(!showCodePicker);
    let code = '+' + country.callingCode[0];
    if (pickerSelectionType === 1) {
      setCountryCode(code);
    } else if (pickerSelectionType === 2) {
      setSecondaryCountryCode(code);
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

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
      style={GlobalInclude.AppStyle.fill}>
      <View style={GlobalInclude.AppStyle.fill}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          style={[g.mt20, g.mb20, grid.flex1]}
          showsVerticalScrollIndicator={false}>
          <View style={[grid.flex1, g.pb30]}>
            {/* fail error alert */}
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
                  birthDate = obj.serverDate;
                  setShowDatePicker(Platform.OS === 'ios');
                  setSelectedDate(obj.displayDate);
                }}
                onTouchCancel={(event) => {
                  setShowDatePicker(false);
                }}
              />
            )}

            {showDatePicker && Platform.OS === 'ios' && (
              <DatePickerView
                maxDate={new Date()}
                onCloseAction={() => {
                  setShowDatePicker(false);
                }}
                onDateSelect={(obj) => {
                  birthDate = obj.serverDate;
                  setShowDatePicker(false);
                  setSelectedDate(obj.displayDate);
                }}
              />
            )}

            <Text style={[g.fs18, g.FHNB, g.mb15, g.colorBlack, g.txtCenter]}>
              Choose a Profile Photo
            </Text>
            <View style={[grid.alignItems, g.mb15]}>
              <TouchableOpacity
                style={g.mb5}
                activeOpacity={1}
                onPress={(e) => {
                  launchImagePicker();
                }}>
                <View style={styles.profileImg}>
                  {profileImg !== '' ? (
                    <Image
                      style={{aspectRatio: 1 / 1}}
                      resizeMode="cover"
                      source={{uri: profileImg}}
                    />
                  ) : (
                    <Image
                      style={{height: scale(135), width: scale(135)}}
                      resizeMode="cover"
                      source={GlobalInclude.Assets.AppLogo}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <Text style={[g.fs16, g.FHNB, g.mb20, g.colorBlack, g.txtCenter]}>
                Pick a photo of your profile
              </Text>
              {profileImg !== '' ? (
                <View style={[grid.rowdir, grid.justifyContentCenter]}>
                  <TouchableOpacity
                    style={[g.btnL, {width: scale(150), height: scale(40)}]}
                    onPress={(e) => {
                      launchImagePicker();
                    }}
                    activeOpacity={0.8}>
                    <Text style={[g.colorWhite, g.FHNR, g.fs15, g.txtCenter]}>
                      Upload Photo
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            <Text
              style={[
                g.fs18,
                g.FHNB,
                g.colorBlack,
                {marginVertical: scale(20)},
              ]}>
              My name is...
            </Text>
            <View style={[grid.rowdir, g.mb15]}>
              <View style={[grid.col, g.mr5]}>
                {generateHeader('Prefix', false)}
                <TextInput
                  underlineColorAndroid="transparent"
                  style={g.inputWhite}
                  value={prefix}
                  placeholder="Enter your text here"
                  onChangeText={(value) => inputHandler('prefix', value)}
                />
              </View>
              <View style={[grid.col, g.ml5]}>
                {generateHeader('Nickname', false)}

                <TextInput
                  underlineColorAndroid="transparent"
                  style={g.inputWhite}
                  value={petName}
                  placeholder="Enter your text here"
                  onChangeText={(value) => inputHandler('petName', value)}
                />
              </View>
            </View>
            <View style={[grid.rowdir]}>
              <View style={[grid.col, g.mr5]}>
                {generateHeader('First Name', true)}
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    Helper.contactToSchool('Primary');
                    console.log('touched');
                  }}>
                  <Text style={g.inputWhite}>{profileData.firstName}</Text>
                </TouchableOpacity>
              </View>
              <View style={[grid.col, g.ml5]}>
                {generateHeader('Middle and Last Name', true)}
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => Helper.contactToSchool('Primary')}>
                  <Text style={g.inputWhite}>
                    {profileData.middleName &&
                    profileData.middleName !== undefined
                      ? ` ${profileData.middleName} ${profileData.lastName}`
                      : profileData.lastName}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* school details */}
            <Text
              style={[
                g.fs18,
                g.FHNB,
                g.colorBlack,
                {marginVertical: scale(20)},
              ]}>
              School Details...
            </Text>
            <View style={[grid.rowdir, g.mb15]}>
              <View style={[grid.col, g.mr5]}>
                {generateHeader('Batch', true)}
                <TouchableOpacity
                  activeOpacity={1}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                  onPress={() => Helper.contactToSchool('Batch')}
                  style={[grid.rowdir, grid.alignItems, g.inputWhite]}>
                  <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
                    {profileData.batch}
                  </Text>
                  <View style={styles.triangleShape} />
                </TouchableOpacity>
              </View>
              <View style={[grid.col, g.ml5]}>
                {generateHeader('School Number', true)}
                <TouchableOpacity
                  activeOpacity={1}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                  onPress={() => Helper.contactToSchool('School Number')}
                  style={[grid.rowdir, grid.alignItems, g.inputWhite]}>
                  <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
                    {profileData.schoolNumber}
                  </Text>
                  <View style={styles.triangleShape} />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              {generateHeader('House', true)}
              <TouchableOpacity
                activeOpacity={1}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                onPress={() => Helper.contactToSchool('House')}
                style={[grid.rowdir, grid.alignItems, g.inputWhite]}>
                <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
                  {concatSchoolAndHouse(profileData)}
                </Text>
                <View style={styles.triangleShape} />
              </TouchableOpacity>
            </View>
            {/* personal info */}
            <Text
              style={[
                g.fs18,
                g.FHNB,
                g.colorBlack,
                {marginVertical: scale(20)},
              ]}>
              Personal Info...
            </Text>
            <View style={g.mb15}>
              <View style={grid.rowdir}>
                <View style={[{width: scale(108)}, g.mr2]}>
                  {generateHeader('DOB', false)}
                  <TouchableOpacity
                    style={g.inputWhite}
                    onPress={() => {
                      setShowDatePicker(true);
                    }}>
                    <Text
                      style={[
                        grid.col,
                        g.FHNR,
                        grid.justifyContentCenter,
                        {textAlignVertical: 'center'},
                      ]}
                      numberOfLines={1}>
                      {selectedDate}
                    </Text>
                    <View
                      style={{
                        position: 'absolute',
                        right: 5,
                        top: 12,
                        zIndex: 2,
                      }}>
                      <GlobalInclude.BaseIcon
                        containerStyle={{height: scale(16), width: scale(16)}}
                        iconColor={'#bababa'}
                        iconName={'calendar'}
                        iconSize={scale(16)}
                        iconType={IconType[4]}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[grid.col, g.ml2]}>
                  {generateHeader('Gender', true)}
                  <View style={[grid.rowdir, grid.flex1]}>
                    {renderRadioButton(
                      createGenderRadioButtons(selectedGender),
                      1,
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        setLgbtqia(!lgbtqia);
                      }}
                      style={styles.lgbtqia}
                      activeOpacity={1}>
                      <View style={styles.otherGenderContainer}>
                        {lgbtqia ? (
                          <GlobalInclude.BaseIcon
                            containerStyle={{
                              height: scale(14),
                              width: scale(14),
                            }}
                            iconColor={GlobalInclude.Color.ColorPrimary}
                            iconName={'check-square'}
                            iconSize={scale(14)}
                            iconType={IconType[4]}
                          />
                        ) : (
                          <View style={styles.defaultOtherGender} />
                        )}
                      </View>
                      <Text style={[g.fs12, g.colorBlack, g.ml5]}>LGBTQIA</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {errorMessage.emptyBirthDate &&
                errorMessage.emptyBirthDate.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.emptyBirthDate}
                  </Text>
                )}
              {errorMessage.emptyGender &&
                errorMessage.emptyGender.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.emptyGender}
                  </Text>
                )}
            </View>
            <View>
              {generateHeader('Blood Group', false)}
              <TouchableOpacity
                activeOpacity={1}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                onPress={() => {
                  bloodGroupSheet.open();
                }}
                style={[grid.rowdir, grid.alignItems, g.inputWhite]}>
                <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
                  {bloodGroup}
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[
                g.fs18,
                g.FHNB,
                g.colorBlack,
                {marginVertical: scale(20)},
              ]}>
              Current Professional Details...
            </Text>
            <View style={g.mb15}>
              {generateHeader('Profession', true)}
              <TouchableOpacity
                style={g.inputWhite}
                onPress={() => {
                  professionSheet.open();
                }}>
                <Text>
                  {selectedProfession === ''
                    ? 'Select Profession'
                    : selectedProfession}
                </Text>
              </TouchableOpacity>
              {errorMessage.profession &&
                errorMessage.profession.length > 0 && (
                  <Text style={[g.errorMsg, g.fs12]}>
                    {errorMessage.profession}
                  </Text>
                )}
            </View>
            <View style={g.mb15}>
              {generateHeader('Designation', false)}
              <TextInput
                underlineColorAndroid="transparent"
                style={[g.inputWhite]}
                autoCapitalize="words"
                placeholder="Enter your text here"
                value={designation}
                onChangeText={(value) => inputHandler('designation', value)}
              />
            </View>
            <View style={g.mb15}>
              {generateHeader('Company', false)}
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                autoCapitalize="words"
                placeholder="Enter your text here"
                value={companyName}
                onChangeText={(value) => inputHandler('company', value)}
              />
            </View>
            <View>
              <Text style={[g.fs16, g.labeltext1]}>LinkedIn Url...</Text>
              <TextInput
                underlineColorAndroid="transparent"
                style={[g.inputWhite]}
                value={linkedInUrl}
                placeholder={'Enter your text here'}
                onChangeText={(value) => inputHandler('linkedin', value)}
              />
            </View>
            <Text
              style={[
                g.fs18,
                g.FHNB,
                g.colorBlack,
                {marginVertical: scale(20)},
              ]}>
              Current Location Details...
            </Text>
            <View style={g.mb15}>
              {generateHeader('Country', true)}
              <TouchableOpacity
                style={g.inputWhite}
                onPress={() => {
                  countryListSheet.open();
                }}>
                <Text>
                  {selectedCountry !== ''
                    ? selectedCountry.charAt(0).toUpperCase() +
                      selectedCountry.slice(1)
                    : 'Select Country'}
                </Text>
              </TouchableOpacity>
              {errorMessage.country && errorMessage.country.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>{errorMessage.country}</Text>
              )}
            </View>
            <View style={g.mb15}>
              {generateHeader('State', true)}
              <TouchableOpacity
                style={g.inputWhite}
                onPress={() => {
                  stateListSheet.open();
                }}>
                <Text style={{textTransform: 'capitalize'}}>
                  {selectedState !== '' ? selectedState : 'Select State'}
                </Text>
              </TouchableOpacity>
              {errorMessage.state && errorMessage.state.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>{errorMessage.state}</Text>
              )}
            </View>
            <View style={g.mb15}>
              {generateHeader('City', true)}
              <TouchableOpacity
                style={g.inputWhite}
                onPress={() => {
                  cityListSheet.open();
                }}>
                <Text>
                  {selectedCity !== ''
                    ? selectedCity.charAt(0).toUpperCase() +
                      selectedCity.slice(1)
                    : 'Select City'}
                </Text>
              </TouchableOpacity>
              {errorMessage.city && errorMessage.city.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>{errorMessage.city}</Text>
              )}
            </View>

            <View>
              {generateHeader('Pin No./Area Code', false)}
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                value={pincode}
                onChangeText={(pinCode) => inputHandler('pinCode', pinCode)}
                placeholder="Pincode"
                placeholderTextColor={'#6e6e6e'}
              />
            </View>
            <Text
              style={[
                g.fs18,
                g.FHNB,
                g.colorBlack,
                {marginVertical: scale(20)},
              ]}>
              Contact Details...
            </Text>
            {generateHeader('Primary Phone Number', false)}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                Helper.contactToSchool('Primary Phone Number');
              }}
              style={[
                grid.rowdir,
                g.bglightGray,
                g.mb15,
                {borderRadius: scale(6)},
              ]}>
              <View activeOpacity={1} style={[g.countryCode]}>
                <Text style={[g.colordarkGray, g.FHNR, g.txtCenter]}>
                  {countryCode}
                </Text>
              </View>
              <View style={[grid.col]}>
                <Text
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    justifyContent: 'center',
                    color: '#ddd',
                    backgroundColor: '#f8f8f8',
                    padding: scale(12),
                    height: scale(40),
                    fontSize: scale(15),
                    fontFamily: 'Lato-Regular',
                  }}>
                  {primaryPhone}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={g.mb15}>
              {generateHeader('Show My Phone Details to', false)}
              <View style={[grid.rowdir, grid.flex1, g.mt5]}>
                {renderRadioButton(
                  createPrimaryVisibilityRadio(parseInt(phoneScope, 10)),
                  2,
                )}
              </View>
            </View>
            <View style={g.mb15}>
              {generateHeader('Primary Email id', false)}
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  Helper.contactToSchool('Primary Email');
                }}
                style={g.inputWhite}>
                <Text
                  style={{
                    textAlign: 'left',
                    color: '#ddd',
                    fontSize: scale(16),
                  }}>
                  {email}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={g.mb15}>
              {generateHeader('Show My Email Details to', false)}
              <View style={[grid.rowdir, grid.flex1, g.mt5]}>
                {renderRadioButton(
                  createPrimaryVisibilityRadio(parseInt(emailScope, 10)),
                  3,
                )}
              </View>
            </View>
            <View style={g.mb15}>
              {generateHeader('Secondary Phone Number', false)}
              <View
                style={[grid.rowdir, g.bglightGray, {borderRadius: scale(6)}]}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={[g.countryCode]}
                  onPress={() => {
                    openCounryCodePicker(2);
                  }}>
                  <Text style={[g.colordarkGray, g.FHNR, g.txtCenter]}>
                    {secondaryCountryCode}
                  </Text>
                </TouchableOpacity>
                <View style={[grid.col]}>
                  <TextInput
                    autoCapitalize="none"
                    underlineColorAndroid="transparent"
                    style={[
                      g.inputGrayLogin,
                      g.mb0,
                      {borderTopLeftRadius: 0, borderBottomLeftRadius: 0},
                    ]}
                    editable={true}
                    maxLength={12}
                    keyboardType="phone-pad"
                    value={secondaryPhone}
                    placeholder="Phone Number"
                    onChangeText={(pinCode) =>
                      inputHandler('secondaryPhone', pinCode)
                    }
                    placeholderTextColor={'#ddd'}
                  />
                </View>
              </View>
            </View>
            <View style={g.mb15}>
              {generateHeader('Show My Phone Details to', false)}
              <View style={[grid.rowdir, grid.flex1, g.mt5]}>
                {renderRadioButton(
                  createPrimaryVisibilityRadio(
                    parseInt(secondaryPhoneScope, 10),
                  ),
                  4,
                )}
              </View>
            </View>
            <View style={g.mb15}>
              {generateHeader('Secondary Email id', false)}
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                value={secondaryEmail}
                onChangeText={(pinCode) =>
                  inputHandler('secondaryEmail', pinCode)
                }
                placeholder="Email Address"
                placeholderTextColor={'#6e6e6e'}
              />
            </View>
            <View>
              {generateHeader('Show My Email Details to', false)}
              <View style={[grid.rowdir, grid.flex1, g.mt5]}>
                {renderRadioButton(
                  createPrimaryVisibilityRadio(
                    parseInt(secondaryEmailScope, 10),
                  ),
                  5,
                )}
              </View>
            </View>
            <Text
              style={[
                g.fs18,
                g.FHNB,
                g.colorBlack,
                {marginVertical: scale(20)},
              ]}>
              Current Address Details...
            </Text>
            {generateHeader('Permanent Address', false)}
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={5}
              multiline={true}
              value={permanentAddress}
              style={[g.inputWhite, {height: 100, textAlignVertical: 'top'}]}
              onChangeText={(value) => inputHandler('permanentAddress', value)}
            />
            <View style={{marginVertical: scale(15)}}>
              <TouchableOpacity
                onPress={() => {
                  updateAddress();
                }}
                style={styles.isSameAddress}
                activeOpacity={1}>
                <View style={[grid.rowdir, grid.alignItems]}>
                  {isSameAddress ? (
                    <GlobalInclude.BaseIcon
                      containerStyle={{height: scale(16), width: scale(16)}}
                      iconColor={GlobalInclude.Color.ColorPrimary}
                      iconName={'check-square'}
                      iconSize={scale(16)}
                      iconType={IconType[4]}
                    />
                  ) : (
                    <View style={styles.defaultOtherGender} />
                  )}
                  <Text style={[g.labeltext1, g.ml5]}>
                    Set as Current Address
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {generateHeader('Current Address', false)}
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={5}
              multiline={true}
              style={[g.inputWhite, {height: 100, textAlignVertical: 'top'}]}
              value={correspondenceAddress}
              onChangeText={(pinCode) =>
                inputHandler('correspondenceAddress', pinCode)
              }
            />
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: scale(150),
            paddingTop: scale(10),
            paddingBottom: scale(10),
            alignContent: 'center',
            alignSelf: 'center',
          }}>
          <CommonButton
            showLoader={isLoading}
            title={'Save'}
            onPress={() => {
              updateProfileDetails();
            }}
          />
        </View>
        {/* country code picker */}
        {showCodePicker && (
          <CountryPicker
            withFilter={true}
            modalProps={{animationType: 'slide'}}
            visible
            onClose={() => {
              closeCodePicker();
            }}
            onSelect={(country) => {
              onSelectCountry(country);
            }}
          />
        )}

        {/* blood group sheet */}
        <BloodGroupSheet
          ref={(ref) => {
            bloodGroupSheet = ref;
          }}
          height={375}
          minClosingHeight={50}
          duration={350}
          closeOnDragDown={true}
          customStyles={{
            container: {
              backgroundColor: '#fff',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingStart: scale(15),
              paddingEnd: scale(15),
              paddingBottom: scale(20),
            },
          }}>
          <BottomSheetHeader title={'Select Blood Group'} showSearch={false} />

          <RadioButton
            defaultSelected={bloodGroup}
            PROP={Helper.getBloodGroup()}
            onRadioSelect={(value) => {
              setBloodGroup(value.text.toString());
              bloodGroupSheet.close();
            }}
          />
        </BloodGroupSheet>

        {/* profession sheet */}
        <ProfessionSheet
          ref={(ref) => {
            professionSheet = ref;
          }}
          height={height - 150}
          minClosingHeight={50}
          duration={350}
          closeOnDragDown={true}
          customStyles={{
            container: {
              backgroundColor: '#fff',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingStart: scale(15),
              paddingEnd: scale(15),
              paddingBottom: scale(20),
            },
          }}>
          <BottomSheetHeader
            title={'Select Profession'}
            showSearch={true}
            onSeachQuery={(query) => {
              searchProfession(query);
            }}
          />
          <RadioButton
            defaultSelected={selectedProfession}
            PROP={professionList}
            onRadioSelect={(value) => {
              setSelectedProfession(value.text.toString());
              professionSheet.close();
            }}
          />
        </ProfessionSheet>

        {/* country list sheet */}
        <CountryListSheet
          ref={(ref) => {
            countryListSheet = ref;
          }}
          height={height - 150}
          minClosingHeight={50}
          duration={350}
          closeOnDragDown={true}
          customStyles={{
            container: {
              backgroundColor: '#fff',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingStart: scale(15),
              paddingEnd: scale(15),
              paddingBottom: scale(20),
            },
          }}>
          <BottomSheetHeader
            title={'Select Country'}
            showSearch={true}
            onSeachQuery={(query) => {
              searchCountry(query);
            }}
          />

          <RadioButton
            capitalize={true}
            defaultSelected={selectedCountry}
            PROP={countryList}
            onRadioSelect={(value) => {
              if (selectedCountry.trim() === '') {
                setSelectedCountry(value.text);
                selectedCountryItem = value.text;
                setCountryList([...countryListMain]);
                setTimeout(() => {
                  //console.log('selectedCountry', selectedCountry);
                  getStateList();
                }, 500);
              } else {
                if (selectedCountry.trim() !== value.text) {
                  setSelectedCountry(value.text);
                  selectedCountryItem = value.text;
                  setSelectedState('');
                  setStateList([]);
                  selectedStateItem = null;

                  setSelectedCity('');
                  setCityList([]);
                  selectedCityItem = null;

                  setCountryList([...countryListMain]);
                  setTimeout(() => {
                    //console.log('selectedCountry', selectedCountry);
                    getStateList();
                  }, 500);
                }
              }
              countryListSheet.close();
            }}
          />
        </CountryListSheet>

        {/* state list sheet */}
        <StateListSheet
          ref={(ref) => {
            stateListSheet = ref;
          }}
          height={height - 150}
          minClosingHeight={50}
          duration={350}
          closeOnDragDown={true}
          customStyles={{
            container: {
              backgroundColor: '#fff',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingStart: scale(15),
              paddingEnd: scale(15),
              paddingBottom: scale(20),
            },
          }}>
          <BottomSheetHeader
            title={'Select State'}
            showSearch={true}
            onSeachQuery={(query) => {
              searchState(query);
            }}
          />

          <RadioButton
            capitalize={true}
            defaultSelected={selectedState}
            PROP={stateList}
            onRadioSelect={(value) => {
              if (selectedState.trim() === '') {
                setSelectedState(value.text.toString());
                setStateList([...stateListMain]);
                selectedStateItem = value.text;
                setTimeout(() => {
                  //console.log('selectedState', selectedState);
                  getCityList();
                }, 500);
              } else {
                if (selectedState.trim() !== value.text) {
                  setSelectedState(value.text.toString());
                  setStateList([...stateListMain]);
                  selectedStateItem = value.text;

                  setSelectedCity('');
                  setCityList([]);
                  selectedCityItem = null;
                  setTimeout(() => {
                    //console.log('selectedState', selectedState);
                    getCityList();
                  }, 500);
                }
              }
              stateListSheet.close();
            }}
          />
        </StateListSheet>

        {/* city list sheet */}
        <CityListSheet
          ref={(ref) => {
            cityListSheet = ref;
          }}
          height={height - 150}
          minClosingHeight={50}
          duration={350}
          closeOnDragDown={true}
          customStyles={{
            container: {
              backgroundColor: '#fff',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingStart: scale(15),
              paddingEnd: scale(15),
              paddingBottom: scale(20),
            },
          }}>
          <BottomSheetHeader
            title={'Select City'}
            showSearch={true}
            onSeachQuery={(query) => {
              searchCity(query);
            }}
          />

          <RadioButton
            capitalize={true}
            defaultSelected={selectedCity}
            PROP={cityList}
            onRadioSelect={(value) => {
              setSelectedCity(value.text.toString());
              setCityList([...cityListMain]);
              selectedCityItem = value.text;
              cityListSheet.close();
            }}
          />
        </CityListSheet>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  spacer: {marginVertical: scale(10)},
  spacerSmall: {marginVertical: scale(5)},
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
  radioCircle: {
    height: scale(15),
    width: scale(15),
    borderRadius: 100,
    borderWidth: scale(1.5),
    borderColor: GlobalInclude.Color.ColorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(3),
  },
  selectedRb: {
    height: scale(6),
    width: scale(6),
    borderRadius: scale(30),
    backgroundColor: GlobalInclude.Color.ColorPrimary,
  },
  otherGenderContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  defaultOtherGender: {
    width: scale(14),
    height: scale(14),
    backgroundColor: '#ced4da',
    borderRadius: 2,
  },
  profileImg: {
    height: scale(144),
    width: scale(144),
    borderRadius: scale(144),
    borderWidth: 3,
    borderColor: '#2b3252',
    overflow: 'hidden',
  },
  lgbtqia: {
    width: scale(110),
    flexDirection: 'row',
    alignItems: 'center',
  },
  isSameAddress: {
    width: scale(200),
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioStyle: {
    marginEnd: scale(8),
    marginStart: scale(2),
    alignSelf: 'center',
  },
});

export default BasicProfile;
