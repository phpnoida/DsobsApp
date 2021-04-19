import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import NextPreviousButton from '../../component/NextPreviousButton';
import ModelAlert from '../../component/ModalAlert';

let selectedIndex = -1;
const TabTwo = ({
  onSaveTab,
  onPreviousTab,
  addTag,
  tag,
  setTag,
  productTags,
  onRemoveTag,
}) => {
  const [errorMessage, setErrorMessage] = useState({});
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);

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
        style={grid.flex1}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={g.pb30}>
          <View style={g.mb15}>
            {generateHeader('About The Business', false)}
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={6}
              multiline={true}
              style={[
                g.inputWhite,
                {height: scale(100), textAlignVertical: 'top'},
              ]}
              autoCapitalize="words"
              placeholder="Enter your text here"
              keyboardType={'default'}
              returnKeyType={'done'}
              onChangeText={(value) => {}}
            />
          </View>
          <View style={g.mb15}>
            {generateHeader('Product & Services Offered', false)}
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={6}
              multiline={true}
              style={[
                g.inputWhite,
                {height: scale(100), textAlignVertical: 'top'},
              ]}
              keyboardType={'default'}
              autoCapitalize={'words'}
              returnKeyType={'done'}
              placeholder={'Enter your text here'}
              onChangeText={(value) => {}}
            />
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
                <Text
                  style={{
                    backgroundColor: '#2b3252',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: scale(16),
                    padding: scale(8),
                    borderRadius: scale(8),
                    overflow: 'hidden',
                  }}>
                  Add Tag
                </Text>
              </TouchableOpacity>
            </View>
            {errorMessage.tag && errorMessage.tag.length > 0 && (
              <Text style={[g.errorMsg, g.pt5]}>{errorMessage.tag}</Text>
            )}
          </View>
          <View>
            <View style={grid.displayinlineBlock}>
              {productTags.map((v, i) => {
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

export default TabTwo;
