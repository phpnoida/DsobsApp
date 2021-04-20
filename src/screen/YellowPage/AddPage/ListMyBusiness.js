import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Keyboard,
  SafeAreaView,
  Platform,
} from 'react-native';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import HeaderBar from '../../../component/HeaderBar';
import TabOne from '../TabOne';
import TabTwo from '../TabTwo';
import TabThree from '../TabThree';
import TabFour from '../TabFour';
import TabFive from '../TabFive';
import {getDirectory} from '../../../Actions/DirectoryActions';
import {doSearchCity} from '../../../Actions/CommonActions';
import {getProfessionList} from '../../../Actions/UserActions';
let searchVal = '';
let cityTitle = '';
let professionListMain = [];
let inEditMode = false;

const ListMyBusiness = ({route, navigation}) => {
  if (route.params !== undefined && route.params !== null) {
    inEditMode = route.params.data.inEditMode;
  }

  const [step, setStep] = useState(1);

  /**Tab one */
  const [businessName, setBusinessName] = useState('');
  const [professionList, setProfessionList] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [coverImages, setCoverImages] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  const [productTags, setProductTags] = useState([]);
  const [tag, setTag] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [searchedUser, setSearchedUser] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState([]);

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
  /*****
   *
   * API Section
   *
   */

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

  const handleInput = (key, value) => {
    if (key === 'businessName') {
      setBusinessName(value);
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
              let oldData = coverImages;
              oldData.push(image);
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
            onSaveTab={() => validateAndMoveNextTab()}
          />
        );
      case 2:
        return (
          <TabTwo
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviousTab={() => goPreviousTab()}
            tag={tag}
            setTag={(value) => {
              setTag(value);
            }}
            productTags={productTags}
            addTag={() => {
              let oldData = productTags;
              oldData.push(tag);
              setProductTags([...oldData]);
            }}
            onRemoveTag={(index) => {}}
          />
        );
      case 3:
        return (
          <TabThree
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviousTab={() => goPreviousTab()}
            changeText={(text) => {
              searchVal = text;
              setFilterQuery(text);
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
            }}
            selectedAlumini={selectedUser}
          />
        );
      case 4:
        return (
          <TabFour
            onSaveTab={() => validateAndMoveNextTab()}
            onPreviousTab={() => goPreviousTab()}
          />
        );
      case 5:
        return (
          <TabFive
            onSaveTab={() => navigation.goBack()}
            onPreviousTab={() => goPreviousTab()}
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
    </View>
  );
};

const style = StyleSheet.create({});

export default ListMyBusiness;
