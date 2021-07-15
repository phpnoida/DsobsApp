import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  PermissionsAndroid,
  NativeModules,
  ImageBackground,
  Linking,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import Helper from '../../helper/Helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {requestAuthCode, verifyAuthCode} from '../../Actions/UserActions';
import {sendPresenceStatus} from '../../Actions/CommonActions';
import CountryPicker from 'react-native-country-picker-modal';
import RBSheet from 'react-native-raw-bottom-sheet';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Constants from '../../helper/Constants';
import {URL_REGX, APP_NAME} from '../../helper/Constants';
import {CommonActions} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import CommonButton from '../../component/CommonButton';
import SmsRetriever from 'react-native-sms-retriever';
import parsePhoneNumber, {AsYouType} from 'libphonenumber-js';

const {emailRegex, phoneRegex} = URL_REGX;

const phoneModule = NativeModules.PhoneModule;

let deviceNumber = '';
let bottomSheet = null;
let requestId = '';
let timerInterval = null;
let responseMessage = '';
let errorStatusCode = '';

const Login = ({navigation}) => {
  const [showCodePicker, setShowCodePicker] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [editable, setEditable] = useState(true);
  const [showOTPBox, setShowOTPBox] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [requestError, setRequestError] = useState('');
  const [isPhoneLogin, setIsPhoneLogin] = useState(true);
  const [currentStatus, setCurrentStatus] = useState(1);
  const [timerValue, setTimerValue] = useState('');
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showContactUsModal, setShowContactUsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // const getUserPhoneNumbers = () => {
    //   phoneModule.getPhoneNumber((numbers) => {
    //     if (numbers) {
    //       deviceNumber = numbers;
    //       setShowPhoneModal(!showPhoneModal);
    //     }
    //   });
    // };
    // if (Platform.OS === 'android') {
    //   async function checkPermission() {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    //     );
    //     if (granted) {
    //       getUserPhoneNumbers();
    //     }
    //   }
    //   checkPermission();
    // }

    const _requestForPhoneNumber = async () => {
      try {
        const phoneNumber = await SmsRetriever.requestPhoneNumber();
        let match = parsePhoneNumber(phoneNumber);
        const asYouType = new AsYouType();
        asYouType.input(match.formatInternational());
        setCountryCode('+' + asYouType.getNumber().countryCallingCode);
        setPhone(match.nationalNumber);
      } catch (error) {}
    };

    if (Platform.OS === 'android') {
      setTimeout(() => {
        _requestForPhoneNumber();
      }, 300);
    }

    return () => {
      if (timerInterval !== null) {
        clearInterval(timerInterval);
      }
      //unsubscribe();
      if (Platform.OS === 'android') {
        SmsRetriever.removeSmsListener();
      }
    };
  }, []);

  const onRefresh = () => {
    setShowCodePicker(false);
    setEditable(true);
    setShowOTPBox(false);
    setIsPhoneLogin(true);
    setShowPhoneModal(false);
    setShowContactUsModal(false);
    setIsLoading(false);
    setCurrentStatus(1);
    setTimerValue('');
    setPhone('');
    setEmail('');
    setErrorMessage({});
    setRequestError('');
  };

  const openSheet = () => {
    bottomSheet.open();
  };

  const showVideo = () => {
    bottomSheet.close();
    // setTimeout(() => {
    //   navigation.navigate('VideoAssist', {
    //     url: 'https://www.youtube.com/watch?v=EvZAOwA4_dc&t=5s',
    //   });
    // }, 500);
  };

  const closePhoneModal = () => {
    setShowPhoneModal(!showPhoneModal);
  };

  const validateLogin = (selectedNumber) => {
    closePhoneModal();
    if (selectedNumber.startsWith('+1')) {
      setCountryCode('+1');
      setPhone(selectedNumber.replace('+1', ''));
    } else if (selectedNumber.startsWith('+44')) {
      setCountryCode('+44');
      setPhone(selectedNumber.replace('+44', ''));
    } else if (selectedNumber.startsWith('+91')) {
      setCountryCode('+91');
      setPhone(selectedNumber.replace('+91', ''));
    } else if (selectedNumber.startsWith('91')) {
      setCountryCode('+91');
      setPhone(selectedNumber.replace('91', ''));
    } else if (selectedNumber.startsWith('0')) {
      setCountryCode('+91');
      setPhone(selectedNumber.replace('+91', ''));
    } else if (selectedNumber.startsWith('+0')) {
      setCountryCode('+91');
      setPhone(selectedNumber.replace('+91', ''));
    }
  };

  const validateEmail = () => {
    Keyboard.dismiss();
    setErrorMessage({});

    if (email.trim().length === 0) {
      setErrorMessage({email: 'Please enter the Email Address'});
    } else if (!Helper.validateRegex(emailRegex, email)) {
      setErrorMessage({phone: 'Please enter the valid Email Address'});
    } else {
      let requestData = {
        email: email,
      };
      if (global.isConnected) {
        getAuthCode(requestData);
      }
    }
  };

  const validatePhoneNumber = async () => {
    Keyboard.dismiss();
    setErrorMessage({});
    if (phone.trim().length === 0) {
      setErrorMessage({phone: 'Please enter the Phone Number'});
    } else {
      let requestData = {
        countryCode: countryCode,
        phone: phone,
      };
      if (global.isConnected) {
        getAuthCode(requestData);

        if (Platform.OS === 'android') {
          const registered = await SmsRetriever.startSmsRetriever();
          if (registered) {
            SmsRetriever.addSmsListener(_onReceiveSms);
          }
        }
      }
    }
  };

  const _onReceiveSms = (event) => {
    let otpCode = event.message.toString().split(' ')[1].replace(/\D/g, '');
    console.log('====================================');
    console.log('event.message', otpCode);
    console.log('====================================');

    setAuthCode(otpCode);
    SmsRetriever.removeSmsListener();
  };

  const getAuthCode = (requestString) => {
    setIsLoading(true);
    requestAuthCode(
      requestString,
      (response) => {
        setIsLoading(false);
        //console.log('requestAuthCode', response);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.response !== null
          ) {
            let data = response.data;

            if (data.status) {
              if (data.data && data.data !== null) {
                requestId = data.data.id;
                setEditable(false);
                setShowOTPBox(true);
                makeAuthTimer();
              }
            }
          }
        }
      },
      (statusCode, error) => {
        setIsLoading(false);
        errorStatusCode = statusCode;
        console.log('statusCode', statusCode);
        console.log('statusCode', error);
        responseMessage = error;
        setShowContactUsModal(!showContactUsModal);
      },
    );
  };

  const validateAuthCode = () => {
    Keyboard.dismiss();
    setErrorMessage({});
    if (authCode.trim().authCode === 0) {
      setErrorMessage({otp: 'Please enter valid authorization code'});
    } else if (authCode.trim().length < 4) {
      setErrorMessage({otp: 'Please enter valid authorization code'});
    } else {
      let requestData = {
        id: requestId,
        otpCode: authCode,
      };
      setIsLoading(true);
      verifyAuthCode(
        requestData,
        (response) => {
          setIsLoading(false);
          //console.log('verifyAuthCode', response);
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.response !== null
            ) {
              let data = response.data;

              if (data.status) {
                if (data.data && data.data !== null) {
                  let userDetails = data.data;

                  let tokens = userDetails.tokens;

                  global.accessToken = tokens.accessToken;

                  sendUserPresence(userDetails);
                }
              }
            }
          }
        },
        (statusCode, error) => {
          setIsLoading(false);
          setErrorMessage({otp: error});
        },
      );
    }
  };

  const sendUserPresence = (userDetails) => {
    sendPresenceStatus(
      (response) => {
        console.log('details');
        completeLogin(userDetails);
      },
      (statusCode, error) => {
        console.log('error');
      },
    );
  };

  const completeLogin = (userDetails) => {
    let tokens = userDetails.tokens;
    let fcmTopic = userDetails.fcmTopic;
    global.userDetails = userDetails;
    global.accessToken = tokens.accessToken;
    global.userId = userDetails._id;
    global.firstName = userDetails.firstName;
    global.lastName = userDetails.lastName;
    clearInterval(timerInterval);

    messaging()
      .subscribeToTopic(fcmTopic)
      .then(() => {
        AsyncStorage.setItem('loggedIn', '1').then(() => {
          AsyncStorage.setItem('tokens', JSON.stringify(tokens)).then(() => {
            AsyncStorage.setItem(
              'userDetails',
              JSON.stringify(userDetails),
            ).then(() => {
              AsyncStorage.setItem('accessToken', tokens.accessToken).then(
                () => {
                  AsyncStorage.setItem(
                    'refreshToken',
                    tokens.refreshToken,
                  ).then(() => {
                    AsyncStorage.setItem('fcmTopic', fcmTopic).then(() => {
                      openHome();
                    });
                  });
                },
              );
            });
          });
        });
      });
  };

  const openHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Profile'}],
      }),
    );
  };

  const makeAuthTimer = () => {
    setCurrentStatus(3);
    var duration = 60 * 2;
    var timer = duration;
    var minutes, seconds;
    var rest_time = 0;
    var timeText = '';

    timerInterval = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      rest_time = parseInt(seconds, 10) + parseInt(minutes, 10) * 60;
      if (rest_time === 0) {
        clearInterval(timerInterval);
      }

      timeText = minutes + ':' + seconds;
      setTimerValue(timeText);
      if (timer === 0) {
        setCurrentStatus(2);
        setTimerValue('');
        setEditable(true);
      }
      if (--timer < 0) {
        timer = duration;
      }
    }, 1000);
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

  const header = () => {
    return (
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
            activeOpacity={1}
            style={[
              g.mr15,
              {
                borderBottomWidth: 1.5,
                borderBottomColor: GlobalInclude.Color.ColorPrimary,
              },
            ]}>
            <Text style={[g.colorBlue, g.fs24, g.pb2]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              clearInterval(timerInterval);
              navigation.navigate('Register', {
                viewType: 'Login',
                onRefresh: onRefresh,
              });
            }}
            style={{
              borderBottomWidth: 0,
              borderBottomColor: GlobalInclude.Color.ColorPrimary,
              opacity: 0.5,
            }}>
            <Text style={[g.colorBlue, g.fs24, g.pb2, {opacity: 0.7}]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
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
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <GlobalInclude.Loader
          ref={(ref) => (global.global_loader_reff = ref)}
        />
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
          <View style={GlobalInclude.AppStyle.fillColMain}>
            {isPhoneLogin ? (
              <View style={{marginBottom: scale(10)}}>
                <Text style={[g.colordarkGray, g.fs15, g.FHNR, g.mb5]}>
                  Phone number
                </Text>
                <View
                  style={[
                    grid.rowdir,
                    g.bglightGray,
                    {
                      borderRadius: scale(6),
                    },
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
                        {borderTopLeftRadius: 0, borderBottomLeftRadius: 0},
                      ]}
                      editable={editable}
                      maxLength={12}
                      keyboardType="phone-pad"
                      value={phone}
                      placeholder="Enter your Phone number"
                      onChangeText={(value) => setPhone(value)}
                      placeholderTextColor={'#ddd'}
                    />
                  </View>
                </View>
                {errorMessage.phone && errorMessage.phone.length && (
                  <Text style={[g.errorMsg, g.fs12, {marginTop: scale(5)}]}>
                    {errorMessage.phone}
                  </Text>
                )}
              </View>
            ) : (
              <View style={{marginBottom: scale(10)}}>
                <Text style={[g.colordarkGray, g.fs15, g.FHNR, g.mb5]}>
                  Email
                </Text>
                <View
                  style={[
                    grid.rowdir,
                    g.bglightGray,
                    {
                      borderRadius: scale(6),
                    },
                  ]}>
                  <View style={[grid.col, {borderRadius: scale(10)}]}>
                    <TextInput
                      autoCapitalize="none"
                      underlineColorAndroid="transparent"
                      style={[g.inputGrayLogin]}
                      editable={editable}
                      maxLength={264}
                      keyboardType="email-address"
                      value={email}
                      placeholder="Enter your email address"
                      onChangeText={(value) => setEmail(value)}
                      placeholderTextColor={'#ddd'}
                    />
                  </View>
                </View>
                {errorMessage.email && errorMessage.email.length > 0 && (
                  <Text style={[g.errorMsg, g.fs12, {marginTop: scale(5)}]}>
                    {errorMessage.email}
                  </Text>
                )}
              </View>
            )}
            {showOTPBox && (
              <View>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={g.inputGrayLogin}
                  keyboardType="numeric"
                  maxLength={6}
                  value={authCode}
                  onChangeText={(otp) => {
                    setAuthCode(otp);
                  }}
                  placeholder="Enter OTP here"
                  placeholderTextColor={'#ddd'}
                  textContentType={'oneTimeCode'}
                />
                {errorMessage.otp && errorMessage.otp.length > 0 && (
                  <Text style={[g.errorMsg, g.fs12, {marginTop: scale(5)}]}>
                    {errorMessage.otp}
                  </Text>
                )}
              </View>
            )}

            <Text
              onPress={() => openSheet()}
              style={[
                g.fs14,
                g.colorBlue,
                g.FHNR,
                g.mb15,
                g.txtCenter,
                {width: 100, justifyContent: 'center', alignSelf: 'center'},
              ]}>
              Need Help?
            </Text>
          </View>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              marginBottom: scale(15),
            }}
            activeOpacity={1}
            onPress={() => {
              if (editable && timerValue.trim() === '') {
                setIsPhoneLogin(!isPhoneLogin);
                if (showOTPBox) {
                  otpInput = '';
                  setAuthCode('');
                  setShowOTPBox(!showOTPBox);
                }
                setPhone('');
                setEmail('');
                setErrorMessage({});
                setRequestError('');
              }
            }}>
            <Text style={[g.fs14, g.colordarkGray, g.FHNR]}>
              {isPhoneLogin
                ? 'Sign in with Email'
                : 'Sign in with Phone number'}
            </Text>
          </TouchableOpacity>

          <View style={{marginBottom: scale(10)}}>
            <CommonButton
              showLoader={isLoading}
              title={
                currentStatus === 1
                  ? 'Request OTP'
                  : currentStatus === 2
                  ? 'Resend OTP'
                  : 'Verify OTP'
              }
              onPress={() => {
                if (currentStatus === 1) {
                  if (isPhoneLogin) {
                    validatePhoneNumber();
                  } else {
                    validateEmail();
                  }
                } else if (currentStatus === 2) {
                  if (showOTPBox) {
                    otpInput = '';
                    setAuthCode('');
                    setShowOTPBox(!showOTPBox);
                  }
                  if (isPhoneLogin) {
                    validatePhoneNumber();
                  } else {
                    validateEmail();
                  }
                } else if (currentStatus === 3) {
                  validateAuthCode();
                }
              }}
            />
            {currentStatus === 3 && (
              <Text style={[g.colorBlue, g.FHNR, g.mt10]}>
                Resend OTP will be active in : {timerValue}
              </Text>
            )}
            {requestError.length > 0 && (
              <Text
                style={[
                  g.errorMsg,
                  g.fs12,
                  g.mb10,
                  grid.justifyContentCenter,
                  {alignSelf: 'center'},
                ]}>
                {requestError}
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* phone number modal */}
      <Modal
        visible={showPhoneModal}
        animationType={'slide'}
        onRequestClose={() => closePhoneModal()}
        transparent={true}>
        <View
          style={[
            {backgroundColor: 'rgba(0, 0, 0, 0.8)', flex: 1},
            grid.alignItems,
            grid.justifyContentCenter,
          ]}>
          <View style={[g.bgWhite, {width: '90%', borderRadius: 5}]}>
            <Text style={[g.p15, g.fs14, g.colorBlack, g.FHNR, g.pb0]}>
              Continue with
            </Text>
            <Text
              style={[g.p15, g.fs16, g.colorBlack]}
              onPress={() => validateLogin(deviceNumber)}>
              {deviceNumber}
            </Text>
            <View style={{height: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)'}} />
            <Text
              style={[
                g.p15,
                g.fs14,
                g.colorBlack,
                g.FHNR,
                g.txtCenter,
                {color: '#3374FF'},
              ]}
              onPress={() => closePhoneModal()}>
              NONE OF THE ABOVE
            </Text>
          </View>
        </View>
      </Modal>

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

      {showContactUsModal && (
        <GlobalInclude.ModalAlert
          status={showContactUsModal}
          header={responseMessage}
          okButton={errorStatusCode === 409 ? null : `Contact ${APP_NAME}`}
          okAction={() => {
            setShowContactUsModal(!showContactUsModal);
            setTimeout(() => {
              navigation.navigate('Register', {viewType: 'ContactUs'});
            }, 500);
          }}
          closeAction={() => {
            setShowContactUsModal(!showContactUsModal);
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default Login;
