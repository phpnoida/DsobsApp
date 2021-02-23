import React, {useState} from 'react';
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
  Alert,
} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import Helper from '../helper/Helper';
import g from '../theme/global';
import grid from '../theme/grid';
import {scale} from '../theme/Scalling';

const menuOptions = [
  {value: 0, label: 'Chat'},
  {value: 1, label: 'Events'},
  {value: 2, label: 'Directory'},
  {value: 3, label: 'News'},
  {value: 4, label: 'Ventures'},
  {value: 5, label: 'Common Room'},
  {value: 6, label: 'Store'},
  {value: 7, label: 'Melaram Gallery'},
  {value: 8, label: 'Jobs'},
  {value: 9, label: 'Offers'},
  {value: 10, label: 'Footsteps'},
  {value: 11, label: 'Videos'},
  {value: 12, label: 'The Rose Bowl'},
  {value: 13, label: 'Contributions'},
  {value: 14, label: 'Masters'},
];

const TopHeaderView = (props) => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [selectedTab, setSelectedTab] = useState(
    menuOptions[props.index].label,
  );
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
                return item.label !== '' ? (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={1}
                    onPress={() => {
                      // setSelectedTab(item.label);
                      // setOpenDropDown(false);
                      // if (props.onTabPress) {
                      //   props.onTabPress();
                      // }
                      Alert.alert('Coming soon!');
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
            <TouchableOpacity
              style={{
                width: scale(50),
              }}
              onPress={() => {
                if (props.onIconPress) {
                  props.onIconPress();
                }
              }}>
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
            </TouchableOpacity>
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
            <TouchableOpacity
              style={{
                width: scale(50),
                alignSelf: 'flex-end',
              }}
              activeOpacity={1}
              onPress={() => {
                props.onIconPress();
              }}>
              <Image source={GlobalInclude.Assets.Back} style={styles.back} />
            </TouchableOpacity>
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
