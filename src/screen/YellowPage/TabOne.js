import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import {launchImageLibrary} from 'react-native-image-picker';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ProgresImage from '../../component/ProgresImage';
import CommonButton from '../../component/CommonButton';
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

const TabOne = ({onSaveTab}) => {
  const refRBSheet = useRef();
  const refRBSheetCity = useRef();
  const refRBSheetLocation = useRef();
  const launchImagePicker = () => {
    launchImageLibrary(options, (res) => {
      if (res) {
        if (res !== null) {
          if (res.didCancel) {
            Alert.alert('Cancel Image Selection!');
          } else {
            profileUri = res;
            if (global.isConnected) {
              uploadProfile();
            }
          }
        }
      }
    });
  };

  const generateHeader = (title, required) => {
    return (
      <View style={[grid.rowdir, grid.alignItemsTop]}>
        <Text style={g.labeltext1}>{title}</Text>
        {required && <Text style={g.colorRed}>*</Text>}
      </View>
    );
  };

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
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              maxLength={100}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {}}
            />
          </View>

          <View style={g.mb15}>
            {generateHeader('Business Category', false)}
            <TouchableOpacity
              style={g.inputWhite}
              onPress={() => {
                if (refRBSheet.current !== null) {
                  refRBSheet.current.open();
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

          <View style={[grid.row, g.mb15]}>
            <View style={[grid.flex1, grid.alignItems]}>
              {generateHeader('Logo', false)}
              <ProgresImage
                source={GlobalInclude.Assets.DefaultImage}
                containerStyle={{height: scale(100), width: scale(120)}}
                imageStyle={{height: scale(100), width: scale(120)}}
                mode={'cover'}
              />
            </View>
            <View style={[grid.flex1, grid.alignItems]}>
              {generateHeader('Cover Image', false)}
              <ProgresImage
                source={GlobalInclude.Assets.DefaultImage}
                containerStyle={{height: scale(100), width: scale(120)}}
                imageStyle={{height: scale(100), width: scale(120)}}
                mode={'cover'}
              />
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

      <RbSheet
        ref={refRBSheetLocation}
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
          Google map will show here...
        </Text>
      </RbSheet>
    </View>
  );
};

export default TabOne;
