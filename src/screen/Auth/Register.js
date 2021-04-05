import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ImageBackground,
  Linking,
  Keyboard,
  StyleSheet,
  Dimensions,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import Helper from '../../helper/Helper';
import {
  getSchoolHouses,
  addUser,
  submitContactForm,
} from '../../Actions/UserActions';
import CountryPicker from 'react-native-country-picker-modal';
import RBSheet from 'react-native-raw-bottom-sheet';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RadioButton from '../../component/RadioButton';
import SelectHouse from '../../component/SelectHouse';
import * as Constants from '../../helper/Constants';
import {URL_REGX, APP_NAME} from '../../helper/Constants';
import CommonButton from '../../component/CommonButton';

const {emailRegex, phoneRegex} = URL_REGX;

let height = Dimensions.get('window').height;
let bottomSheet = null;
let batchSheet = null;
let houseSheet = null;
let lastRequestFrom = '';
let responseMessage = '';
let errorStatusCode = '';

const Register = (props) => {
  lastRequestFrom = props.route.params.viewType;

  const [showCodePicker, setShowCodePicker] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [schoolHouses, setSchoolHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState('');
  const [seleectedSection, setSeleectedSection] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');

  const [editable, setEditable] = useState(true);
  const [errorMessage, setErrorMessage] = useState({});
  const [requestError, setRequestError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showContactUsModal, setShowContactUsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getSchoolHouse();
    return () => {};
  }, []);

  const getSchoolHouse = () => {
    getSchoolHouses(
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let houseList = [];
              let itemList = data.data;
              itemList.map((item) => {
                houseList.push({
                  key: item.title,
                  text:
                    item.title.toLowerCase().charAt(0).toUpperCase() +
                    item.title.toLowerCase().slice(1),
                  id: item._id,
                  section: item.section,
                });
              });

              houseList.sort(function (a, b) {
                if (a.text < b.text) {
                  return -1;
                }
                if (a.text > b.text) {
                  return 1;
                }
                return 0;
              });

              setSchoolHouses([...houseList]);
            }
          }
        }
      },
      (error) => {
        console.log('error', error);
        setRequestError('');
      },
    );
  };

  const validateFields = () => {
    Keyboard.dismiss();
    setErrorMessage({});
    if (firstName.trim().length === 0) {
      setErrorMessage({firstName: 'Please enter the First Name'});
    } else if (lastName.trim().length === 0) {
      setErrorMessage({lastName: 'Please enter the Middle/Last Name'});
    } else if (email.trim().length === 0) {
      setErrorMessage({email: 'Please enter the Email Address'});
    } else if (!Helper.validateRegex(emailRegex, email)) {
      setErrorMessage({email: 'Please enter a valid email address'});
    } else if (phone.trim().length === 0) {
      setErrorMessage({phone: 'Please enter the Phone Number'});
    } else if (phone.trim().length < 6) {
      setErrorMessage({phone: 'Please enter the valid Phone Number'});
    } else if (!Helper.validateRegex(phoneRegex, phone)) {
      setErrorMessage({phone: 'Please enter the valid Phone Number'});
    } else if (selectedBatch.trim().length === 0) {
      setErrorMessage({batchNo: 'Please select your Batch'});
    } else if (schoolName.trim().length === 0) {
      setErrorMessage({schoolName: 'Please enter the School Number'});
    } else if (selectedHouse.trim().length === 0) {
      setErrorMessage({house: 'Please select the School House'});
    } else {
      setEditable(false);

      if (lastRequestFrom === 'Login') {
        saveUserData();
      } else {
        submitContactUs();
      }
    }
  };

  const saveUserData = () => {
    let requestData = {
      firstName: firstName,
      phone: phone,
      email: email,
      countryCode: countryCode,
      password: '12345678',
      profileImg: '',
      prefix: '',
      lastName: lastName,
      petName: '',
      phoneScope: 1,
      emailScope: 1,
      secondaryPhone: '',
      secondaryPhoneScope: 1,
      secondaryEmail: '',
      secondaryEmailScope: 1,
      gender: 1, //default will be male 0= female ,1= male
      lgbtqia: false,
      bloodGroup: '',
      profession: '',
      designation: '',
      company: '',
      linkedinUrl: '',
      schoolNumber: schoolName,
      batch: selectedBatch,
      house: selectedHouse,
      section: seleectedSection,
      country: '',
      state: '',
      city: '',
      pincode: '',
      permanentAddress: '',
      correspondenceAddress: '',
      isSameAddress: true,
      aboutMe: '',
      schoolMemories: '',
      philosophy: '',
      hobbies: '',
      favMusician: '',
      favMovies: '',
      favPeople: '',
      favSportsTeams: '',
      philanthorpy: '',
      photos: [],
      videos: [],
      docs: [],
      tags: [],
    };
    console.log('requestData', requestData);
    setIsLoading(true);
    addUser(
      requestData,
      (response) => {
        setIsLoading(false);
        console.log('addUser', response);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.response !== null
          ) {
            let data = response.data;
            if (data.status) {
              errorStatusCode = 201;
              responseMessage = data.message;
              setShowContactUsModal(!showContactUsModal);
            }
          }
        }
      },
      (statusCode, error) => {
        console.log('error', error);
        console.log('statusCode', statusCode);
        setEditable(true);
        //setRequestError(error);
        errorStatusCode = statusCode;
        setIsLoading(false);
        responseMessage = error;
        setShowContactUsModal(!showContactUsModal);
      },
    );
  };

  const submitContactUs = () => {
    let requestData = {
      email: email,
      countryCode: countryCode,
      phone: phone,
      firstName: firstName,
      lastName: lastName,
      batch: selectedBatch,
      schoolNum: schoolName,
      house: selectedHouse,
      section: seleectedSection,
      msg: '',
    };

    console.log('request', requestData);

    setIsLoading(true);
    submitContactForm(
      requestData,
      (response) => {
        setIsLoading(false);
        console.log('addUser', response);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.response !== null
          ) {
            let data = response.data;
            if (data.status) {
              errorStatusCode = 201;
              responseMessage = data.message;
              setShowContactUsModal(!showContactUsModal);
            }
          }
        }
      },
      (statusCode, error) => {
        console.log('error', error);
        console.log('statusCode', statusCode);
        setEditable(true);
        //setRequestError(error);
        errorStatusCode = statusCode;
        setIsLoading(false);
        responseMessage = error;
        setShowContactUsModal(!showContactUsModal);
      },
    );
  };

  const openCounryCodePicker = () => {
    setShowCodePicker(!showCodePicker);
  };

  const closeCodePicker = () => {
    setShowCodePicker(!showCodePicker);
  };

  const onSelectCountry = (country) => {
    setShowCodePicker(!showCodePicker);
    let code = '+' + country.callingCode[0];
    setCountryCode(code);
  };

  const openSheet = () => {
    bottomSheet.open();
  };

  const shareToWhatsApp = () => {
    bottomSheet.close();
    setTimeout(() => {
      let url = `whatsapp://send?text=${''}&phone=${Constants.WHATSAPP_NO}`;
      Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
          // eslint-disable-next-line no-alert
          alert('Please install Whatsapp App first');
        } else {
          return Linking.openURL(url);
        }
      });
    }, 500);
  };

  const showVideo = () => {
    bottomSheet.close();
    // setTimeout(() => {
    //   navigation.navigate('VideoAssist', {
    //     url: 'https://www.youtube.com/watch?v=EvZAOwA4_dc&t=5s',
    //   });
    // }, 500);
  };

  const header = () => {
    return (
      <View>
        {lastRequestFrom === 'Login' ? (
          <View style={[grid.rowdir, grid.justifyContent, grid.alignItems]}>
            <View style={[grid.col]}>
              <View
                style={[
                  g.boxShadow,
                  g.bgWhite,
                  {
                    width: scale(50),
                    borderRadius: scale(50),
                    shadowOpacity: 0.15,
                  },
                ]}>
                <Image
                  source={GlobalInclude.Assets.AppLogo}
                  style={{width: scale(50), height: scale(50)}}
                  resizeMode="contain"
                />
              </View>
            </View>
            <View style={[grid.rowrow]}>
              <TouchableOpacity
                onPress={() => {
                  props.route.params.onRefresh();
                  props.navigation.goBack();
                }}
                activeOpacity={1}
                style={[g.mr15]}>
                <Text style={[g.colorBlue, g.fs24, g.pb2, {opacity: 0.7}]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={[
                  g.mr15,
                  {borderBottomWidth: 1.5, borderBottomColor: '#2b3252'},
                ]}>
                <Text style={[g.colorBlue, g.fs24, g.pb2]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              paddingStart: scale(5),
              paddingEnd: scale(16),
              alignItems: 'center',
            }}>
            <Text style={[g.colorBlue, g.fs24, {flex: 1}]}>Contact Us</Text>
            <TouchableOpacity
              onPress={() => props.navigation.goBack()}
              style={[g.ml15, {padding: scale(10)}]}>
              <AntDesign
                name={'arrowleft'}
                color={'#2b3252'}
                size={scale(30)}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={GlobalInclude.AppStyle.topSpace}
      activeOpacity={1}
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={GlobalInclude.AppStyle.parentStyle}>
        <View
          style={[
            GlobalInclude.AppStyle.fill,
            GlobalInclude.AppStyle.contentSpace,
            {
              paddingBottom: scale(15),
            },
          ]}>
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
          {header()}

          <ScrollView>
            <View style={[GlobalInclude.AppStyle.fillColCross, g.mt20]}>
              <TextInput
                underlineColorAndroid="transparent"
                style={[g.inputGrayLogin]}
                editable={editable}
                maxLength={100}
                keyboardType="default"
                value={firstName}
                placeholder="First Name"
                onChangeText={(value) => setFirstName(value)}
                placeholderTextColor={'#ddd'}
                autoCompleteType={'name'}
                autoCorrect={false}
                autoCapitalize={'words'}
              />
              {errorMessage.firstName && (
                <Text
                  style={[
                    g.errorMsg,
                    g.fs12,
                    {
                      textAlign: 'left',
                      alignSelf: 'flex-start',
                      marginTop: scale(5),
                    },
                  ]}>
                  {errorMessage.firstName}
                </Text>
              )}

              <TextInput
                underlineColorAndroid="transparent"
                style={[g.inputGrayLogin, g.mb0, g.mt10, g.pt5, g.pb5]}
                editable={editable}
                maxLength={100}
                keyboardType={'default'}
                value={lastName}
                placeholder="Middle and Last Name"
                onChangeText={(value) => setLastName(value)}
                placeholderTextColor={'#ddd'}
                autoCompleteType={'name'}
                autoCorrect={false}
                autoCapitalize={'words'}
              />
              {errorMessage.lastName && (
                <Text
                  style={[
                    g.errorMsg,
                    g.fs12,
                    {
                      textAlign: 'left',
                      alignSelf: 'flex-start',
                      marginTop: scale(5),
                    },
                  ]}>
                  {errorMessage.lastName}
                </Text>
              )}

              <TextInput
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                style={[g.inputGrayLogin, g.mb0, g.mt10, g.pt5, g.pb5]}
                editable={editable}
                maxLength={264}
                keyboardType="email-address"
                value={email}
                placeholder="Email"
                onChangeText={(value) => setEmail(value)}
                placeholderTextColor={'#ddd'}
              />
              {errorMessage.email && (
                <Text
                  style={[
                    g.errorMsg,
                    g.fs12,
                    {
                      textAlign: 'left',
                      alignSelf: 'flex-start',
                      marginTop: scale(5),
                    },
                  ]}>
                  {errorMessage.email}
                </Text>
              )}

              <View
                style={[
                  grid.rowdir,
                  g.bglightGray,
                  g.mt10,
                  {borderRadius: scale(6)},
                ]}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={[g.countryCode]}
                  onPress={() => {
                    openCounryCodePicker();
                  }}>
                  <Text style={[g.colordarkGray, g.FHNR, g.txtCenter]}>
                    {countryCode}
                  </Text>
                </TouchableOpacity>
                <View style={[grid.col]}>
                  <TextInput
                    autoCapitalize="none"
                    underlineColorAndroid="transparent"
                    style={[
                      g.inputGrayLogin,
                      g.mb0,
                      g.pt5,
                      g.pb5,
                      {borderTopLeftRadius: 0, borderBottomLeftRadius: 0},
                    ]}
                    editable={editable}
                    maxLength={12}
                    keyboardType="phone-pad"
                    value={phone}
                    placeholder="Phone Number"
                    onChangeText={(value) => setPhone(value)}
                    placeholderTextColor={'#ddd'}
                  />
                </View>
              </View>
              {errorMessage.phone && (
                <Text
                  style={[
                    g.errorMsg,
                    g.fs12,
                    {
                      textAlign: 'left',
                      alignSelf: 'flex-start',
                      marginTop: scale(5),
                    },
                  ]}>
                  {errorMessage.phone}
                </Text>
              )}

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => batchSheet.open()}
                style={[
                  g.mt10,
                  g.inputGrayLogin,
                  grid.rowrow,
                  grid.alignItems,
                  grid.justifyContent,
                  g.pt5,
                  g.pb5,
                ]}>
                <Text
                  style={[
                    grid.col,
                    {
                      color: selectedBatch.length > 0 ? '#000' : '#ddd',
                      fontSize: scale(14),
                      fontFamily: 'Lato-Regular',
                    },
                  ]}>
                  {selectedBatch.length > 0 ? selectedBatch : 'Select Batch'}
                </Text>
                <View style={style.triangleShape} />
              </TouchableOpacity>
              {errorMessage.batchNo && (
                <Text
                  style={[
                    g.errorMsg,
                    g.fs12,
                    {
                      textAlign: 'left',
                      alignSelf: 'flex-start',
                      marginTop: scale(5),
                    },
                  ]}>
                  {errorMessage.batchNo}
                </Text>
              )}

              <TextInput
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                style={[g.inputGrayLogin, g.mb0, g.mt10, g.pt5, g.pb5]}
                editable={editable}
                maxLength={100}
                keyboardType="default"
                value={schoolName}
                placeholder="School Number"
                onChangeText={(value) => setSchoolName(value)}
                placeholderTextColor={'#ddd'}
              />
              {errorMessage.schoolName && (
                <Text
                  style={[
                    g.errorMsg,
                    g.fs12,
                    {
                      textAlign: 'left',
                      alignSelf: 'flex-start',
                      marginTop: scale(5),
                    },
                  ]}>
                  {errorMessage.schoolName}
                </Text>
              )}

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => houseSheet.open()}
                style={[
                  g.mt10,
                  g.inputGrayLogin,
                  grid.rowrow,
                  grid.alignItems,
                  grid.justifyContent,
                  g.pt5,
                  g.pb5,
                ]}>
                <Text
                  style={[
                    grid.col,
                    {
                      color: selectedHouse.length > 0 ? '#000' : '#ddd',
                      fontSize: scale(14),
                      fontFamily: 'Lato-Regular',
                    },
                  ]}>
                  {selectedHouse.length > 0
                    ? `${selectedHouse} ${seleectedSection}`
                    : 'House'}
                </Text>
                <View style={style.triangleShape} />
              </TouchableOpacity>
              {errorMessage.house && (
                <Text
                  style={[
                    g.errorMsg,
                    g.fs12,
                    {
                      textAlign: 'left',
                      alignSelf: 'flex-start',
                      marginTop: scale(5),
                    },
                  ]}>
                  {errorMessage.house}
                </Text>
              )}

              <Text
                onPress={() => openSheet()}
                style={[
                  g.fs14,
                  g.colorBlue,
                  g.FHNR,
                  g.mb15,
                  g.mt10,
                  g.txtCenter,
                ]}>
                Need Help?
              </Text>
            </View>
          </ScrollView>

          <CommonButton
            showLoader={isLoading}
            title={'Submit'}
            onPress={() => {
              validateFields();
            }}
          />
          {requestError.length > 0 && (
            <Text style={[g.errorMsg, g.fs12, g.mb10, g.mt10]}>
              {requestError}
            </Text>
          )}
        </View>
      </View>
      {/* need help sheet */}
      <RBSheet
        ref={(ref) => {
          bottomSheet = ref;
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
            padding: 20,
          },
        }}>
        <View style={[g.p15, {flex: 1}]}>
          <View>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                g.oh,
                {
                  aspectRatio: 16 / 9,
                  backgroundColor: '#E7E7E7',
                  borderRadius: 10,
                  position: 'relative',
                },
              ]}
              onPress={() => showVideo()}>
              <View
                style={[
                  grid.flex1,
                  grid.alignItems,
                  grid.justifyContentCenter,
                  {
                    zIndex: 2,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  },
                ]}>
                <Icon name={'play-circle'} size={50} color={'#ffffff'} />
              </View>
              <ImageBackground
                source={GlobalInclude.Assets.NeedHelp}
                style={[{aspectRatio: 16 / 9}]}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              grid.rowrow,
              grid.justifyContentCenter,
              grid.alignItems,
              g.btnL,
              g.mt45,
              g.p11,
            ]}
            onPress={() => shareToWhatsApp()}>
            <Text
              style={{
                alignSelf: 'center',
                color: '#ffffff',
                fontSize: scale(18),
                justifyContent: 'center',
                textAlign: 'center',
                textAlignVertical: 'center',
              }}>
              {'Chat with us on Whatsapp'}
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>

      {/* select batch sheet */}
      <RBSheet
        ref={(ref) => {
          batchSheet = ref;
        }}
        height={height / 2}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20,
          },
        }}>
        <Text
          style={[g.fs18, g.FHNB, g.txtCenter, g.colorBlack, g.mt5, g.mb15]}>
          Select Batch
        </Text>
        <RadioButton
          PROP={Helper.generateYearList(false,-1)}
          onRadioSelect={(value) => {
            setSelectedBatch(value.text.toString());
            batchSheet.close();
          }}
        />
      </RBSheet>

      {/* select school house */}
      <RBSheet
        ref={(ref) => {
          houseSheet = ref;
        }}
        height={395}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20,
          },
        }}>
        <SelectHouse
          PROP={schoolHouses}
          onRadioSelect={(house, section) => {
            setSelectedHouse(house);
            setSeleectedSection(section);
            houseSheet.close();
          }}
        />
      </RBSheet>

      {/* success alert */}
      {showSuccessModal && (
        <GlobalInclude.ModalAlert
          status={showSuccessModal}
          header={'Congratulations!'}
          subHeader={`Your message has been forwarded to ${APP_NAME}. Please wait until response from them.`}
          okButton={'Okay'}
          okAction={() => {
            setShowSuccessModal(!showSuccessModal);
            setTimeout(() => {
              props.navigation.goBack();
            }, 300);
          }}
        />
      )}

      {/* fail error alert */}
      {showContactUsModal && (
        <GlobalInclude.ModalAlert
          status={showContactUsModal}
          header={responseMessage}
          okButton={
            errorStatusCode === 409 || errorStatusCode === 201
              ? 'Okay'
              : `Contact ${APP_NAME}`
          }
          okAction={() => {
            if (errorStatusCode === 409 || errorStatusCode === 201) {
              props.navigation.goBack();
            } else {
              setShowContactUsModal(!showContactUsModal);
            }
          }}
          cancelAction={() => {
            setShowContactUsModal(!showContactUsModal);
          }}
        />
      )}
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
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

export default Register;
