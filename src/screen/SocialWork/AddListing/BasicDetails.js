import React, {useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonButton from '../../../component/CommonButton';
import {generateHeader} from './HeaderTitle';
import {showSocialIcon} from '../../../component/SocialIcon';
import CategorySheet from './CategorySheet';
import YearSelection from '../../../component/YearSelectionSheet';

const BasicDetails = ({
  handleInput,
  onSaveTab,
  setYear,
  searchCategory,
  onCategorySelect,
  categoryList,
  selectedCategory,
  projectName,
  selectedYear,
  initiatedBy,
  facebook,
  twitter,
  wikipedia,
  errorMessage,
}) => {
  const refCategory = useRef();
  const refYear = useRef();

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15, g.pt30]}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        style={[grid.flex1]}
        showsVerticalScrollIndicator={false}>
        <View style={[grid.flex1, g.pb30]}>
          <View style={g.mb15}>
            {generateHeader('Nature of Work', true)}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[grid.rowdir, grid.alignItems, g.inputWhite]}
              onPress={() => {
                if (refCategory.current !== null) {
                  refCategory.current.open();
                }
              }}>
              <Text
                style={[
                  grid.col,
                  g.FHNR,
                  grid.justifyContentCenter,
                  {textAlignVertical: 'center'},
                  selectedCategory !== '' ? g.colorBlack : g.colorGray1,
                ]}
                numberOfLines={1}>
                {selectedCategory !== '' ? selectedCategory : 'Select'}
              </Text>
              <View style={GlobalInclude.AppStyle.triangleShape} />
            </TouchableOpacity>
            {errorMessage.selectedCategory &&
            errorMessage.selectedCategory !== '' ? (
              <Text style={g.errorMsg}>{errorMessage.selectedCategory}</Text>
            ) : null}
          </View>
          <View style={g.mb15}>
            <View style={grid.rowdir}>
              <View style={[grid.flex1, g.mr5]}>
                {generateHeader('Name of Project', true)}
                <TextInput
                  underlineColorAndroid={'transparent'}
                  style={g.inputWhite}
                  value={projectName}
                  maxLength={100}
                  keyboardType={'default'}
                  autoCapitalize={'words'}
                  returnKeyType={'done'}
                  placeholder={'Write text here'}
                  onChangeText={(value) => {
                    handleInput('projectName', value);
                  }}
                />
                {errorMessage.projectName && errorMessage.projectName !== '' ? (
                  <Text style={g.errorMsg}>{errorMessage.projectName}</Text>
                ) : null}
              </View>
              <View style={[grid.flex1, g.ml5]}>
                {generateHeader('Year Started', true)}
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    if (refYear.current !== null) {
                      refYear.current.open();
                    }
                  }}
                  style={[grid.rowdir, grid.alignItems, g.inputWhite]}>
                  <Text
                    style={[
                      grid.col,
                      g.FHNR,
                      selectedYear !== -1 ? g.colorBlack : g.colorGray1,
                    ]}
                    numberOfLines={1}>
                    {selectedYear !== -1 ? selectedYear : 'Select Year'}
                  </Text>
                  <View style={GlobalInclude.AppStyle.triangleShape} />
                </TouchableOpacity>
                {errorMessage.selectedYear &&
                errorMessage.selectedYear !== '' ? (
                  <Text style={g.errorMsg}>{errorMessage.selectedYear}</Text>
                ) : null}
              </View>
            </View>
          </View>
          <View style={g.mb15}>
            {generateHeader('Initiated By', true)}
            <TextInput
              underlineColorAndroid={'transparent'}
              style={g.inputWhite}
              value={initiatedBy}
              maxLength={100}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Write text here'}
              onChangeText={(value) => {
                handleInput('initiatedBy', value);
              }}
            />
            {errorMessage.initiatedBy && errorMessage.initiatedBy !== '' ? (
              <Text style={g.errorMsg}>{errorMessage.initiatedBy}</Text>
            ) : null}
          </View>
          <View style={g.mb15}>
            {generateHeader('Social Media Links', false)}
            <View style={[grid.rowdir, g.shareStyle, grid.alignItems]}>
              {showSocialIcon('facebook-official', '#475993')}
              <TextInput
                keyboardType={'default'}
                underlineColorAndroid="transparent"
                style={[g.inputWhite, grid.col]}
                value={facebook}
                onChangeText={(value) => handleInput('facebook', value)}
                placeholder={'Write/Paste link here'}
                maxLength={264}
              />
            </View>
            {errorMessage.facebook && errorMessage.facebook !== '' ? (
              <Text style={g.errorMsg}>{errorMessage.facebook}</Text>
            ) : null}
          </View>

          <View style={g.mb15}>
            <View style={[grid.rowdir, g.shareStyle, grid.alignItems]}>
              {showSocialIcon('twitter-square', '#2b95ff')}
              <TextInput
                keyboardType={'default'}
                underlineColorAndroid="transparent"
                style={[g.inputWhite, grid.col]}
                value={twitter}
                onChangeText={(value) => handleInput('twitter', value)}
                placeholder={'Write/Paste link here'}
                maxLength={264}
              />
            </View>
            {errorMessage.twitter && errorMessage.twitter !== '' ? (
              <Text style={g.errorMsg}>{errorMessage.twitter}</Text>
            ) : null}
          </View>

          <View style={g.mb15}>
            <View style={[grid.rowdir, g.shareStyle, grid.alignItems]}>
              {showSocialIcon('wikipedia-w', '#3e3e3e')}
              <TextInput
                keyboardType={'default'}
                underlineColorAndroid="transparent"
                style={[g.inputWhite, grid.col]}
                value={wikipedia}
                onChangeText={(value) => handleInput('wikipedia', value)}
                placeholder={'Write/Paste link here'}
                maxLength={264}
              />
            </View>
            {errorMessage.wikipedia && errorMessage.wikipedia !== '' ? (
              <Text style={g.errorMsg}>{errorMessage.wikipedia}</Text>
            ) : null}
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.buttonContainer}>
        <CommonButton
          showLoader={false}
          title={'Save & Next'}
          onPress={() => {
            onSaveTab();
          }}
        />
      </View>

      <CategorySheet
        refRBSheet={refCategory}
        dataList={categoryList}
        searchProfession={(query) => {
          searchCategory(query);
        }}
        selectedProfession={selectedCategory}
        setSelectedProfession={(value) => {
          console.log('value', value);
          onCategorySelect(value);
          refCategory.current.close();
        }}
        onClose={() => {}}
      />

      {/* year select */}
      <YearSelection
        refRBSheet={refYear}
        title={'Select Year'}
        onSelect={(value) => {
          refYear.current.close();
          setYear(value.text.toString());
        }}
      />
      {/* year select */}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
  },
});

export default BasicDetails;
