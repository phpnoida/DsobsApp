import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  StyleSheet,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {IconType} from '../../helper/Constants';
import NextPreviousButton from '../../component/NextPreviousButton';
import {updateUserProfile} from '../../Actions/UserActions';

let responseMessage = '';

const Tags = (props) => {
  const {profileData} = props;

  const [showContactUsModal, setShowContactUsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [tag, setTag] = useState('');
  const [userTags, setUserTags] = useState([]);
  const [tagList] = useState([
    'School Captain',
    'School Prefect',
    'House Captain',
    'House Prefect',
    'House Monitor',
    "Scholar's Scarf",
    'Scholar’s Gown Recipient',
    'Sports Blazer',
    'Sports Captain',
    'Sports Colours',
    'School Basketball Team',
    'School Cricket Team',
    'School Football Team',
    'School Hockey Team',
    'Magazine Editorial Board',
    'School Debating Team',
    'MUN Team',
    'School DanceTeam',
    'Dramatics Team',
  ]);
  const [selectedTag, setSelectedTag] = useState(-1);

  useEffect(() => {
    setUserTags(profileData.tags);
    return () => {};
  }, [profileData]);

  const generateHeader = (title, required) => {
    return (
      <View style={[grid.rowdir, grid.alignItemsTop]}>
        <Text style={g.labeltext1}>{title}</Text>
        {required && <Text style={g.colorRed}>*</Text>}
      </View>
    );
  };

  const addTag = (value, index) => {
    if (index === selectedTag) {
      setSelectedTag(-1);
      setTag('');
    } else {
      setSelectedTag(index);
      setTag(tagList[index]);
    }
  };

  const addTags = () => {
    if (tag.trim() === '') {
      setErrorMessage({tag: 'please add or select tag'});
    } else {
      let oldData = userTags;
      oldData.push(tag);
      setUserTags([...oldData]);
      setTag('');
      setErrorMessage({});
    }
  };

  const removeIndex = (index) => {
    if (index > userTags.length) {
      return;
    } else {
      let oldData = userTags;
      oldData.splice(index, 1);
      setUserTags([...oldData]);
    }
  };

  /**
   *
   * API Section start
   *
   */
  const updateProfileDetails = () => {
    let requestData = {
      tags: userTags,
    };

    if (global.isConnected) {
      setIsLoading(true);
      updateUserProfile(
        requestData,
        (response) => {
          setIsLoading(false);
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.response !== null
            ) {
              let data = response.data;
              console.log('updateUserProfile', data);
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
              {generateHeader('Add Your Tags', false)}
              <View style={{marginVertical: scale(5)}} />
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
                  onPress={() => addTags()}>
                  <Text
                    style={{
                      backgroundColor: GlobalInclude.Color.ColorPrimary,
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
            <View style={g.mt10}>
              <View style={grid.displayinlineBlock}>
                {userTags.map((v, i) => {
                  return (
                    <TouchableOpacity
                      key={i.toString()}
                      onPress={() => {
                        props.removeIndex(() => {
                          removeIndex(i);
                        });
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
              <View style={g.mt10}>
                <View style={grid.displayinlineBlock}>
                  {tagList.map((v, i) => {
                    return (
                      <TouchableOpacity
                        key={i.toString()}
                        onPress={() => {
                          addTag(v, i);
                        }}
                        activeOpacity={1}
                        style={[
                          selectedTag === i
                            ? styles.styletagnew
                            : styles.styletag,
                        ]}>
                        <Text
                          style={[
                            styles.styletagTxt,
                            selectedTag === i ? g.colorWhite : g.colorBlue,
                          ]}>
                          {v}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <NextPreviousButton
          isLoading={isLoading}
          onPreviuosTab={() => {
            props.onPreviuosTab();
          }}
          onSaveTab={() => {
            updateProfileDetails();
            //props.onSaveTab();
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  styletag: {
    borderWidth: 1,
    borderColor: GlobalInclude.Color.ColorPrimary,
    borderRadius: 30,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  styletagnew: {
    borderWidth: 1,
    borderColor: GlobalInclude.Color.ColorPrimary,
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    borderRadius: 30,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  styletagTxt: {
    fontSize: scale(13),
    textAlign: 'center',
  },
});

export default Tags;
