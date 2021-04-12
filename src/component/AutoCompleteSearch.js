import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
  Linking,
} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';
import g from '../theme/global';
import grid from '../theme/grid';
import {IconType} from '../helper/Constants';
import CheckBoxIOS from 'react-native-check-box';
import AutoSuggestUser from './AutoSuggestUser';

const {height, width} = Dimensions.get('window');
const tablet = width >= 768;

const AutoCompleteSearch = ({
  mainTitle,
  chkOneTitle,
  chkTwoTitle,
  ChkThreeTitle,
  ChkFourTitle,
  chkType,
  onChecked,
  onFilterPress,
  changeText,
  filterQuery,
  searchedUser,
  onUserSelected,
  onGoPress,
  withFilter
}) => {
  const drawCheckbox = (title, checked, onClick) => {
    return (
      <View style={[grid.rowdir, grid.alignItems]}>
        <CheckBoxIOS
          checkBoxColor={'#2b3252'}
          style={[g.mr2, g.br3, {maxWidth: 23, height: 20}]}
          onClick={() => {
            onClick();
          }}
          isChecked={checked}
          checkedImage={
            <Image
              source={GlobalInclude.Assets.CheckboxChecked}
              style={{maxWidth: 20, height: 20}}
            />
          }
          unCheckedImage={
            <Image
              source={GlobalInclude.Assets.CheckboxDefault}
              style={{maxWidth: 20, height: 20}}
            />
          }
        />
        <Text style={[g.colordarkGray, g.FHNR, grid.col, g.fs12]}>{title}</Text>
      </View>
    );
  };

  return (
    <View>
      <View style={[grid.rowdir, grid.alignItems, g.mt10]}>
        <Text style={[g.fs16, g.FHNR, g.colordarkGray, grid.col]}>
          {mainTitle}
        </Text>
      </View>
      {/* search container */}

      <View
        style={[
          grid.rowdir,
          grid.alignItems,
          g.mt10,
          g.mb10,
          tablet && g.pt10,
        ]}>
        {chkOneTitle && (
          <View
            style={{
              width: scale(120),
            }}>
            {drawCheckbox(chkOneTitle, chkType === 1 ? true : false, () => {
              onChecked(1);
            })}
          </View>
        )}
        {chkTwoTitle && (
          <View
            style={{
              width: scale(75),
              marginStart: scale(3),
              marginEnd: scale(3),
            }}>
            {drawCheckbox(chkTwoTitle, chkType === 2 ? true : false, () => {
              onChecked(2);
            })}
          </View>
        )}
        {ChkThreeTitle && (
          <View
            style={{
              width: scale(65),
            }}>
            {drawCheckbox(ChkThreeTitle, chkType === 3 ? true : false, () => {
              onChecked(3);
            })}
          </View>
        )}
        {ChkFourTitle && (
          <View style={[grid.col, {marginStart: scale(3)}]}>
            {drawCheckbox(ChkFourTitle, chkType === 4 ? true : false, () => {
              onChecked(4);
            })}
          </View>
        )}
      </View>

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
              placeholder={
                chkType === 1
                  ? 'Type more than 3 characters'
                  : chkType === 4
                  ? 'Type anything...'
                  : 'Search Photo'
              }
              onChangeText={(text) => {
                changeText(text);
              }}
            />
          </View>
        </View>
        {filterQuery.length <= 3 ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onFilterPress()}
            style={[
              g.fliterBtnNew,
              grid.alignItems,
              grid.justifyContentCenter,
            ]}>
            <Image
              source={GlobalInclude.Assets.Filter}
              resizeMode="contain"
              style={{width: 16}}
            />
          </TouchableOpacity>
        ) : chkType === 1 || chkType === 4 ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onGoPress()}
            style={[
              g.fliterBtnNew,
              grid.alignItems,
              grid.justifyContentCenter,
              g.bgBlue,
            ]}>
            <Text style={[g.colorWhite, g.FHNM, g.fs16]}>Go</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>

      {chkType === 1 && searchedUser.length > 0 && (
        <AutoSuggestUser
          searchedUser={searchedUser}
          onPress={(row, index) => {
            onUserSelected(row, index);
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

export default AutoCompleteSearch;
