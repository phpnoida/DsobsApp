import React, {useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import ZoomImage from '../../component/ZoomImage';
import WorkExperience from '../../component/WrokExperience';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';

const DURATION_UNIT = {
  1: 'Secs',
  2: 'Mins',
  3: 'Hours',
  4: 'Days',
  5: 'Weeks',
  6: 'Months',
  7: 'Years',
};
let imageArray = [];

const UserEducational = (props) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const {profileData} = props;

  const generateExperience = ({item, index}) => {
    return (
      <View style={{padding: scale(5)}}>
        <WorkExperience
          indexName={index}
          header={item.institute}
          subHeader={item.trainingNature}
          description={`${item.trainingYear} | ${item.trainingPeriod} ${
            DURATION_UNIT[item.trainingUnit]
          }`}
          // video={item.video}
          // link={item.link}
          // image={item.image}
          onImagePress={() => {
            imageArray = [{url: item.image}];
            setShowImageModal(!showImageModal);
          }}
        />
      </View>
    );
  };

  return (
    <View style={{paddingStart: scale(15), paddingEnd: scale(15), flex: 1}}>
      {profileData.uersEducational.length === 0 ? (
        <View style={GlobalInclude.AppStyle.fillCenter}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            Currently No Data Uploaded!
          </Text>
        </View>
      ) : (
        <FlatList
          data={profileData.uersEducational}
          renderItem={generateExperience}
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

export default UserEducational;
