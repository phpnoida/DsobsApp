import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {generateView} from '../../../screen/userProfile/SocialMedia';
import {IconType} from '../../../helper/Constants';

const {height, width} = Dimensions.get('window');

const Tags = ({content, productTags}) => (
  <ScrollView style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15]}>
    <View>
      <View style={[g.tagStyle, grid.rowdir, g.mb5]}>
        {generateView('#3b5998', 'facebook', IconType[4], () => {})}
        {generateView('#55acee', 'twitter', IconType[4], () => {})}
        {generateView('#222222', 'wikipedia-w', IconType[4], () => {})}
      </View>

      {productTags &&
      productTags !== undefined &&
      productTags !== null &&
      productTags.length > 0 ? (
        <View style={grid.displayinlineBlock}>
          {productTags.map((v, i) => {
            return (
              <TouchableOpacity
                key={i.toString()}
                style={{margin: scale(4)}}
                activeOpacity={1}>
                <View style={[g.tagStyle, grid.rowdir]}>
                  <Text style={[g.tagTxtStyle, g.mr10]}>{v}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={GlobalInclude.AppStyle.center}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            Currently No Data Uploaded!
          </Text>
        </View>
      )}
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  socialMediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: scale(6),
    alignContent: 'center',
  },
  mediaButtonContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: scale(10),
    margin: scale(6),
    maxWidth: width / 3 - scale(25),
    minWidth: width / 3 - scale(25),
    height: scale(90),
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(6),
  },
});

export default Tags;
