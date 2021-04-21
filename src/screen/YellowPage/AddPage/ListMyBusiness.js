import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Keyboard,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import HeaderBar from '../../../component/HeaderBar';
import TabOne from './TabOne';
import TabTwo from './TabTwo';
import TabThree from './TabThree';
import TabFour from './TabFour';
import TabFive from './TabFive';
import Toast from '../../../component/Toast';
import {getDirectory} from '../../../Actions/DirectoryActions';
import {doSearchCity} from '../../../Actions/CommonActions';
import {getProfessionList} from '../../../Actions/UserActions';
import {uploadMedia} from '../../../Actions/CommonActions';
import {addYellowPage} from '../../../Actions/AddYellowPageActions';
import RNFetchBlob from 'rn-fetch-blob';
import {APP_NAME} from '../../../helper/Constants';
import {CommonActions} from '@react-navigation/native';

let searchVal = '';
let cityTitle = '';
let responseMessage = '';
let professionListMain = [];
let inEditMode = false;
let isSuccess = false;

const ListMyBusiness = ({route, navigation}) => {
  if (route.params !== undefined && route.params !== null) {
    inEditMode = route.params.data.inEditMode;
  }

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [loader, setLoader] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  /**Tab one */
  const [businessName, setBusinessName] = useState('');
  const [professionList, setProfessionList] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [coverImages, setCoverImages] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [businessLocation, setBusinessLocation] = useState('');

  /**Tab Two */
  const [aboutBusiness, setAboutBusiness] = useState('');
  const [businessServices, setBusinessServices] = useState('');
  const [productTags, setProductTags] = useState([]);
  const [tag, setTag] = useState('');

  /**Tab three */
  const [searchedUser, setSearchedUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [searchUserName, setSearchUserName] = useState('');

  /**Tab four */
  const [mediaData, setMediaData] = useState([]);

  /**Tab five */
  const [contactPerson, setContactPerson] = useState('');
  const [designation, setDesignation] = useState('');
  const [phoneContact, setPhoneContact] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [address, setAddress] = useState('');
  const [webLink, setWebLink] = useState('');

  useEffect(() => {
    if (global.isConnected) {
      getProfession();
    }
    return () => {};
  }, []);

  /*****
   *
   * API Section
   *
   */

  const getProfession = () => {
    getProfessionList(
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let professionArray = [];
              if (data.data !== null) {
                data.data.map((item, index) => {
                  professionArray.push({key: index, text: item});
                });
              }
              professionListMain = professionArray;
              setProfessionList(professionArray);
            }
          }
        }
      },
      (error) => {},
    );
  };

  const getSearchDataByCity = (query) => {
    doSearchCity(
      query,
      10,
      0,
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              if (cityTitle.length > 0) {
                setCityList([...data.data]);
              } else {
                setCityList([]);
              }
            }
          }
        }
      },
      (code, error) => {
        setCityList([]);
      },
    );
  };

  // Upload Media

  const uploadMediaContent = (body, childPath, mediaType) => {
    setIsLoading(true);
    uploadMedia(
      childPath,
      body,
      (response) => {
        setIsLoading(false);
        if (response && response !== undefined && response !== null) {
          if (response.status) {
            if (response.data && response.data !== null) {
              let childData = response.data.data;
              let object = {
                thumbnail: childData,
                fileName: childData,
                type: mediaType,
              };

              if (mediaType === 4) {
                let oldData = coverImages;
                oldData.splice(0, 0, object);
                setCoverImages([...oldData]);
              } else {
                let oldData = mediaData;
                oldData.splice(0, 0, object);
                setMediaData([...oldData]);
              }
            }
          }
        }
      },
      (statusCode, message) => {
        setIsLoading(false);
        Toast.show({
          title: 'Error while uploading',
          text: message,
          color: '#f39c12',
          timing: 3000,
        });
      },
    );
  };

  /*****
   *
   * API Section
   *
   */

  // Filter section
  const doSearchUser = (query) => {
    getDirectory(
      '1',
      query,
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
        console.log('error', error);
      },
    );
  };

  const saveMyBusiness = () => {
    const requestObject = {
      googleMapsLocation: {
        link: businessLocation,
        lat: 0,
        long: 0,
      },
      companyContactPerson: {
        name: contactPerson,
        designation: designation,
        email: emailAddress,
        whatsapp: whatsApp,
        websiteLink: webLink,
        phone: phoneContact,
        countryCode: '+91',
      },
      status: 1,
      categoryOfBusiness: selectedProfession,
      citiesOfOperation: selectedCities,
      aboutTheBusiness: aboutBusiness,
      productsAndServicesOffered: businessServices,
      coverImages: coverImages,
      tags: productTags,
      images: mediaData,
      videos: [],
      docs: [],
      editors: [],
      alumniInBusiness: selectedUser,
      amountReceived: 0,
      amountDateOfRecived: 0,
      subscriptionStartDate: 0,
      subscriptionEndDate: 0,
      amountReceivedBy: '',
      amountReceiverPhone: '',
      paymentMode: 0,
      companyAddress: address,
      businessName: businessName,
      userId: global.userId,
    };
    setLoader(true);
    addYellowPage(
      requestObject,
      (response) => {
        setLoader(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              isSuccess = true;
              responseMessage =
                'Congratulations your request has been submitted!';
              setShowErrorMessage(true);
            } else {
              responseMessage = 'Error while posting your request!';
              setShowErrorMessage(true);
            }
          }
        }
      },
      (code, error) => {
        responseMessage = error;
        setShowErrorMessage(true);
      },
    );
  };

  /*****
   *
   * API Section
   *
   */

  const uploadImage = (pickFile, childPath, mediaType) => {
    let body = [];

    if (pickFile !== null) {
      var path = '';

      if (Platform.OS === 'android') {
        path = pickFile.path;
      } else if (Platform.OS === 'ios') {
        path = pickFile.sourceURL;
      }
      let imageName = '';
      if (
        pickFile.fileName === undefined ||
        pickFile.fileName == null ||
        pickFile.fileName === ''
      ) {
        var getFilename = path.split('/');
        imageName = getFilename[getFilename.length - 1];
        var extension = imageName.split('.')[1];
        imageName = new Date().getTime() + '.' + extension;
      } else {
        imageName = pickFile.fileName;
      }

      let imagePath =
        Platform.OS === 'ios' ? path.replace('file://', '') : path;

      let imageType = pickFile.mime;

      var imageData = {
        name: 'image',
        filename: imageName,
        type: imageType,
        data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
      };
      body.push(imageData);

      uploadMediaContent(body, childPath, mediaType);
    }
  };

  const uploadDoc = (pickFile, childPath, mediaType) => {
    let body = [];

    if (pickFile !== null) {
      var path = pickFile.uri;
      let imageName = '';
      if (
        pickFile.name === undefined ||
        pickFile.name == null ||
        pickFile.name === ''
      ) {
        var getFilename = path.split('/');
        imageName = getFilename[getFilename.length - 1];
        var extension = imageName.split('.')[1];
        imageName = new Date().getTime() + '.' + extension;
      } else {
        imageName = pickFile.name;
      }

      let imagePath =
        Platform.OS === 'ios' ? path.replace('file://', '') : path;

      let imageType = pickFile.type;

      var imageData = {
        name: 'image',
        filename: imageName,
        type: imageType,
        data: RNFetchBlob.wrap(decodeURIComponent(imagePath)),
      };
      body.push(imageData);

      uploadMediaContent(body, childPath, mediaType);
    }
  };

  const validateAndMoveNextTab = () => {
    Keyboard.dismiss();

    if (step === 1) {
      if (businessName.trim() === '') {
        setErrorMessage({businessName: 'This field is required'});
        return;
      } else if (selectedProfession.trim() === '') {
        setErrorMessage({selectedProfession: 'This field is required'});
        return;
      } else if (coverImages.length === 0) {
        setErrorMessage({coverImage: 'This field is required'});
        return;
      } else if (selectedCities.length === 0) {
        setErrorMessage({selectedCities: 'This field is required'});
        return;
      } else if (businessLocation.trim() === '') {
        setErrorMessage({businessLocation: 'This field is required'});
        return;
      }
    } else if (step === 2) {
      if (aboutBusiness.trim() === '') {
        setErrorMessage({aboutBusiness: 'This field is required'});
        return;
      } else if (businessServices.trim() === '') {
        setErrorMessage({businessServices: 'This field is required'});
        return;
      } else if (productTags.length === 0) {
        setErrorMessage({tag: 'This field is required'});
        return;
      }
    } else if (step === 3) {
      if (selectedUser.length === 0) {
        setErrorMessage({selectedAlumini: 'This field is required'});
        return;
      }
    } else if (step === 5) {
      if (contactPerson.trim() === '') {
        setErrorMessage({contactPerson: 'This field is required'});
        return;
      } else if (designation.trim() === '') {
        setErrorMessage({designation: 'This field is required'});
        return;
      } else if (phoneContact.trim() === '') {
        setErrorMessage({phoneContact: 'This field is required'});
        return;
      } else if (emailAddress.trim() === '') {
        setErrorMessage({emailAddress: 'This field is required'});
        return;
      } else if (whatsApp.trim() === '') {
        setErrorMessage({whatsApp: 'This field is required'});
        return;
      } else if (address.trim() === '') {
        setErrorMessage({address: 'This field is required'});
        return;
      } else if (webLink.trim() === '') {
        setErrorMessage({webLink: 'This field is required'});
        return;
      } else {
        saveMyBusiness();
      }
    }

    setStep(step + 1);
  };

  const goPreviousTab = () => {
    Keyboard.dismiss();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInput = (key, value) => {
    if (key === 'businessName') {
      setBusinessName(value);
    } else if (key === 'businessLocation') {
      setBusinessLocation(value);
    } else if (key === 'aboutBusiness') {
      setAboutBusiness(value);
    } else if (key === 'businessServices') {
      setBusinessServices(value);
    } else if (key === 'contactPerson') {
      setContactPerson(value);
    } else if (key === 'designation') {
      setDesignation(value);
    } else if (key === 'phoneContact') {
      setPhoneContact(value);
    } else if (key === 'emailAddress') {
      setEmailAddress(value);
    } else if (key === 'whatsApp') {
      setWhatsApp(value);
    } else if (key === 'address') {
      setAddress(value);
    } else if (key === 'webLink') {
      setWebLink(value);
    }
  };

  const searchProfession = (searchText) => {
    let oldContent = professionList;
    var list = [];
    if (searchText.length > 0) {
      oldContent.forEach((element) => {
        if (element.text.toLowerCase().includes(searchText.toLowerCase())) {
          list.push(element);
        }
      });
      setProfessionList([...list]);
    } else {
      //console.log('professionListMain', professionListMain.length);
      setProfessionList([...professionListMain]);
    }
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
          },
        },
      ],
      {cancelable: false},
    );
  };

  const loadTab = (page) => {
    switch (page) {
      case 1:
        return (
          <TabOne
            businessName={businessName}
            professionList={professionList}
            selectedProfession={selectedProfession}
            searchProfession={(search) => {
              searchProfession(search);
            }}
            onPreofessionSelect={(profession) => {
              setSelectedProfession(profession);
            }}
            coverImages={coverImages}
            setCoverImages={(image) => {
              uploadImage(image, 'utils/imageupload', 4);
            }}
            onDeleteImage={(index) => {
              let oldData = coverImages;
              oldData.splice(index, 1);
              setCoverImages([...oldData]);
            }}
            cityList={cityList}
            onSearchCity={(query) => {
              cityTitle = query;
              getSearchDataByCity(query);
            }}
            selectedCities={selectedCities}
            setSelectedCities={(city) => {
              let oldData = selectedCities;
              oldData.push(city);
              setSelectedCities([...oldData]);
            }}
            onRemoveCity={(index) => {
              let oldData = selectedCities;
              oldData.splice(index, 1);
              setSelectedCities([...oldData]);
            }}
            handleInput={handleInput}
            errorMessage={errorMessage}
            businessLocation={businessLocation}
            onSaveTab={() => validateAndMoveNextTab()}
          />
        );
      case 2:
        return (
          <TabTwo
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviousTab={() => goPreviousTab()}
            handleInput={handleInput}
            errorMessage={errorMessage}
            aboutBusiness={aboutBusiness}
            businessServices={businessServices}
            tag={tag}
            setTag={(value) => {
              setTag(value);
            }}
            productTags={productTags}
            addTag={() => {
              if (tag.trim() === '') {
                Toast.show({
                  title: 'Tag Required',
                  text: 'Tag is required',
                  color: '#f39c12',
                  timing: 3000,
                });
              } else {
                Keyboard.dismiss();
                let oldData = productTags;
                if (!oldData.includes(tag)) {
                  oldData.push(tag);
                  setProductTags([...oldData]);
                  setTag('');
                  let msg = errorMessage;
                  delete msg.tag;
                  setErrorMessage(msg);
                } else {
                  Toast.show({
                    title: 'Duplicate Tag',
                    text: 'Tag is Already Exists',
                    color: '#f39c12',
                    timing: 3000,
                  });
                }
              }
            }}
            onRemoveTag={(index) => {
              let oldData = productTags;
              oldData.splice(index, 1);
              setProductTags([...oldData]);
            }}
          />
        );
      case 3:
        return (
          <TabThree
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviousTab={() => goPreviousTab()}
            errorMessage={errorMessage}
            searchUserName={searchUserName}
            changeText={(text) => {
              setSearchUserName(text);
              searchVal = text;
              if (text.length > 3) {
                setSearchedUser([]);
                doSearchUser(text);
              } else if (text.length < 4) {
                setSearchedUser([]);
              }
            }}
            searchedUser={searchedUser}
            onUserSelect={(row, index) => {
              let oldData = selectedUser;
              oldData.push(row);
              setSelectedUser([...oldData]);
              setSearchUserName('');
              setSearchedUser([]);
            }}
            removeAlumini={(index) => {
              let oldData = selectedUser;
              oldData.splice(index, 1);
              setSelectedUser([...oldData]);
            }}
            selectedAlumini={selectedUser}
          />
        );
      case 4:
        return (
          <TabFour
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviousTab={() => goPreviousTab()}
            mediaData={mediaData}
            removeMedia={(index) => removeIndex(index)}
            addVideo={(obj) => {
              let oldData = mediaData;
              oldData.splice(0, 0, obj);
              setMediaData([...oldData]);
            }}
            onPickImage={(image) => {
              uploadImage(image, 'utils/imageupload', 1);
            }}
            onPickDocument={(document) => {
              uploadDoc(document, 'utils/imageupload?type=1', 3);
            }}
          />
        );
      case 5:
        return (
          <TabFive
            loader={loader}
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviousTab={() => goPreviousTab()}
            handleInput={handleInput}
            contactPerson={contactPerson}
            designation={designation}
            phoneContact={phoneContact}
            emailAddress={emailAddress}
            whatsApp={whatsApp}
            address={address}
            webLink={webLink}
            errorMessage={errorMessage}
          />
        );
    }
    return <View />;
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <HeaderBar
          title={'List My Business'}
          navigation={navigation}
          showBack={true}
        />
        <View style={GlobalInclude.AppStyle.fill}>{loadTab(step)}</View>
      </SafeAreaView>
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            alignItems: 'center',
            zIndex: 2,
            left: 0,
            right: 0,
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={'large'} color={'#2b3252'} />
        </View>
      )}

      {showErrorMessage && (
        <GlobalInclude.ModalAlert
          status={showErrorMessage}
          header={responseMessage}
          okButton={isSuccess ? 'Okay' : `Contact ${APP_NAME}`}
          okAction={() => {
            setShowErrorMessage(!showErrorMessage);
            if (isSuccess) {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'YellowPages'}],
                }),
              );
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

const style = StyleSheet.create({});

export default ListMyBusiness;
