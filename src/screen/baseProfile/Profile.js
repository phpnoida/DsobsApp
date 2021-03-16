import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Linking,
  Keyboard,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import * as Progress from 'react-native-progress';
import GlobalInclude from '../../globalInclude/Globalinclude';
import Helper from '../../helper/Helper';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {CommonActions} from '@react-navigation/native';
import {APP_NAME, WHATSAPP_NO} from '../../helper/Constants';
import Globalinclude from '../../globalInclude/Globalinclude';
import BloodGroupSheet from 'react-native-raw-bottom-sheet';
import ProfessionSheet from 'react-native-raw-bottom-sheet';
import CountryListSheet from 'react-native-raw-bottom-sheet';
import StateListSheet from 'react-native-raw-bottom-sheet';
import CityListSheet from 'react-native-raw-bottom-sheet';
import RadioButton from '../../component/RadioButton';
import TabOne from './TabOne';
import TabTwo from './TabTwo';
import TabThree from './TabThree';
import TabFour from './TabFour';
import TabFive from './TabFive';
import TabSeven from './TabSeven';
import BottomSheetHeader from '../../component/BottomSheetHeader';
import {
  getUserProfile,
  getProfessionList,
  uploadProfilePic,
  updateUserProfile,
} from '../../Actions/UserActions';
import {getCountries, getStates, getCities} from '../../Actions/CommonActions';
import RNFetchBlob from 'rn-fetch-blob';
let firstName = '',
  middleName = '',
  lastName = '',
  likedinPlaceholder = '',
  professionListMain = [],
  countryListMain = [],
  selectedCountryItem = null,
  stateListMain = [],
  selectedStateItem = null,
  cityListMain = [],
  selectedCityItem = null,
  profileUri = null,
  birthDate = '',
  isCountrySelected = false,
  isStateSelected = false,
  isCitySelected = false;

let bloodGroupSheet = null;
let professionSheet = null;
let countryListSheet = null;
let stateListSheet = null;
let cityListSheet = null;

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

const Profile = ({navigation}) => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // step 1
  const [prefix, setPrefix] = useState('');
  const [petName, setPetName] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [lgbtqia, setLgbtqia] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');

  const [professionList, setProfessionList] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [designation, setDesignation] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [pincode, setPincode] = useState('');

  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [errorMessage, setErrorMessage] = useState({});

  useEffect(() => {
    getProfile();
    //return () => {};
  }, []);

  /**
   * ************************************************
   * API Section Start
   * ************************************************
   */

  const getProfile = () => {
    setIsLoading(true);
    getUserProfile(
      global.userId,
      (response) => {
        setIsLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let profile =
                Array.isArray(data.data) && data.data.length > 0
                  ? data.data[0]
                  : null;

              if (profile.dob && profile.dob !== undefined) {
                var formatedDate = new Date(profile.dob);
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
                var stringDate = `${date}-${month}-${formatedDate.getFullYear()}`;
                setSelectedDate(stringDate);
                birthDate = `${formatedDate.getFullYear()}-${month}-${date}`;
              }
              setLgbtqia(profile.lgbtqia);
              setSelectedGender(profile.gender.toString());

              let group = '';
              if (profile.bloodGroup === "i don't know") {
                group = "I Don't Know";
              } else {
                group = profile.bloodGroup.toUpperCase();
              }
              setBloodGroup(group);
              setPrefix(profile.prefix);
              setPetName(profile.petName);
              setDesignation(profile.designation);
              setCompanyName(profile.company);
              setLinkedInUrl(profile.linkedinUrl);
              setProfileImg(profile.profileImg);
              setPincode(profile.pincode);

              setSelectedState(profile.state);
              selectedStateItem = profile.state;
              if (profile.state.trim() !== '') {
                isStateSelected = true;
              }
              setSelectedCity(profile.city);
              selectedCityItem = profile.city;
              if (profile.city.trim() !== '') {
                isCitySelected = true;
              }

              setSelectedCountry(profile.country);
              selectedCountryItem = profile.country;
              if (profile.country.trim() !== '') {
                isCountrySelected = true;
                getCountryList();
              }

              let profession = '';
              if (profile.profession.includes('-')) {
                let profArray = profile.profession.split('-');
                profession =
                  profArray.length > 2 ? profArray[2] : profile.profession;
              } else {
                profession = profile.profession;
              }

              setSelectedProfession(profession);
              setProfileData(profile);
            }
          }
        }
      },
      (error) => {
        setIsLoading(false);
      },
    );
  };

  const getProfession = () => {
    setIsLoading(true);
    getProfessionList(
      (response) => {
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
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
      },
    );
  };

  const getCountryList = () => {
    if (!isCountrySelected) {
      setIsLoading(true);
    }

    getCountries(
      (response) => {
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
        setIsLoading(false);
        isCountrySelected = false;
        if (isStateSelected) {
          getStateList();
        }
      },
      (error) => {
        isCountrySelected = false;
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
        setIsLoading(false);
        isCitySelected = false;
      },
    );
  };

  const uploadProfile = () => {
    setIsLoading(true);
    let body = [];

    if (profileUri !== null) {
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
          if (response && response !== undefined && response !== null) {
            if (response.status) {
              if (response.data && response.data !== null) {
                let childData = response.data.data;
                setProfileImg(childData);
              }
            }
          }
        },
        (error) => {
          setIsLoading(false);
        },
      );
    }
  };

  const submitUserProfile = () => {
    let requestData = {};

    if (profileUri !== null) {
      requestData.profileImg = profileImg;
    }
    if (prefix.trim() !== '') {
      requestData.prefix = prefix;
    }
    if (petName.trim() !== '') {
      requestData.petName = petName;
    }

    requestData.dob = birthDate;
    requestData.gender = selectedGender;
    requestData.lgbtqia = lgbtqia;

    if (bloodGroup.trim() !== '') {
      requestData.bloodGroup = bloodGroup;
    }
    requestData.profession = selectedProfession;

    if (designation.trim() !== '') {
      requestData.designation = designation;
    }

    if (companyName.trim() !== '') {
      requestData.company = companyName;
    }

    if (linkedInUrl.trim() !== '') {
      requestData.linkedinUrl = linkedInUrl;
    }

    if (selectedCountryItem !== null) {
      requestData.country = selectedCountry;
    }

    if (selectedStateItem !== null) {
      requestData.state = selectedState;
    }

    if (selectedCityItem !== null) {
      requestData.city = selectedCity;
    }

    if (pincode.trim() !== '') {
      requestData.pincode = pincode;
    }

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
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Dashboard'}],
                }),
              );
            }
          }
        }
      },
      (error) => {
        setIsLoading(false);
      },
    );
  };

  /*
   * ************************************************
   * API Section End
   * ************************************************
   */

  const contactToSchool = (result) => {
    Alert.alert(
      `You Are Not Allowed To Change Your ${result} Details`,
      `In Case There Is Any Error In Your Record Please Contact ${APP_NAME}`,
      [
        {
          text: 'CANCEL',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: `CONTACT ${APP_NAME}`,
          onPress: () => {
            Linking.openURL(
              'mailto:' +
                'info@alumbus.com' +
                `?subject=REPORT A PROBLEM TO ${APP_NAME}`,
            );
          },
        },
        {
          text: 'CONTACT VIA WHATSAPP',
          onPress: () => {
            Helper.shareToWhatsAppWithContact(WHATSAPP_NO, '');
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  const getBarPercentage = (currentStep) => {
    if (currentStep === 1) {
      return 0.14;
    } else if (currentStep === 2) {
      return 0.28;
    } else if (currentStep === 3) {
      return 0.42;
    } else if (currentStep === 4) {
      return 0.56;
    } else if (currentStep === 5) {
      return 0.7;
    } else if (currentStep === 6) {
      return 0.84;
    } else if (currentStep === 7) {
      return 0.98;
    }
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
    } else if (fieldName === 'linkedin') {
      setLinkedInUrl(fieldValue);
    } else if (fieldName === 'pinCode') {
      setPincode(fieldValue);
    }
  };

  /*
   * ************************************************
   * Validation start
   * ************************************************
   */

  const validatePersonalInfo = () => {
    if (selectedDate === '') {
      setErrorMessage({emptyBirthDate: 'please select birth date first!'});
      return false;
    } else if (selectedGender === '') {
      setErrorMessage({emptyGender: 'please select gender first!'});
      return false;
    }
    return true;
  };

  const validateProfessionalDetails = () => {
    if (selectedProfession === '') {
      setErrorMessage({profession: 'please select your profession!'});
      return false;
    }
    return true;
  };

  const validateLocationDetails = () => {
    if (selectedCountry === '') {
      setErrorMessage({country: 'please select your country!'});
      return false;
    } else if (selectedState === '') {
      setErrorMessage({state: 'please select your state!'});
      return false;
    } else if (selectedCity === '') {
      setErrorMessage({city: 'please select your city!'});
      return false;
    }
    return true;
  };

  /*
   * ************************************************
   * Validation end
   * ************************************************
   */

  /*
   * ************************************************
   * forward backword start
   * ************************************************
   */

  const moveBack = (lastStep) => {
    if (lastStep > 1) {
      setStep(lastStep - 1);
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'Dashboard'}],
        }),
      );
    }
  };

  const validateAndMoveNextTab = () => {
    Keyboard.dismiss();
    switch (step) {
      case 1: {
        setStep(step + 1);
        break;
      }
      case 2: {
        setStep(step + 1);
        break;
      }
      case 3: {
        if (validatePersonalInfo()) {
          setStep(step + 1);
          if (professionList.length === 0) {
            getProfession();
          }
        }
        break;
      }
      case 4: {
        if (validateProfessionalDetails()) {
          setStep(step + 1);
          if (countryList.length === 0) {
            getCountryList();
          }
        }
        break;
      }
      case 5: {
        if (validateLocationDetails()) {
          setStep(step + 1);
        }
        break;
      }
      case 6: {
        setStep(step + 1);
        break;
      }
      case 7: {
        submitUserProfile();
      }
    }
  };

  /*
   * ************************************************
   * forward backword end
   * ************************************************
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
      //console.log('professionListMain', professionListMain.length);
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
      //console.log('professionListMain', professionListMain.length);
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
      //console.log('professionListMain', professionListMain.length);
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
      //console.log('professionListMain', professionListMain.length);
      setCityList([...cityListMain]);
    }
  };

  const loadPage = (page) => {
    switch (page) {
      case 1: {
        return (
          <TabOne
            profileData={profileData}
            contactToSchool={contactToSchool}
            errorMessage={errorMessage}
            inputHandler={inputHandler}
            prefix={prefix}
            petName={petName}
            firstName={firstName}
            middleName={middleName}
            lastName={lastName}
          />
        );
      }
      case 2: {
        return (
          <TabTwo
            profileData={profileData}
            contactToSchool={contactToSchool}
            errorMessage={errorMessage}
            inputHandler={inputHandler}
            batch={''}
            schoolNo={''}
          />
        );
      }
      case 3: {
        return (
          <TabThree
            profileData={profileData}
            selectedGender={selectedGender}
            lgbtqia={lgbtqia}
            showDatePicker={showDatePicker}
            selectedDate={selectedDate}
            bloodGroup={bloodGroup}
            contactToSchool={contactToSchool}
            errorMessage={errorMessage}
            inputHandler={inputHandler}
            openDatePicker={() => {
              setShowDatePicker(!showDatePicker);
            }}
            setSelectedDate={(date, serverDate) => {
              birthDate = serverDate;
              setSelectedDate(date);
              setShowDatePicker(!showDatePicker);
            }}
            onGenderChange={(gender) => {
              setSelectedGender(gender);
            }}
            setLgbtqia={(checked) => {
              setLgbtqia(!lgbtqia);
            }}
            showBloodGroup={() => {
              bloodGroupSheet.open();
            }}
          />
        );
      }
      case 4: {
        return (
          <TabFour
            selectedProfession={selectedProfession}
            designation={designation}
            companyName={companyName}
            contactToSchool={contactToSchool}
            errorMessage={errorMessage}
            inputHandler={inputHandler}
            openProfessionList={() => {
              professionSheet.open();
            }}
          />
        );
      }
      case 5: {
        return (
          <TabFive
            selectedCountry={selectedCountry}
            selectedState={selectedState}
            selectedCity={selectedCity}
            contactToSchool={contactToSchool}
            pinCode={pincode}
            errorMessage={errorMessage}
            inputHandler={inputHandler}
            openCountryPicker={() => {
              countryListSheet.open();
            }}
            openStatePicker={() => {
              stateListSheet.open();
            }}
            openCityPicker={() => {
              cityListSheet.open();
            }}
          />
        );
      }
      case 6: {
        return (
          <View style={[g.mt45]}>
            <Text style={[g.fs24, g.FHNB, g.mb15, g.colorBlack]}>
              LinkedIn Url...
            </Text>
            <TextInput
              underlineColorAndroid="transparent"
              style={[g.inputWhite]}
              value={linkedInUrl}
              placeholder={likedinPlaceholder}
              onChangeText={(value) => inputHandler('linkedin', value)}
            />
          </View>
        );
      }
      case 7: {
        return (
          <TabSeven
            profileImg={profileImg}
            errorMessage={errorMessage}
            onSelectImage={(res) => {
              profileUri = res;
              //setProfileImg(res.uri);
              uploadProfile();
            }}
          />
        );
      }
    }
  };

  return (
    <TouchableOpacity
      style={GlobalInclude.AppStyle.topSpace}
      activeOpacity={1}
      onPress={() => {
        Keyboard.dismiss();
      }}>
      {isLoading ? (
        <View style={GlobalInclude.AppStyle.fillCenter}>
          <ActivityIndicator size={'small'} color={'#2b3252'} />
        </View>
      ) : (
        <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
          {profileData !== null && (
            <View
              style={[
                GlobalInclude.AppStyle.fill,
                {
                  paddingStart: scale(15),
                  paddingEnd: scale(15),
                  paddingBottom: scale(15),
                },
              ]}>
              <View
                style={[
                  grid.rowdir,
                  grid.justifyContent,
                  grid.alignItems,
                  g.p15,
                  g.pl0,
                ]}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => moveBack(step)}>
                  <Image
                    source={Globalinclude.Assets.Back}
                    style={styles.back}
                  />
                </TouchableOpacity>
                <View style={[grid.row, grid.justifyContentRight]}>
                  <Progress.Bar
                    height={scale(5)}
                    width={width / 2 - 50}
                    progress={getBarPercentage(step)}
                    borderRadius={scale(10)}
                    borderWidth={0}
                    unfilledColor={'#f8f8f8'}
                    color={'#2b3252'}
                  />
                </View>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={GlobalInclude.AppStyle.fill}>
                <View>{loadPage(step)}</View>
              </ScrollView>

              <View
                style={[
                  grid.rowdir,
                  grid.alignItems,
                  grid.justifyContentCenter,
                  g.p15,
                  g.bgWhite,
                  {
                    paddingBottom: scale(5),
                  },
                ]}>
                <TouchableOpacity
                  style={[grid.col, g.btnL, GlobalInclude.AppStyle.fullWidth]}
                  onPress={() => {
                    validateAndMoveNextTab();
                  }}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      g.colorWhite,
                      g.txtCenter,
                      {fontSize: scale(17), padding: scale(10)},
                    ]}>
                    {step === 1 ? 'Start' : 'Save & Next'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
            <BottomSheetHeader
              title={'Select Blood Group'}
              showSearch={false}
            />

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
              defaultSelected={selectedCountry}
              capitalize={true}
              PROP={countryList}
              onRadioSelect={(value) => {
                if (selectedCountry.trim() === '') {
                  setSelectedCountry(value.text);
                  selectedCountryItem = value.text;
                  setCountryList([...countryListMain]);
                  setTimeout(() => {
                    console.log('selectedCountry', selectedCountry);
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
                      console.log('selectedCountry', selectedCountry);
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
              defaultSelected={selectedState}
              capitalize={true}
              PROP={stateList}
              onRadioSelect={(value) => {
                if (selectedState.trim() === '') {
                  setSelectedState(value.text.toString());
                  setStateList([...stateListMain]);
                  selectedStateItem = value.text;
                  setTimeout(() => {
                    console.log('selectedState', selectedState);
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
                      console.log('selectedState', selectedState);
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
              defaultSelected={selectedCity}
              capitalize={true}
              PROP={cityList}
              onRadioSelect={(value) => {
                setSelectedCity(value.text.toString());
                setCityList([...cityListMain]);
                selectedCityItem = value.text;
                cityListSheet.close();
              }}
            />
          </CityListSheet>
        </SafeAreaView>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  back: {
    width: scale(30),
    height: scale(30),
    padding: scale(4),
  },
});

export default Profile;
