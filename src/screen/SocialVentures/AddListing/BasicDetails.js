import React, {useRef, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
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
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePickerView from '../../../component/DatePickerView';
import Helper from '../../../helper/Helper';
import {IconType} from '../../../helper/Constants';

const BasicDetails = ({
  handleInput,
  onSaveTab,
  setYear,
  setDate,
  closingDate,
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  return (
    <View style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15, g.pt30]}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        style={[grid.flex1]}
        showsVerticalScrollIndicator={false}>
        <View style={[grid.flex1, g.pb30]}>
          {showDatePicker && Platform.OS === 'android' && (
            <DateTimePicker
              testID={'dateTimePicker'}
              value={new Date()}
              mode={'date'}
              display={'spinner'}
              minimumDate={new Date()}
              dateFormat={'day month year'}
              onChange={(event, selected) => {
                const currentDate = selected || new Date();
                let obj = Helper.formateDate(currentDate);
                setShowDatePicker(Platform.OS === 'ios');
                setDate(obj);
              }}
              onTouchCancel={(event) => {
                setShowDatePicker(false);
              }}
            />
          )}

          {showDatePicker && Platform.OS === 'ios' && (
            <DatePickerView
              minDate={new Date()}
              onCloseAction={() => {
                setShowDatePicker(false);
              }}
              onDateSelect={(obj) => {
                setShowDatePicker(false);
                setDate(obj);
              }}
            />
          )}
          <View style={g.mb15}>
            <View style={grid.rowdir}>
              <View style={[grid.flex1, g.mr5]}>
                {generateHeader('Nature of Venture', true)}
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
                  <Text style={g.errorMsg}>
                    {errorMessage.selectedCategory}
                  </Text>
                ) : null}
              </View>
              <View style={[grid.flex1, g.ml5]}>
                {generateHeader('Start Year', true)}
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
            <View style={grid.rowdir}>
              <View style={[grid.flex1, g.mr5]}>
                {generateHeader('Name of Venture', true)}
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
                {generateHeader('Closing Date', true)}
                <TouchableOpacity
                  style={g.inputWhite}
                  onPress={() => {
                    setShowDatePicker(true);
                  }}>
                  <Text
                    style={[
                      grid.col,
                      g.FHNR,
                      grid.justifyContentCenter,
                      {textAlignVertical: 'center'},
                    ]}
                    numberOfLines={1}>
                    {closingDate === '' ? 'Select Date' : closingDate}
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      right: 5,
                      top: 12,
                      zIndex: 2,
                    }}>
                    <GlobalInclude.BaseIcon
                      containerStyle={{height: scale(16), width: scale(16)}}
                      iconColor={'#bababa'}
                      iconName={'calendar'}
                      iconSize={scale(16)}
                      iconType={IconType[4]}
                    />
                  </View>
                </TouchableOpacity>
                {errorMessage.closingDate && errorMessage.closingDate !== '' ? (
                  <Text style={g.errorMsg}>{errorMessage.closingDate}</Text>
                ) : null}
              </View>
            </View>
          </View>
          <View style={g.mb15}>
            {generateHeader('Founder', true)}
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
