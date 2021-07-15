import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Keyboard,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import HeaderBar from '../../../component/HeaderBar';
import Helper from '../../../helper/Helper';
import {IconType, APP_NAME} from '../../../helper/Constants';
import grid from '../../../theme/grid';
import g from '../../../theme/global';
import {scale} from '../../../theme/Scalling';
import CommonButton from '../../../component/CommonButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FilterCategory from '../../../component/FilterCategory';
import {generateHeader} from '../../../component/Common';
import {loadMedia} from '../../../component/MediaComponent';
import UploadMedia from '../../../component/UploadMedia';
import ModelAlert from '../../../component/ModalAlert';
import {getCategories, addPost, editPost} from '../../../Actions/TickerActions';
import {getScrappedData} from '../../../Actions/CommonActions';

let selectedIndex = -1;
let responseMessage = '';
let isSuccess = false;
let inEditMode = false;
let postId = '';
let newsBody = '';
let newsImage = '';
let title = '';
let newsLink = '';

const PostTicker = ({route, navigation}) => {
  const categoryRef = useRef();
  const uploadRef = useRef();
  const [loading, setLoading] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryId, setCategoryId] = useState(-1);
  const [categoryList, setCategoryList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [mediaData, setMediaData] = useState([]);
  const [showImageLoading, setShowImageLoading] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [myComment, setMyComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tag, setTag] = useState('');
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [disableImage, setDisableImage] = useState(false);
  const [disableDoc, setDisableDoc] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    selectedIndex = -1;
    responseMessage = '';
    isSuccess = false;
    inEditMode = false;
    postId = '';
    newsBody = '';
    newsImage = '';
    title = '';
    newsLink = '';
    pickMultiple = false;

    if (route.params !== undefined && route.params !== null) {
      if (route.params.data !== undefined && route.params.data !== null) {
        inEditMode = route.params.data.inEditMode;
        if (inEditMode) {
          setupDefaultData(route.params.data.data);
        }
      }
    }

    if (global.isConnected) {
      getCategory();
    }
    return () => {};
  }, [route.params]);

  const setupDefaultData = (defaultData) => {
    if (defaultData && defaultData !== undefined && defaultData !== null) {
      setCategoryId(defaultData.categoryId);
      setSelectedCategory(Helper.capitalize(defaultData.categoryMsg));
      setInputValue(defaultData.body);
      setMyComment(defaultData.comment);
      setSelectedTags(defaultData.tags);
      setBackgroundColor(defaultData.colorCode);

      postId = defaultData._id;
      if (
        defaultData.links !== undefined &&
        defaultData.links !== null &&
        defaultData.links.length > 0
      ) {
        let tmpMedia = [];
        var isImage = false,
          isDoc = false;

        let altArray = defaultData.links;
        altArray.reverse();

        altArray.map((child) => {
          switch (child.type) {
            case 1:
              isImage = true;
              tmpMedia.push({
                fileName: child.file,
                thumbnail: child.file,
                type: 1,
              });
              break;

            case 2:
              setYoutubeLink(child.file);
              break;

            case 3:
              isDoc = true;
              tmpMedia.push({
                fileName: child.file,
                thumbnail: child.file,
                type: 3,
              });
              break;

            default:
              break;
          }
        });

        if (isImage) {
          setDisableImage(false);
          setDisableDoc(true);
        } else if (isDoc) {
          setDisableImage(true);
          setDisableDoc(false);
        }

        setMediaData([...tmpMedia]);
      }
    }
  };

  /*****
   *
   * API Section
   *
   */
  const getCategory = () => {
    getCategories(
      (response) => {
        setLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let categoryArray = [];
              if (data.data !== null) {
                data.data.map((item, index) => {
                  categoryArray.push({
                    key: item.id,
                    text: item.name,
                  });
                });
              }
              setCategoryList(categoryArray);
            }
          }
        }
      },
      (error) => {
        setLoading(false);
      },
    );
  };

  const doScrapping = (onDone) => {
    getScrappedData(
      youtubeLink,
      (response) => {
        if (
          response &&
          response !== null &&
          response.data &&
          response.data !== undefined &&
          response.data !== null
        ) {
          let data = response.data;

          console.log('data', data);

          if (data.status) {
            let child = data.data;
            newsBody =
              child.description !== undefined && child.description !== null
                ? child.description
                : '';
            title =
              child.title !== undefined && child.title !== null
                ? child.title
                : '';
            newsLink =
              child.site_url !== undefined && child.site_url !== null
                ? child.site_url
                : '';

            if (
              child.image !== undefined &&
              child.image !== null &&
              child.image !== ''
            ) {
              newsImage = {
                file: child.image,
                type: 1,
              };
            }
            setTimeout(() => {
              onDone();
            }, 200);
          } else {
            setTimeout(() => {
              onDone();
            }, 200);
          }
        } else {
          setTimeout(() => {
            onDone();
          }, 200);
        }
      },
      (error, code) => {
        console.log('error', error, code);
        setTimeout(() => {
          onDone();
        }, 200);
      },
    );
  };

  const savePostData = () => {
    let links = [];

    if (youtubeLink !== '') {
      if (categoryId !== 4) {
        links.push({file: youtubeLink, type: 2});
      }
    }

    if (categoryId !== 4) {
      mediaData.map((child) => {
        links.push({file: child.thumbnail, type: child.type});
      });
    } else {
      links.push(newsImage);
    }

    links.reverse();

    let bodyContent = '';
    let newsTitle = '';
    let linkHost = '';
    let redirectURL = '';

    if (categoryId === 4 || categoryId === 5) {
      if (myComment !== undefined && myComment !== null && myComment !== '') {
        bodyContent = myComment;
      } else {
        if (categoryId === 4) {
          bodyContent = newsBody;
        }
      }
      newsTitle = title;
      linkHost = newsLink;
      redirectURL = youtubeLink;
    } else if (categoryId === 8) {
      bodyContent = myComment;
    } else {
      bodyContent = inputValue;
    }

    let requestObject = {
      categoryId: categoryId,
      body: bodyContent,
      title: newsTitle,
      linkHost: linkHost,
      comment: myComment,
      tags: selectedTags,
      colorCode: backgroundColor,
      links: links,
      fullUrl: redirectURL,
      videoLinks: [],
      imageLinks: [],
      pdfLinks: [],
      gifLinks: [],
    };

    console.log('====================================');
    console.log('requestObject', JSON.stringify(requestObject));
    console.log('====================================');

    Keyboard.dismiss();
    if (inEditMode) {
      editPostData(requestObject);
    } else {
      uploadPostData(requestObject);
    }
  };

  const uploadPostData = (requestObject) => {
    addPost(
      requestObject,
      (response) => {
        setSubmitting(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              isSuccess = true;
              setTimeout(() => {
                route.params.onGoBack();
                navigation.goBack();
              }, 250);
            } else {
              responseMessage = 'Error while posting your request!';
              setShowErrorMessage(true);
            }
          }
        }
      },
      (code, error) => {
        setSubmitting(false);
        Alert.alert('Something went wrong', error);
      },
    );
  };

  const editPostData = (requestObject) => {
    setSubmitting(true);
    editPost(
      requestObject,
      postId,
      (response) => {
        setSubmitting(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              isSuccess = true;
              setTimeout(() => {
                route.params.onGoBack();
                navigation.goBack();
              }, 250);
            } else {
              responseMessage = 'Error while updating your request!';
              setShowErrorMessage(true);
            }
          }
        }
      },
      (code, error) => {
        setSubmitting(false);
        Alert.alert('Something went wrong', error);
      },
    );
  };

  const completePosting = () => {
    setSubmitting(true);
    if (categoryId === 4 || categoryId === 5) {
      doScrapping(() => {
        savePostData();
      });
    } else {
      savePostData();
    }
  };

  /*****
   *
   * API Section
   *
   */

  const validateInput = () => {
    if (
      categoryId === 1 ||
      categoryId === 2 ||
      categoryId === 3 ||
      categoryId === 6 ||
      categoryId === 7
    ) {
      if (inputValue.trim() === '' || inputValue.length === 0) {
        setErrorMessage({inputValue: 'This field is required'});
      } else {
        if (global.isConnected) {
          completePosting();
        }
      }
    } else if (categoryId === 4 || categoryId === 5 || categoryId === 9) {
      if (youtubeLink.trim() === '' || youtubeLink.length === 0) {
        setErrorMessage({uploadLink: 'This field is required'});
      } else {
        if (global.isConnected) {
          completePosting();
        }
      }
    } else if (categoryId === 8) {
      if (mediaData.length === 0) {
        setErrorMessage({uploadImage: 'This field is required'});
      } else {
        if (global.isConnected) {
          completePosting();
        }
      }
    }
  };

  const showColourButton = (code) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setBackgroundColor(code)}
        style={{
          height: scale(20),
          width: scale(20),
          backgroundColor: code,
          borderRadius: scale(5),
          marginHorizontal: scale(2),
        }}
      />
    );
  };

  const showColorSelection = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={grid.justifyContentRight}>
        <View style={[grid.rowdir, grid.alignItems, grid.justifyContentRight]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setBackgroundColor('')}
            style={{
              height: scale(20),
              width: scale(20),
              backgroundColor: '#f8f8f8',
              borderRadius: scale(5),
              marginHorizontal: scale(2),
            }}
          />
          <View
            style={[{height: scale(30), width: 3}, g.bggray5, g.ml2, g.mr2]}
          />
          {showColourButton('#4AAA68')}
          {showColourButton('#F76323')}
          {showColourButton('#F35269')}
          {showColourButton('#000')}
          {showColourButton('#E9F1FF')}
          {showColourButton('#F3EEAA')}
          {showColourButton('#FBBFC0')}
          {showColourButton('#008080')}
          {showColourButton('#FAD583')}
          {showColourButton('#27336B')}
          {showColourButton('#4F5265')}
        </View>
      </ScrollView>
    );
  };

  const showInput = () => {
    return (
      <View>
        {generateHeader('Write Your Text', true)}
        <TextInput
          underlineColorAndroid="transparent"
          numberOfLines={16}
          style={[
            g.inputWhite,
            {
              height: scale(160),
              textAlignVertical: 'top',
              backgroundColor:
                backgroundColor !== '' ? backgroundColor : '#f8f8f8',
              color:
                backgroundColor !== ''
                  ? Helper.getContrastYIQ(backgroundColor)
                  : 'black',
            },
          ]}
          placeholderTextColor={
            backgroundColor !== '' && Helper.getContrastYIQ(backgroundColor)
          }
          value={inputValue}
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
            setErrorMessage({});
            setInputValue(value);
          }}
        />
        {errorMessage.inputValue && errorMessage.inputValue !== '' ? (
          <Text style={g.errorMsg}>{errorMessage.inputValue}</Text>
        ) : null}
      </View>
    );
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
            let oldData = mediaData;
            oldData.splice(index, 1);
            setMediaData([...oldData]);

            if (oldData.length === 0) {
              setDisableDoc(false);
              setDisableImage(false);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderMediaItem = () => {
    let componentArray = [];

    mediaData.map((item, index) => {
      const component = loadMedia(item, index, () => {
        removeIndex(index);
      });
      componentArray.push(component);
    });
    return componentArray;
  };

  const showUploadPhoto = (compulsory, header) => {
    return (
      <View style={[grid.alignItems, grid.justifyContentCenter]}>
        {generateHeader(header, compulsory)}
        <View style={[grid.rowdir, grid.justifyContentCenter, grid.alignItems]}>
          <TouchableOpacity
            style={[grid.col, g.mr10]}
            activeOpacity={1}
            onPress={() => {
              if (mediaData.length < 5) {
                if (categoryId === 8) {
                  if (uploadRef.current !== null) {
                    uploadRef.current.open();
                  }
                } else {
                  // pickMedia();
                  setDisableDoc(true);
                  if (uploadRef.current !== null) {
                    uploadRef.current.open();
                  }
                }
              } else {
                if (categoryId === 8) {
                  Alert.alert(
                    'Max Upload Reached',
                    'You can only upload 5 images or PDFs',
                  );
                } else {
                  Alert.alert(
                    'Max Image Reached',
                    'You can upload max 5 images',
                  );
                }
              }
            }}>
            <View
              style={[grid.row, g.inputWhite, grid.alignItems, g.pb5, g.pt5]}>
              <GlobalInclude.BaseIcon
                containerStyle={styles.downloadIcon}
                iconColor={'#bababa'}
                iconName={'download'}
                iconSize={scale(22)}
                iconType={IconType[4]}
              />
              <Text style={[grid.col, g.fs14, g.colorLightGray, g.FHNR]}>
                {categoryId === 8
                  ? 'Click to Upload Media'
                  : 'Click to Upload Image'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.addTag}
            onPress={() => {
              if (mediaData.length < 5) {
                if (categoryId === 8) {
                  if (uploadRef.current !== null) {
                    uploadRef.current.open();
                  }
                } else {
                  // pickMedia();
                  setDisableDoc(true);
                  if (uploadRef.current !== null) {
                    uploadRef.current.open();
                  }
                }
              } else {
                if (categoryId === 8) {
                  Alert.alert(
                    'Max Upload Reached',
                    'You can only upload 5 images or PDFs',
                  );
                } else {
                  Alert.alert(
                    'Max Image Reached',
                    'You can upload max 5 images',
                  );
                }
              }
            }}>
            {showImageLoading ? (
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
        {errorMessage.uploadImage && errorMessage.uploadImage !== '' ? (
          <Text style={[g.errorMsg, grid.justifyContentLeft, grid.alignSelf]}>
            {errorMessage.uploadImage}
          </Text>
        ) : null}
        <Text
          style={[
            g.errorMsg,
            grid.justifyContentLeft,
            grid.alignSelf,
            g.mt5,
            g.colorBlack,
          ]}>
          You can upload max 5 Images
        </Text>
      </View>
    );
  };

  const showUploadedMedia = () => {
    return (
      <View>
        {/* media data */}
        {mediaData.length > 0 && (
          <View style={[grid.rowdir, grid.flexwrap, grid.alignItems]}>
            {renderMediaItem()}
          </View>
        )}
        {/* media data */}
      </View>
    );
  };

  const showYoutubeLink = (header, placeholder) => {
    return (
      <View>
        {generateHeader(header, true)}
        <TextInput
          underlineColorAndroid={'transparent'}
          style={g.inputWhite}
          value={youtubeLink}
          keyboardType={'default'}
          autoCapitalize={'none'}
          returnKeyType={'done'}
          placeholder={placeholder}
          onChangeText={(value) => {
            setYoutubeLink(value);
          }}
        />
        {errorMessage.uploadLink && errorMessage.uploadLink !== '' ? (
          <Text style={g.errorMsg}>{errorMessage.uploadLink}</Text>
        ) : null}
      </View>
    );
  };

  const showMyCommentInput = () => {
    return (
      <View>
        {generateHeader('Write/Paste Your Comment', false)}
        <TextInput
          underlineColorAndroid="transparent"
          style={styles.commentInput}
          multiline={true}
          value={myComment}
          returnKeyType="done"
          blurOnSubmit={true}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          placeholder={"My comment - (Why I'm posting this)"}
          onChangeText={(comment) => {
            setMyComment(comment);
          }}
        />
        {errorMessage.userComment && errorMessage.userComment !== '' ? (
          <Text style={g.errorMsg}>{errorMessage.userComment}</Text>
        ) : null}
      </View>
    );
  };

  const showShowTags = () => {
    return (
      <View>
        <View style={g.mb15}>
          {generateHeader('Tags', false)}
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
          {errorMessage.postTags && errorMessage.postTags !== '' ? (
            <Text style={g.errorMsg}>{errorMessage.postTags}</Text>
          ) : null}
        </View>
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
    );
  };

  const addTag = () => {
    if (tag.trim() === '') {
      Alert.alert('Tag Required', 'Tag is required');
    } else {
      Keyboard.dismiss();
      let oldData = selectedTags;
      if (!oldData.includes(tag)) {
        oldData.push(tag);
        setSelectedTags([...oldData]);
        setTag('');
        let msg = errorMessage;
        delete msg.tag;
        setErrorMessage(msg);
      } else {
        Alert.alert('Duplicate Tag', 'Tag is Already Exists');
      }
    }
  };

  const onRemoveTag = (index) => {
    let oldData = selectedTags;
    oldData.splice(index, 1);
    setSelectedTags([...oldData]);
  };

  const loadTab = () => {
    switch (categoryId) {
      case 1:
        return (
          <View style={g.mt15}>
            {showInput()}
            <View style={[g.mt5, g.mb5]} />
            {showColorSelection()}
          </View>
        );
      case 2:
        return (
          <View style={g.mt15}>
            {showInput()}
            <View style={[g.mt5, g.mb5]} />
            {showColorSelection()}
            <View style={[g.mt5, g.mb5]} />
            {showUploadPhoto(false, 'Upload Photo')}
            <View style={[g.mt5, g.mb5]} />
            {showUploadedMedia()}
          </View>
        );
      case 3:
        return (
          <View style={g.mt15}>
            {showInput()}
            <View style={[g.mt5, g.mb5]} />
            {showColorSelection()}
            <View style={[g.mt5, g.mb5]} />
            {showUploadPhoto(false, 'Upload Photo')}
            <View style={[g.mt5, g.mb5]} />
            {showUploadedMedia()}
          </View>
        );
      case 4:
        return (
          <View style={g.mt15}>
            {showYoutubeLink('Paste News Link', 'Paste News Link')}
            <View style={[g.mt5, g.mb5]} />
            {showMyCommentInput()}
            <View style={[g.mt5, g.mb5]} />
            {showShowTags()}
          </View>
        );
      case 5:
        return (
          <View style={g.mt15}>
            {showYoutubeLink('Paste Youtube Link', 'Paste Youtube Link')}
            <View style={[g.mt5, g.mb5]} />
            {showMyCommentInput()}
            <View style={[g.mt5, g.mb5]} />
            {showShowTags()}
          </View>
        );
      case 6:
        return (
          <View style={g.mt15}>
            {showInput()}
            <View style={[g.mt5, g.mb5]} />
            {showColorSelection()}
          </View>
        );
      case 7:
        return (
          <View style={g.mt15}>
            {showInput()}
            <View style={[g.mt5, g.mb5]} />
            {showColorSelection()}
            <View style={[g.mt5, g.mb5]} />
            {showUploadPhoto(false, 'Upload Photo')}
            <View style={[g.mt5, g.mb5]} />
            {showUploadedMedia()}
          </View>
        );
      case 8:
        return (
          <View style={g.mt15}>
            {showUploadPhoto(true, 'Upload Media')}
            <View style={[g.mt5, g.mb5]} />
            {showUploadedMedia()}
            <View style={[g.mt5, g.mb5]} />
            {showMyCommentInput()}
          </View>
        );
      case 9:
        return (
          <View style={g.mt15}>
            {showYoutubeLink('Paste Youtube Link', 'Paste youtube URL')}
            <View style={[g.mt5, g.mb5]} />
            {showMyCommentInput()}
          </View>
        );
      default:
        return <View />;
    }
  };

  const resetOptions = () => {
    setInputValue('');
    setYoutubeLink('');
    setMyComment('');
    setTag('');
    setErrorMessage({});
    setMediaData([]);
    setSelectedTags([]);
    setShowImageLoading(false);
    setBackgroundColor('');
  };

  const showCategories = () => {
    return (
      <FilterCategory
        refRBSheet={categoryRef}
        dataList={categoryList}
        title={'Select Category'}
        selectedFilter={selectedCategory}
        setSelectedFilter={(value, item) => {
          Keyboard.dismiss();
          if (inEditMode) {
            if (categoryId !== item.key) {
              console.log('gethere');
              setTimeout(() => {
                setDisableDoc(false);
                setDisableImage(false);
              }, 200);
            }
          }
          setSelectedCategory(Helper.capitalize(value));
          setCategoryId(item.key);
          resetOptions();
          categoryRef.current.close();
        }}
        onClose={() => {}}
      />
    );
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar
        title={inEditMode ? 'Update Post' : 'Create New Post'}
        navigation={navigation}
        showBack={true}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <View style={GlobalInclude.AppStyle.fill}>
          {loading ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator
                size={'small'}
                color={GlobalInclude.Color.ColorPrimary}
              />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              <View
                style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15, g.pt30]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[grid.rowdir, grid.alignItems, g.inputWhite]}
                  onPress={() => {
                    if (categoryRef !== undefined && categoryRef !== null) {
                      categoryRef.current.open();
                    }
                  }}>
                  <Text
                    style={[
                      grid.col,
                      g.FHNR,
                      g.fs13,
                      grid.justifyContentCenter,
                      {textAlignVertical: 'center'},
                      selectedCategory !== '' ? g.colorBlack : g.colorGray1,
                    ]}
                    numberOfLines={1}>
                    {selectedCategory !== ''
                      ? selectedCategory
                      : 'Select Category Of Post'}
                  </Text>
                  <View style={GlobalInclude.AppStyle.triangleShape} />
                </TouchableOpacity>
                <KeyboardAwareScrollView
                  keyboardShouldPersistTaps={'handled'}
                  style={[grid.flex1]}
                  showsVerticalScrollIndicator={false}>
                  {loadTab()}
                </KeyboardAwareScrollView>
                <View style={styles.buttonContainer}>
                  <CommonButton
                    showLoader={submitting}
                    title={inEditMode ? 'Update Post' : 'Post It Now'}
                    onPress={() => validateInput()}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
      {showCategories()}

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

      <UploadMedia
        refRBSheet={uploadRef}
        media={{
          image: disableImage,
          video: true,
          document: disableDoc,
          audio: true,
        }}
        supportMultiple={true}
        onPickMedia={(media) => {
          uploadRef.current.close();
          if (media !== undefined && media !== null) {
            console.log('media', media);

            let oldData = mediaData;
            if (oldData.length === 0) {
              if (media.type === 1) {
                setDisableDoc(true);
              } else if (media.type === 3) {
                setDisableImage(true);
              }
            }

            Array.prototype.push.apply(oldData, media);
            setMediaData([...oldData]);
          }
        }}
      />

      {showErrorMessage && (
        <GlobalInclude.ModalAlert
          status={showErrorMessage}
          header={responseMessage}
          okButton={isSuccess ? 'Okay' : `Contact ${APP_NAME}`}
          okAction={() => {
            setShowErrorMessage(!showErrorMessage);
            if (isSuccess) {
              navigation.goBack();
            }
          }}
          closeAction={() => {
            setShowErrorMessage(!showErrorMessage);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
  },
  addTag: {
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    color: '#ffffff',
    textAlign: 'center',
    fontSize: scale(16),
    padding: scale(8),
    borderRadius: scale(8),
    overflow: 'hidden',
    width: scale(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageStyle: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: scale(16),
  },
  downloadIcon: {
    height: scale(28),
    width: scale(28),
    justifyContent: 'center',
  },
  commentInput: {
    height: 120,
    color: 'black',
    textAlignVertical: 'top',
    backgroundColor: '#f8f8f8',
    padding: scale(10),
    margin: 0,
    fontSize: scale(12),
    borderRadius: scale(8),
    fontFamily: 'Lato-Regular',
    justifyContent: 'center',
  },
});

export default PostTicker;
