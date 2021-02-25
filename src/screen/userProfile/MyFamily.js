/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import GlobalInclude from '../../globalInclude/Globalinclude';
import WorkExperience from '../../component/WrokExperience';
import ZoomImage from '../../component/ZoomImage';
import {scale} from '../../theme/Scalling';
let imageArray = [];

const generateView = (title, subTitle) => {
  return (
    <View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {}}
        style={GlobalInclude.AppStyle.userProfileBox}>
        {title !== null && title !== '' ? (
          <Text style={[g.colordarkGray, g.fs16, g.FHNB, g.mb5]}>{title}</Text>
        ) : null}

        {subTitle !== null && subTitle !== '' ? (
          <Text style={[g.colorLightGray, g.fs14, g.FHNR]}>{subTitle}</Text>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const checkKey = (object, keyName) => {
  if (object.hasOwnProperty(keyName) && object[keyName] !== '') {
    return true;
  } else {
    return false;
  }
};

const MyFamily = (props) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const {profileData} = props;

  const generateWorkExperience = ({item, index}) => {
    console.log('item', item);
    return (
      <View>
        <WorkExperience
          indexName={index}
          header={item.childName}
          subHeader={`DOB. ${item.dob}`}
          description={item.gender.toString() === '1' ? 'Female' : 'Male'}
          image={item.childPhoto}
          onImagePress={() => {
            imageArray = [{url: item.childPhoto}];
            setShowImageModal(!showImageModal);
          }}
        />
      </View>
    );
  };

  return (
    <View style={{paddingStart: scale(15), paddingEnd: scale(15), flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {checkKey(profileData, 'relationsheepStatus')
            ? generateView(
                'Relationship Status',
                profileData.relationsheepStatus,
              )
            : null}

          {profileData.spouseName !== null && profileData.spouseName !== '' ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}}
              style={GlobalInclude.AppStyle.userProfileBox}>
              <View style={[grid.rowdir, grid.alignItems]}>
                <View style={[grid.col, g.pr10]}>
                  <Text style={[g.colordarkGray, g.fs16, g.FHNB]}>Spouse</Text>
                  <Text style={[g.colorLightGray, g.mt5, g.fs14, g.FHNR]}>
                    {profileData.spouseName}
                  </Text>
                </View>
                {profileData.spousePhoto && profileData.spousePhoto !== '' ? (
                  <View
                    style={[
                      g.br3,
                      g.oh,
                      g.bggray3,
                      {backgroundColor: '#b2b2b2', width: 50},
                    ]}>
                    <Image
                      style={[{aspectRatio: 1 / 1}]}
                      resizeMode="cover"
                      source={{uri: profileData.spousePhoto}}
                    />
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          ) : null}

          {checkKey(profileData, 'dateOfMarriage')
            ? generateView('Date of Marriage', profileData.dateOfMarriage)
            : null}
          {checkKey(profileData, 'fatherName')
            ? generateView('Father', profileData.fatherName)
            : null}
          {checkKey(profileData, 'motherName')
            ? generateView('Mother', profileData.motherName)
            : null}

          {profileData.children.length > 0 && (
            <View style={{marginTop: scale(8)}}>
              <Text
                style={[
                  g.colordarkGray,
                  g.fs16,
                  g.FHNB,
                  {marginStart: scale(5)},
                ]}>
                Children
              </Text>
              <FlatList
                data={profileData.children}
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

export default MyFamily;
