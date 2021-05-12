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
import Toast from '../../../component/Toast';
import Helper from '../../../helper/Helper';
import BasicDetails from './BasicDetails';
import VentureDetails from './VentureDetails';
import VentureMedia from './VentureMedia';
import VolunteerTeam from './VolunteerTeam';
import {getDirectory} from '../../../Actions/DirectoryActions';
import {APP_NAME} from '../../../helper/Constants';

let categoryListMain = [];
let searchVal = '';
let requestedIndex = 0;
let responseMessage = '';
let isSuccess = false;

const ListMyWork = ({route, navigation}) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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

  //TabTwo
  const [ventureVideoLink, setVentureVideoLink] = useState('');
  const [aboutVenture, setAboutVenture] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tag, setTag] = useState('');

  //TabThree
  const [searchedUser, setSearchedUser] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  //TabFour
  const [mediaData, setMediaData] = useState([]);

  useEffect(() => {
    categoryListMain = [];
    searchVal = '';

    let volunterDetail = {
      fromSchool: false,
      volunteerName: '',
      userData: null,
      imageData: null,
      volunteerRole: '',
      isLoading: false,
      errorMessage: {},
    };

    let defaultVolunteers = [];

    defaultVolunteers.push(volunterDetail);
    defaultVolunteers.push(volunterDetail);
    setVolunteers(defaultVolunteers);
    return () => {};
  }, []);

  /*****
   *
   * API Section
   *
   */
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
  /*****
   *
   * API Section
   *
   */

  const handleInput = (key, value) => {
    switch (key) {
      case 'value': {
      }
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

    //projectName    selectedYear;
    if (step === 1) {
      // if (selectedCategory === '') {
      //   setErrorMessage({selectedCategory: 'This field is required'});
      //   return;
      // } else if (projectName === '') {
      //   setErrorMessage({projectName: 'This field is required'});
      //   return;
      // } else if (selectedYear === -1) {
      //   setErrorMessage({selectedYear: 'This field is required'});
      //   return;
      // }
    } else if (step === 2) {
      //Please Upload at least one, Photo or Video
    } else if (step === 3) {
    } else if (step === 4) {
      isSuccess = true;
      responseMessage = `Congratulations your social work has been successfully sent to ${APP_NAME} for approval.`;
      setShowErrorMessage(true);
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
    item[key] = value;
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
      } else if (
        element.volunteerRole === '' ||
        element.volunteerRole.trim().length === 0
      ) {
        element.errorMessage.volunteerRole = 'This field is required';
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
        fromSchool: false,
        volunteerName: '',
        userData: null,
        imageData: null,
        volunteerRole: '',
        isLoading: false,
        errorMessage: {},
      };
      oldData.splice(0, 0, volunterDetail);
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
            searchCategory={searchCategory}
            onCategorySelect={(category) => {
              setSelectedCategory(category);
              setCategoryList([...categoryListMain]);
            }}
            setYear={(value) => {
              setSelectedYear(value);
            }}
            onSaveTab={validateAndMoveNextTab}
          />
        );

      case 2:
        return (
          <VentureDetails
            handleInput={handleInput}
            onPreviousTab={goPreviousTab}
            onSaveTab={validateAndMoveNextTab}
            ventureVideoLink={ventureVideoLink}
            aboutVenture={aboutVenture}
            selectedTags={selectedTags}
            tag={tag}
            setTag={(value) => {
              setTag(value);
            }}
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
                let oldData = selectedTags;
                if (!oldData.includes(tag)) {
                  oldData.push(tag);
                  setSelectedTags([...oldData]);
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
              updateVolunteer('userData', row, index);
              updateVolunteer('volunteerName', Helper.concatName(row), index);
              setSearchedUser([]);
            }}
            addNewVolunteer={validateAndAddNewVolunteer}
          />
        );

      case 4:
        return (
          <VentureMedia
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
          title={'Post a Social'}
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

export default ListMyWork;
