import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
  Alert,
} from 'react-native';
import grid from '../../theme/grid';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import {IconType} from '../../helper/Constants';

const ProfessionalDetail = (props) => {
  const {profileData} = props;

  const generateWorkExperience = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() => {
          Linking.canOpenURL(item.link).then((result) => {
            if (result) {
              Linking.openURL(item.link);
            } else {
              Alert.alert('Invalid link!');
            }
          });
        }}
        style={GlobalInclude.AppStyle.userProfileBox}>
        <View style={[grid.rowdir, grid.alignItems]}>
          <View style={[grid.col]}>
            <Text style={GlobalInclude.AppStyle.menuHeader}>
              {item.aboutLink}
            </Text>
            <View style={{margin: scale(5)}} />
            <Text style={GlobalInclude.AppStyle.menuTitle}>{item.link}</Text>
          </View>
          <GlobalInclude.BaseIcon
            containerStyle={{height: scale(20), width: scale(20)}}
            iconColor={'#6e6e6e'}
            iconName={'eye'}
            iconSize={scale(20)}
            iconType={IconType[4]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{paddingStart: scale(15), paddingEnd: scale(15), flex: 1}}>
      <FlatList
        data={profileData.links}
        renderItem={generateWorkExperience}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default ProfessionalDetail;
