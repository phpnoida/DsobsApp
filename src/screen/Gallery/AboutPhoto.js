import React, {useState, useEffect} from 'react';
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
import Helper from '../../helper/Helper';
import RadioButton from '../../component/RadioButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import CommonButton from '../../component/CommonButton';
import YearSelection from '../../component/YearSelection';
import FilterSheet from 'react-native-raw-bottom-sheet';
import {
  getGalleryCategory,
  doUpdateImageInformation,
} from '../../Actions/GalleryActions';

let filterSheet = null;
let batchSheet = null;

const {height, width} = Dimensions.get('window');

const generateYearList = (onGoing, defaultChecked) => {
  let year = '';
  let yearList = [];
  let cYear = new Date().getFullYear();
  let sYear = 1920;

  for (let i = 0; i <= cYear - sYear; i++) {
    year = sYear + i;
    yearList.push({
      key: year,
      text: year,
      selected: year === defaultChecked ? true : false,
    });
  }
  yearList.reverse();

  if (onGoing) {
    yearList.splice(0, 0, {
      key: 'Ongoing',
      text: 'Ongoing',
      selected: defaultChecked === 'Ongoing' ? true : false,
    });
  }
  return yearList;
};

let imageId = '';
let imageKey = '';
let responseMessage = '';
let selectedCategoryName = '';
const AboutPhoto = ({route, navigation}) => {
  const [about, setAbout] = useState('');
  const [errorMessage, seterrorMessage] = useState({});
  const [showStatus, setShowStatus] = useState(false);
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

      console.log('====================================');
      console.log(requestData);
      console.log('====================================');

      setShowLoader(true);

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
        {showStatus && (
          <YearSelection
            title={'Select Year'}
            yearList={generateYearList(false, selectedYear)}
            onItemSelect={(value) => {
              setSelectedYear(value.key);
              setShowStatus(false);
            }}
            onCloseAction={() => {
              setShowStatus(false);
            }}
          />
        )}
        <View style={GlobalInclude.AppStyle.fill}>
          <HeaderBar
            navigation={navigation}
            title={'About the Photo'}
            showLabel={false}
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
                  if (batchSheet !== null) {
                    batchSheet.open();
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
                  if (filterSheet !== null) {
                    filterSheet.open();
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
      <FilterSheet
        ref={(ref) => {
          filterSheet = ref;
        }}
        onClose={() => {}}
        height={height / 2 + 70}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingStart: scale(15),
            paddingEnd: scale(15),
            paddingBottom: scale(20),
            paddingTop: scale(10),
          },
        }}>
        <Text
          style={[
            g.mt15,
            g.colorBlue,
            g.fs18,
            g.FHNB,
            styles.filterText,
            g.mb15,
          ]}>
          Select Category
        </Text>

        <View style={grid.flex1}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {filterCategory.map((item, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={[
                      g.mb15,
                      grid.rowdir,
                      grid.alignItems,
                      grid.justifyContent,
                    ]}
                    onPress={() => {
                      setSelectedCategory(item.label);
                      selectCategory(index);
                    }}>
                    <Text
                      style={[
                        g.fs15,
                        g.FHNB,
                        g.colorBlack,
                        item.isSelected ? g.colorBlue : g.colorGray5,
                      ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.filterButton}>
          <CommonButton
            showLoader={false}
            title={'Select'}
            onPress={() => {
              filterSheet.close();
            }}
          />
        </View>
      </FilterSheet>
      {/* filter sheet */}

      {/* select batch sheet */}
      <RBSheet
        ref={(ref) => {
          batchSheet = ref;
        }}
        height={height / 2}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20,
          },
        }}>
        <Text
          style={[g.fs18, g.FHNB, g.txtCenter, g.colorBlack, g.mt5, g.mb15]}>
          Select Batch
        </Text>
        <RadioButton
          PROP={Helper.getYearList()}
          onRadioSelect={(value) => {
            setSelectedYear(value.text.toString());
            batchSheet.close();
          }}
        />
      </RBSheet>

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
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
  filterText: {
    paddingTop: 12,
    paddingBottom: 12,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
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
