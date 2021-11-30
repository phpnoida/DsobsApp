import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Keyboard,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import Helper from '../../../helper/Helper';
import {APP_NAME} from '../../../helper/Constants';
import {scale} from '../../../theme/Scalling';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import HeaderBar from '../../../component/HeaderBar';
import {IconType} from '../../../helper/Constants';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import ProgressImage from '../../../component/ProgresImage';
import CommonButton from '../../../component/CommonButton';
import JobDescription from './JobDescription';
import OtherDetails from './OtherDetails';
import PostedBy from './PostedBy';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {generateHeader} from '../../../component/Common';
import {
  applyForJob,
  doFilterJobs,
  doGetAppliedUsers,
} from '../../../Actions/JobsActions';

const {height, width} = Dimensions.get('window');

let responseMessage = '';
let isSuccess = false;
let openMode = 1;

const JobDetails = ({route, navigation}) => {
  const refApply = useRef();

  const [isLoading, setIsLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [pageContent, setPageContent] = useState(null);

  const [fullName, setFullName] = useState('');
  const [linkedInProfile, setLinkedInProfile] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    if (route.params && route.params !== undefined && route.params !== null) {
      let data = route.params.data;

      let filterObject = {
        id: data._id,
      };

      if (global.isConnected) {
        getAppliedData(data._id);
        getFilteredData(filterObject);
      }
    }

    return () => {};
  }, [route]);

  /**
   *
   * API Section
   */

  const getFilteredData = filterObject => {
    doFilterJobs(
      filterObject,
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              setPageContent(data.data[0]);
            }
          }
        }
        setIsLoading(false);
      },
      (code, error) => {
        setIsLoading(false);
        setPageContent(null);
        console.log('error->', error, code);
      },
    );
  };

  const getAppliedData = jobId => {
    doGetAppliedUsers(
      jobId,
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              let filtered = data.data.filter(
                item => item._id === global.userId,
              );
            }
          }
        }
      },
      (code, error) => {
        console.log('error->', error, code);
      },
    );
  };

  const applyJob = () => {
    let requestObject = {
      name: fullName,
      type: openMode,
      linkedIn: linkedInProfile,
      jobId: pageContent._id,
      phone: phoneNumber,
      email: emailAddress,
      notes: notes,
    };
    setLoader(true);
    applyForJob(
      requestObject,
      response => {
        setLoader(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            console.log('data', data);
            if (data.status) {
              if (refApply.current !== null && refApply.current !== undefined) {
                refApply.current.close();
              }
              setTimeout(() => {
                isSuccess = true;
                if (openMode === 1) {
                  responseMessage =
                    'You have successfully sent your application for this position!\n\nPlease await a response on this matter via E-mail from the Job poster.';
                } else {
                  responseMessage =
                    'You have successfully sent your recommendation for this position!\n\nPlease await a response on this matter via E-mail from the Job poster.';
                }
                setShowErrorMessage(true);
              }, 350);
            } else {
              responseMessage = 'Error while posting your request!';
              setShowErrorMessage(true);
            }
          }
        }
      },
      (code, error) => {
        if (refApply.current !== null && refApply.current !== undefined) {
          refApply.current.close();
        }
        setLoader(false);
        Alert.alert('Something went wrong', error);
      },
    );
  };
  /**
   *
   * API Section
   */

  const updateData = type => {
    openMode = type;
    let userDetails = global.userDetails;
    setFullName(type === 2 ? '' : Helper.concatName(userDetails));
    setLinkedInProfile(type === 2 ? '' : userDetails.linkedinUrl);
    setphoneNumber(type === 2 ? '' : userDetails.phone);
    setEmailAddress(type === 2 ? '' : userDetails.email);
    setNotes('');
    setErrorMessage({});
  };

  const concateLocation = item => {
    let locationString = '';

    if (item.city !== undefined && item.city !== null && item.city !== '') {
      locationString += item.city + ', ';
    }

    if (
      item.country !== undefined &&
      item.country !== null &&
      item.country !== ''
    ) {
      locationString += item.country;
    }
    return locationString;
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar
        title={'Details'}
        navigation={navigation}
        customIcon={{
          containerStyle: {height: scale(30), width: scale(30)},
          iconColor: GlobalInclude.Color.ColorPrimary,
          iconName: 'keyboard-backspace',
          size: scale(30),
          type: IconType[1],
        }}
        customIconPress={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.fill}>
          {isLoading ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator
                size={'small'}
                color={GlobalInclude.Color.ColorPrimary}
              />
            </View>
          ) : (
            <View style={[GlobalInclude.AppStyle.fill, g.mt15]}>
              {pageContent !== null && (
                <View style={GlobalInclude.AppStyle.fill}>
                  <View style={GlobalInclude.AppStyle.fill}>
                    <View
                      style={{
                        marginBottom: scale(15),
                        marginHorizontal: scale(15),
                      }}>
                      <View
                        style={[
                          g.bgWhite,
                          g.boxShadow,
                          {borderRadius: scale(10)},
                          g.p10,
                        ]}>
                        <View style={grid.rowdir}>
                          <ProgressImage
                            source={
                              pageContent.logo !== undefined &&
                              pageContent.logo !== null &&
                              pageContent.logo !== ''
                                ? {uri: pageContent.logo}
                                : GlobalInclude.Assets.MainLogo
                            }
                            containerStyle={{
                              height: scale(65),
                              width: scale(65),
                              borderRadius: scale(10),
                            }}
                            imageStyle={{
                              height: scale(65),
                              width: scale(65),
                              borderRadius: scale(10),
                            }}
                            mode={'contain'}
                          />
                          <View style={[grid.col, g.ml5]}>
                            <Text
                              numberOfLines={1}
                              style={[
                                g.txtRight,
                                pageContent.status === 1 ? g.FHNB : g.FHNM,
                                g.fs13,
                                GlobalInclude.AppStyle.transform,
                                pageContent.status === 1
                                  ? g.colorBlue
                                  : pageContent.status === 2
                                  ? g.colorGray
                                  : g.colordarkGray,
                              ]}>
                              {pageContent.status === 1 ? 'Open' : 'Closed'}
                            </Text>
                          </View>
                        </View>
                        <View style={g.mt5}>
                          <Text
                            numberOfLines={2}
                            style={[
                              g.FHNM,
                              g.fs14,
                              g.colorBlack,
                              GlobalInclude.AppStyle.transform,
                            ]}>
                            {pageContent.title !== undefined &&
                            pageContent.title !== null &&
                            pageContent.title !== ''
                              ? pageContent.title
                              : 'N/A'}
                          </Text>

                          <Text
                            numberOfLines={1}
                            style={[
                              g.FHNM,
                              g.fs14,
                              g.colorGray,
                              GlobalInclude.AppStyle.transform,
                            ]}>
                            {pageContent.forCompany !== undefined &&
                            pageContent.forCompany !== null &&
                            pageContent.forCompany !== ''
                              ? pageContent.forCompany
                              : 'N/A'}
                          </Text>
                          <Text
                            numberOfLines={1}
                            style={[
                              g.FHNM,
                              g.fs14,
                              g.colorGray,
                              GlobalInclude.AppStyle.transform,
                            ]}>
                            {concateLocation(pageContent)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {/* Design two */}

                    <ScrollableTabView
                      underlineColor={'#ffffff'}
                      initialPage={0}
                      tabBarActiveTextColor={GlobalInclude.Color.ColorPrimary}
                      tabBarInactiveTextColor={'#bababa'}
                      tabBarTextStyle={{
                        fontSize: scale(15),
                        fontFamily: 'Lato-Regular',
                        margin: -5,
                      }}
                      tabBarUnderlineStyle={style.tabBarUnderlineStyle}
                      renderTabBar={() => (
                        <ScrollableTabBar style={style.tabBarStyle} />
                      )}>
                      <JobDescription
                        tabLabel={'Job Description'}
                        content={pageContent}
                      />
                      <OtherDetails
                        tabLabel={'More Details'}
                        content={pageContent}
                      />
                      <PostedBy
                        tabLabel={'PostedBy'}
                        content={pageContent}
                        navigation={navigation}
                      />
                    </ScrollableTabView>
                  </View>

                  <View style={style.buttonContainer}>
                    <View style={grid.flex1}>
                      <TouchableOpacity
                        activeOpacity={1}
                        disabled={
                          pageContent !== null && pageContent.status !== 1
                        }
                        style={[
                          style.button,
                          {
                            backgroundColor:
                              pageContent !== null && pageContent.status !== 1
                                ? '#ebebe4'
                                : GlobalInclude.Color.ColorPrimary,
                          },
                        ]}
                        onPress={() => {
                          updateData(2);
                          if (
                            refApply.current !== null &&
                            refApply.current !== undefined
                          ) {
                            refApply.current.open();
                          }
                        }}>
                        <Text
                          style={[
                            g.fs16,
                            g.FHNB,
                            pageContent !== null && pageContent.status !== 1
                              ? g.colorGray8
                              : g.colorWhite,
                            grid.textCenter,
                            g.mr5,
                          ]}>
                          Recommend
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{marginHorizontal: scale(10)}} />
                    <View style={grid.flex1}>
                      <TouchableOpacity
                        activeOpacity={1}
                        disabled={
                          pageContent !== null && pageContent.status !== 1
                        }
                        style={[
                          style.button,
                          {
                            backgroundColor:
                              pageContent !== null && pageContent.status !== 1
                                ? '#ebebe4'
                                : GlobalInclude.Color.ColorPrimary,
                          },
                        ]}
                        onPress={() => {
                          updateData(1);
                          if (
                            refApply.current !== null &&
                            refApply.current !== undefined
                          ) {
                            refApply.current.open();
                          }
                        }}>
                        <Text
                          style={[
                            g.fs16,
                            g.FHNB,
                            pageContent !== null && pageContent.status !== 1
                              ? g.colorGray8
                              : g.colorWhite,
                            grid.textCenter,
                            g.mr5,
                          ]}>
                          Apply
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>

      {/* Apply */}
      <OptionsSheet
        ref={refApply}
        minClosingHeight={50}
        height={height / 2 + 225}
        duration={200}
        closeOnDragDown={true}
        customStyles={{
          container: GlobalInclude.AppStyle.sheetContainer,
        }}>
        <View style={[grid.flex1, g.mb10]}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            style={grid.flex1}
            showsVerticalScrollIndicator={false}>
            <View style={grid.flex1}>
              <View style={g.mb15}>
                {generateHeader('Name', true)}
                <TextInput
                  underlineColorAndroid="transparent"
                  style={g.inputWhite}
                  maxLength={50}
                  keyboardType={'default'}
                  autoCapitalize={'words'}
                  returnKeyType={'done'}
                  placeholder={'Type your name'}
                  value={fullName}
                  onChangeText={value => {
                    setFullName(value);
                  }}
                />
                {errorMessage.fullName && errorMessage.fullName.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.fullName}
                  </Text>
                )}
              </View>
              <View style={g.mb15}>
                {generateHeader('LinkedIn Profile', false)}
                <TextInput
                  underlineColorAndroid="transparent"
                  style={g.inputWhite}
                  maxLength={100}
                  keyboardType={'default'}
                  autoCapitalize={'none'}
                  returnKeyType={'done'}
                  placeholder={'Write/Paste link'}
                  value={linkedInProfile}
                  onChangeText={value => {
                    setLinkedInProfile(value);
                  }}
                />
              </View>
              <View style={g.mb15}>
                {generateHeader('Email', false)}
                <TextInput
                  underlineColorAndroid="transparent"
                  style={g.inputWhite}
                  maxLength={264}
                  keyboardType={'default'}
                  autoCapitalize={'none'}
                  returnKeyType={'done'}
                  placeholder={'Write your email address'}
                  value={emailAddress}
                  onChangeText={value => {
                    setEmailAddress(value);
                  }}
                />
                {errorMessage.emailAddress &&
                  errorMessage.emailAddress.length > 0 && (
                    <Text style={[g.errorMsg, g.pt5]}>
                      {errorMessage.emailAddress}
                    </Text>
                  )}
              </View>
              <View style={g.mb15}>
                {generateHeader('Phone Number', true)}
                <TextInput
                  underlineColorAndroid="transparent"
                  style={g.inputWhite}
                  maxLength={15}
                  keyboardType={'phone-pad'}
                  autoCapitalize={'none'}
                  returnKeyType={'done'}
                  placeholder={'Write phone number'}
                  value={phoneNumber}
                  onChangeText={value => {
                    setphoneNumber(value);
                  }}
                />
                {errorMessage.phoneNumber &&
                  errorMessage.phoneNumber.length > 0 && (
                    <Text style={[g.errorMsg, g.pt5]}>
                      {errorMessage.phoneNumber}
                    </Text>
                  )}
              </View>
              <View style={g.mb15}>
                {generateHeader('Notes', false)}
                <TextInput
                  underlineColorAndroid="transparent"
                  style={{
                    height: 120,
                    color: 'black',
                    textAlignVertical: 'top',
                    backgroundColor: '#f8f8f8',
                    padding: scale(10),
                    margin: 0,
                    fontSize: scale(12),
                    borderRadius: scale(8),
                    fontFamily: 'Lato-Regular',
                    justifyContent: 'center',
                  }}
                  multiline={true}
                  maxLength={1000}
                  keyboardType={'default'}
                  autoCapitalize={'sentences'}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  placeholder={'Type here'}
                  value={notes}
                  onChangeText={value => {
                    setNotes(value);
                  }}
                />
              </View>
            </View>
            <CommonButton
              title={'Send'}
              showLoader={loader}
              onPress={() => {
                setErrorMessage({});
                if (openMode === 1) {
                  if (fullName.trim() === '' || fullName.trim().length === 0) {
                    setErrorMessage({fullName: 'This field is required'});
                    return;
                  } else if (
                    phoneNumber.trim() === '' ||
                    phoneNumber.trim().length === 0
                  ) {
                    setErrorMessage({phoneNumber: 'This field is required'});
                    return;
                  }
                } else if (openMode === 2) {
                  if (fullName.trim() === '' || fullName.trim().length === 0) {
                    setErrorMessage({fullName: 'This field is required'});
                    return;
                  }
                }

                applyJob();
              }}
            />
          </KeyboardAwareScrollView>
        </View>
      </OptionsSheet>
      {/* Apply */}

      {showErrorMessage && (
        <GlobalInclude.ModalAlert
          status={showErrorMessage}
          header={responseMessage}
          okButton={isSuccess ? 'Okay' : `Contact ${APP_NAME}`}
          okAction={() => {
            setShowErrorMessage(!showErrorMessage);
          }}
          closeAction={() => {
            setShowErrorMessage(!showErrorMessage);
          }}
        />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  tabBarStyle: {borderBottomWidth: 0, margin: 0},
  tabBarUnderlineStyle: {
    borderBottomColor: 'transparent',
    backgroundColor: 'white',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#f8f8f8',
    borderRadius: scale(8),
    flex: 1,
    height: scale(38),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  searchIcon: {
    height: scale(20),
    width: scale(20),
    alignSelf: 'center',
    marginEnd: scale(6),
    marginStart: scale(6),
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
  filterText: {
    paddingTop: 12,
    paddingBottom: 12,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
  footerView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  videoContainer: {
    aspectRatio: 16 / 9,
    width: '100%',
    borderRadius: scale(10),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
  },
  overlayStyle: {
    backgroundColor: '#00000066',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: scale(10),
  },
  thumbStyle: {
    borderRadius: scale(10),
    aspectRatio: 16 / 9,
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  playIconstyle: {
    position: 'absolute',
    zIndex: 9,
    bottom: 15,
    left: 15,
  },
  imageStyle: {
    aspectRatio: 16 / 9,
    borderRadius: scale(10),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  grayColorText: {color: '#bababa'},
  backgroundBorder: {
    borderRadius: scale(10),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
});

export default JobDetails;
