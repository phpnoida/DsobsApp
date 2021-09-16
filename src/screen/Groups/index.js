import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
  TextInput,
  Keyboard,
  Animated,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';

import OptionsSheet from 'react-native-raw-bottom-sheet';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';

import Helpers from '../../helper/Helper';
import {IconType, APP_NAME} from '../../helper/Constants';

import {generateMenuOption} from '../../component/Common';
import TopHeaderView from '../../component/TopHeaderView';
import SingleSearchWithFilter from '../../component/SingleSearchWithFilter';

import MyGroups from './MyGroups';
import DiscoverGroups from './DiscoverGroups';
import BatchGroups from './BatchGroups';
import {doJoinGroup} from '../../Actions/GroupActions';
import {useDispatch} from 'react-redux';
import {refreshScreen} from '../../reducer/GroupReducer';

let responseMessage = '';
let isSuccess = false;
let initialPage = 0;

const GroupsList = ({route, navigation}) => {
  const refOptions = useRef();
  const refJoinGroup = useRef();
  const discoverRef = useRef();
  const tabRef = useRef();
  const dispatch = useDispatch();

  const [firstTimeLoad, setFirstTimeLoad] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

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
  /**
   *
   * @API Section
   */

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
            setTimeout(() => {
              navigation.navigate('CreateGroup');
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
                // if (groupStatus === 2 || groupStatus === 3) {
                //   setTimeout(() => {
                //     joinGroupRequest();
                //   }, 200);
                // }
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
          {firstTimeLoad ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator
                size={'large'}
                color={GlobalInclude.Color.ColorPrimary}
              />
            </View>
          ) : (
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
                    setTimeout(() => {
                      navigation.navigate('StartGroupChat');
                    }, 200);
                  }}
                />
                <DiscoverGroups
                  isActive={currentTab === 2}
                  tabLabel={'Discover More'}
                  onTap={(item, index) => {
                    /*
                      -1 = unjoin
                      0 = pending
                      1 = active
                      2 = rejected
                      3 = removed
                    */
                    console.log('====================================');
                    console.log('selectedItem', JSON.stringify(item));
                    console.log('====================================');
                    setSelectedGroup(item);

                    if (item.status === 1) {
                      navigation.navigate('GroupInfo', {
                        groupId: item._id,
                      });
                    } else {
                      if (
                        refJoinGroup.current !== undefined &&
                        refJoinGroup.current !== null
                      ) {
                        refJoinGroup.current.open();
                      }
                    }
                  }}
                />
                <BatchGroups
                  isActive={currentTab === 3}
                  tabLabel={'Batch Groups'}
                />
              </ScrollableTabView>
            </View>
          )}
        </View>
        {userOptions()}
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
    </View>
  );
};
const styles = StyleSheet.create({
  tabBarStyle: {borderBottomWidth: 0, margin: 0},
  tabBarUnderlineStyle: {
    borderBottomColor: 'transparent',
    backgroundColor: 'white',
  },
});

export default GroupsList;
