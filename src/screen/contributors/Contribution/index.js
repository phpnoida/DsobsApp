import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import {IconType} from '../../../helper/Constants';
import ProgressImage from '../../../component/ProgresImage';
import YoutubeView from '../../../component/YoutubeView';
import Radio from '../../../component/Radio';
import Helper from '../../../helper/Helper';
import HeaderBar from '../../../component/HeaderBar';
import {APP_NAME, URL_REGX} from '../../../helper/Constants';
import CommonButton from '../../../component/CommonButton';
import CommonButtonGray from '../../../component/CommonButtonGray';
import SemiCircleProgress from '../../../component/SemiCircleProgress';
import NumberFormat from 'react-number-format';
import {getCurrencyList} from '../../../Actions/ContributionActions';
import FilterCategory from '../../../component/FilterCategory';
import _ from 'lodash';

const {urlRegex} = URL_REGX;

const Contributions = ({route, navigation}) => {
  const sheetRef = useRef();
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryList, setCategoryList] = useState([]);

  const [attributes, setAttributes] = useState([
    {
      key: '1',
      label: 'Show My Name',
      selected: true,
    },
    {
      key: '2',
      label: 'Do this Anoymously',
      selected: false,
    },
  ]);
  const [pageContent] = useState(route?.params?.pageContent ?? null);

  useEffect(() => {
    getCurrencyList(
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              let categoryArray = [];
              const categoryObject = data?.data ?? [];
              if (categoryObject !== null) {
                categoryObject.forEach(element => {
                  categoryArray.push({key: element, text: element});
                });
                setCategoryList(categoryArray);
                setSelectedCategory(categoryArray[0].text);
              }
            }
          }
        }
      },
      error => {},
    );

    return () => {};
  }, []);

  const renderRadioButton = radioObj => {
    return radioObj.map((item, key) => {
      return (
        <View key={key} style={style.radioStyle}>
          <Radio
            item={item}
            title={item.label}
            onRadioSelect={value => {
              let oldData = attributes;
              oldData.forEach(element => {
                element.selected = false;
              });
              const index = _.findIndex(
                oldData,
                child => child.key === value.key,
              );
              oldData[index].selected = true;
              setAttributes([...oldData]);
            }}
            selected={item.selected}
            radioStyle={style.radioCircle}
            selectedStyle={style.selectedRb}
          />
        </View>
      );
    });
  };

  const loadContributionPhoto = useCallback(itemPath => {
    if (
      itemPath === undefined ||
      itemPath === null ||
      itemPath === '' ||
      !Helper.validateRegex(urlRegex, itemPath)
    ) {
      return (
        <ProgressImage
          source={GlobalInclude.Assets.DefaultImage}
          containerStyle={style.imageStyle}
          imageStyle={style.imageStyle}
          mode={'cover'}
        />
      );
    }
    let extension = itemPath.split(/[#?]/)[0].split('.').pop().trim();
    if (
      extension.toLowerCase() === 'png' ||
      extension.toLowerCase() === 'jpg' ||
      extension.toLowerCase() === 'jpeg'
    ) {
      return (
        <ProgressImage
          source={{uri: itemPath}}
          containerStyle={style.imageStyle}
          imageStyle={style.imageStyle}
          mode={'cover'}
        />
      );
    } else {
      return (
        <YoutubeView
          link={itemPath}
          containerStyle={style.videoContainer}
          overlayStyle={style.overlayStyle}
          thumbStyle={style.thumbStyle}
          showPlay
          playIconstyle={style.playIconstyle}
          playIconContainer={{
            height: scale(20),
            width: scale(20),
          }}
          iconSize={scale(20)}
        />
      );
    }
  }, []);

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar
        title={
          pageContent !== null &&
          pageContent?.title &&
          pageContent?.title !== undefined &&
          pageContent?.title !== null
            ? pageContent?.title
            : APP_NAME
        }
        navigation={navigation}
        customIcon={{
          containerStyle: {height: scale(30), width: scale(30)},
          iconColor: GlobalInclude.Color.ColorPrimary,
          iconName: 'keyboard-backspace',
          size: scale(30),
          type: IconType[1],
        }}
        customIconPress={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={GlobalInclude.AppStyle.fill}
          contentContainerStyle={{flexGrow: 1}}>
          <View style={GlobalInclude.AppStyle.fill}>
            {pageContent !== undefined && pageContent !== null && (
              <>
                <View style={GlobalInclude.AppStyle.fill}>
                  <View style={GlobalInclude.AppStyle.fill}>
                    <View
                      style={[
                        g.bggray3,
                        style.backgroundBorder,
                        g.mt15,
                        g.ml10,
                        g.mr10,
                      ]}>
                      {loadContributionPhoto(pageContent.contributionsPhoto)}
                    </View>
                    <View style={[g.mt5, g.p5]}>
                      <View style={[g.boxShadow, g.bgWhite, g.br3]}>
                        <View
                          style={[
                            grid.alignItems,
                            grid.justifyContentCenter,
                            g.mb10,
                            g.mt10,
                          ]}>
                          <SemiCircleProgress
                            percentage={
                              Math.round(pageContent.totalRaisedInPr) > 100
                                ? 100
                                : Math.round(pageContent.totalRaisedInPr)
                            }
                            circleRadius={70}
                            progressWidth={15}
                            progressColor={GlobalInclude.Color.ColorPrimary}>
                            <Text
                              style={[
                                g.fs24,
                                g.FHNB,
                                GlobalInclude.AppStyle.transform,
                                g.colorBlue,
                              ]}>{`${
                              Math.round(pageContent.totalRaisedInPr) > 100
                                ? '100'
                                : Math.round(pageContent.totalRaisedInPr)
                            }%`}</Text>
                          </SemiCircleProgress>
                        </View>
                        <View style={[g.mb5, grid.rowrow]}>
                          <View
                            style={[
                              grid.col,
                              GlobalInclude.AppStyle.center,
                              GlobalInclude.AppStyle.textCenter,
                              grid.alignItems,
                              g.mr5,
                            ]}>
                            <Text
                              style={[
                                g.fs15,
                                g.FHNM,
                                GlobalInclude.AppStyle.transform,
                                g.colorBlue,
                              ]}
                              numberOfLines={1}>
                              Total to Raise
                            </Text>
                            <NumberFormat
                              value={pageContent.amountTORaise}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'₹'}
                              decimalScale={2}
                              fixedDecimalScale
                              renderText={formattedValue => (
                                <Text
                                  style={[
                                    g.fs20,
                                    g.FHNB,
                                    GlobalInclude.AppStyle.upper,
                                    g.colorBlue,
                                  ]}
                                  numberOfLines={1}>
                                  {formattedValue}
                                </Text>
                              )}
                            />
                          </View>
                          <View
                            style={[
                              grid.col,
                              GlobalInclude.AppStyle.center,
                              GlobalInclude.AppStyle.textCenter,
                              grid.alignItems,
                              g.ml5,
                            ]}>
                            <Text
                              style={[
                                g.fs15,
                                g.FHNM,
                                GlobalInclude.AppStyle.transform,
                                g.colorBlue,
                              ]}
                              numberOfLines={1}>
                              Raised so far
                            </Text>
                            <NumberFormat
                              value={pageContent.totalRaised}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'₹'}
                              decimalScale={2}
                              fixedDecimalScale
                              renderText={formattedValue => (
                                <Text
                                  style={[
                                    g.fs20,
                                    g.FHNB,
                                    GlobalInclude.AppStyle.upper,
                                    g.colorBlue,
                                  ]}
                                  numberOfLines={1}>
                                  {formattedValue}
                                </Text>
                              )}
                            />
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* content area */}
                    <View style={[g.pl10, g.pr10, g.mt15]}>
                      <Text
                        style={[
                          g.fs15,
                          g.FHNM,
                          GlobalInclude.AppStyle.transform,
                          g.colorBlue,
                        ]}
                        numberOfLines={1}>
                        I wish to give
                      </Text>

                      <View style={[grid.rowrow, grid.alignItems, g.mt10]}>
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={e => {
                            e.preventDefault();
                            sheetRef?.current?.open();
                          }}
                          style={[
                            g.inputGrayLogin,
                            grid.rowrow,
                            grid.alignItems,
                            grid.justifyContent,
                            g.mr10,
                            {width: scale(120)},
                          ]}>
                          <Text
                            style={[
                              grid.col,
                              {
                                color:
                                  selectedCategory === '' ? '#ddd' : '#000',
                                fontSize: scale(14),
                                fontFamily: 'Lato-Regular',
                              },
                            ]}>
                            {selectedCategory === ''
                              ? 'Currency'
                              : selectedCategory}
                          </Text>
                          <View style={GlobalInclude.AppStyle.triangleShape} />
                        </TouchableOpacity>
                        <TextInput
                          autoCapitalize="none"
                          underlineColorAndroid="transparent"
                          style={[g.inputGrayLogin, g.mb0]}
                          maxLength={9}
                          keyboardType={'decimal-pad'}
                          value={amount}
                          placeholder={'Amount'}
                          onChangeText={value => {
                            setAmount(value.replace(/\D./g, ''));
                          }}
                          placeholderTextColor={'#ddd'}
                        />
                      </View>

                      <Text
                        style={[
                          g.fs15,
                          g.FHNM,
                          GlobalInclude.AppStyle.transform,
                          g.colorBlue,
                        ]}
                        numberOfLines={1}>
                        Attribute
                      </Text>

                      <View style={[g.mt10]}>
                        {renderRadioButton(attributes)}
                      </View>
                    </View>
                  </View>

                  <View
                    style={[
                      grid.rowrow,
                      g.mb10,
                      g.mt10,
                      grid.alignItems,
                      g.pl10,
                      g.pr10,
                    ]}>
                    <View style={grid.col}>
                      <CommonButtonGray
                        showLoader={false}
                        customStyle={{height: scale(48)}}
                        title={'International\nCitizens'}
                        onPress={() => {
                          if (amount.trim().length === 0) {
                            Alert.alert('Required', 'Amount is required');
                          } else {
                            const index = _.findIndex(
                              attributes,
                              child => child.selected,
                            );
                            const selectedAttribute = attributes[index];

                            const request = {
                              showName:
                                selectedAttribute.key === '1' ? true : false,
                              currency: selectedCategory,
                              amount: amount,
                              fromSchool: true,
                              indianCitizen: false,
                              contributerId: global.userId,
                              title: pageContent?.title,
                              _id: pageContent?._id,
                            };

                            navigation.navigate('AddContribution', {
                              type: '1',
                              request: request,
                            });
                          }
                        }}
                      />
                    </View>
                    <View style={[g.ml5, g.mr5]} />
                    <View style={grid.col}>
                      <CommonButton
                        showLoader={false}
                        customStyle={{height: scale(48)}}
                        title={'Indian\nCitizens'}
                        onPress={() => {
                          if (amount.trim().length === 0) {
                            Alert.alert('Required', 'Amount is required');
                          } else {
                            const index = _.findIndex(
                              attributes,
                              child => child.selected,
                            );
                            const selectedAttribute = attributes[index];

                            const request = {
                              showName:
                                selectedAttribute.key === '1' ? true : false,
                              currency: selectedCategory,
                              amount: parseFloat(amount),
                              fromSchool: true,
                              indianCitizen: true,
                              contributerId: global.userId,
                              title: pageContent?.title,
                              _id: pageContent?._id,
                            };

                            navigation.navigate('AddContribution', {
                              type: '2',
                              request: request,
                            });
                          }
                        }}
                      />
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>

        <FilterCategory
          refRBSheet={sheetRef}
          dataList={categoryList}
          title={'Select'}
          selectedFilter={selectedCategory}
          setSelectedFilter={(value, item) => {
            setSelectedCategory(Helper.capitalize(value));
            sheetRef.current.close();
          }}
          onClose={() => {}}
        />
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  videoContainer: {
    aspectRatio: 16 / 9,
    width: '100%',
    borderRadius: scale(10),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
  },
  overlayStyle: {
    backgroundColor: '#00000066',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: scale(10),
  },
  thumbStyle: {
    borderRadius: scale(10),
    aspectRatio: 16 / 9,
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  playIconstyle: {
    position: 'absolute',
    zIndex: 9,
    bottom: 12,
    left: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {borderBottomWidth: 0, margin: 0},
  tabBarUnderlineStyle: {
    borderBottomColor: 'transparent',
    backgroundColor: 'white',
  },
  imageStyle: {
    aspectRatio: 16 / 9,
    borderRadius: scale(10),
  },
  grayColorText: {color: '#bababa'},
  backgroundBorder: {
    borderRadius: scale(10),
    overflow: 'hidden',
  },
  tabTextStyle: {
    fontSize: scale(15),
    fontFamily: 'Lato-Regular',
    margin: -5,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(145),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: scale(2),
  },
  radioCircle: {
    height: scale(15),
    width: scale(15),
    borderRadius: 100,
    borderWidth: scale(1.5),
    borderColor: GlobalInclude.Color.ColorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(3),
  },
  selectedRb: {
    height: scale(6),
    width: scale(6),
    borderRadius: scale(30),
    backgroundColor: GlobalInclude.Color.ColorPrimary,
  },
  radioStyle: {
    marginEnd: scale(8),
    marginStart: scale(2),
    marginBottom: scale(10),
  },
});

export default Contributions;
