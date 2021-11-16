import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import EditLinksExperience from '../../component/EditLinksExperience';
import {searchUser} from '../../Actions/UserActions';
import {getDirectory} from '../../Actions/DirectoryActions';
import NextPreviousButton from '../../component/NextPreviousButton';
import {updateUserProfile} from '../../Actions/UserActions';
import Helpers from '../../helper/Helper';

var lastSelectedIndex = -1;
let responseMessage = '';
let selectedUser = null;
const Relatives = props => {
  const {profileData} = props;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [showContactUsModal, setShowContactUsModal] = useState(false);
  const [relativeName, setRelativeName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [searchedUser, setSearchedUser] = useState([]);
  const [myRelatives, setMyRelatives] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    setMyRelatives(profileData.relativeInSchool);
    return () => {};
  }, [profileData]);

  const inputHandler = (fieldName, fieldValue) => {
    if (fieldName === 'relationship') {
      setRelationship(fieldValue);
    }
  };

  const generateHeader = (title, required) => {
    return (
      <View style={[grid.rowdir, grid.alignItemsTop]}>
        <Text style={g.labeltext1}>{title}</Text>
        {required && <Text style={g.colorRed}>*</Text>}
      </View>
    );
  };

  const doSearchUser = searchQuery => {
    getDirectory(
      '1',
      searchQuery,
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            for (var i = data.data.length - 1; i >= 0; i--) {
              const element = data.data[i];
              if (element._id === global.userId) {
                data.data.splice(i, 1);
                break;
              }
            }
            setSearchedUser([...data.data]);
          }
        }
      },
      error => {
        setSearchedUser([]);
        console.log('error', error);
      },
    );
  };

  const inflateLinks = ({index, item}) => {
    return (
      <EditLinksExperience
        indexName={index}
        mainTitle={`${item.relativeName} ${
          item.batch !== undefined && item.batch !== null ? item.batch : ''
        }`}
        header={item.relationship}
        onDeletePress={() => {
          lastSelectedIndex = index;
          props.removeIndex(() => {
            removeLink();
          });
        }}
        onEditPress={() => {
          selectedUser = item;
          setIsEdit(true);
          setErrorMessage({});
          setRelativeName(item.relativeName);
          setRelationship(item.relationship);
          lastSelectedIndex = index;
        }}
      />
    );
  };

  const addNewLink = updateMode => {
    Keyboard.dismiss();
    if (relativeName.trim() === '') {
      setErrorMessage({relativeName: 'This field is required'});
    } else {
      let object = {
        _id: selectedUser._id,
        relativeName: relativeName,
        relationship: relationship,
        relativeProfileImg: profileImg,
        batch: selectedUser.batch,
        house: selectedUser.house,
        section: selectedUser.section,
        schoolNumber: selectedUser.schoolNumber,
      };

      if (updateMode) {
        let oldData = myRelatives;
        oldData[lastSelectedIndex] = object;
        setMyRelatives([...oldData]);
      } else {
        let oldData = myRelatives;
        oldData.push(object);
        setMyRelatives([...oldData]);
      }
      selectedUser = null;
      setIsEdit(false);
      setErrorMessage({});
      setRelativeName('');
      setRelationship('');
      lastSelectedIndex = -1;
    }
  };

  const removeLink = () => {
    if (lastSelectedIndex > myRelatives.length) {
      return;
    }
    let oldData = myRelatives;
    oldData.splice(lastSelectedIndex, 1);
    setMyRelatives([...oldData]);
  };

  /**
   *
   * API Section start
   *
   */
  const updateProfileDetails = () => {
    let requestData = {
      relativeInSchool: myRelatives,
    };

    if (global.isConnected) {
      setIsLoading(true);
      updateUserProfile(
        requestData,
        response => {
          setIsLoading(false);
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.response !== null
            ) {
              let data = response.data;
              if (data.status) {
                props.updateData(data.data);
                setTimeout(() => {
                  props.onSaveTab();
                }, 500);
              }
            }
          }
        },
        (error, message) => {
          setIsLoading(false);
          responseMessage = message;
          setShowContactUsModal(!showContactUsModal);
        },
      );
    }
  };
  /**
   *
   * API Section end
   *
   */

  const renderAutoSuggest = () => {
    var data = searchedUser.map((row, index) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          style={styles.suggestionContainer}
          onPress={() => {
            selectedUser = row;
            setRelativeName(Helpers.concatName(row));
            setProfileImg(row.profileImg);
            setSearchedUser([]);
          }}>
          <View style={[g.bggray2, g.br3]}>
            <Image
              style={{width: '100%', height: scale(93), borderRadius: scale(6)}}
              source={{uri: row.profileImg}}
              resizeMode={'contain'}
            />
          </View>
          <Text style={styles.userName}>{Helpers.concatName(row)}</Text>
          {row.batch ? (
            <Text style={[g.fs12, g.colorBlack, g.FHNR, {margin: scale(2)}]}>
              {row.batch}
            </Text>
          ) : null}
        </TouchableOpacity>
      );
    });
    return (
      <View style={[g.AutoCompleteList1, g.p10]}>
        <Text style={[g.colordarkGray, g.fs16, g.FHNM, g.pb5]}>Suggestion</Text>
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
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
      style={GlobalInclude.AppStyle.fill}>
      <View style={GlobalInclude.AppStyle.fill}>
        <KeyboardAwareScrollView
          style={[g.mt20, g.mb20]}
          showsVerticalScrollIndicator={false}>
          <View style={[grid.flex1, g.pb30]}>
            {showContactUsModal && (
              <GlobalInclude.ModalAlert
                status={showContactUsModal}
                header={responseMessage}
                okButton={'Okay'}
                okAction={() => {
                  setShowContactUsModal(false);
                }}
                closeAction={() => {
                  setShowContactUsModal(false);
                }}
              />
            )}
            <View style={g.mb15}>
              {generateHeader('Name of Relative', true)}
              <View style={{marginBottom: scale(5)}} />
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Name of Relative'}
                value={relativeName}
                onChangeText={value => {
                  setRelativeName(value);
                  if (value.length > 0) {
                    doSearchUser(value);
                  } else {
                    setSearchedUser([]);
                  }
                }}
              />
              {errorMessage.relativeName &&
                errorMessage.relativeName.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.relativeName}
                  </Text>
                )}
            </View>
            {searchedUser.length > 0 && renderAutoSuggest()}

            <View style={g.mb15}>
              {generateHeader('Nature of Relationship', false)}
              <View style={{marginBottom: scale(5)}} />
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Nature of Relationship'}
                value={relationship}
                onChangeText={value => inputHandler('relationship', value)}
              />
            </View>
            <View>
              <View style={[grid.row, g.mt20, grid.justifyContentRight]}>
                {!isEdit ? (
                  <Text
                    style={[g.btn]}
                    onPress={e => {
                      addNewLink(false);
                    }}>
                    Add this Relative
                  </Text>
                ) : (
                  <Text
                    style={[g.btn]}
                    onPress={e => {
                      addNewLink(true);
                    }}>
                    Update
                  </Text>
                )}
              </View>
            </View>

            {generateHeader('My Relative(s)', false)}

            {myRelatives.length > 0 && (
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={myRelatives}
                renderItem={inflateLinks}
              />
            )}
          </View>
        </KeyboardAwareScrollView>
        <NextPreviousButton
          isLoading={isLoading}
          onPreviuosTab={() => {
            props.onPreviuosTab();
          }}
          onSaveTab={() => {
            //props.onSaveTab();
            updateProfileDetails();
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  userName: {
    textAlign: 'left',
    fontSize: scale(13),
    color: '#333333',
    fontFamily: 'Lato-Regular',
    marginTop: scale(5),
  },
  suggestionContainer: {
    width: scale(70),
    marginEnd: scale(10),
    marginTop: scale(6),
    marginBottom: scale(6),
  },
});

export default Relatives;
