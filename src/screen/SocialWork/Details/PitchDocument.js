import React from 'react';
import {Text, View} from 'react-native';
import g from '../../../theme/global';
import ImageGallery from '../../../component/ImageGallery';
import GlobalInclude from '../../../globalInclude/Globalinclude';

const media = [
  {
    thumbnail:
      'https://dsobs-new.s3.ap-south-1.amazonaws.com/1619262480_777933_1619262475866.pdf',
    fileName:
      'https://dsobs-new.s3.ap-south-1.amazonaws.com/1619262480_777933_1619262475866.pdf',
    type: 3,
    key: 0,
  },
  {
    thumbnail:
      'https://dsobs-new.s3.ap-south-1.amazonaws.com/1619262471_851033_1619262471490.pdf',
    fileName:
      'https://dsobs-new.s3.ap-south-1.amazonaws.com/1619262471_851033_1619262471490.pdf',
    type: 3,
    key: 1,
  },
  {
    thumbnail:
      'https://dsobs-new.s3.ap-south-1.amazonaws.com/1619262466_584918_1619262465457.pdf',
    fileName:
      'https://dsobs-new.s3.ap-south-1.amazonaws.com/1619262466_584918_1619262465457.pdf',
    type: 3,
    key: 2,
  },
  {
    thumbnail:
      'https://dsobs-new.s3.ap-south-1.amazonaws.com/1619247629_957718_1619247628257.pdf',
    fileName:
      'https://dsobs-new.s3.ap-south-1.amazonaws.com/1619247629_957718_1619247628257.pdf',
    type: 3,
    key: 3,
  },
  {
    thumbnail:
      'https://dsobs-new.s3.ap-south-1.amazonaws.com/1615461875_241279_1615461874571.jpg',
    fileName:
      'https://dsobs-new.s3.ap-south-1.amazonaws.com/1615461875_241279_1615461874571.jpg',
    type: 1,
    key: 4,
  },
  {
    fileName: 'https://www.youtube.com/watch?v=hH3uUP_w6oM',
    thumbnail: 'https://www.youtube.com/embed/hH3uUP_w6oM',
    type: 2,
    tags: 'Anotehr video',
    key: 5,
  },
  {
    thumbnail:
      'https://dsobs-new.s3.ap-south-1.amazonaws.com/1615461802_731371_1615461801816.jpg',
    fileName:
      'https://dsobs-new.s3.ap-south-1.amazonaws.com/1615461802_731371_1615461801816.jpg',
    type: 1,
    key: 6,
  },
  {
    fileName: 'https://www.youtube.com/watch?v=oznr-1-poSU',
    thumbnail: 'https://www.youtube.com/embed/oznr-1-poSU',
    type: 2,
    tags: 'Another Video',
    key: 7,
  },
  {
    thumbnail:
      'https://dsobs-new.s3.ap-south-1.amazonaws.com/1615461777_657795_1615461776333.jpg',
    fileName:
      'https://dsobs-new.s3.ap-south-1.amazonaws.com/1615461777_657795_1615461776333.jpg',
    type: 1,
    key: 8,
  },
  {
    fileName: 'https://www.youtube.com/watch?v=C0DPdy98e4c',
    thumbnail: 'https://www.youtube.com/embed/C0DPdy98e4c',
    type: 2,
    tags: 'Vide Tag',
    key: 9,
  },
];

const PitchDocument = ({content}) => {
  return (
    <View style={GlobalInclude.AppStyle.fill}>
      {media && media !== undefined && media !== null && media.length > 0 ? (
        <ImageGallery mediaContent={media} />
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
