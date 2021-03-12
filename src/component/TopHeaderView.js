import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import g from '../theme/global';
import grid from '../theme/grid';
import {scale} from '../theme/Scalling';
import {CommonActions} from '@react-navigation/native';
const menuOptions = [
  {screen: '', visible: false, value: 0, label: 'Chat'},
  {screen: '', visible: false, value: 1, label: 'Events'},
  {screen: 'SearchDirectory', visible: true, value: 2, label: 'Directory'},
  {screen: '', visible: false, value: 3, label: 'News'},
  {screen: '', visible: false, value: 4, label: 'Ventures'},
  {screen: '', visible: false, value: 5, label: 'Common Room'},
  {screen: '', visible: false, value: 6, label: 'Store'},
  {screen: '', visible: false, value: 7, label: 'Melaram Gallery'},
  {screen: '', visible: false, value: 8, label: 'Jobs'},
  {screen: '', visible: false, value: 9, label: 'Offers'},
  {screen: '', visible: false, value: 10, label: 'Footsteps'},
  {screen: 'Video', visible: false, value: 11, label: 'Videos'},
  {screen: 'Magazine', visible: true, value: 12, label: 'The Rose Bowl'},
  {screen: '', visible: false, value: 13, label: 'Contributions'},
  {screen: '', visible: false, value: 14, label: 'Masters'},
];

const TopHeaderView = ({navigation, index, showBack}) => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [selectedTab] = useState(menuOptions[index].label);
  return (
    <View>
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            <View
              style={[grid.alignItems, grid.col, {marginBottom: scale(15)}]}>
              {menuOptions.map(function (item, i) {
                let arrayStyle = [styles.menuDefaultStyle];
                if (item.label === selectedTab) {
                  arrayStyle.push({color: '#2b3252'});
                } else {
                  arrayStyle.push({color: '#bababa'});
                }
                return item.label !== '' && item.visible ? (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={1}
                    onPress={() => {
                      setOpenDropDown(false);
                      setTimeout(() => {
                        if (item.screen !== '') {
                          if (index !== item.value) {
                            navigation.navigate(item.screen);
                          }
                        }
                      }, 200);
                    }}>
                    <Text style={arrayStyle}>{item.label}</Text>
                  </TouchableOpacity>
                ) : null;
              })}
            </View>
          </ScrollView>
        </View>
      ) : (
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
          <View style={[grid.col, grid.justifyContentCenter]}>
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
                <Image source={GlobalInclude.Assets.Back} style={styles.back} />
              </TouchableOpacity>
            )}
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
});

export default TopHeaderView;
