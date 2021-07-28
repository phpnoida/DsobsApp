import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Keyboard,
  SafeAreaView,
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
import {getDirectory} from '../../../Actions/DirectoryActions';
import {doSearchCity, uploadMedia} from '../../../Actions/CommonActions';
import {getProfessionList} from '../../../Actions/UserActions';
import {addYellowPage, editYellowPage} from '../../../Actions/YelloPageActions';
import {APP_NAME} from '../../../helper/Constants';
import Helper from '../../../helper/Helper';
import CountryPicker from 'react-native-country-picker-modal';

let searchVal = '';
let postId = '';
let cityTitle = '';
let responseMessage = '';
let professionListMain = [];
let inEditMode = false;
let isSuccess = false;
let pickerType = 1;
const ListMyBusiness = ({route, navigation}) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [loader, setLoader] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [setDefaultBusinessName, setSetDefaultBusinessName] = useState('');

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
  const [whatsappCountryCode, setWhatsappCountryCode] = useState('+91');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [showCodePicker, setShowCodePicker] = useState(false);

  useEffect(() => {
    searchVal = '';
    postId = '';
    cityTitle = '';
    responseMessage = '';
    professionListMain = [];
    inEditMode = false;
    isSuccess = false;

    if (route.params !== undefined && route.params !== null) {
      inEditMode = route.params.data.inEditMode;

      if (inEditMode) {
        setupDefaultData(route.params.data.data);
      }
    }

    if (global.isConnected) {
      getProfession();
    }
    return () => {};
  }, [route]);

  const setupDefaultData = (defaultData) => {
    if (defaultData && defaultData !== undefined && defaultData !== null) {
      setBusinessName(defaultData.businessName);
      setSetDefaultBusinessName(defaultData.businessName);
      setSelectedProfession(defaultData.categoryOfBusiness);
      setBusinessLocation(
        defaultData.googleMapsLocation !== undefined &&
          defaultData.googleMapsLocation !== null
          ? defaultData.googleMapsLocation.link
          : '',
      );
      setSelectedCities([...defaultData.citiesOfOperation]);
      setCoverImages([...defaultData.coverImages]);

      setAboutBusiness(defaultData.aboutTheBusiness);
      setBusinessServices(defaultData.productsAndServicesOffered);
      setProductTags([...defaultData.tags]);

      setSelectedUser([...defaultData.alumniInBusiness]);
      setMediaData([...defaultData.images]);

      let companyContactPerson = defaultData.companyContactPerson;

      setContactPerson(companyContactPerson.name);
      setDesignation(companyContactPerson.designation);
      setPhoneContact(companyContactPerson.phone);
      setPhoneCountryCode(companyContactPerson.countryCode);
      setEmailAddress(companyContactPerson.email);
      setWhatsApp(companyContactPerson.whatsapp);
      setAddress(defaultData.companyAddress);
      setWebLink(companyContactPerson.websiteLink);
      setWhatsappCountryCode(companyContactPerson.whatsappCountryCode);

      postId = defaultData._id;
    }
  };

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

              if (mediaType === 4) {
                let oldData = coverImages;
                oldData.splice(0, 0, childData);
                setCoverImages([...oldData]);
              }
            }
          }
        }
      },
      (statusCode, message) => {
        setIsLoading(false);
        Alert.alert('Error while uploading', message);
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
        whatsappCountryCode: whatsappCountryCode,
        websiteLink: webLink,
        phone: phoneContact,
        countryCode: phoneCountryCode,
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
      editors: [
        {
          profileImg: global.userDetails.profileImg,
          lastName: global.userDetails.lastName,
          countryCode: global.userDetails.countryCode,
          profession: global.userDetails.profession,
          designation: global.userDetails.designation,
          schoolNumber: global.userDetails.schoolNumber,
          batch: global.userDetails.batch,
          house: global.userDetails.house,
          section: global.userDetails.section,
          status: global.userDetails.status,
          lastseen: global.userDetails.lastseen,
          deviceType: global.userDetails.deviceType,
          deviceTypeTxt: global.userDetails.deviceTypeTxt,
          deviceModelNumber: global.userDetails.deviceModelNumber,
          _id: global.userDetails._id,
          firstName: global.userDetails.firstName,
          email: global.userDetails.email,
          phone: global.userDetails.phone,
          name: global.userDetails.name,
        },
      ],
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

    if (inEditMode) {
      delete requestObject.userId;
      delete requestObject.amountReceived;
      delete requestObject.amountDateOfRecived;
      delete requestObject.subscriptionStartDate;
      delete requestObject.subscriptionEndDate;
      delete requestObject.amountReceivedBy;
      delete requestObject.amountReceiverPhone;
      delete requestObject.editors;
      editYellowPageData(requestObject);
    } else {
      addYellowPageData(requestObject);
    }
  };

  const addYellowPageData = (requestObject) => {
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

  const editYellowPageData = (requestObject) => {
    setLoader(true);
    editYellowPage(
      postId,
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
        setLoader(false);
      },
    );
  };

  /*****
   *
   * API Section
   *
   */

  const openCounryCodePicker = () => {
    setShowCodePicker(!showCodePicker);
  };

  const closeCodePicker = () => {
    setShowCodePicker(!showCodePicker);
  };

  const onSelectCountry = (country) => {
    setShowCodePicker(!showCodePicker);
    let code = '+' + country.callingCode[0];

    if (pickerType === 1) {
      setPhoneCountryCode(code);
    } else {
      setWhatsappCountryCode(code);
    }
  };

  const uploadImage = (pickFile, childPath, mediaType) => {
    let body = Helper.uploadImage(pickFile);
    if (body !== null) {
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
      }
      /**
       * else if (businessLocation.trim() === '') {
       * setErrorMessage({businessLocation: 'This field is required'});
       * return;
       * }
       *
       */
    } else if (step === 2) {
      if (aboutBusiness.trim() === '') {
        setErrorMessage({aboutBusiness: 'This field is required'});
        return;
      } else if (businessServices.trim() === '') {
        setErrorMessage({businessServices: 'This field is required'});
        return;
      }
      /**
       * else if (productTags.length === 0) {
       * setErrorMessage({tag: 'This field is required'});
       * return;
      }
       */
    } else if (step === 3) {
      /*if (selectedUser.length === 0) {
        setErrorMessage({selectedAlumini: 'This field is required'});
        return;
      }*/
    } else if (step === 5) {
      /**
       * else if (designation.trim() === '') {
       * setErrorMessage({designation: 'This field is required'});
       * return;
       * }
       *  else if (whatsApp.trim() === '') {
       * setErrorMessage({whatsApp: 'This field is required'});
       * return;
       * }
       *  else if (webLink.trim() === '') {
       * setErrorMessage({webLink: 'This field is required'});
       * return;
       * }
       *
       */
      if (contactPerson.trim() === '') {
        setErrorMessage({contactPerson: 'This field is required'});
        return;
      } else if (phoneContact.trim() === '') {
        setErrorMessage({phoneContact: 'This field is required'});
        return;
      } else if (emailAddress.trim() === '') {
        setErrorMessage({emailAddress: 'This field is required'});
        return;
      } else if (address.trim() === '') {
        setErrorMessage({address: 'This field is required'});
        return;
      } else {
        saveMyBusiness();
        return;
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
    setErrorMessage({});
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
    if (searchText.length > 0) {
      var filtered = professionListMain.filter((element) =>
        element.text.toLowerCase().includes(searchText.toLowerCase()),
      );
      setProfessionList([...filtered]);
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
            navigation={navigation}
            inEditMode={inEditMode}
            businessName={businessName}
            professionList={professionList}
            selectedProfession={selectedProfession}
            searchProfession={(search) => {
              searchProfession(search);
            }}
            onPreofessionSelect={(profession) => {
              setErrorMessage({});
              setSelectedProfession(profession);
              setProfessionList([...professionListMain]);
            }}
            coverImages={coverImages}
            setCoverImages={(image) => {
              let oldData = coverImages;
              Array.prototype.push.apply(oldData, image);
              setCoverImages([...oldData]);
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
            setSelectedCities={(city, countryCode) => {
              let oldData = selectedCities;
              oldData.push(`${Helper.capitalize(city)} (${countryCode})`);
              setErrorMessage({});
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
            inEditMode={inEditMode}
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
                Alert.alert('Tag Required', 'Tag is required');
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
                  Alert.alert('Duplicate Tag', 'Tag is Already Exists');
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
            inEditMode={inEditMode}
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
              setErrorMessage({});
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
            inEditMode={inEditMode}
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviousTab={() => goPreviousTab()}
            mediaData={mediaData}
            removeMedia={(index) => removeIndex(index)}
            onMediaPick={(media) => {
              let oldData = mediaData;
              Array.prototype.push.apply(oldData, media);
              setMediaData([...oldData]);
            }}
          />
        );
      case 5:
        return (
          <TabFive
            inEditMode={inEditMode}
            loader={loader}
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviousTab={() => goPreviousTab()}
            handleInput={handleInput}
            contactPerson={contactPerson}
            designation={designation}
            phoneContact={phoneContact}
            emailAddress={emailAddress}
            whatsApp={whatsApp}
            whatsappCountryCode={whatsappCountryCode}
            phoneCountryCode={phoneCountryCode}
            address={address}
            webLink={webLink}
            errorMessage={errorMessage}
            openCounryCodePicker={(type) => {
              pickerType = type;
              openCounryCodePicker();
            }}
          />
        );
    }
    return <View />;
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar
        title={
          inEditMode ? `Edit ${setDefaultBusinessName}` : 'List My Business'
        }
        navigation={navigation}
        showBack={true}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
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
          <ActivityIndicator
            size={'large'}
            color={GlobalInclude.Color.ColorPrimary}
          />
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
              navigation.goBack();
              // navigation.dispatch(
              //   CommonActions.reset({
              //     index: 0,
              //     routes: [{name: 'YellowPages'}],
              //   }),
              // );
            }
          }}
          closeAction={() => {
            setShowErrorMessage(!showErrorMessage);
          }}
        />
      )}

      {/* country code picker */}
      {showCodePicker && (
        <CountryPicker
          withFilter={true}
          modalProps={{animationType: 'slide'}}
          visible
          onClose={() => {
            closeCodePicker();
          }}
          onSelect={(country) => {
            onSelectCountry(country);
          }}
        />
      )}
    </View>
  );
};

export default ListMyBusiness;
