import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ProfessionalSheet from '../../../component/ProfessionalSheetFilter';
import ProgresImage from '../../../component/ProgresImage';
import CommonButton from '../../../component/CommonButton';
import {IconType} from '../../../helper/Constants';
import ImagePicker from 'react-native-image-crop-picker';
import RbSheet from 'react-native-raw-bottom-sheet';
import BottomSheetHeader from '../../../component/BottomSheetHeader';
import ModelAlert from '../../../component/ModalAlert';

const {height, width} = Dimensions.get('window');
let selectedIndex = -1;
let isEndReached = false;
let scrollHold = 60;

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

const TabOne = ({
  onSaveTab,
  handleInput,
  businessName,
  professionList,
  selectedProfession,
  onPreofessionSelect,
  searchProfession,
  setCoverImages,
  coverImages,
  onDeleteImage,
  cityList,
  onSearchCity,
  selectedCities,
  setSelectedCities,
  onRemoveCity,
  businessLocation,
  errorMessage,
}) => {
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);

  const renderCity = () => {
    var data = cityList.map((row, index) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          style={style.suggestionContainer}
          onPress={() => {
            if (selectedCities.length < 5) {
              setSelectedCities(row.name);
            } else {
              Alert.alert('You can select max 5 cities!');
            }
          }}>
          <View
            style={{
              backgroundColor: '#323232',
              borderRadius: scale(10),
              height: scale(93),
            }}
          />
          <View style={{marginStart: scale(5)}}>
            <Text style={style.userName}>{row.name}</Text>
          </View>
        </TouchableOpacity>
      );
    });
    return (
      <View style={[g.AutoCompleteList1, g.p10]}>
        <Text style={[g.colordarkGray, g.fs12, g.FHNM, g.pb5]}>
          Search Suggestion:
        </Text>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {data}
        </ScrollView>
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
            {errorMessage.businessName &&
              errorMessage.businessName.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.businessName}
                </Text>
              )}
          </View>

          <View style={g.mb15}>
            {generateHeader('Business Category', false)}
            <TouchableOpacity
              activeOpacity={0.8}
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
                {selectedProfession !== ''
                  ? selectedProfession
                  : 'Select Category'}
              </Text>
            </TouchableOpacity>
            {errorMessage.selectedProfession &&
              errorMessage.selectedProfession.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.selectedProfession}
                </Text>
              )}
          </View>

          <View style={g.mb15}>
            {generateHeader('Cover Image', false)}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                ImagePicker.openPicker({
                  includeBase64: false,
                  cropping: true,
                  includeExif: false,
                  mediaType: 'photo',
                  multiple: false,
                })
                  .then((images) => {
                    if (images !== null) {
                      console.log('images', images);
                      setCoverImages(images);
                    }
                  })
                  .catch((err) => {
                    Alert.alert('User Cancelled Selection!');
                    console.log('err', err);
                  });
              }}>
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
            </TouchableOpacity>
            {errorMessage.coverImage && errorMessage.coverImage.length > 0 && (
              <Text style={[g.errorMsg, g.pt5]}>{errorMessage.coverImage}</Text>
            )}
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
                {coverImages.map((item, index) => {
                  return (
                    <View style={{margin: scale(5)}} key={index}>
                      <ProgresImage
                        source={{uri: item.thumbnail}}
                        containerStyle={{
                          height: scale(80),
                          width: scale(110),
                          borderRadius: scale(8),
                        }}
                        imageStyle={{
                          height: scale(80),
                          width: scale(110),
                          borderRadius: scale(8),
                        }}
                        mode={'cover'}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          onDeleteImage(index);
                        }}
                        style={style.deleteIcon}>
                        <GlobalInclude.BaseIcon
                          containerStyle={{
                            height: scale(20),
                            width: scale(20),
                          }}
                          iconColor={'#fff'}
                          iconName={'close'}
                          iconSize={scale(20)}
                          iconType={IconType[8]}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>

              {coverImages.length > 0 && (
                <View style={style.leftArrowContainer}>
                  <TouchableOpacity
                    style={style.nextIconBox}
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
              )}

              {coverImages.length > 0 && (
                <View style={style.rightArrowContainer}>
                  <TouchableOpacity
                    disabled={isEndReached}
                    style={style.nextIconBox}
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
              )}
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
                {selectedCities.length > 0
                  ? selectedCities.toString()
                  : 'Select City'}
              </Text>
            </TouchableOpacity>
            {errorMessage.selectedCities &&
              errorMessage.selectedCities.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.selectedCities}
                </Text>
              )}
          </View>

          <View style={g.mb15}>
            {generateHeader('Business Location', false)}
            <TextInput
              underlineColorAndroid="transparent"
              style={g.inputWhite}
              value={businessLocation}
              maxLength={100}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Paste Map Link Here'}
              onChangeText={(value) => {
                handleInput('businessLocation', value);
              }}
            />
            {errorMessage.businessLocation &&
              errorMessage.businessLocation.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.businessLocation}
                </Text>
              )}
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={style.buttonContainer}>
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
        height={height - 150}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,

            paddingBottom: scale(20),
          },
        }}>
        <BottomSheetHeader
          title={'Select City'}
          showSearch={true}
          onSeachQuery={(query) => {
            onSearchCity(query);
          }}
        />
        <View style={{paddingStart: scale(15), paddingEnd: scale(15)}}>
          <View>{cityList.length > 0 && renderCity()}</View>

          {selectedCities.length > 0 && (
            <View>
              <Text style={[g.colorBlack, g.fs16, g.FHNB]}>
                Selected Cities
              </Text>
              <View>
                <View style={grid.displayinlineBlock}>
                  {selectedCities.map((v, i) => {
                    return (
                      <TouchableOpacity
                        key={i.toString()}
                        onLongPress={() => {
                          selectedIndex = i;
                          setShowRemoveAlert(true);
                        }}
                        style={{margin: scale(4)}}
                        activeOpacity={1}>
                        <View style={[g.tagStyle, grid.rowdir]}>
                          <Text style={[g.tagTxtStyle, g.mr10]}>{v}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          )}
        </View>
      </RbSheet>

      <ProfessionalSheet
        refRBSheet={refProfessionSheet}
        dataList={professionList}
        searchProfession={(query) => {
          searchProfession(query);
        }}
        selectedProfession={selectedProfession}
        setSelectedProfession={(value) => {
          console.log('value', value);
          onPreofessionSelect(value);
          refProfessionSheet.current.close();
        }}
        onClose={() => {}}
      />

      {showRemoveAlert && (
        <ModelAlert
          status={true}
          header={'Are you sure you would like to remove?'}
          okButton={'Okay'}
          okAction={() => {
            onRemoveCity(selectedIndex);
            setShowRemoveAlert(false);
          }}
          cancelButton={'Cancel'}
          cancelAction={() => {
            setShowRemoveAlert(false);
          }}
          closeAction={() => {
            setShowRemoveAlert(false);
          }}
        />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  deleteIcon: {
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
  },
  nextIconBox: {
    height: scale(30),
    width: scale(30),
    backgroundColor: '#2b3252',
    borderRadius: scale(38),
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionContainer: {
    width: scale(73),
    marginEnd: scale(10),
    marginTop: scale(6),
    marginBottom: scale(6),
  },
  userName: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    alignContent: 'center',
    textAlign: 'left',
    fontSize: scale(11),
    color: '#333333',
    fontFamily: 'Lato-Regular',
    marginTop: scale(5),
    textTransform: 'capitalize',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
  },
  leftArrowContainer: {
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    alignItems: 'center',
    alignContent: 'center',
    top: 0,
    bottom: 0,
  },
  rightArrowContainer: {
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    alignContent: 'center',
    top: 0,
    bottom: 0,
  },
});

export default TabOne;
