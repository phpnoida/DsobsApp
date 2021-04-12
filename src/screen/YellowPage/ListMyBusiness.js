import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Keyboard,
  SafeAreaView,
  Platform,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import {scale} from '../../theme/Scalling';
import grid from '../../theme/grid';
import {IconType, APP_NAME} from '../../helper/Constants';
import HeaderBar from '../../component/HeaderBar';
import Helper from '../../helper/Helper';
import TabOne from './TabOne';
import TabTwo from './TabTwo';
import TabThree from './TabThree';
import TabFour from './TabFour';
import TabFive from './TabFive';
import TabSix from './TabSix';
import {getDirectory} from '../../Actions/DirectoryActions';

const {height, width} = Dimensions.get('window');
const tablet = width >= 768;
const isX =
  Platform.OS === 'ios' && (height > 800 || height > 800) ? true : false;
const isL =
  Platform.OS === 'android' && (height > 1920 || height > 1920) ? true : false;

let searchType = '';
let searchVal = '';
let professionSheet = null;
let professionListMain = [];
let positionY = Platform.OS === 'ios' ? 130 : 180;

let inEditMode = false;
const ListMyBusiness = ({route, navigation}) => {
  if (route.params !== undefined && route.params !== null) {
    inEditMode = route.params.data.inEditMode;
  }

  const [step, setStep] = useState(1);
  const [productTags, setProductTags] = useState([]);
  const [tag, setTag] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [searchedUser, setSearchedUser] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState([]);
  useEffect(() => {
    return () => {};
  }, []);

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

  const loadTab = (page) => {
    switch (page) {
      case 1:
        return <TabOne onSaveTab={() => validateAndMoveNextTab()} />;
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
