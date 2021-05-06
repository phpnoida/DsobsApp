import React from 'react';
import {Text, View} from 'react-native';
import g from '../../theme/global';
import ImageGallery from '../../component/ImageGallery';
import Globalinclude from '../../globalInclude/Globalinclude';

const CompanyPhotos = ({content}) => {

  console.log('====================================');
  console.log('content.images', JSON.stringify(content.images));
  console.log('====================================');
  let cloneData = [];

  for (let i = 0; i < 15; i++) {
    cloneData.push({
      type: 1,
      thumbnail: `https://picsum.photos/seed/${new Date().getMilliseconds()}/200/300`,
    });
  }

  return (
    <View style={Globalinclude.AppStyle.fill}>
      {content.images &&
      content.images !== undefined &&
      content.images !== null &&
      content.images.length > 0 ? (
        <ImageGallery mediaContent={content.images} />
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

export default CompanyPhotos;
