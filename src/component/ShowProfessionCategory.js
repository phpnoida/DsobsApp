import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import GlobalInclude from '../globalInclude/Globalinclude';
import g from '../theme/global';
import {scale} from '../theme/Scalling';
import grid from '../theme/grid';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;




const ShowProfessionCategory = ({
  scrollRef,
  searchTitle,
  selectedGroup,
  professionList,
  onGroupSelect,
  onProfessionSelect,
}) => {
  

  return (
    <View>
      
    </View>
  );
};

const style = StyleSheet.create({
  
});

export default ShowProfessionCategory;
