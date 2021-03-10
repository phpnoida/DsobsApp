/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View} from 'react-native';
import g from '../../theme/global';
import ImageGallery from '../../component/ImageGallery';
import Globalinclude from '../../globalInclude/Globalinclude';

const SocialMedia = (props) => {
  const {profileData} = props;
  const {photos} = profileData;

  let cloneData = JSON.parse(JSON.stringify(photos));
  cloneData = cloneData.reverse();

  console.log('photos', photos);

  return (
    <View style={{flex: 1}}>
      {photos.length > 0 ? (
        <ImageGallery mediaContent={cloneData} />
      ) : (
        <View style={Globalinclude.AppStyle.fillCenter}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            Currently No Data Uploaded!
          </Text>
        </View>
      )}
    </View>
  );
};

export default SocialMedia;
