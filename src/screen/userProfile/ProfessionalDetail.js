/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Linking,
  Alert,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import ZoomImage from '../../component/ZoomImage';
import WorkExperience from '../../component/WrokExperience';

let imageArray = [];
const generateView = (title, subTitle, callback) => {
  return (
    <View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          callback();
        }}
        style={[g.boxShadow, g.bgWhite, g.br3, g.mb10, g.p15]}>
        <View style={[grid.rowdir, grid.alignItems]}>
          <View style={[grid.col, g.pl15]}>
            <Text style={[g.colordarkGray, g.fs16, g.FHNB, g.mb5]}>
              {title}
            </Text>
            <Text style={[g.colorLightGray, g.fs14, g.FHNR]}>{subTitle}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ProfessionalDetail = (props) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const {profileData} = props;

  let profession = '';
  if (profileData.profession.includes('-')) {
    let profArray = profileData.profession.split('-');
    profession = profArray.length > 2 ? profArray[2] : profileData.profession;
  } else {
    profession = profileData.profession;
  }

  const generateWorkExperience = ({item, index}) => {
    return (
      <WorkExperience
        indexName={index}
        header={item.company}
        subHeader={item.designation}
        description={`${item.fromYear}${
          item.toYear ? ' - ' + item.toYear : ''
        }`}
        // video={item.video}
        // link={item.link}
        // image={item.image}
        onImagePress={() => {
          imageArray = [{url: item.image}];
          setShowImageModal(!showImageModal);
        }}
      />
    );
  };

  return (
    <View style={{paddingStart: scale(15), paddingEnd: scale(15), flex: 1}}>
      {profileData.linkedinUrl === '' &&
      profileData.designation === '' &&
      profileData.company === '' &&
      profileData.businessSector === '' &&
      profileData.uersExperience.length === 0 ? (
        <View style={GlobalInclude.AppStyle.fillCenter}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            Currently No Data Uploaded!
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{padding: scale(5)}}>
            {generateView('My Linkedin Page', profileData.linkedinUrl, () => {
              if (profileData.linkedinUrl !== '') {
                Linking.canOpenURL(profileData.linkedinUrl).then((status) => {
                  if (status) {
                    Linking.openURL(profileData.linkedinUrl);
                  } else {
                    Alert.alert('Invalid link!');
                  }
                });
              }
            })}
            {generateView('Designation', profileData.designation, () => {})}
            {/* {generateView('Profession', profession, () => {})} */}
            {generateView('Company Name', profileData.company, () => {})}
            {profileData.businessSector !== '' &&
              generateView(
                'Sector of Business',
                profileData.businessSector,
                () => {},
              )}
            {/* {profileData.secondaryBusinessSector !== '' &&
            generateView(
              'Secondary Sector of Business',
              profileData.secondaryBusinessSector,
              () => {},
            )} */}

            {generateView(
              'Open To Mentoring',
              profileData.mentoring ? 'Yes' : 'No',
              () => {},
            )}
            {profileData.uersExperience.length > 0 && (
              <View style={{marginTop: scale(8)}}>
                <Text
                  style={[
                    g.colordarkGray,
                    g.fs16,
                    g.FHNB,
                    {marginStart: scale(5)},
                  ]}>
                  Work Experience
                </Text>
                <FlatList
                  data={profileData.uersExperience}
                  renderItem={generateWorkExperience}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{
                    paddingTop: scale(8),
                    paddingStart: scale(5),
                    paddingEnd: scale(5),
                    paddingBottom: scale(5),
                  }}
                />
              </View>
            )}
          </View>
        </ScrollView>
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

export default ProfessionalDetail;
