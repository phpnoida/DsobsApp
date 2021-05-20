import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Modal,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
  Linking,
  TouchableNativeFeedback,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {IconType} from '../../helper/Constants';
import HeaderBar from '../../component/HeaderBar';
import ProgresImage from '../../component/ProgresImage';
import {getDirectory} from '../../Actions/DirectoryActions';
import {doUpdateImageInformation} from '../../Actions/GalleryActions';
import CommonButton from '../../component/CommonButton';
import Helper from '../../helper/Helper';
const {width} = Dimensions.get('window');

let searchVal = '';
let imageId = '';
let imageKey = '';
let responseMessage = '';
let isRemoved = false;
const TagUser = ({route, navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUser, setSearchedUser] = useState([]);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (route.params !== undefined && route.params !== null) {
      imageId = route.params.id;
      imageKey = route.params.imageKey;
      setTaggedUsers([...route.params.userTag]);
    }
    return () => {};
  }, []);

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
    if (taggedUsers.length === 0) {
      setErrorMessage({emptyTag: 'You must need to add people to tag.'});
    } else {
      let taggedIds = [];
      taggedUsers.map((user) => {
        taggedIds.push({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          batch: user.batch,
          schoolNumber: user.schoolNumber,
          house: user.house,
          section: user.section,
          phone: user.phone,
          countryCode: user.countryCode,
          profileImg: user.profileImg,
        });
      });
      let requestData = {
        userTag: taggedIds,
        imageKey: imageKey,
      };

      setShowLoader(true);
      doUpdateImageInformation(
        imageId,
        requestData,
        (response) => {
          setShowLoader(false);
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.data !== null
            ) {
              let data = response.data;
              if (data.status) {
                if (isRemoved) {
                  isRemoved = false;
                  responseMessage = 'User removed successfully!';
                } else {
                  responseMessage = 'User tagged successfully!';
                }
              } else {
                responseMessage = 'Error while tagging!';
              }
              setShowModal(true);

              setTimeout(() => {
                setShowModal(false);

                setTimeout(() => {
                  navigation.goBack();
                }, 100);
              }, 2000);
            }
          }
        },
        (error) => {
          responseMessage = 'Error while tagging!';
          setShowModal(true);
          setShowLoader(false);

          setTimeout(() => {
            setShowModal(false);
          }, 2000);
        },
      );
    }
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
    setSearchQuery('');
    setSearchedUser([]);

    oldItem.sort((a, b) =>
      a.firstName > b.firstName ? 1 : b.firstName > a.firstName ? -1 : 0,
    );

    oldItem.sort((a, b) =>
      a.batch > b.batch ? 1 : b.batch > a.batch ? -1 : 0,
    );

    setTaggedUsers([...oldItem]);
  };

  const removeIndex = (index) => {
    Alert.alert(
      'Are you sure you want to delete it?',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => {
            isRemoved = true;
            removeUser(index);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const removeUser = (index) => {
    let oldItem = taggedUsers;
    oldItem.splice(index, 1);
    setTaggedUsers([...oldItem]);
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
            <Text style={style.userNameView}>{Helper.concatName(row)}</Text>
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
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar
        navigation={navigation}
        title={'Tag People'}
        showLabel={false}
        showBack={true}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <View
          style={[
            GlobalInclude.AppStyle.fill,
            GlobalInclude.AppStyle.contentSpace,
          ]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              underlineColorAndroid="transparent"
              value={searchQuery}
              placeholder={'Tag People in the Photo'}
              placeholderTextColor={'#202020'}
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

              <View style={[grid.rowdir, grid.flexwrap, grid.alignItems]}>
                {taggedUsers.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        {
                          width: width / 3 - 30,
                          marginTop: 10,
                          marginRight: 10,
                          marginLeft: 10,
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
                      <TouchableOpacity
                        onPress={() => {
                          removeIndex(index);
                        }}
                        style={{
                          height: scale(18),
                          width: scale(18),
                          justifyContent: 'flex-end',
                          alignItems: 'flex-end',
                          alignSelf: 'flex-end',
                          position: 'absolute',
                          top: 0,
                          right: 0,
                        }}
                        background={TouchableNativeFeedback.SelectableBackground()}>
                        <GlobalInclude.BaseIcon
                          containerStyle={{height: scale(18), width: scale(18)}}
                          iconColor={'#2b3252'}
                          iconName={'close'}
                          iconSize={scale(16)}
                          iconType={IconType[4]}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
        <View
          style={[
            grid.alignItems,
            grid.justifyContentCenter,
            g.ml15,
            g.mr15,
            g.mb15,
          ]}>
          <CommonButton
            showLoader={showLoader}
            title={'Update'}
            onPress={() => {
              submitData();
            }}
          />
        </View>
      </SafeAreaView>

      {showModal && (
        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setShowModal(!showModal);
          }}
          hardwareAccelerated={true}
          visible={showModal}>
          <View style={style.centeredView}>
            <View style={style.modalView}>
              <Text style={style.headerText}>{responseMessage}</Text>
            </View>
          </View>
        </Modal>
      )}
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: width - 50,
    backgroundColor: 'white',
    borderRadius: scale(6),
    padding: scale(7),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: scale(60),
    alignContent: 'center',
  },
  headerText: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: scale(16),
    textAlign: 'center',
    ...g.FHNR,
    ...g.colorBlue,
  },
});

export default TagUser;
