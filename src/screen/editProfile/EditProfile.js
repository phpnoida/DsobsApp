import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Keyboard,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import * as Progress from 'react-native-progress';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {CommonActions} from '@react-navigation/native';
import Globalinclude from '../../globalInclude/Globalinclude';
import MyStatusBar from '../../component/MyStatusBar';
import BasicProfile from './BasicProfile';
import AboutMe from './AboutMe';
import PhotosMedia from './PhotosMedia';
import SocialLinks from './SocialLinks';
import ProfessionalDetails from './ProfessionalDetails';
import Tags from './Tags';
import Educational from './Educational';
import Awards from './Awards';
import Relatives from './Relatives';
import MyFamily from './MyFamily';

let width = Dimensions.get('window').width;
let givenStep = 1;
let userData = '';
let selectedStep = -1;

const menuOptions = [
  {value: 1, label: 'Basic Profile '},
  {value: 2, label: 'About Me'},
  {value: 3, label: 'Photos/Media'},
  {value: 4, label: 'Social/Links'},
  {value: 5, label: 'Professional Details'},
  {value: 6, label: 'Tags'},
  {value: 7, label: 'Educational/Training'},
  {value: 8, label: 'Awards/Distinctions'},
  {value: 9, label: 'Relatives in School'},
  {value: 10, label: 'My Family'},
  {value: 11, label: 'Delete Profile'},
];

const EditProfile = ({route, navigation}) => {
  if (route.params && route.params !== null && route.params !== undefined) {
    givenStep = route.params.step;
    userData = JSON.parse(route.params.profileData);
  }
  const [step, setStep] = useState(givenStep);
  const [profileData, setProfileData] = useState(userData);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [selectedTab, setSelectedTab] = useState(
    menuOptions[givenStep - 1].label,
  );

  /*
   * Bar percentages start
   */
  const getBarPercentage = (currentStep) => {
    if (currentStep === 1) {
      return 0.1;
    } else if (currentStep === 2) {
      return 0.2;
    } else if (currentStep === 3) {
      return 0.3;
    } else if (currentStep === 4) {
      return 0.4;
    } else if (currentStep === 5) {
      return 0.5;
    } else if (currentStep === 6) {
      return 0.6;
    } else if (currentStep === 7) {
      return 0.7;
    } else if (currentStep === 8) {
      return 0.8;
    } else if (currentStep === 9) {
      return 0.9;
    } else if (currentStep === 10) {
      return 1;
    }
  };

  /*
   * Bar percentages end
   */

  /*
   * ************************************************
   * forward backword start
   * ************************************************
   */

  const moveBack = () => {
    // navigation.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [{name: 'Dashboard'}],
    //   }),
    // );

    route.params.onRefresh();
    navigation.goBack();
  };

  const goPreviousTab = () => {
    Keyboard.dismiss();
    if (step > 1) {
      setStep(step - 1);
      setSelectedTab(findLabel(step - 1));
    }
  };

  const findLabel = (index) => {
    for (let i = 0; i < menuOptions.length; i++) {
      const item = menuOptions[i];
      if (item.value === index) {
        return item.label;
      }
    }
  };

  const refreshStep = () => {
    Keyboard.dismiss();
    setStep(0);
    setStep(selectedStep);
    setSelectedTab(menuOptions[selectedStep - 1].label);
  };

  const updateMultipleFields = (newValues) => {
    let oldData = profileData;
    Object.assign(oldData, newValues);
    selectedStep = step;
    setProfileData(oldData);
    refreshStep();
  };

  const validateAndMoveNextTab = () => {
    Keyboard.dismiss();
    if (step === 10) {
      moveBack();
    } else {
      setStep(step + 1);
      setSelectedTab(menuOptions[step].label);
    }
  };

  /*
   * ************************************************
   * forward backword end
   * ************************************************
   */

  const removeIndex = (callBack) => {
    Alert.alert(
      'Are you sure you want to delete it?',
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
            callBack();
          },
        },
      ],
      {cancelable: false},
    );
  };

  /*
   * load UI page start
   */
  const loadPage = (page) => {
    switch (page) {
      case 1: {
        return (
          <BasicProfile
            profileData={profileData}
            onSaveTab={() => validateAndMoveNextTab()}
            updateData={updateMultipleFields}
          />
        );
      }
      case 2: {
        return (
          <AboutMe
            profileData={profileData}
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviuosTab={() => goPreviousTab()}
            updateData={updateMultipleFields}
          />
        );
      }
      case 3: {
        return (
          <PhotosMedia
            profileData={profileData}
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviuosTab={() => goPreviousTab()}
            removeIndex={removeIndex}
            updateData={updateMultipleFields}
          />
        );
      }
      case 4: {
        return (
          <SocialLinks
            profileData={profileData}
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviuosTab={() => goPreviousTab()}
            removeIndex={removeIndex}
            updateData={updateMultipleFields}
          />
        );
      }
      case 5: {
        return (
          <ProfessionalDetails
            profileData={profileData}
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviuosTab={() => goPreviousTab()}
            removeIndex={removeIndex}
            updateData={updateMultipleFields}
          />
        );
      }
      case 6: {
        return (
          <Tags
            profileData={profileData}
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviuosTab={() => goPreviousTab()}
            removeIndex={removeIndex}
            updateData={updateMultipleFields}
          />
        );
      }
      case 7: {
        return (
          <Educational
            profileData={profileData}
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviuosTab={() => goPreviousTab()}
            removeIndex={removeIndex}
            updateData={updateMultipleFields}
          />
        );
      }
      case 8: {
        return (
          <Awards
            profileData={profileData}
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviuosTab={() => goPreviousTab()}
            removeIndex={removeIndex}
            updateData={updateMultipleFields}
          />
        );
      }
      case 9: {
        return (
          <Relatives
            profileData={profileData}
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviuosTab={() => goPreviousTab()}
            refreshStep={refreshStep}
            removeIndex={removeIndex}
            updateData={updateMultipleFields}
          />
        );
      }
      case 10: {
        return (
          <MyFamily
            profileData={profileData}
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviuosTab={() => goPreviousTab()}
            refreshStep={refreshStep}
            removeIndex={removeIndex}
            updateData={updateMultipleFields}
          />
        );
      }
    }
    return <View />;
  };
  /*
   * load UI page end
   */

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <View
          style={[
            GlobalInclude.AppStyle.fill,
            GlobalInclude.AppStyle.contentSpace,
          ]}>
          {profileData !== null && (
            <View style={GlobalInclude.AppStyle.fill}>
              <View style={[grid.rowdir, grid.justifyContent, grid.alignItems]}>
                <View style={grid.flex1}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => moveBack()}>
                    <Image
                      source={Globalinclude.Assets.Back}
                      style={styles.back}
                    />
                  </TouchableOpacity>
                </View>
                <View style={grid.justifyContentRight}>
                  <TouchableOpacity
                    style={styles.currentTab}
                    onPress={() => {
                      setOpenDropDown(true);
                    }}
                    activeOpacity={1}>
                    <Text style={[g.colorBlue, g.fs18, g.FHNB, g.txtCenter]}>
                      {selectedTab}
                    </Text>
                    <View style={styles.triangleShape} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[grid.rowdir, grid.justifyContentRight]}>
                <Progress.Bar
                  height={scale(5)}
                  width={width / 2 + 30}
                  progress={getBarPercentage(step)}
                  borderRadius={scale(10)}
                  borderWidth={0}
                  unfilledColor={'#f8f8f8'}
                  color={'#2b3252'}
                />
              </View>
              {openDropDown ? (
                <View style={styles.menuDropDown}>
                  <View style={[grid.rowdir, grid.justifyContentRight, g.pb20]}>
                    <TouchableOpacity
                      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                      onPress={() => {
                        setOpenDropDown(false);
                      }}>
                      <Image
                        source={GlobalInclude.Assets.Close}
                        style={{width: scale(20), height: scale(20)}}
                      />
                    </TouchableOpacity>
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={grid.alignItems}>
                      {menuOptions.map(function (item, i) {
                        let arrayStyle = [styles.menuDefaultStyle];
                        if (item.label === selectedTab) {
                          arrayStyle.push({color: '#2b3252'});
                        } else {
                          arrayStyle.push({color: '#bababa'});
                        }
                        return item.label !== '' ? (
                          <TouchableOpacity
                            key={i}
                            activeOpacity={1}
                            onPress={() => {
                              setSelectedTab(item.label);
                              setOpenDropDown(false);
                              setStep(i + 1);
                            }}>
                            <Text style={arrayStyle}>{item.label}</Text>
                          </TouchableOpacity>
                        ) : null;
                      })}
                    </View>
                  </ScrollView>
                </View>
              ) : (
                <View />
              )}

              <View style={GlobalInclude.AppStyle.fill}>{loadPage(step)}</View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    width: scale(30),
    height: scale(30),
    padding: scale(4),
  },
  currentTab: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
    flexBasis: 0,
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
    borderTopColor: '#d6d6d6',
    marginLeft: 8,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  menuDropDown: {
    padding: 30,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9,
    backgroundColor: '#ffffff',
    flex: 1,
  },
  menuDefaultStyle: {
    fontSize: scale(20),
    fontFamily: 'Lato-Bold',
    marginBottom: scale(20),
  },
});

export default EditProfile;
