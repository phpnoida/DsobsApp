import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import NextPreviousButton from '../../../component/NextPreviousButton';
import ModelAlert from '../../../component/ModalAlert';
import {generateHeader} from './HeaderTitle';
import {IconType, TEXTAREA_COUNT} from '../../../helper/Constants';
import {
  pickImage,
  uploadImage,
  uploadMediaContent,
} from '../../../helper/mediaHelper';
import ProgressImage from '../../../component/ProgresImage';
import {renderRadioButton} from '../../../component/Common';
let selectedIndex = -1;

const constFreePaid = (value) => {
  return [
    {
      key: 0,
      label: 'Free',
      selected: value === 0 || false,
    },
    {
      key: 1,
      label: 'Paid',
      selected: value === 1 || false,
    },
  ];
};

const VentureDetails = ({
  handleInput,
  onSaveTab,
  onPreviousTab,
  onRemoveTag,
  ventureVideoLink,
  uploadMedia,
  aboutVenture,
  socialPhoto,
  addTag,
  tag,
  eventType,
  setTag,
  eventPrice,
  setEventType,
  selectedTags,
  errorMessage,
}) => {
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pickMedia = async () => {
    let result = await pickImage();

    if (result !== undefined && result !== null) {
      setIsLoading(true);
      let itemObject = uploadImage(result, 'utils/imageupload', 1);

      if (itemObject !== undefined && itemObject !== null) {
        uploadMediaContent(
          itemObject.body,
          itemObject.childPath,
          itemObject.mediaType,
          (uploadResult) => {
            setIsLoading(false);
            if (uploadResult !== null && uploadResult !== undefined) {
              uploadMedia(uploadResult);
            }
          },
        );
      } else {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15, g.pt30]}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        style={[grid.flex1]}
        showsVerticalScrollIndicator={false}>
        <View style={[grid.flex1, g.pb30]}>
          <View style={g.mb15}>
            {generateHeader('Event Video', false)}
            <View style={[grid.rowdir]}>
              {/* {socialPhoto !== null && (
                <View
                  style={[grid.alignItems, grid.justifyContentCenter, g.mr5]}>
                  <View>
                    <ProgressImage
                      source={{uri: socialPhoto.thumbnail}}
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
                      mode={'contain'}
                    />
                    <TouchableOpacity
                      hitSlop={{
                        top: 15,
                        bottom: 15,
                        left: 15,
                        right: 15,
                      }}
                      onPress={() => {
                        uploadMedia(null);
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
              )} */}
              <View style={[grid.flex1]}>
                <TextInput
                  underlineColorAndroid={'transparent'}
                  style={g.inputWhite}
                  value={ventureVideoLink}
                  maxLength={100}
                  keyboardType={'default'}
                  autoCapitalize={'words'}
                  returnKeyType={'done'}
                  placeholder={'Paste youtube URL'}
                  onChangeText={(value) => {
                    handleInput('ventureVideoLink', value);
                  }}
                />
                <View style={[g.mt10]}>
                  <View style={[grid.rowdir]}>
                    <TouchableOpacity
                      style={[grid.col, g.mr10]}
                      activeOpacity={1}
                      onPress={() => {
                        pickMedia();
                      }}>
                      <View
                        style={[
                          grid.row,
                          g.inputWhite,
                          grid.alignItems,
                          g.pb5,
                          g.pt5,
                        ]}>
                        <GlobalInclude.BaseIcon
                          containerStyle={{
                            height: scale(28),
                            width: scale(28),
                            justifyContent: 'center',
                          }}
                          iconColor={'#bababa'}
                          iconName={'download'}
                          iconSize={scale(22)}
                          iconType={IconType[4]}
                        />
                        <Text
                          style={[grid.col, g.fs14, g.colorLightGray, g.FHNR]}>
                          {socialPhoto !== null
                            ? 'Image Uploaded'
                            : 'Click to Upload Image'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.addTag}
                      onPress={() => {
                        pickMedia();
                      }}>
                      {isLoading ? (
                        <View
                          style={[
                            grid.alignItems,
                            grid.justifyContentCenter,
                            grid.flex1,
                          ]}>
                          <ActivityIndicator
                            size={'small'}
                            color={'#fff'}
                            style={[grid.alignItems, grid.justifyContentCenter]}
                          />
                        </View>
                      ) : (
                        <Text style={styles.addImageStyle}>Add</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            {errorMessage.socialImageVideo &&
            errorMessage.socialImageVideo !== '' ? (
              <Text style={g.errorMsg}>{errorMessage.socialImageVideo}</Text>
            ) : null}
          </View>
          <View style={g.mb15}>
            {generateHeader('Event Type', false)}
            <View style={[grid.rowdir, grid.flex1]}>
              {renderRadioButton(constFreePaid(eventType), (selected) => {
                setEventType(selected.key);
              })}
            </View>
            {eventType === 1 ? (
              <TextInput
                underlineColorAndroid={'transparent'}
                style={g.inputWhite}
                value={eventPrice}
                maxLength={15}
                keyboardType={'default'}
                returnKeyType={'done'}
                placeholder={'Enter price here'}
                onChangeText={(value) => {
                  handleInput('eventPrice', value);
                }}
              />
            ) : null}
          </View>

          <View style={g.mb15}>
            {generateHeader('About the Event', true)}
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={16}
              style={[
                g.inputWhite,
                {height: scale(160), textAlignVertical: 'top'},
              ]}
              value={aboutVenture}
              keyboardType={'default'}
              autoCapitalize={'sentences'}
              multiline={true}
              blurOnSubmit={true}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              returnKeyType="done"
              placeholder={'Write text here'}
              onChangeText={(value) => {
                handleInput('aboutVenture', value);
              }}
            />
            <View style={[grid.rowdir, g.mt5]}>
              <View style={grid.col}>
                {errorMessage.aboutVenture &&
                errorMessage.aboutVenture !== '' ? (
                  <Text style={g.errorMsg}>{errorMessage.aboutVenture}</Text>
                ) : null}
              </View>
              <View>
                <Text style={[g.fs10, g.FHNM, g.txtRight, g.colorGray1]}>
                  {TEXTAREA_COUNT.min} to {TEXTAREA_COUNT.max} {'Characters'} :{' '}
                  {aboutVenture.length}
                </Text>
              </View>
            </View>
          </View>

          <View style={g.mb15}>
            {generateHeader('Add Tags', false)}
            <View style={[grid.rowdir]}>
              <View style={[grid.col, g.mr10]}>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={g.inputWhite}
                  value={tag}
                  placeholder={'Add Tag'}
                  onChangeText={(value) => setTag(value)}
                />
              </View>
              <TouchableOpacity
                activeOpacity={1}
                disabled={tag.length > 0 ? false : true}
                onPress={() => addTag()}>
                <Text style={styles.addTag}>Add Tag</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View style={grid.displayinlineBlock}>
              {selectedTags.map((v, i) => {
                return (
                  <TouchableOpacity
                    key={i.toString()}
                    onLongPress={() => {
                      selectedIndex = i;
                      setShowRemoveAlert(true);
                    }}
                    onPress={() => {
                      selectedIndex = i;
                      setShowRemoveAlert(true);
                    }}
                    style={{margin: scale(4)}}
                    activeOpacity={1}>
                    <View style={[g.tagStyle, grid.rowdir]}>
                      <Text style={[g.tagTxtStyle, g.mr10]}>{v}</Text>
                      <GlobalInclude.BaseIcon
                        containerStyle={{height: scale(18), width: scale(18)}}
                        iconColor={'#333333'}
                        iconName={'remove'}
                        iconSize={scale(18)}
                        iconType={IconType[4]}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
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

      {showRemoveAlert && (
        <ModelAlert
          status={true}
          header={'Are you sure you would like to remove this tag?'}
          okButton={'Okay'}
          okAction={() => {
            onRemoveTag(selectedIndex);
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

const styles = StyleSheet.create({
  addTag: {
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    color: '#ffffff',
    textAlign: 'center',
    fontSize: scale(16),
    padding: scale(8),
    borderRadius: scale(8),
    overflow: 'hidden',
    width: scale(80),
  },
  addImageStyle: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: scale(16),
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

export default VentureDetails;
