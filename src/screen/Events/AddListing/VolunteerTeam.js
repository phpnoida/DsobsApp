import React, {useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import NextPreviousButton from '../../../component/NextPreviousButton';
import ProgressImage from '../../../component/ProgresImage';
import UploadMedia from '../../../component/UploadMedia';
import {generateHeader} from './HeaderTitle';
import {IconType} from '../../../helper/Constants';
import {drawCheckbox} from '../../../component/Common';
import AutoSuggestUser from '../../../component/AutoSuggestUser';

let lastIndex = 0;
const VolunteerTeam = ({
  onSaveTab,
  onPreviousTab,
  addNewVolunteer,
  volunteers,
  updateIndex,
  changeText,
  searchedUser,
  onUserSelect,
  requestedIndex,
}) => {
  const uploadRef = useRef();

  const renderVolunteers = () => {
    return volunteers.map((item, index) => {
      return (
        <View key={index} style={g.mb20}>
          <View style={[grid.rowdir, g.mb5]}>
            <View style={[grid.flex1, grid.rowdir]}>
              <View
                style={{
                  width: scale(75),
                }}>
                {generateHeader(`Organiser ${item.role}`, false)}
              </View>
              <View
                style={{
                  width: scale(120),
                  marginStart: scale(5),
                }}>
                {drawCheckbox('From School', item.fromSchool, () => {
                  updateIndex('fromSchool', !item.fromSchool, index);
                })}
              </View>
            </View>
            {index === 0 && (
              <TouchableOpacity
                onPress={addNewVolunteer}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                {generateHeader('Add More', false)}
              </TouchableOpacity>
            )}
          </View>
          <View style={[grid.rowdir, g.mb5]}>
            {item.imageData !== null && (
              <View style={[grid.alignItems, grid.justifyContentCenter, g.mr5]}>
                <View>
                  <ProgressImage
                    source={{uri: item.imageData}}
                    containerStyle={{
                      height: scale(50),
                      width: scale(50),
                      borderRadius: scale(5),
                    }}
                    imageStyle={{
                      height: scale(50),
                      width: scale(50),
                      borderRadius: scale(5),
                    }}
                  />
                  <TouchableOpacity
                    hitSlop={{
                      top: 15,
                      bottom: 15,
                      left: 15,
                      right: 15,
                    }}
                    onPress={() => {
                      updateIndex('imageData', null, index);
                    }}
                    style={styles.buttonCircle}>
                    <GlobalInclude.BaseIcon
                      containerStyle={{height: scale(15), width: scale(15)}}
                      iconColor={'#FFF'}
                      iconName={'close'}
                      iconSize={scale(15)}
                      iconType={IconType[8]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={grid.flex1}>
              <View style={g.mb10}>
                <TextInput
                  underlineColorAndroid={'transparent'}
                  style={g.inputWhite}
                  maxLength={100}
                  autoCompleteType={'off'}
                  importantForAutofill={'no'}
                  value={item.volunteerName}
                  keyboardType={'default'}
                  autoCapitalize={'words'}
                  returnKeyType={'done'}
                  placeholder={'Enter Name'}
                  onChangeText={(value) => {
                    changeText(value, item.fromSchool, index);
                  }}
                />
                {item.errorMessage.volunteerName &&
                item.errorMessage.volunteerName !== '' ? (
                  <Text style={g.errorMsg}>
                    {item.errorMessage.volunteerName}
                  </Text>
                ) : null}
              </View>
              {searchedUser.length > 0 && requestedIndex === index && (
                <AutoSuggestUser
                  searchedUser={searchedUser}
                  onPress={(row, userIndex) => {
                    onUserSelect(row, index);
                  }}
                />
              )}
              <View style={grid.row}>
                <View style={[grid.col, g.pr5]}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      lastIndex = index;
                      if (
                        uploadRef &&
                        uploadRef !== null &&
                        uploadRef.current !== undefined &&
                        uploadRef.current !== null
                      ) {
                        uploadRef.current.open();
                      }
                    }}>
                    {item.isLoading ? (
                      <View
                        style={[
                          g.inputWhite,
                          grid.alignItems,
                          grid.justifyContentCenter,
                        ]}>
                        <ActivityIndicator
                          size={'small'}
                          color={GlobalInclude.Color.ColorPrimary}
                        />
                      </View>
                    ) : (
                      <Text
                        numberOfLines={1}
                        style={[g.inputWhite, g.txtCenter]}>
                        {'Upload Image'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={[grid.col, g.pl5]}>
                  <TextInput
                    underlineColorAndroid={'transparent'}
                    style={g.inputWhite}
                    maxLength={100}
                    value={item.volunteerRole}
                    keyboardType={'default'}
                    autoCapitalize={'words'}
                    returnKeyType={'done'}
                    placeholder={'Enter Role'}
                    onChangeText={(value) => {
                      updateIndex('volunteerRole', value, index);
                    }}
                  />
                  <View style={{alignSelf: 'flex-end'}}>
                    {item.errorMessage.volunteerRole &&
                    item.errorMessage.volunteerRole !== '' ? (
                      <Text style={g.errorMsg}>
                        {item.errorMessage.volunteerRole}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    });
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15, g.pt30]}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        style={[grid.flex1]}
        showsVerticalScrollIndicator={false}>
        <View style={[grid.flex1, g.pb30]}>{renderVolunteers()}</View>
      </KeyboardAwareScrollView>
      <NextPreviousButton
        isLoading={false}
        nextTitle={'Save & Next'}
        onPreviuosTab={() => {
          onPreviousTab();
        }}
        onSaveTab={() => {
          onSaveTab();
        }}
      />

      <UploadMedia
        refRBSheet={uploadRef}
        media={{image: false, video: true, document: true, audio: true}}
        supportMultiple={false}
        onPickMedia={(media) => {
          uploadRef.current.close();
          if (media !== undefined && media !== null) {
            console.log('media', media);
            updateIndex('imageData', media[0].thumbnail, lastIndex);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addTag: {
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    color: '#ffffff',
    textAlign: 'center',
    fontSize: scale(16),
    padding: scale(8),
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  buttonCircle: {
    width: scale(20),
    height: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    borderRadius: scale(24),
  },
});

export default VolunteerTeam;
