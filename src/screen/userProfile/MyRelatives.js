/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import ZoomImage from '../../component/ZoomImage';

let imageArray = [];

const ProfessionalDetail = (props) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const {profileData} = props;

  const generateWorkExperience = ({item, index}) => {
    return (
      <View style={{padding: scale(5)}}>
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          onPress={() => {}}
          style={[g.boxShadow, g.bgWhite, g.br3, g.mb10, g.p15]}>
          <View style={[grid.rowdir, grid.alignItems]}>
            <TouchableOpacity onPress={() => {}} activeOpacity={0.8}>
              <View
                style={[
                  g.bggray,
                  g.oh,
                  {
                    width: scale(48),
                    borderRadius: scale(48),
                    height: scale(48),
                  },
                ]}>
                {item.relativeProfileImg !== undefined &&
                item.relativeProfileImg !== '' ? (
                  <Image
                    style={{
                      aspectRatio: 1 / 1,
                      width: scale(48),
                      height: scale(48),
                    }}
                    resizeMode="cover"
                    source={{uri: item.relativeProfileImg}}
                  />
                ) : (
                  <Image
                    style={{
                      aspectRatio: 1 / 1,
                      width: scale(48),
                      height: scale(48),
                    }}
                    resizeMode="cover"
                    source={GlobalInclude.Assets.AppLogo}
                  />
                )}
              </View>
            </TouchableOpacity>
            <View style={[grid.col, g.pl10]}>
              <Text style={styles.menuHeader}>{item.relationship}</Text>
              <View style={{margin: scale(5)}} />
              <Text style={styles.menuTitle}>{item.relativeName}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{paddingStart: scale(15), paddingEnd: scale(15), flex: 1}}>
      {profileData.relativeInSchool.length === 0 ? (
        <View style={GlobalInclude.AppStyle.fillCenter}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            Currently No Data Uploaded!
          </Text>
        </View>
      ) : (
        <FlatList
          data={profileData.relativeInSchool}
          renderItem={generateWorkExperience}
          keyExtractor={(item, index) => index.toString()}
        />
      )}

      {showImageModal && (
        <ZoomImage
          mediaContent={imageArray}
          onClose={() => {
            setShowImageModal(!showImageModal);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuTitle: {
    color: '#bababa',
    fontSize: scale(13),
    fontFamily: 'Lato-Regular',
    textAlign: 'left',
  },
  menuHeader: {
    color: '#000',
    fontSize: scale(13),
    fontFamily: 'Lato-Bold',
    textAlign: 'left',
  },
});

export default ProfessionalDetail;
