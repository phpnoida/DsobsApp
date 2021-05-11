import React, {useState} from 'react';
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
import NextPreviousButton from '../../../component/NextPreviousButton';
import ModelAlert from '../../../component/ModalAlert';
import {generateHeader} from './HeaderTitle';
import {IconType, TEXTAREA_COUNT} from '../../../helper/Constants';
import {pickImage, uploadImage} from '../../../helper/mediaHelper';

let selectedIndex = -1;

const VentureDetails = ({
  handleInput,
  onSaveTab,
  onPreviousTab,
  onRemoveTag,
  ventureVideoLink,
  aboutVenture,
  addTag,
  tag,
  setTag,
  selectedTags,
}) => {
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const pickMedia = async () => {
    let result = await pickImage();

    if (result !== undefined && result !== null) {
      let itemObject = uploadImage(result);
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
            {generateHeader('Social Venture Video', false)}
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
                    <Text style={[grid.col, g.fs14, g.colorLightGray, g.FHNR]}>
                      Click to Upload Image
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    pickMedia();
                  }}>
                  <Text style={styles.addTag}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={g.mb15}>
            {generateHeader('About the Social Venture', true)}
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={16}
              multiline={true}
              style={[
                g.inputWhite,
                {height: scale(160), textAlignVertical: 'top'},
              ]}
              value={aboutVenture}
              keyboardType={'default'}
              autoCapitalize={'sentences'}
              returnKeyType={'done'}
              placeholder={''}
              onChangeText={(value) => {
                handleInput('aboutVenture', value);
              }}
            />
            <Text style={[g.fs10, g.FHNM, g.txtRight, g.colorGray1, g.pt5]}>
              {TEXTAREA_COUNT.min} to {TEXTAREA_COUNT.max} {'Characters'} :{' '}
              {aboutVenture.length}
            </Text>
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
    backgroundColor: '#2b3252',
    color: '#ffffff',
    textAlign: 'center',
    fontSize: scale(16),
    padding: scale(8),
    borderRadius: scale(8),
    overflow: 'hidden',
  },
});

export default VentureDetails;
