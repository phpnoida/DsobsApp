import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
  Linking,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {IconType, APP_NAME, URL_REGX} from '../../helper/Constants';
import HeaderBar from '../../component/HeaderBar';
import Helper from '../../helper/Helper';
import axios from 'axios';
import GalleryImage from '../../component/GalleryImage';
import CheckBoxIOS from 'react-native-check-box';
import OptionsSheet from 'react-native-raw-bottom-sheet';
import RadioButton from '../../component/RadioButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import CommonButton from '../../component/CommonButton';
import YearSelection from '../../component/YearSelection';
import FilterSheet from 'react-native-raw-bottom-sheet';

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

const AboutPhoto = ({navigation}) => {
  const [about, setAbout] = useState('');
  const [errorMessage, seterrorMessage] = useState({});
  const [showStatus, setShowStatus] = useState(false);
  const [selectedYear, setSelectedYear] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const updateData = () => {};
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
                    onChangeText={(tag) => {}}
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
            <View
              style={[
                grid.rowdir,
                grid.alignItems,
                grid.justifyContentCenter,
                g.mt15,
              ]}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => updateData()}
                style={[grid.col, g.btnL, g.w115, {height: 45}]}>
                <Text style={[g.colorWhite, g.txtCenter]}>Update</Text>
              </TouchableOpacity>
            </View>
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

        <View style={grid.flex1}></View>

        <View style={styles.filterButton}>
          <CommonButton
            showLoader={false}
            title={'Save'}
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
});

export default AboutPhoto;
