import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  TextInput,
  Alert,
  Dimensions,
  StyleSheet,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ProgresImage from '../../component/ProgresImage';
import AutoSuggestUser from '../../component/AutoSuggestUser';
import {IconType} from '../../helper/Constants';
import Helper from '../../helper/Helper';
import ModelAlert from '../../component/ModalAlert';
import NextPreviousButton from '../../component/NextPreviousButton';
const {height, width} = Dimensions.get('window');

let selectedIndex = -1;
const TabThree = ({
  onSaveTab,
  onPreviousTab,
  changeText,
  searchedUser,
  onUserSelect,
  selectedAlumini,
}) => {
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
        style={[grid.flex1]}
        showsVerticalScrollIndicator={false}>
        <View style={[grid.flex1, g.pb30]}>
          <View style={g.mb15}>
            {generateHeader('Alumini In Business', false)}
            <View style={[grid.rowdir, g.mb5, g.pt15]}>
              <View style={[g.br3, grid.col, g.mr5]}>
                <View style={[g.inputNew, grid.rowdir]}>
                  <GlobalInclude.BaseIcon
                    containerStyle={style.searchIcon}
                    iconColor={'#dddddd'}
                    iconName={'search'}
                    iconSize={scale(20)}
                    iconType={IconType[4]}
                  />
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={[
                      g.inputNew,
                      g.pl0,
                      g.fs18,
                      grid.col,
                      grid.justifyContentCenter,
                    ]}
                    keyboardType={'default'}
                    placeholder={'Type more then 3 characters '}
                    onChangeText={(text) => {
                      changeText(text);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>

          <AutoSuggestUser
            searchedUser={searchedUser}
            onPress={(row, index) => {
              onUserSelect(row, index);
            }}
          />

          <View style={g.mt15}>
            {selectedAlumini.length > 0 ? (
              <Text style={[g.fs16, g.FHNB, g.colordarkGray, g.ml10]}>
                Selected
              </Text>
            ) : null}
            <View
              style={[
                grid.row,
                g.mt10,
                selectedAlumini.length > 2 ? grid.justifyContent : '',
                grid.flexwrap,
              ]}>
              {selectedAlumini.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onLongPress={() => {
                      setShowRemoveAlert(true);
                    }}
                    key={index}
                    style={[
                      {
                        marginLeft: 10,
                        width: width / 3 - 40,
                        marginRight: selectedAlumini.length > 2 ? 10 : 20,
                        paddingTop: scale(15),
                      },
                    ]}>
                    <View style={[g.bglightGray, g.oh, {borderRadius: 100}]}>
                      <ProgresImage
                        source={
                          item.profileImg != null && item.profileImg !== ''
                            ? {uri: item.profileImg}
                            : GlobalInclude.Assets.DefaultProfile
                        }
                        containerStyle={{
                          aspectRatio: 1 / 1,
                        }}
                        mode={'cover'}
                      />
                    </View>
                    <View style={{height: 80}}>
                      <Text
                        style={[
                          {fontSize: 14, marginTop: 10},
                          g.FHNR,
                          g.txtCenter,
                          g.colorBlack,
                        ]}
                        numberOfLines={2}>
                        {Helper.concatName(item)}
                      </Text>
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
          header={'Are you sure you would like to remove this user?'}
          okButton={'Okay'}
          okAction={() => {
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
  searchIcon: {
    height: scale(20),
    width: scale(20),
    alignSelf: 'center',
    marginEnd: scale(6),
    marginStart: scale(6),
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
  filterText: {
    paddingTop: 12,
    paddingBottom: 12,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
});

export default TabThree;
