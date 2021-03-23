import React, {useState, useEffect} from 'react';
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
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {IconType, APP_NAME, URL_REGX} from '../../helper/Constants';
import HeaderBar from '../../component/HeaderBar';
import Helper from '../../helper/Helper';
import axios from 'axios';
import GalleryImage from '../../component/GalleryImage';
import CheckBoxIOS from 'react-native-check-box';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import CommonButton from '../../component/CommonButton';
import ProgresImage from '../../component/ProgresImage';
import {getDirectory} from '../../Actions/DirectoryActions';

const {height, width} = Dimensions.get('window');

const pt_android = Platform.OS === 'ios' ? g.pt0 : g.pt15;
const isX =
  Platform.OS === 'ios' && (height > 800 || height > 800) ? true : false;

let searchVal = '';

const TagUser = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUser, setSearchedUser] = useState([]);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState({});
  /**
   * API section
   */
  const doSearchUser = (searchQuery) => {
    getDirectory(
      '1',
      searchQuery,
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (searchVal.length > 0) {
              setSearchedUser([...data.data]);
            } else {
              setSearchedUser([]);
            }
          }
        }
      },
      (error) => {
        setSearchedUser([]);
      },
    );
  };

  const submitData = () => {
      navigation.goBack();
  };

  /**
   * API section
   */

  const addUserToTaggedList = (item) => {
    for (let i = 0; i < taggedUsers.length; i++) {
      const element = taggedUsers[i];
      if (element._id === item._id) {
        alert('Sorry this person is allready added.');
        return;
      }
    }

    let oldItem = taggedUsers;

    oldItem.push(item);
    setSearchedUser([]);
    setTaggedUsers([...oldItem]);
  };

  const concatName = (item) => {
    let fullName = '';

    if (
      item.firstName &&
      item.firstName !== undefined &&
      item.firstName !== ''
    ) {
      fullName += item.firstName;
    }

    if (item.lastName && item.lastName !== undefined && item.lastName !== '') {
      fullName += ' ' + item.lastName;
    }
    return fullName;
  };
  const renderAutoSuggest = () => {
    var data = searchedUser.map((row, index) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          style={style.suggestionContainer}
          onPress={() => {
            addUserToTaggedList(row);
          }}>
          <View style={[g.bggray2, g.br3, {overflow: 'hidden', height: 100}]}>
            {row.profileImg != null && row.profileImg !== '' && (
              <ProgresImage
                source={
                  row.profileImg != null && row.profileImg !== ''
                    ? {uri: row.profileImg}
                    : GlobalInclude.Assets.DefaultProfile
                }
                containerStyle={{width: 75, height: 100}}
                imageStyle={{width: 75, height: 100}}
                mode={'contain'}
              />
            )}
          </View>
          <View style={{padding: scale(3)}}>
            <Text style={style.userNameView}>{concatName(row)}</Text>
            {row.batch ? (
              <Text style={style.userNameView}>{row.batch}</Text>
            ) : null}
          </View>
        </TouchableOpacity>
      );
    });
    return (
      <View style={[g.AutoCompleteList1]}>
        <Text style={[g.colorBlack, g.fs11, g.pb5]}>Suggestion</Text>
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
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <View style={GlobalInclude.AppStyle.fill}>
          <HeaderBar
            navigation={navigation}
            title={'Tag People'}
            showLabel={false}
          />
          <ScrollView
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: scale(15),
              paddingBottom: 15,
            }}
            showsVerticalScrollIndicator={false}>
            <View style={{marginTop: 15}}>
              <TextInput
                underlineColorAndroid="transparent"
                value={searchQuery}
                placeholder={'Tag People in the Photo'}
                underlineColorAndroid="transparent"
                placeholderTextColor={g.bggray}
                style={[g.inputWhite, {color: 'black'}]}
                onChangeText={(value) => {
                  searchVal = value;
                  setSearchQuery(value);
                  if (value.length > 0) {
                    doSearchUser(value);
                  } else {
                    setSearchedUser([]);
                  }
                }}
              />
            </View>
            {errorMessage.emptyTag && errorMessage.emptyTag.length > 0 && (
              <Text style={[g.errorMsg, g.pt5]}>{errorMessage.emptyTag}</Text>
            )}
            {searchedUser.length > 0 && (
              <View style={[grid.row, g.pb10]}>{renderAutoSuggest()}</View>
            )}
            <View style={g.mt15}>
              {taggedUsers.length > 0 ? (
                <Text style={[g.fs16, g.FHNB, g.colordarkGray, g.ml10]}>
                  People
                </Text>
              ) : null}
              <View
                style={[
                  grid.row,
                  g.mt10,
                  taggedUsers.length > 2 ? grid.justifyContent : '',
                  grid.flexwrap,
                ]}>
                {taggedUsers.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        {
                          marginLeft: 10,
                          width: width / 3 - 40,
                          marginRight: taggedUsers.length > 2 ? 10 : 20,
                        },
                      ]}>
                      <TouchableOpacity activeOpacity={0.8}>
                        <View
                          style={[g.bglightGray, g.oh, {borderRadius: 100}]}>
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
                            {concatName(item)}
                          </Text>
                          <Text
                            style={[
                              {fontSize: 14},
                              g.FHNR,
                              g.txtCenter,
                              g.colorGray1,
                            ]}>
                            {'Batch ' + `${item.batch}`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
          <View
            style={[
              grid.rowdir,
              grid.alignItems,
              grid.justifyContentCenter,
              g.bgWhite,
              {
                paddingTop: 15,
                padding: 20,
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
              },
            ]}>
            <TouchableOpacity
              onPress={() => submitData()}
              activeOpacity={1}
              style={[grid.col, g.btnL, g.w115, {height: 45}]}>
              <Text style={[g.colorWhite, g.txtCenter]}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  suggestionContainer: {
    width: 75,
    marginEnd: 15,
  },
  userNameView: {
    fontSize: 12,
    color: '#000000',
    marginTop: scale(3),
  },
});

export default TagUser;
