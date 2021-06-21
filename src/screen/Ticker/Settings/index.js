import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import HeaderBar from '../../../component/HeaderBar';
import {scale} from '../../../theme/Scalling';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import ViewPost from './ViewPost';
import FollowUser from './FollowUser';
import Notifications from './Notifications';

const Settings = ({navigation}) => {
  return (
    <View style={[GlobalInclude.AppStyle.fill, g.bgWhite]}>
      <HeaderBar title={'Settings'} navigation={navigation} showBack={true} />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <View style={[g.mt5, grid.flex1]}>
          <ScrollableTabView
            underlineColor={'#ffffff'}
            initialPage={0}
            tabBarActiveTextColor={GlobalInclude.Color.ColorPrimary}
            tabBarInactiveTextColor={'#bababa'}
            tabBarTextStyle={style.tabTextStyle}
            tabBarUnderlineStyle={style.tabBarUnderlineStyle}
            renderTabBar={() => <ScrollableTabBar style={style.tabBarStyle} />}>
            <ViewPost tabLabel={'View Posts'} />
            <FollowUser tabLabel={'I Follow'} />
            <Notifications tabLabel={'Notifications'} />
          </ScrollableTabView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  tabBarStyle: {borderBottomWidth: 0, margin: 0},
  tabBarUnderlineStyle: {
    borderBottomColor: 'transparent',
    backgroundColor: 'white',
  },
  tabTextStyle: {
    fontSize: scale(15),
    fontFamily: 'Lato-Regular',
    margin: -5,
  },
});

export default Settings;
