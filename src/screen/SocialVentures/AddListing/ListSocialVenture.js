import React, {useState, useEffect} from 'react';
import {View, Keyboard, SafeAreaView, Alert} from 'react-native';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import HeaderBar from '../../../component/HeaderBar';
import Helper from '../../../helper/Helper';
import BasicDetails from './BasicDetails';
import VentureDetails from './VentureDetails';
import VentureMedia from './VentureMedia';
import VolunteerTeam from './VolunteerTeam';
import {getDirectory} from '../../../Actions/DirectoryActions';
import {
  getWorkCategory,
  addSocialWork,
} from '../../../Actions/SocialVenturesActions';
import {APP_NAME, URL_REGX} from '../../../helper/Constants';
const {fbRegex, twiterRegex, wikiRegex} = URL_REGX;
let categoryListMain = [];
let searchVal = '';
let requestedIndex = 0;
let responseMessage = '';
let investmentClosingDate = '';
let isSuccess = false;

const ListSocialVenture = ({route, navigation}) => {
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState({});
  const [loader, setLoader] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Tab One
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [projectName, setProjectName] = useState('');
  const [selectedYear, setSelectedYear] = useState(-1);
  const [initiatedBy, setInitiatedBy] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [wikipedia, setWikipedia] = useState('');
  const [closingDate, setClosingDate] = useState('');

  //TabTwo
  const [ventureVideoLink, setVentureVideoLink] = useState('');
  const [aboutVenture, setAboutVenture] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tag, setTag] = useState('');
  const [socialPhoto, setSocialPhoto] = useState(null);
  //TabThree
  const [searchedUser, setSearchedUser] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  //TabFour
  const [mediaData, setMediaData] = useState([]);

  useEffect(() => {
    categoryListMain = [];
    searchVal = '';

    let defaultVolunteers = [];

    defaultVolunteers.push({
      _id: '',
      fromSchool: false,
      volunteerName: '',
      userData: null,
      imageData: null,
      volunteerRole: '',
      isLoading: false,
      errorMessage: {},
      role: 1,
    });
    defaultVolunteers.push({
      _id: '',
      fromSchool: false,
      volunteerName: '',
      userData: null,
      imageData: null,
      volunteerRole: '',
      isLoading: false,
      errorMessage: {},
      role: 2,
    });

    setVolunteers([...defaultVolunteers]);

    if (global.isConnected) {
      getCategory();
    }

    return () => {};
  }, []);

  /*****
   *
   * API Section
   *
   */

  const getCategory = () => {
    getWorkCategory(
      (response) => {
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
                  categoryArray.push({key: index, text: item});
                });
              }
              categoryListMain = categoryArray;
              setCategoryList(categoryArray);
            }
          }
        }
      },
      (error) => {},
    );
  };

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

  const listMyWork = () => {
    let participants = [];

    volunteers.map((item, index) => {
      if (item.volunteerName.trim() !== '') {
        let request = {
          fromSchool: item.fromSchool,
          name: item.volunteerName,
          batch: item.volunteerRole,
          profilePic:
            item.imageData !== null && item.imageData !== undefined
              ? item.imageData.thumbnail
              : '',
        };
        if (item._id !== undefined && item._id !== null && item._id !== '') {
          request._id = item._id;
        }
        participants.push(request);
      }
    });

    mediaData.map((item, index) => {
      if (
        item.fileName &&
        item.fileName !== undefined &&
        item.fileName !== null
      ) {
        delete item.fileName;
      }
      if (item.tags && item.tags !== undefined && item.tags !== null) {
        delete item.tags;
      }
    });

    let requestObject = {
      title: projectName,
      category: selectedCategory,
      startedYear: selectedYear.toString(),
      founder: initiatedBy,
      coFounder: initiatedBy,
      investmentClosingDate: investmentClosingDate,
      facebook: facebook,
      twitter: twitter,
      wiki: wikipedia,
      ventureVideo: ventureVideoLink,
      ventureImage:
        socialPhoto !== null && socialPhoto !== undefined
          ? socialPhoto.thumbnail
          : '',
      about: aboutVenture,
      tags: selectedTags,
      organizer: participants,
      media: mediaData,
    };
    if (global.isConnected) {
      addMyWork(requestObject);
    }
  };

  const addMyWork = (requestObject) => {
    setLoader(true);
    addSocialWork(
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
              responseMessage = `Congratulations your venture has been successfully sent to ${APP_NAME} for approval.`;
              setShowErrorMessage(true);
            } else {
              responseMessage = 'Error while posting your request!';
              setShowErrorMessage(true);
            }
          }
        }
      },
      (code, error) => {
        console.log('====================================');
        console.log('code,error', code, error);
        console.log('====================================');
        setLoader(false);
        Alert.alert('Something went wrong', error);
      },
    );
  };

  /*****
   *
   * API Section
   *
   */

  const handleInput = (key, value) => {
    setErrorMessage({});
    switch (key) {
      case 'projectName':
        setProjectName(value);
        break;
      case 'initiatedBy':
        setInitiatedBy(value);
        break;
      case 'facebook':
        setFacebook(value);
        break;
      case 'twitter':
        setTwitter(value);
        break;
      case 'wikipedia':
        setWikipedia(value);
        break;
      case 'ventureVideoLink':
        setVentureVideoLink(value);
        break;
      case 'aboutVenture':
        setAboutVenture(value);
        break;
    }
  };

  const searchCategory = (searchText) => {
    let oldContent = categoryList;
    var list = [];
    if (searchText.length > 0) {
      oldContent.forEach((element) => {
        if (element.text.toLowerCase().includes(searchText.toLowerCase())) {
          list.push(element);
        }
      });
      setCategoryList([...list]);
    } else {
      setCategoryList([...categoryListMain]);
    }
  };

  const validateAndMoveNextTab = () => {
    Keyboard.dismiss();
    if (step === 1) {
      if (selectedCategory.trim() === '') {
        setErrorMessage({selectedCategory: 'This field is required'});
        return;
      } else if (selectedYear === -1) {
        setErrorMessage({selectedYear: 'This field is required'});
        return;
      } else if (projectName.trim() === '') {
        setErrorMessage({projectName: 'This field is required'});
        return;
      } else if (closingDate.trim() === '') {
        setErrorMessage({closingDate: 'This field is required'});
        return;
      } else if (initiatedBy.trim() === '') {
        setErrorMessage({initiatedBy: 'This field is required'});
        return;
      } else if (
        facebook.trim() !== '' &&
        !Helper.validateRegex(fbRegex, facebook)
      ) {
        setErrorMessage({facebook: 'This link is not valid'});
        return;
      } else if (
        twitter.trim() !== '' &&
        !Helper.validateRegex(twiterRegex, twitter)
      ) {
        setErrorMessage({twitter: 'This link is not valid'});
        return;
      } else if (
        wikipedia.trim() !== '' &&
        !Helper.validateRegex(wikiRegex, wikipedia)
      ) {
        setErrorMessage({wikipedia: 'This link is not valid'});
        return;
      }
    } else if (step === 2) {
      if (ventureVideoLink.trim() === '' && socialPhoto === null) {
        setErrorMessage({
          socialImageVideo: 'Please Upload at least one, Photo or Video',
        });
        return;
      } else if (aboutVenture.trim() === '') {
        setErrorMessage({aboutVenture: 'This field is required'});
        return;
      }
    } else if (step === 4) {
      listMyWork();
      return;
    }

    setStep(step + 1);
  };

  const goPreviousTab = () => {
    Keyboard.dismiss();
    if (step > 1) {
      setStep(step - 1);
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

  const updateVolunteer = (key, value, index) => {
    let oldData = volunteers;
    oldData = JSON.parse(JSON.stringify(oldData));
    let item = oldData[index];
    if (key === 'userData') {
      item._id = value._id;
      item.volunteerName = Helper.concatName(value);
      item[key] = value;
      item.errorMessage = {};
    } else {
      item[key] = value;
      item.errorMessage = {};
    }
    oldData[index] = item;
    setVolunteers([...oldData]);
  };

  const validateAndAddNewVolunteer = () => {
    let oldData = volunteers;
    oldData = JSON.parse(JSON.stringify(oldData));
    let isValid = true;
    for (let i = 0; i < oldData.length; i++) {
      const element = oldData[i];
      element.errorMessage = {};
      if (
        element.volunteerName === '' ||
        element.volunteerName.trim().length === 0
      ) {
        element.errorMessage.volunteerName = 'This field is required';
        isValid = false;
      } else {
        element.errorMessage = {};
      }
      if (!isValid) {
        break;
      }
    }

    if (isValid) {
      let volunterDetail = {
        _id: '',
        fromSchool: false,
        volunteerName: '',
        userData: null,
        imageData: null,
        volunteerRole: '',
        isLoading: false,
        errorMessage: {},
        role: oldData.length + 1,
      };
      //oldData.splice(0, 0, volunterDetail);
      oldData.push(volunterDetail);
    }
    setVolunteers([...oldData]);
  };

  const loadTab = (page) => {
    switch (page) {
      case 1:
        return (
          <BasicDetails
            errorMessage={errorMessage}
            handleInput={handleInput}
            categoryList={categoryList}
            selectedCategory={selectedCategory}
            projectName={projectName}
            selectedYear={selectedYear}
            initiatedBy={initiatedBy}
            facebook={facebook}
            twitter={twitter}
            wikipedia={wikipedia}
            closingDate={closingDate}
            setDate={(obj) => {
              setErrorMessage({});
              setClosingDate(obj.displayDate);
              let closeDate = new Date(obj.serverDate);
              investmentClosingDate = Math.round(closeDate.getTime() / 1000);
            }}
            searchCategory={searchCategory}
            onCategorySelect={(category) => {
              setSelectedCategory(category);
              setErrorMessage({});
              setCategoryList([...categoryListMain]);
            }}
            setYear={(value) => {
              setErrorMessage({});
              setSelectedYear(value);
            }}
            onSaveTab={validateAndMoveNextTab}
          />
        );

      case 2:
        return (
          <VentureDetails
            errorMessage={errorMessage}
            handleInput={handleInput}
            onPreviousTab={goPreviousTab}
            onSaveTab={validateAndMoveNextTab}
            ventureVideoLink={ventureVideoLink}
            aboutVenture={aboutVenture}
            selectedTags={selectedTags}
            socialPhoto={socialPhoto}
            uploadMedia={(media) => {
              setErrorMessage({});
              setSocialPhoto(media);
            }}
            tag={tag}
            setTag={(value) => {
              setTag(value);
            }}
            addTag={() => {
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
            }}
            onRemoveTag={(index) => {
              let oldData = selectedTags;
              oldData.splice(index, 1);
              setSelectedTags([...oldData]);
            }}
          />
        );

      case 3:
        return (
          <VolunteerTeam
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviousTab={() => goPreviousTab()}
            volunteers={volunteers}
            requestedIndex={requestedIndex}
            updateIndex={(key, value, index) => {
              updateVolunteer(key, value, index);
            }}
            changeText={(text, fromSchool, index) => {
              requestedIndex = index;
              searchVal = text;
              updateVolunteer('volunteerName', text, index);
              if (fromSchool) {
                if (text.length > 3) {
                  setSearchedUser([]);
                  doSearchUser(text);
                } else if (text.length < 4) {
                  setSearchedUser([]);
                }
              }
            }}
            searchedUser={searchedUser}
            onUserSelect={(row, index) => {
              setSearchedUser([]);
              setTimeout(() => {
                updateVolunteer('userData', row, index);
              }, 200);
            }}
            addNewVolunteer={validateAndAddNewVolunteer}
          />
        );

      case 4:
        return (
          <VentureMedia
            loader={loader}
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviousTab={() => goPreviousTab()}
            mediaData={mediaData}
            removeMedia={(index) => removeIndex(index)}
            onMediaPick={(media) => {
              let oldData = mediaData;
              oldData.splice(0, 0, media);
              setMediaData([...oldData]);
            }}
          />
        );
    }
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <HeaderBar
          title={'Post a Venture'}
          navigation={navigation}
          showBack={true}
        />
        <View style={GlobalInclude.AppStyle.fill}>{loadTab(step)}</View>
      </SafeAreaView>

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

export default ListSocialVenture;
