import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {launchImageLibrary} from 'react-native-image-picker';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ProfessionalSheet from '../../component/ProfessionalSheetFilter';
import ProgresImage from '../../component/ProgresImage';
import CommonButton from '../../component/CommonButton';
import {IconType} from '../../helper/Constants';
import {doSearchCity} from '../../Actions/CommonActions';

import RbSheet from 'react-native-raw-bottom-sheet';
const {height, width} = Dimensions.get('window');
const options = {
  title: 'Select Image',
  noData: true,
  maxWidth: 720,
  maxHeight: 1024,
  allowsEditing: false,
  storageOptions: {
    skipBackup: true,
    path: 'images',
    cameraRoll: true,
    waitUntilSaved: true,
  },
};
let pickerSelectionType = -1;
let isEndReached = false;
let scrollHold = 60;
let searchVal = '';

const scrollRef = React.createRef();
const refRBSheet = React.createRef();
const refRBSheetCity = React.createRef();
const refProfessionSheet = React.createRef();

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.width + contentOffset.x >=
    contentSize.width - paddingToBottom
  );
};

const generateHeader = (title, required) => {
  return (
    <View style={[grid.rowdir, grid.alignItemsTop]}>
      <Text style={g.labeltext1}>{title}</Text>
      {required && <Text style={g.colorRed}>*</Text>}
    </View>
  );
};

const mainImage = () => {
  return (
    <View style={{margin: scale(5)}}>
      <ProgresImage
        source={GlobalInclude.Assets.DefaultImage}
        containerStyle={{
          height: scale(100),
          width: scale(120),
        }}
        imageStyle={{height: scale(100), width: scale(120)}}
        mode={'cover'}
      />
      <TouchableOpacity
        onPress={() => {}}
        style={{
          width: scale(24),
          height: scale(24),
          borderRadius: scale(24),
          backgroundColor: '#2b3252',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'flex-end',
          position: 'absolute',
          top: scale(-5),
          right: scale(-5),
          zIndex: 9,
        }}>
        <GlobalInclude.BaseIcon
          containerStyle={{height: scale(20), width: scale(20)}}
          iconColor={'#fff'}
          iconName={'close'}
          iconSize={scale(20)}
          iconType={IconType[8]}
        />
      </TouchableOpacity>
    </View>
  );
};

const TabOne = ({onSaveTab, handleInput, businessName, professionList}) => {
  return (
    <View style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15, g.pt20]}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        style={[grid.flex1]}
        showsVerticalScrollIndicator={false}>
        <View style={[grid.flex1, g.pb30]}>
          <View style={g.mb15}>
            {generateHeader('Company Name', false)}
            <TextInput
              value={businessName}
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              maxLength={100}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {
                handleInput('businessName', value);
              }}
            />
          </View>

          <View style={g.mb15}>
            {generateHeader('Business Category', false)}
            <TouchableOpacity
              style={g.inputWhite}
              onPress={() => {
                if (refProfessionSheet.current !== null) {
                  refProfessionSheet.current.open();
                }
              }}>
              <Text
                style={[
                  grid.col,
                  g.FHNR,
                  grid.justifyContentCenter,
                  {textAlignVertical: 'center'},
                ]}
                numberOfLines={1}>
                Select Category
              </Text>
            </TouchableOpacity>
          </View>

          <View style={g.mb15}>
            {generateHeader('Cover Image', false)}
            <ProgresImage
              source={GlobalInclude.Assets.DefaultImage}
              containerStyle={{
                height: scale(100),
                width: scale(120),
                borderRadius: scale(6),
                marginBottom: scale(12),
              }}
              imageStyle={{
                height: scale(100),
                width: scale(120),
                borderRadius: scale(6),
              }}
              mode={'cover'}
            />

            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                ref={scrollRef}
                onScroll={({nativeEvent}) => {
                  if (isCloseToBottom(nativeEvent)) {
                    isEndReached = true;
                  } else {
                    isEndReached = false;
                  }
                }}>
                {mainImage()}
                {mainImage()}
                {mainImage()}
              </ScrollView>
              <View
                style={{
                  justifyContent: 'center',
                  position: 'absolute',
                  left: 0,
                  alignItems: 'center',
                  alignContent: 'center',
                  top: 0,
                  bottom: 0,
                }}>
                <TouchableOpacity
                  style={{
                    height: scale(30),
                    width: scale(30),
                    backgroundColor: '#2b3252',
                    borderRadius: scale(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    scrollRef.current.scrollTo({
                      x: -scrollHold,
                    });
                  }}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(22), width: scale(22)}}
                    iconColor={'#fff'}
                    iconName={'arrowleft'}
                    iconSize={scale(22)}
                    iconType={IconType[10]}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  position: 'absolute',
                  right: 0,
                  alignItems: 'center',
                  alignContent: 'center',
                  top: 0,
                  bottom: 0,
                }}>
                <TouchableOpacity
                  disabled={isEndReached}
                  style={{
                    height: scale(30),
                    width: scale(30),
                    backgroundColor: '#2b3252',
                    borderRadius: scale(38),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    if (scrollHold === 60) {
                      scrollRef.current.scrollTo({
                        x: scrollHold,
                      });
                    } else {
                      scrollRef.current.scrollTo({
                        x: scrollHold++,
                      });
                    }
                  }}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(22), width: scale(22)}}
                    iconColor={'#fff'}
                    iconName={'arrowright'}
                    iconSize={scale(22)}
                    iconType={IconType[10]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={g.mb15}>
            {generateHeader('Cities of Operation Max-5', false)}
            <TouchableOpacity
              style={g.inputWhite}
              onPress={() => {
                if (refRBSheetCity.current !== null) {
                  refRBSheetCity.current.open();
                }
              }}>
              <Text
                style={[
                  grid.col,
                  g.FHNR,
                  grid.justifyContentCenter,
                  {textAlignVertical: 'center'},
                ]}
                numberOfLines={1}>
                Select City
              </Text>
            </TouchableOpacity>
          </View>

          <View style={g.mb15}>
            {generateHeader('Business Location', false)}
            <TextInput
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              maxLength={100}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Paste Map Link Here'}
              onChangeText={(value) => {}}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: scale(150),
          paddingTop: scale(10),
          paddingBottom: scale(10),
          alignContent: 'center',
          alignSelf: 'center',
        }}>
        <CommonButton
          showLoader={false}
          title={'Save & Next'}
          onPress={() => {
            onSaveTab();
          }}
        />
      </View>

      {/* bottom sheet */}
      <RbSheet
        ref={refRBSheet}
        height={height / 2}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20,
          },
        }}>
        <Text style={[g.fs16, g.FHNR, g.txtLeft, g.colorBlack, g.mb15]}>
          Title will display here
        </Text>
      </RbSheet>

      <RbSheet
        ref={refRBSheetCity}
        height={height / 2}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20,
          },
        }}>
        <Text style={[g.fs16, g.FHNR, g.txtLeft, g.colorBlack, g.mb15]}>
          City Selection will done from here
        </Text>
      </RbSheet>

      <ProfessionalSheet
        refRBSheet={refProfessionSheet}
        dataList={professionList}
        searchProfession={(query) => {
          searchProfession(query);
        }}
        selectedProfession={selectedProfession}
        setSelectedProfession={(value) => {
          setSelectedProfession(value);
          refProfessionalSheet.current.close();
        }}
        onClose={() => {}}
      />
    </View>
  );
};

export default TabOne;
