import React, {useRef, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  Keyboard,
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
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePickerView from '../../../component/DatePickerView';
import Helper from '../../../helper/Helper';
import {IconType} from '../../../helper/Constants';

let selectedType = 1;
const BasicDetails = ({
  handleInput,
  onSaveTab,
  setYear,
  setDate,
  setTime,
  closingDate,
  closingTime,
  searchCategory,
  onCategorySelect,
  categoryList,
  selectedCategory,
  projectName,
  googleMapLink,
  venueAddress,
  city,
  facebook,
  twitter,
  wikipedia,
  errorMessage,
}) => {
  const refCategory = useRef();
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
              mode={selectedType === 1 ? 'date' : 'time'}
              display={'spinner'}
              minimumDate={new Date()}
              dateFormat={'day month year'}
              onChange={(event, selected) => {
                const currentDate = selected || new Date();
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedType === 1) {
                  let obj = Helper.formateDate(currentDate);
                  setDate(obj);
                } else {
                  setTime(currentDate);
                }
              }}
              onTouchCancel={(event) => {
                setShowDatePicker(false);
              }}
            />
          )}

          {showDatePicker && Platform.OS === 'ios' && (
            <DatePickerView
              minDate={new Date()}
              mode={selectedType === 1 ? 'date' : 'time'}
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
            {generateHeader('Nature of Event', true)}
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
            {generateHeader('Name of Event', true)}
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

          <View style={g.mb15}>
            {generateHeader('Date & Time', true)}
            <View style={grid.rowdir}>
              <View style={[grid.flex1, g.mr5]}>
                <TouchableOpacity
                  style={g.inputWhite}
                  onPress={() => {
                    selectedType = 1;
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
              <View style={[grid.flex1, g.ml5]}>
                <TouchableOpacity
                  style={g.inputWhite}
                  onPress={() => {
                    selectedType = 2;
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
                    {closingTime === '' ? 'Select Time' : closingTime}
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      right: 5,
                      top: 12,
                      zIndex: 2,
                    }}>
                    <GlobalInclude.BaseIcon
                      containerStyle={{
                        height: scale(16),
                        width: scale(16),
                      }}
                      iconColor={'#bababa'}
                      iconName={'clock-o'}
                      iconSize={scale(16)}
                      iconType={IconType[4]}
                    />
                  </View>
                </TouchableOpacity>
                {errorMessage.closingTime && errorMessage.closingTime !== '' ? (
                  <Text style={g.errorMsg}>{errorMessage.closingTime}</Text>
                ) : null}
              </View>
            </View>
          </View>
          <View style={g.mb15}>
            <TextInput
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              value={googleMapLink}
              maxLength={100}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Paste Map Link Here'}
              onChangeText={(value) => {
                handleInput('googleMapLink', value);
              }}
            />
            {errorMessage.googleMapLink &&
              errorMessage.googleMapLink.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.googleMapLink}
                </Text>
              )}
          </View>

          <View style={g.mb15}>
            {generateHeader('Venue Address', true)}
            <TextInput
              underlineColorAndroid="transparent"
              style={{
                height: 120,
                color: 'black',
                textAlignVertical: 'top',
                backgroundColor: '#f8f8f8',
                padding: scale(10),
                margin: 0,
                fontSize: scale(12),
                borderRadius: scale(8),
                fontFamily: 'Lato-Regular',
                justifyContent: 'center',
              }}
              value={venueAddress}
              multiline={true}
              blurOnSubmit={true}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Write text here'}
              onChangeText={(value) => {
                handleInput('venueAddress', value);
              }}
            />
            {errorMessage.venueAddress &&
              errorMessage.venueAddress.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.venueAddress}
                </Text>
              )}
          </View>

          <View style={g.mb15}>
            {generateHeader('City', true)}
            <TextInput
              underlineColorAndroid={'transparent'}
              style={g.inputWhite}
              value={city}
              maxLength={100}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Write text here'}
              onChangeText={(value) => {
                handleInput('city', value);
              }}
            />
            {errorMessage.city && errorMessage.city !== '' ? (
              <Text style={g.errorMsg}>{errorMessage.city}</Text>
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
