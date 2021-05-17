import React from 'react';
import {Text, View} from 'react-native';
import g from '../../../theme/global';
import ImageGallery from '../../../component/ImageGallery';
import GlobalInclude from '../../../globalInclude/Globalinclude';

const PitchDocument = ({content}) => {

  content.media.map((item, index) => {
    item.key = index;
  });

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      {content.media &&
      content.media !== undefined &&
      content.media !== null &&
      content.media.length > 0 ? (
        <ImageGallery mediaContent={content.media} />
      ) : (
        <View style={GlobalInclude.AppStyle.center}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            Currently No Data Uploaded!
          </Text>
        </View>
      )}
    </View>
  );
};

export default PitchDocument;
