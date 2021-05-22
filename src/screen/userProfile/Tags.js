/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, ScrollView, StyleSheet} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';

const Tags = (props) => {
  const {profileData} = props;
  const {tags} = profileData;

  const renderList = () => {
    let componentArray = [];
    tags.map((item, index) => {
      const component = (
        <View style={styles.tagView} key={index}>
          <Text style={styles.tagText}>{item}</Text>
        </View>
      );
      componentArray.push(component);
    });
    return componentArray;
  };
  return (
    <View style={{paddingStart: scale(15), paddingEnd: scale(15), flex: 1}}>
      {tags.length === 0 ? (
        <View style={GlobalInclude.AppStyle.fillCenter}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            Currently No Data Uploaded!
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.socialMediaContainer}>{renderList()}</View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  socialMediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: scale(6),
  },
  tagView: {
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    borderRadius: 30,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: scale(12),
    textAlign: 'center',
    color: 'white',
  },
});

export default Tags;
