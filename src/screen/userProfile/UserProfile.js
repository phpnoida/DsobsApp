import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getUserProfile,
  getUserProfileFromDirectory,
} from '../../Actions/UserActions';
import ProfileSheet from 'react-native-raw-bottom-sheet';
import Icons from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import UserProfileHeader from '../../component/UserProfileHeader';
import Contact from './Contact';
import AboutMe from './AboutMe';
import SocialMedia from './SocialMedia';
import ProfessionalDetail from './ProfessionalDetail';
import UserMedia from './UserMedia';
import Tags from './Tags';
import UserEducational from './UserEducational';
import Awards from './Awards';
import MyRelatives from './MyRelatives';
import MyFamily from './MyFamily';
import Links from './Links';
import MyStatusBar from '../../component/MyStatusBar';

import {IconType} from '../../helper/Constants';

let profileSheetMenu = [
  {
    title: 'Edit Profile',
    icon: 'edit',
    screenName: 'EditProfile',
    key: '1',
  },
  {
    title: 'Share Profile',
    icon: 'share-square-o',
    screenName: '',
    key: '2',
  },
  {title: 'Bookmark Profile', icon: 'bookmark', screenName: '', key: '3'},

  {title: 'Add Calendar', icon: 'calendar', screenName: '', key: '4'},
  {title: 'Delete Profile', icon: 'trash', screenName: '', key: '5'},
];

let profileSheet = null,
  userId = '',
  birthDate = 'N/A',
  moveToTab = 1;

const UserProfile = ({route, navigation}) => {
  if (route !== null) {
    if (route.params && route.params !== undefined && route.params !== null) {
      userId = route.params.userId;
    }
  }
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    profileSheet = null;

    birthDate = 'N/A';
    moveToTab = 1;

    console.log('Request for', userId);
    if (userId === global.userId) {
      getProfile();
    } else {
      getOtherUserProfile();
    }
    return () => {};
  }, []);

  /**
   * ************************************************
   * API Section Start
   * ************************************************
   */

  const getProfile = () => {
    setIsLoading(true);
    getUserProfile(
      userId,
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

              console.log('profile', profile);

              global.userDetails = profile;
              global.firstName = profile.firstName;
              global.lastName = profile.lastName;

              AsyncStorage.setItem('userDetails', JSON.stringify(profile)).then(
                () => {
                  userId = profile._id;
                  if (profile._id !== global.userId) {
                    profileSheetMenu.splice(0, 1);
                    profileSheetMenu.splice(3, 1);
                  }
                  if (
                    profile.dob &&
                    profile.dob !== undefined &&
                    profile.dob !== '' &&
                    profile.dob !== 'Invalid date'
                  ) {
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

                    birthDate = `${date}/${month}/${formatedDate.getFullYear()}`;
                  }
                  setProfileData(profile);
                },
              );
            }
          }
        }
      },
      (error) => {
        setIsLoading(false);
        console.log('error', error);
      },
    );
  };

  const getOtherUserProfile = () => {
    setIsLoading(true);
    getUserProfileFromDirectory(
      userId,
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

              console.log('profile', profile);
              userId = profile._id;

              if (profile._id !== global.userId) {
                profileSheetMenu.splice(0, 1);
                profileSheetMenu.splice(3, 1);
              }
              if (
                profile.dob &&
                profile.dob !== undefined &&
                profile.dob !== 'Invalid date'
              ) {
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

                birthDate = `${date}/${month}/${formatedDate.getFullYear()}`;
              }
              setProfileData(profile);
            }
          }
        }
      },
      (error) => {
        setIsLoading(false);
        console.log('error', error);
      },
    );
  };

  /*
   * ************************************************
   * API Section End
   * ************************************************
   */

  const onRefresh = () => {
    setStep(1);
    if (userId === global.userId) {
      getProfile();
    } else {
      getOtherUserProfile();
    }
  };

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

  /*
   * ************************************************
   * forward backword end
   * ************************************************
   */

  const naviateEditProfile = (moveToStep) => {
    if (moveToStep === 11) {
      navigation.navigate('EditProfile', {
        userId: userId,
        step: 4,
        profileData: JSON.stringify(profileData),
        onRefresh: onRefresh,
      });
    } else {
      navigation.navigate('EditProfile', {
        userId: userId,
        step: moveToStep,
        profileData: JSON.stringify(profileData),
        onRefresh: onRefresh,
      });
    }
  };

  const inflateMenu = (item) => {
    return (
      <View
        key={item.index.toString()}
        style={[styles.bottomBorderStyle, styles.profileMenuContainer]}>
        <TouchableOpacity
          style={[
            grid.rowdir,
            grid.alignItems,
            {paddingTop: scale(3), paddingBottom: scale(3)},
          ]}
          onPress={() => {
            profileSheet.close();
            if (item.item.key === '1') {
              naviateEditProfile(1);
            } else {
              Alert.alert('Coming soon...');
            }
          }}>
          <Icons name={item.item.icon} color={'#2b3252'} size={scale(26)} />
          <Text style={[g.fs16, g.FHNB, g.colorBlack, g.ml15]}>
            {item.item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.parentStyle}>
          {isLoading ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator size={'small'} color={'#2b3252'} />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              {profileData !== null && (
                <View style={GlobalInclude.AppStyle.fill}>
                  <View style={GlobalInclude.AppStyle.contentSpace}>
                    <View
                      style={[
                        grid.rowdir,
                        grid.justifyContent,
                        grid.alignItems,
                      ]}>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => moveBack(step)}>
                        <Image
                          source={GlobalInclude.Assets.Back}
                          style={styles.back}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          profileSheet.open();
                        }}
                        style={[g.pr5]}
                        activeOpacity={1}>
                        <Image
                          source={GlobalInclude.Assets.Menu}
                          style={styles.back}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                    <UserProfileHeader
                      profileImg={profileData.profileImg}
                      firstName={profileData.firstName}
                      lastName={profileData.lastName}
                      schoolNo={profileData.schoolNumber}
                      section={profileData.section}
                      batch={profileData.batch}
                      house={profileData.house}
                      userId={userId}
                      profession={profileData.profession}
                      city={profileData.city}
                      lastseen={profileData.lastseen}
                    />
                  </View>

                  <ScrollableTabView
                    underlineColor={'#ffffff'}
                    style={{paddingLeft: 0, paddingRight: 0, margin: 0}}
                    tabBarActiveTextColor={'#2b3252'}
                    tabBarInactiveTextColor={'#bababa'}
                    tabBarTextStyle={{
                      fontSize: scale(15),
                      fontFamily: 'Lato-Regular',
                      margin: -5,
                    }}
                    tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
                    renderTabBar={() => (
                      <ScrollableTabBar style={styles.tabBarStyle} />
                    )}
                    onChangeTab={(tabVal) => {
                      moveToTab = tabVal.i + 1;
                    }}>
                    <Contact
                      tabLabel={'Contact'}
                      userId={userId}
                      phone={profileData.phone}
                      countryCode={profileData.countryCode}
                      phoneScope={profileData.phoneScope}
                      emailScope={profileData.emailScope}
                      email={profileData.email}
                      dob={birthDate}
                      petName={profileData.petName}
                      secondaryPhone={profileData.secondaryPhone}
                      secondaryCountryCode={
                        profileData.secondaryCountryCode !== undefined
                          ? profileData.secondaryCountryCode
                          : ''
                      }
                      secondaryPhoneScope={profileData.secondaryPhoneScope}
                      secondaryEmail={profileData.secondaryEmail}
                      secondaryEmailScope={profileData.secondaryEmailScope}
                      permanentAddress={profileData.permanentAddress}
                      correspondenceAddress={profileData.correspondenceAddress}
                      bloodGroup={
                        profileData.bloodGroup === "i don't know"
                          ? "I Don't Know"
                          : profileData.bloodGroup.toUpperCase()
                      }
                    />
                    <AboutMe
                      tabLabel={'About Me'}
                      aboutMe={profileData.aboutMe}
                      schoolMemories={profileData.schoolMemories}
                      philosophy={profileData.philosophy}
                      hobbies={profileData.hobbies}
                      favMusician={profileData.favMusician}
                      favMovies={profileData.favMovies}
                      favBooks={profileData.favBooks}
                      favPeople={profileData.favPeople}
                      philanthorpy={profileData.philanthorpy}
                      favSportsTeams={profileData.favSportsTeams}
                    />
                    <UserMedia tabLabel={'Media'} profileData={profileData} />
                    <SocialMedia
                      tabLabel={'Social'}
                      profileData={profileData}
                    />
                    <ProfessionalDetail
                      tabLabel={'Professional Detail'}
                      profileData={profileData}
                    />
                    <Tags tabLabel={'Tags'} profileData={profileData} />
                    <UserEducational
                      tabLabel={'Training'}
                      profileData={profileData}
                    />
                    <Awards tabLabel={'Awards'} profileData={profileData} />
                    <MyRelatives
                      tabLabel={'Relatives in School'}
                      profileData={profileData}
                    />
                    <MyFamily
                      tabLabel={'My Family'}
                      profileData={profileData}
                    />
                    {profileData.links &&
                      profileData.links !== undefined &&
                      profileData.links.length > 0 && (
                        <Links tabLabel={'Links'} profileData={profileData} />
                      )}
                  </ScrollableTabView>

                  {userId === global.userId ? (
                    <TouchableOpacity
                      onPress={() => {
                        naviateEditProfile(moveToTab);
                      }}
                      activeOpacity={0.8}
                      style={styles.absoluteView}>
                      <View style={styles.floatingButtonContainer}>
                        <GlobalInclude.BaseIcon
                          containerStyle={{height: scale(26), width: scale(26)}}
                          iconColor={'#fff'}
                          iconName={'pencil'}
                          iconSize={scale(26)}
                          iconType={IconType[4]}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
            </View>
          )}
        </View>

        {/* city list sheet */}
        <ProfileSheet
          ref={(ref) => {
            profileSheet = ref;
          }}
          height={390}
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
          <View>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={profileSheetMenu}
              renderItem={inflateMenu}
            />
          </View>
        </ProfileSheet>
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
  },
  profileMenuContainer: {
    paddingTop: scale(7),
    paddingBottom: scale(7),
    marginBottom: scale(4),
  },
  bottomBorderStyle: {borderBottomColor: '#e5e5e5', borderBottomWidth: 1},
  tabBarStyle: {borderBottomWidth: 0, margin: 0},
  tabBarUnderlineStyle: {
    borderBottomColor: 'transparent',
    backgroundColor: 'white',
  },
  floatingButtonContainer: {
    borderRadius: scale(60),
    width: scale(60),
    height: scale(60),
    backgroundColor: '#2b3252',
    alignItems: 'center',
    justifyContent: 'center',
  },
  absoluteView: {
    position: 'absolute',
    bottom: 30,
    zIndex: 1,
    right: 15,
  },
});

export default UserProfile;
