import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  FlatList,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {IconType} from '../../helper/Constants';
import {URL_REGX} from '../../helper/Constants';
import Helpers from '../../helper/Helper';
import {updateUserProfile} from '../../Actions/UserActions';
import NextPreviousButton from '../../component/NextPreviousButton';

var lastSelectedIndex = -1;

const {urlRegex, fbRegex, instaRegex, twiterRegex, youtubeRegex, wikiRegex} =
  URL_REGX;
let responseMessage = '';
const SocialLinks = (props) => {
  const {profileData} = props;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [youtube, setYoutube] = useState('');
  const [twitter, setTwitter] = useState('');
  const [wikipedia, setWikipedia] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [link, setLink] = useState('');
  const [aboutLink, setAboutLink] = useState('');
  const [myLinks, setMyLinks] = useState([]);
  const [showContactUsModal, setShowContactUsModal] = useState(false);

  useEffect(() => {
    setFacebook(profileData.fb);
    setInstagram(profileData.insta);
    setLinkedIn(profileData.linkedinUrl);
    setYoutube(profileData.youtube);
    setTwitter(profileData.twitter);
    setWikipedia(profileData.wiki);
    setWhatsApp(profileData.whatsapp);
    setMyLinks(profileData.links);
    return () => {};
  }, [profileData]);

  /**
   *
   * API Section start
   *
   */
  const updateProfileDetails = () => {
    let requestData = {};

    if (facebook !== undefined && facebook !== null && facebook !== '') {
      if (Helpers.validateRegex(fbRegex, facebook)) {
        requestData.fb = facebook;
      } else {
        setErrorMessage({facebook: 'Facebook link is not valid'});
        return;
      }
    } else {
      requestData.fb = '';
    }
    if (instagram !== undefined && instagram !== null && instagram !== '') {
      if (Helpers.validateRegex(instaRegex, instagram)) {
        requestData.insta = instagram;
      } else {
        setErrorMessage({instagram: 'Instagram link is not valid'});
        return;
      }
    } else {
      requestData.insta = '';
    }
    if (linkedIn !== undefined && linkedIn !== null && linkedIn !== '') {
      if (Helpers.validateRegex(urlRegex, linkedIn)) {
        requestData.linkedinUrl = linkedIn;
      } else {
        setErrorMessage({linkedIn: 'LinkedIn link is not valid'});
        return;
      }
    } else {
      requestData.linkedinUrl = '';
    }
    if (youtube !== undefined && youtube !== null && youtube !== '') {
      if (Helpers.validateRegex(youtubeRegex, youtube)) {
        requestData.youtube = youtube;
      } else {
        setErrorMessage({youtube: 'Youtube link is not valid'});
        return;
      }
    } else {
      requestData.youtube = '';
    }
    if (twitter !== undefined && twitter !== null && twitter !== '') {
      if (Helpers.validateRegex(twiterRegex, twitter)) {
        requestData.twitter = twitter;
      } else {
        setErrorMessage({twitter: 'Twitter link is not valid'});
        return;
      }
    } else {
      requestData.twitter = '';
    }
    if (wikipedia !== undefined && wikipedia !== null && wikipedia !== '') {
      if (Helpers.validateRegex(wikiRegex, wikipedia)) {
        requestData.wiki = wikipedia;
      } else {
        setErrorMessage({wikipedia: 'Wikipedia link is not valid'});
        return;
      }
    } else {
      requestData.wiki = '';
    }
    if (whatsApp !== undefined && whatsApp !== null && whatsApp !== '') {
      requestData.whatsapp = whatsApp;
    } else {
      requestData.whatsapp = '';
    }

    requestData.links = myLinks;

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

  const inputHandler = (key, fieldValue) => {
    if (key === 'facebook') {
      setFacebook(fieldValue);
    } else if (key === 'instagram') {
      setInstagram(fieldValue);
    } else if (key === 'linkedIn') {
      setLinkedIn(fieldValue);
    } else if (key === 'youtube') {
      setYoutube(fieldValue);
    } else if (key === 'twitter') {
      setTwitter(fieldValue);
    } else if (key === 'wikipedia') {
      setWikipedia(fieldValue);
    } else if (key === 'whatsApp') {
      setWhatsApp(fieldValue);
    } else if (key === 'link') {
      setLink(fieldValue);
    } else if (key === 'aboutLink') {
      setAboutLink(fieldValue);
    }
  };

  const addNewLink = (updateMode) => {
    setErrorMessage({});
    if (link.trim() === '') {
      setErrorMessage({link: 'This field is required'});
    } else if (!Helpers.validateRegex(urlRegex, link)) {
      setErrorMessage({link: 'This field is not valid'});
    } else if (aboutLink.trim() === '') {
      setErrorMessage({aboutLink: 'This field is required'});
    } else {
      let oldData = myLinks;
      let insertedItem = {
        link: Helpers.getValidUrl(link),
        aboutLink: aboutLink,
      };
      if (updateMode) {
        oldData[lastSelectedIndex] = insertedItem;
      } else {
        oldData.push(insertedItem);
      }
      setMyLinks([...oldData]);
      setIsEdit(false);
      lastSelectedIndex = -1;
      setLink('');
      setAboutLink('');
    }
  };

  const removeLink = () => {
    if (lastSelectedIndex > myLinks.length) {
      return;
    }
    let oldData = myLinks;
    oldData.splice(lastSelectedIndex, 1);
    setMyLinks([...oldData]);
  };

  const generateHeader = (title, color) => {
    return (
      <View style={grid.rowrow}>
        <GlobalInclude.BaseIcon
          containerStyle={{
            height: scale(28),
            width: scale(28),
            justifyContent: 'center',
          }}
          iconColor={color}
          iconName={title}
          iconSize={scale(22)}
          iconType={IconType[4]}
        />
        <View
          style={{
            width: 1,
            height: 26,
            backgroundColor: '#ced4da',
            marginStart: scale(5),
          }}
        />
      </View>
    );
  };

  const inflateLinks = ({index, item}) => {
    return (
      <TouchableOpacity activeOpacity={1}>
        <View style={[g.mt10, {borderTopWidth: 1, borderTopColor: '#cccccc'}]}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack, g.pt5]}>{item.link}</Text>
          <Text style={[g.fs14, g.FHNR, g.colorLightGray, g.mt10]}>
            {item.aboutLink}
          </Text>
          <View style={{width: scale(140)}}>
            <View style={[grid.rowdir, g.mt5]}>
              <Text
                style={[g.btn, grid.col, g.bggray5, g.mr5]}
                onPress={() => {
                  lastSelectedIndex = index;
                  props.removeIndex(() => {
                    removeLink();
                  });
                }}>
                Delete
              </Text>
              <Text
                style={[g.btn, grid.col, g.bggray5]}
                onPress={() => {
                  setIsEdit(true);
                  lastSelectedIndex = index;
                  setLink(item.link);
                  setAboutLink(item.aboutLink);
                }}>
                Edit
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
              <View style={[grid.rowdir, g.shareStyle, grid.alignItems]}>
                {generateHeader('facebook-official', '#475993')}
                <TextInput
                  keyboardType={'default'}
                  underlineColorAndroid="transparent"
                  style={[g.inputWhite, grid.col]}
                  value={facebook}
                  onChangeText={(value) => inputHandler('facebook', value)}
                  placeholder={''}
                  maxLength={264}
                  editable={true}
                />
              </View>
              {errorMessage.facebook && errorMessage.facebook.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>{errorMessage.facebook}</Text>
              )}
            </View>

            <View style={g.mb15}>
              <View style={[grid.rowdir, g.shareStyle, grid.alignItems]}>
                {generateHeader('twitter-square', '#2b95ff')}
                <TextInput
                  keyboardType={'default'}
                  underlineColorAndroid="transparent"
                  style={[g.inputWhite, grid.col]}
                  value={twitter}
                  onChangeText={(value) => inputHandler('twitter', value)}
                  placeholder={''}
                  maxLength={264}
                  editable={true}
                />
              </View>
              {errorMessage.twitter && errorMessage.twitter.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>{errorMessage.twitter}</Text>
              )}
            </View>

            <View style={g.mb15}>
              <View style={[grid.rowdir, g.shareStyle, grid.alignItems]}>
                {generateHeader('linkedin-square', '#2b95ff')}
                <TextInput
                  keyboardType={'default'}
                  underlineColorAndroid="transparent"
                  style={[g.inputWhite, grid.col]}
                  value={linkedIn}
                  onChangeText={(value) => inputHandler('linkedIn', value)}
                  placeholder={''}
                  maxLength={264}
                  editable={true}
                />
              </View>
              {errorMessage.linkedIn && errorMessage.linkedIn.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>{errorMessage.linkedIn}</Text>
              )}
            </View>

            <View style={g.mb15}>
              <View style={[grid.rowdir, g.shareStyle, grid.alignItems]}>
                {generateHeader('instagram', '#e4405f')}
                <TextInput
                  keyboardType={'default'}
                  underlineColorAndroid="transparent"
                  style={[g.inputWhite, grid.col]}
                  value={instagram}
                  onChangeText={(value) => inputHandler('instagram', value)}
                  placeholder={''}
                  maxLength={264}
                  editable={true}
                />
              </View>
              {errorMessage.instagram && errorMessage.instagram.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.instagram}
                </Text>
              )}
            </View>

            <View style={g.mb15}>
              <View style={[grid.rowdir, g.shareStyle, grid.alignItems]}>
                {generateHeader('youtube-play', '#ff0000')}
                <TextInput
                  keyboardType={'default'}
                  underlineColorAndroid="transparent"
                  style={[g.inputWhite, grid.col]}
                  value={youtube}
                  onChangeText={(value) => inputHandler('youtube', value)}
                  placeholder={''}
                  maxLength={264}
                  editable={true}
                />
              </View>
              {errorMessage.youtube && errorMessage.youtube.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>{errorMessage.youtube}</Text>
              )}
            </View>

            <View style={g.mb15}>
              <View style={[grid.rowdir, g.shareStyle, grid.alignItems]}>
                {generateHeader('wikipedia-w', '#3e3e3e')}
                <TextInput
                  keyboardType={'default'}
                  underlineColorAndroid="transparent"
                  style={[g.inputWhite, grid.col]}
                  value={wikipedia}
                  onChangeText={(value) => inputHandler('wikipedia', value)}
                  placeholder={''}
                  maxLength={264}
                  editable={true}
                />
              </View>
              {errorMessage.wikipedia && errorMessage.wikipedia.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.wikipedia}
                </Text>
              )}
            </View>

            <View style={g.mb25}>
              <View style={[grid.rowdir, g.shareStyle, grid.alignItems]}>
                {generateHeader('whatsapp', '#25d366')}
                <TextInput
                  keyboardType={'default'}
                  underlineColorAndroid="transparent"
                  style={[g.inputWhite, grid.col]}
                  value={whatsApp}
                  onChangeText={(value) => inputHandler('whatsApp', value)}
                  placeholder={''}
                  maxLength={264}
                  editable={true}
                />
              </View>
              {errorMessage.whatsapp && errorMessage.whatsapp.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>{errorMessage.whatsapp}</Text>
              )}
            </View>
            <View style={[grid.rowdir, grid.alignItemsTop, g.mb15]}>
              <Text style={g.labeltext1}>Add Your Links</Text>
            </View>

            <View style={[g.textAreaContainer, g.mb15]}>
              <TextInput
                keyboardType={'default'}
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Post Your Link Here'}
                maxLength={264}
                onChangeText={(value) => inputHandler('link', value)}
                value={link}
                editable={true}
              />
            </View>
            {errorMessage.link && errorMessage.link.length > 0 && (
              <Text style={[g.errorMsg, g.pt5]}>{errorMessage.link}</Text>
            )}
            <View style={[g.textAreaContainer]}>
              <TextInput
                keyboardType={'default'}
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'About Your Link'}
                maxLength={264}
                value={aboutLink}
                onChangeText={(value) => inputHandler('aboutLink', value)}
                editable={true}
              />
            </View>
            {errorMessage.aboutLink && errorMessage.aboutLink.length > 0 && (
              <Text style={[g.errorMsg, g.pt5]}>{errorMessage.aboutLink}</Text>
            )}

            <View style={[grid.rowdir, g.pt10, grid.justifyContentRight]}>
              {!isEdit ? (
                <Text
                  style={[g.btn]}
                  onPress={(e) => {
                    addNewLink(false);
                  }}>
                  Add More
                </Text>
              ) : (
                <Text
                  style={[g.btn]}
                  onPress={(e) => {
                    addNewLink(true);
                  }}>
                  Update
                </Text>
              )}
            </View>

            <View style={[grid.rowdir, grid.alignItemsTop]}>
              <Text style={[g.colorBlue1, g.fs16, g.FHNB]}>My Links</Text>
            </View>

            <View>
              {myLinks.length > 0 && (
                <View>
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={myLinks}
                    renderItem={inflateLinks}
                  />
                </View>
              )}
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

export default SocialLinks;
