import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import g from '../theme/global';
import grid from '../theme/grid';
import {scale} from '../theme/Scalling';
import {CommonActions} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
const menuOptions = [
  {screen: 'SearchDirectory', visible: true, value: 0, label: 'Directory'},
  {screen: 'Magazine', visible: true, value: 1, label: 'The Rose Bowl'},
  {screen: 'NewsListing', visible: true, value: 2, label: 'News'},
  {screen: 'Video', visible: true, value: 3, label: 'Videos'},
  {screen: 'GalleryListing', visible: true, value: 4, label: 'Gallery'},
  {screen: 'YellowPages', visible: true, value: 5, label: 'Yellow Pages'},
  {screen: 'Teachers', visible: true, value: 6, label: 'Masters'},
  {screen: 'SocialListing', visible: true, value: 7, label: 'Social Work'},
  {screen: 'SocialVenture', visible: true, value: 8, label: 'Ventures'},
  {screen: 'SocialEvents', visible: true, value: 9, label: 'Events'},
];

const TopHeaderView = ({
  navigation,
  index,
  showBack,
  label,
  showLabel,
  onLabelPress,
  customIcon,
  customIconPress,
}) => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [selectedTab] = useState(menuOptions[index].label);
  return (
    <View style={{zIndex: 9}}>
      {openDropDown ? (
        <View style={styles.menuDropDown}>
          <View style={styles.topContainer} />
          <View style={[grid.rowdir, grid.justifyContentRight]}>
            <TouchableOpacity
              style={g.mr15}
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            <View
              style={[grid.alignItems, grid.col, {marginBottom: scale(15)}]}>
              {menuOptions.map(function (item, i) {
                let arrayStyle = [styles.menuDefaultStyle];
                if (item.label === selectedTab) {
                  arrayStyle.push({color: GlobalInclude.Color.ColorPrimary});
                } else {
                  arrayStyle.push({color: '#bababa'});
                }
                return item.label !== '' && item.visible ? (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={1}
                    onPress={() => {
                      setOpenDropDown(false);
                      if (item.screen !== '') {
                        if (index !== item.value) {
                          navigation.navigate(item.screen);
                        }
                      }
                    }}>
                    <Text style={arrayStyle}>{item.label}</Text>
                  </TouchableOpacity>
                ) : null;
              })}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={g.bgWhite}>
          <View style={styles.topContainer} />
          <View style={[GlobalInclude.AppStyle.contentSpace]}>
            <View style={[grid.rowdir, grid.justifyContent, grid.alignItems]}>
              <View style={[grid.col]}>
                <View style={{width: scale(50)}}>
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
                    <TouchableOpacity
                      style={{}}
                      onPress={() => {
                        navigation.dispatch(
                          CommonActions.reset({
                            index: 0,
                            routes: [{name: 'Dashboard'}],
                          }),
                        );
                      }}>
                      <Image
                        source={GlobalInclude.Assets.AppLogo}
                        style={{width: scale(50), height: scale(50)}}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.currentTab}
                  onPress={() => {
                    setOpenDropDown(true);
                  }}
                  activeOpacity={1}>
                  <Text style={[g.colorBlue, g.fs16, g.FHNB, g.txtCenter]}>
                    {selectedTab}
                  </Text>
                  <View style={styles.triangleShape} />
                </TouchableOpacity>
              </View>
              <View style={[grid.col]}>
                {showBack && (
                  <TouchableOpacity
                    style={{
                      width: scale(50),
                      alignSelf: 'flex-end',
                    }}
                    activeOpacity={1}
                    onPress={() => {
                      navigation.goBack();
                    }}>
                    <Image
                      source={GlobalInclude.Assets.Back}
                      style={styles.back}
                    />
                  </TouchableOpacity>
                )}
                {showLabel && (
                  <TouchableOpacity
                    style={{
                      minWidth: scale(50),
                      alignSelf: 'flex-end',
                    }}
                    activeOpacity={1}
                    onPress={() => {
                      onLabelPress();
                    }}>
                    <Text style={[g.colorBlue, g.fs14, g.FHNB, g.txtRight]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                )}
                {customIcon && (
                  <TouchableOpacity
                    onPress={() => customIconPress()}
                    style={{
                      maxWidth: scale(50),
                      alignSelf: 'flex-end',
                    }}>
                    <GlobalInclude.BaseIcon
                      containerStyle={customIcon.containerStyle}
                      iconColor={customIcon.iconColor}
                      iconName={customIcon.iconName}
                      iconSize={customIcon.size}
                      iconType={customIcon.type}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  currentTab: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex:1,
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
    backgroundColor: '#ffffff',
    marginTop: scale(15),
    marginBottom: scale(30),
    height: '100%',
  },
  menuDefaultStyle: {
    fontSize: scale(20),
    fontFamily: 'Lato-Bold',
    marginBottom: scale(20),
  },
  back: {
    width: scale(30),
    height: scale(30),
    padding: scale(4),
    alignSelf: 'flex-end',
  },
  topContainer: {
    height: Platform.OS === 'android' ? 0 : getStatusBarHeight(),
    width: '100%',
    backgroundColor: 'white',
  },
});

export default TopHeaderView;
