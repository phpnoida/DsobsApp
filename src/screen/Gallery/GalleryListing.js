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
import TopHeaderView from '../../component/TopHeaderView';
import Helper from '../../helper/Helper';
import axios from 'axios';
import GalleryImage from '../../component/GalleryImage';
import CheckBoxIOS from 'react-native-check-box';
import FilterSheet from 'react-native-raw-bottom-sheet';
import CommonButton from '../../component/CommonButton';

const {height, width} = Dimensions.get('window');
const tablet = width >= 768;
let filterSheet = null;
let userData = null;
const GalleryListing = ({navigation}) => {
  const [pageContent, setPageContent] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    userData = global.userDetails;
    let dummyArray = [];
    axios.get('https://picsum.photos/v2/list?page=1&limit=200').then((res) => {
      let data = res.data;
      var result = data.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 25);

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []; // start a new chunk
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
      }, []);
      for (let i = 0; i < result.length; i++) {
        const element = result[i];

        const dummyData = {
          title: `Doon School Memories - ${i}`,
          images: element,
          isExpanded: false,
        };
        dummyArray.push(dummyData);
      }

      setPageContent(dummyArray);
    });
    return () => {};
  }, []);

  const drawCheckbox = (title, checked, onClick) => {
    return (
      <View style={[grid.rowdir, grid.alignItems]}>
        <CheckBoxIOS
          checkBoxColor={'#2b3252'}
          style={[g.mr2, g.br3, {maxWidth: 23, height: 20}]}
          onClick={() => {
            onClick();
          }}
          isChecked={checked}
          checkedImage={
            <Image
              source={GlobalInclude.Assets.CheckboxChecked}
              style={{maxWidth: 20, height: 20}}
            />
          }
          unCheckedImage={
            <Image
              source={GlobalInclude.Assets.CheckboxDefault}
              style={{maxWidth: 20, height: 20}}
            />
          }
        />
        <Text style={[g.colordarkGray, g.FHNR, grid.col, g.fs12]}>{title}</Text>
      </View>
    );
  };

  const expandSelectedPanel = (index) => {
    let oldData = pageContent;

    oldData[index].isExpanded = !oldData[index].isExpanded;

    setPageContent([...oldData]);
  };

  const generateGalleryView = ({item, index}) => {
    return (
      <GalleryImage
        key={index}
        title={item.title}
        images={item.images}
        isExpanded={item.isExpanded}
        expandSelectedPanel={() => {
          expandSelectedPanel(index);
        }}
        onImagePress={(imageData, index) => {
          let payload = {
            index: index,
            data: item.images,
            title: item.title,
          };
          navigation.navigate('GalleryDetail', payload);
        }}
      />
    );
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <View style={GlobalInclude.AppStyle.fill}>
          <View
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: scale(15),
              paddingBottom: 0,
            }}>
            <TopHeaderView
              index={4}
              navigation={navigation}
              label={'Send Photos'}
              showLabel={true}
              onLabelPress={() => {
                if (userData !== undefined && userData !== null) {
                  Linking.openURL(
                    `mailto:info@alumbus.com?subject=Photos from ${APP_NAME} ${userData.firstName} ${userData.lastName}, ${userData.schoolNumber}, ${userData.house}, ${userData.batch} &body=Please send us a note about the photographs.Upload photos upto 20 MB here for larger photos please use Google Drive or a WeTransfer link to send images.`,
                  );
                } else {
                  Linking.openURL(
                    `mailto:info@alumbus.com?subject=Photos from ${APP_NAME} FullName: School No: House: Batch: &body=Please send us a note about the photographs.Upload photos upto 20 MB here for larger photos please use Google Drive or a WeTransfer link to send images.`,
                  );
                }
              }}
            />
            <View style={[grid.rowdir, grid.alignItems, g.mt10]}>
              <Text style={[g.fs16, g.FHNR, g.colordarkGray, grid.col]}>
                {'Search By'}
              </Text>
            </View>
            {/* search container */}

            <View
              style={[grid.rowdir, grid.alignItems, g.mt10, tablet && g.pt10]}>
              <View style={{width: scale(120)}}>
                {drawCheckbox('Name/Batch/House/Number', false, () => {})}
              </View>
              <View
                style={{
                  width: scale(90),
                  marginStart: scale(3),
                  marginEnd: scale(3),
                }}>
                {drawCheckbox('Album Name', false, () => {})}
              </View>
              <View style={{width: scale(45)}}>
                {drawCheckbox('Year', false, () => {})}
              </View>
              <View style={[grid.col, {marginStart: scale(3)}]}>
                {drawCheckbox('Tag', false, () => {})}
              </View>
            </View>
            <View style={[grid.rowdir, g.mt10, g.mb5]}>
              <View style={[g.br3, grid.col, g.mr5]}>
                <View style={[g.inputNew, grid.rowdir]}>
                  <GlobalInclude.BaseIcon
                    containerStyle={style.searchIcon}
                    iconColor={'#dddddd'}
                    iconName={'search'}
                    iconSize={scale(20)}
                    iconType={IconType[4]}
                  />
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={[
                      g.inputNew,
                      g.fs14,
                      grid.col,
                      grid.justifyContentCenter,
                    ]}
                    keyboardType={'default'}
                    placeholder={'Search by(Title)'}
                    onChangeText={(text) => {
                      setFilterQuery(text);
                    }}
                  />
                </View>
              </View>
              {filterQuery.length <= 3 ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (filterSheet !== null) {
                      filterSheet.open();
                    }
                  }}
                  style={[
                    g.fliterBtnNew,
                    grid.alignItems,
                    grid.justifyContentCenter,
                  ]}>
                  <Image
                    source={GlobalInclude.Assets.Filter}
                    resizeMode="contain"
                    style={{width: 16}}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {}}
                  style={[
                    g.fliterBtnNew,
                    grid.alignItems,
                    grid.justifyContentCenter,
                    g.bgBlue,
                  ]}>
                  <Text style={[g.colorWhite, g.FHNM, g.fs16]}>Go</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={GlobalInclude.AppStyle.fill}>
            {pageContent === null || pageContent.length === 0 ? (
              <View style={GlobalInclude.AppStyle.center}>
                <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
                  No Record Found
                </Text>
              </View>
            ) : (
              <FlatList
                extraData={pageContent}
                data={pageContent}
                showsVerticalScrollIndicator={false}
                renderItem={generateGalleryView}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
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
            style.filterText,
            g.mb15,
          ]}>
          Filter Gallery By
        </Text>

        <View style={grid.flex1}></View>

        <View style={style.filterButton}>
          <CommonButton
            showLoader={false}
            title={'Go'}
            onPress={() => {
              filterSheet.close();
            }}
          />
        </View>
      </FilterSheet>
      {/* filter sheet */}
    </View>
  );
};

const style = StyleSheet.create({
  searchIcon: {
    height: scale(20),
    width: scale(20),
    alignSelf: 'center',
    marginEnd: scale(6),
    marginStart: scale(6),
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
});

export default GalleryListing;
