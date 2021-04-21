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
  FlatList,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import {scale} from '../../theme/Scalling';
import grid from '../../theme/grid';
import {IconType, APP_NAME} from '../../helper/Constants';
import HeaderBar from '../../component/HeaderBar';
import Helper from '../../helper/Helper';
import YellowPageSearch from '../../component/YellowPageSearch';
import ProfessionalSheetFilter from '../../component/ProfessionalSheetFilter';
import ProgresImage from '../../component/ProgresImage';
import Slideshow from '../../component/Slideshow.js';
import FlatListSlider from '../../component/FlatListSlider';
import Preview from '../../component/Preview';

import BottomSheetAbout from 'react-native-raw-bottom-sheet';
import {getProfessionList} from '../../Actions/UserActions';

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

const myInput = React.createRef();
const scrollRef = React.createRef();

let sortBy = [
  {
    value: '1',
    label: 'Newest',
  },
  {
    value: '5',
    label: 'Alphabetical A-Z',
  },
  {
    value: '7',
    label: 'Most Bookmarked',
  },
];

const YellowPages = ({navigation}) => {
  const refRBSheet = useRef();
  const refProfessionalSheet = useRef();

  const [checkedType, setCheckedType] = useState(1);
  const [filterQuery, setFilterQuery] = useState('');
  const [professionList, setProfessionList] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortedBy, setSortedBy] = useState('');
  const [pageContent, setPageContent] = useState([
    {item: 1},
    {item: 1},
    {item: 1},
  ]);

  useEffect(() => {
    professionSheet = null;
    professionListMain = [];
    searchVal = '';

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

  /*****
   *
   * API Section
   *
   */

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

  const renderItem = ({item, index}) => {
    return (
      <View style={{marginBottom: scale(15), padding: scale(5)}}>
        <View style={[g.bgWhite, g.boxShadow, {borderRadius: scale(10)}]}>
          <View
            style={[
              g.bggray3,
              {
                borderRadius: scale(10),
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                overflow: 'hidden',
              },
            ]}>
            {index === 0 ? (
              <FlatListSlider
                data={[
                  {
                    image:
                      'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
                    desc:
                      'Silent Waters in the mountains in midst of Himilayas',
                  },
                  {
                    image:
                      'https://images.unsplash.com/photo-1455620611406-966ca6889d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1130&q=80',
                    desc:
                      'Red fort in India New Delhi is a magnificient masterpeiece of humans',
                  },
                ]}
                component={<Preview />}
                indicatorActiveWidth={40}
                contentContainerStyle={{
                  borderRadius: scale(10),
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                autoscroll={false}
              />
            ) : (
              <ProgresImage
                source={GlobalInclude.Assets.DefaultImage}
                containerStyle={{aspectRatio: 16 / 9, borderRadius: scale(10)}}
                imageStyle={{
                  aspectRatio: 16 / 9,
                  borderRadius: scale(10),
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                mode={'cover'}
              />
            )}
          </View>
          <TouchableOpacity
            style={[g.p15]}
            onPress={() => {
              navigation.navigate('BusinessDetails');
            }}>
            <Text style={[g.FHNB, g.fs16, g.colorBlue]}>
              Incred Applications Pvt. Ltd.
            </Text>
            <Text
              style={[g.fs14, g.mt5, g.FHNR, g.colorBlack]}
              numberOfLines={2}>
              IT/Information Technology
            </Text>
            <Text
              style={[g.fs12, g.mt5, g.FHNR, g.colorBlack]}
              numberOfLines={2}>
              Montréal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <View style={GlobalInclude.AppStyle.fill}>
          <HeaderBar
            title={'YellowPages'}
            navigation={navigation}
            showBack={true}
            customIcon={{
              containerStyle: {height: scale(24), width: scale(24)},
              iconColor: '#2b3252',
              iconName: 'dots-horizontal',
              size: scale(24),
              type: IconType[1],
            }}
            customIconPress={() => {
              if (refRBSheet.current !== null) {
                refRBSheet.current.open();
              }
            }}
          />
          <ScrollView
            ref={scrollRef}
            style={{
              minHeight:
                Platform.OS === 'ios'
                  ? isX
                    ? height - 0
                    : 0
                  : isL
                  ? height - 10
                  : height - 5,
            }}
            showsVerticalScrollIndicator={false}>
            <View>
              <View
                style={{
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingTop: scale(15),
                  paddingBottom: 0,
                }}>
                {/* search container */}
                <YellowPageSearch
                  scrollRef={scrollRef}
                  mainTitle={'Search By'}
                  chkType={checkedType}
                  chkOneTitle={'Category'}
                  chkTwoTitle={'Company'}
                  ChkThreeTitle={'Tags'}
                  ChkFourTitle={'Location'}
                  onChecked={(type) => {
                    searchType = type;
                    setCheckedType(type);
                  }}
                  changeText={(text) => {
                    searchVal = text;
                    setFilterQuery(text);
                  }}
                  filterQuery={filterQuery}
                  onGoPress={() => {
                    navigation.navigate('YellowPageListing');
                  }}
                  onFilterPress={() => {
                    if (
                      refProfessionalSheet.current !== undefined &&
                      refProfessionalSheet.current !== null
                    ) {
                      refProfessionalSheet.current.open();
                    }
                  }}
                />
              </View>

              <View style={[grid.row, g.ml15, g.mr15, g.mt10]}>
                {sortBy.map((item, i) => {
                  return (
                    <View
                      style={[
                        g.btnsort,
                        sortedBy === item.value && g.darkBlue,
                        i === 0 && g.ml0,
                      ]}
                      key={i}>
                      <Text
                        style={[
                          g.colorGray,
                          g.fs12,
                          sortedBy === item.value && g.colorWhite,
                        ]}
                        onPress={() => {
                          setSortedBy(item.value);
                        }}>
                        {item.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <View
                style={[
                  GlobalInclude.AppStyle.fill,
                  GlobalInclude.AppStyle.contentSpace,
                ]}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={pageContent}
                  onEndReachedThreshold={0.1}
                  renderItem={renderItem}
                  keyExtractor={(v, i) => i.toString()}
                  contentContainerStyle={{
                    paddingBottom: scale(70),
                    paddingTop: scale(10),
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      <BottomSheetAbout
        ref={refRBSheet}
        height={height / 2 - 80}
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
        <TouchableOpacity
          onPress={() => {
            refRBSheet.current.close();
            navigation.navigate('ListMyBusiness');
          }}>
          <Text
            style={[g.fs16, g.FHNM, g.txtLeft, g.colorBlack, g.mt5, g.mb15]}>
            List My Business
          </Text>
        </TouchableOpacity>

        <Text style={[g.fs16, g.FHNR, g.txtLeft, g.colorBlack, g.mb15]}>
          Edit Incred Applications Pvt Ltd
        </Text>
        <Text style={[g.fs16, g.FHNR, g.txtLeft, g.colorBlack, g.mb15]}>
          Edit Embrace Cinema Pvt Ltd
        </Text>
        <TouchableOpacity
          onPress={() => {
            refRBSheet.current.close();
            navigation.navigate('AboutYellowPage');
          }}>
          <Text style={[g.fs16, g.FHNM, g.txtLeft, g.colorBlack, g.mb15]}>
            About YellowPages
          </Text>
        </TouchableOpacity>
      </BottomSheetAbout>

      <ProfessionalSheetFilter
        refRBSheet={refProfessionalSheet}
        dataList={professionList}
        searchProfession={(query) => {
          searchProfession(query);
        }}
        selectedProfession={selectedProfession}
        setSelectedProfession={(value) => {
          setSelectedProfession(value);
          refProfessionalSheet.current.close();
        }}
        onClose={() => {}}
      />
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
  filterText: {
    paddingTop: 12,
    paddingBottom: 12,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
  footerView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabsbut: {
    backgroundColor: '#2b3252',
    color: '#ffffff',
    width: scale(100),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    fontSize: scale(12),
    textAlign: 'center',
    borderRadius: scale(4),
    overflow: 'hidden',
  },
  bbtbgnactive: {
    backgroundColor: '#f8f8f8',
    color: '#2b3252',
  },
  tabBarText: {
    color: '#333333',
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  tabSpace: {
    paddingRight: width - 105,
  },
  tabbarheight: {
    minHeight: height - 90,
  },
});

export default YellowPages;
