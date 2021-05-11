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

let categoryListMain = [];

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
  const [selectedYear, setSelectedYear] = useState('');
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
  const [mediaData, setMediaData] = useState([]);

  useEffect(() => {
    categoryListMain = [];
    return () => {};
  }, []);

  const handleInput = (key, value) => {};

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

  const loadTab = (page) => {
    switch (page) {
      case 1:
        return (
          <BasicDetails
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
    </View>
  );
};

export default ListMyWork;
