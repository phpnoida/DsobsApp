import React from 'react';
import {Text, View} from 'react-native';
import g from '../../theme/global';
import ImageGallery from '../../component/ImageGallery';
import GlobalInclude from '../../globalInclude/Globalinclude';

const CompanyPhotos = ({content}) => {
  return (
    <View style={GlobalInclude.AppStyle.fill}>
      {content.images &&
      content.images !== undefined &&
      content.images !== null &&
      content.images.length > 0 ? (
        <ImageGallery mediaContent={content.images} />
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

export default CompanyPhotos;
