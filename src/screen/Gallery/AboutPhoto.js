import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import HeaderBar from '../../component/HeaderBar';
import CommonButton from '../../component/CommonButton';
import YearSelection from '../../component/YearSelectionSheet';
import CategoryFilter from '../../component/CategoryFilterSheet';
import FilterSheet from 'react-native-raw-bottom-sheet';
import {
  getGalleryCategory,
  doUpdateImageInformation,
} from '../../Actions/GalleryActions';

let filterSheet = null;

const {height, width} = Dimensions.get('window');

let imageId = '';
let imageKey = '';
let responseMessage = '';
let selectedCategoryName = '';
const AboutPhoto = ({route, navigation}) => {
  const refRBSheet = useRef();
  const refRBFilter = useRef();
  const [about, setAbout] = useState('');
  const [errorMessage, seterrorMessage] = useState({});
  const [selectedYear, setSelectedYear] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const [filterCategory, setFilterCategory] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    imageId = '';
    imageKey = '';
    responseMessage = '';
    selectedCategoryName = '';

    if (route.params !== undefined && route.params !== null) {
      imageId = route.params.id;
      imageKey = route.params.imageKey;

      if (
        route.params.about !== undefined &&
        route.params.about !== null &&
        route.params.about !== ''
      ) {
        setAbout(route.params.about);
      }

      if (
        route.params.category !== undefined &&
        route.params.category !== null &&
        route.params.category !== ''
      ) {
        setSelectedCategory(route.params.category);
        selectedCategoryName = route.params.category;
      }

      if (
        route.params.year !== undefined &&
        route.params.year !== null &&
        route.params.year !== ''
      ) {
        setSelectedYear(parseInt(route.params.year));
      }
    }
    getFilterCategory();
    return () => {};
  }, []);
  /**
   *
   * API Section
   *
   */
  const getFilterCategory = () => {
    getGalleryCategory(
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let records = data.data;
              let pushArray = [];
              records.map((child) => {
                pushArray.push({
                  label: child,
                  value: child,
                  isSelected: selectedCategoryName === child ? true : false,
                });
              });
              setFilterCategory([...pushArray]);
            }
          }
        }
      },
      (error) => {
        console.log('error', error);
      },
    );
  };

  const selectCategory = (index) => {
    let oldData = filterCategory;

    oldData.map((item) => {
      item.isSelected = false;
    });
    oldData[index].isSelected = true;

    setFilterCategory([...oldData]);
  };

  const updateData = () => {
    seterrorMessage({});
    if (about.trim() === '' || about.trim().length === 0) {
      seterrorMessage({emptyAbout: 'This field is required'});
    } else if (selectedYear === -1) {
      seterrorMessage({emptyPhotoYear: 'This field is required'});
    } else if (selectedCategory === 'Select Category') {
      seterrorMessage({emptyCategory: 'This field is required'});
    } else {
      let requestData = {
        about: about,
        year: selectedYear.toString(),
        category: selectedCategory,
        imageKey: imageKey,
      };

      setShowLoader(true);

      console.log('====================================');
      console.log('requestData', requestData);
      console.log('====================================');

      doUpdateImageInformation(
        imageId,
        requestData,
        (response) => {
          setShowLoader(false);
          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.data !== null
            ) {
              let data = response.data;
              if (data.status) {
                responseMessage = 'Updating information successfully!';
              } else {
                responseMessage = 'Error while updating information!';
              }
              setShowModal(true);

              setTimeout(() => {
                setShowModal(false);

                setTimeout(() => {
                  navigation.goBack();
                }, 100);
              }, 2000);
            }
          }
        },
        (error) => {
          responseMessage = 'Error while updating information!';
          setShowModal(true);
          setShowLoader(false);

          setTimeout(() => {
            setShowModal(false);
          }, 2000);
        },
      );
    }
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <View style={GlobalInclude.AppStyle.fill}>
          <HeaderBar
            navigation={navigation}
            title={'About the Photo'}
            showLabel={false}
            showBack={true}
          />
          <View
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: scale(15),
              paddingBottom: 15,
              flex: 1,
            }}>
            <View style={{flex: 1}}>
              <View style={{marginTop: 15}}>
                <Text style={[g.labeltext1]}>
                  {'About this photo'}
                  <Text style={g.colorRed}>*</Text>
                </Text>
                <View style={[grid.rowdir]}>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={[
                      g.inputWhite,
                      {height: 120, color: 'black', textAlignVertical: 'top'},
                    ]}
                    multiline={true}
                    value={about}
                    placeholder={'Enter words separated by comma'}
                    onChangeText={(tag) => {
                      setAbout(tag);
                    }}
                  />
                </View>
              </View>
              {errorMessage.emptyAbout &&
                errorMessage.emptyAbout.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.emptyAbout}
                  </Text>
                )}

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  if (refRBSheet.current !== null) {
                    refRBSheet.current.open();
                  }
                }}
                style={[grid.rowdir, grid.alignItems, g.inputWhite, g.mt15]}>
                <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
                  {selectedYear !== -1 ? selectedYear : 'Select Year'}
                </Text>
                <View style={styles.triangleShape} />
              </TouchableOpacity>
              {errorMessage.emptyPhotoYear &&
                errorMessage.emptyPhotoYear.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.emptyPhotoYear}
                  </Text>
                )}
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  if (refRBFilter.current !== null) {
                    refRBFilter.current.open();
                  }
                }}
                style={[grid.rowdir, grid.alignItems, g.inputWhite, g.mt15]}>
                <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
                  {selectedCategory}
                </Text>
                <View style={styles.triangleShape} />
              </TouchableOpacity>
              {errorMessage.emptyCategory &&
                errorMessage.emptyCategory.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.emptyCategory}
                  </Text>
                )}
            </View>
            <CommonButton
              showLoader={showLoader}
              title={'Update'}
              onPress={() => {
                updateData();
              }}
            />
          </View>
        </View>
      </SafeAreaView>

      {/* filter sheet */}
      <CategoryFilter
        refRBSheet={refRBFilter}
        title={'Select Category'}
        buttonText={'Okay'}
        dataList={filterCategory}
        onPress={(item, index) => {
          setSelectedCategory(item.label);
          selectCategory(index);
        }}
        onSelect={() => {
          refRBFilter.current.close();
        }}
      />
      {/* filter sheet */}

      {/* year select */}
      <YearSelection
        refRBSheet={refRBSheet}
        title={'Select Year'}
        onSelect={(value) => {
          refRBSheet.current.close();
          setSelectedYear(value.text.toString());
        }}
      />

      {showModal && (
        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setShowModal(!showModal);
          }}
          hardwareAccelerated={true}
          visible={showModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.headerText}>{responseMessage}</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  triangleShape: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#dddddd',
    marginLeft: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: width - 50,
    backgroundColor: 'white',
    borderRadius: scale(6),
    padding: scale(7),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: scale(60),
    alignContent: 'center',
  },
  headerText: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: scale(16),
    textAlign: 'center',
    ...g.FHNR,
    ...g.colorBlue,
  },
});

export default AboutPhoto;
