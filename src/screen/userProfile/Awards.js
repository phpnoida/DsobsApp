import React, {useState} from 'react';
import {View, FlatList, Text} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import ZoomImage from '../../component/ZoomImage';
import WorkExperience from '../../component/WrokExperience';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';

let imageArray = [];

const UserEducational = (props) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const {profileData} = props;

  const generateAwards = ({item, index}) => {
    return (
      <View style={{padding: scale(5)}}>
        <WorkExperience
          indexName={index}
          mainTitle={item.awardPlace}
          header={item.awardName}
          subHeader={item.awarCategory}
          description={item.awardYear}
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
      {profileData.awards.length === 0 ? (
        <View style={GlobalInclude.AppStyle.fillCenter}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            Currently No Data Uploaded!
          </Text>
        </View>
      ) : (
        <FlatList
          data={profileData.awards}
          renderItem={generateAwards}
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
