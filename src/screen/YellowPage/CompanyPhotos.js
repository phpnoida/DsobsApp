import React from 'react';
import {Text, View} from 'react-native';
import g from '../../theme/global';
import ImageGallery from '../../component/ImageGallery';
import Globalinclude from '../../globalInclude/Globalinclude';

const CompanyPhotos = ({photos}) => {
  let cloneData = [];

  for (let i = 0; i < 15; i++) {
    cloneData.push({
      type: 1,
      thumbnail: `https://picsum.photos/seed/${new Date().getMilliseconds()}/200/300`,
    });
  }

  return (
    <View style={{flex: 1}}>
      {cloneData.length > 0 ? (
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

export default CompanyPhotos;
