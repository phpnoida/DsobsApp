import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import {IconType} from '../../helper/Constants';
import ProgresImage from '../../component/ProgresImage';
import HeaderBar from '../../component/HeaderBar';
import AboutCompany from './AboutCompany';
import ProductServices from './ProductServices';
import CompanyPhotos from './CompanyPhotos';
import Location from './Location';
import AluminiDetails from './AluminiDetails';
import Tags from './Tags';
import RbSheet from 'react-native-raw-bottom-sheet';
import CommonButton from '../../component/CommonButton';
import FlatListSlider from '../../component/FlatListSlider';
import Preview from '../../component/Preview';
import Helpers from '../../helper/Helper';

let latitude = 0.0,
  longitude = 0.0;

const BusinessDetails = ({route, navigation}) => {
  const refRBSheet = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [pageContent, setPageContent] = useState(null);

  useEffect(() => {
    if (route.params && route.params !== undefined && route.params !== null) {
      let data = route.params.data;
      let location = data.googleMapsLocation;

      if (location && location !== null && location !== undefined) {
        if (
          location.link &&
          location.link !== undefined &&
          location.link !== null &&
          location.link !== ''
        ) {
          var regex = /@(-?\d+\.\d+),(-?\d+\.\d+),(\d+\.?\d?)+z/g,
            params = {},
            match;

          while ((match = regex.exec(location.link))) {
            params[match[1]] = match[2];
          }

          if (params !== undefined && params !== null) {
            for (var key in params) {
              if (params.hasOwnProperty(key)) {
                latitude = parseFloat(key);
                longitude = parseFloat(params[key]);
              }
            }
          }
        }
      }
      setPageContent(data);
      setTimeout(() => {
        setIsLoading(false);
        // console.log('====================================');
        // console.log(JSON.stringify(route.params.data));
        // console.log('====================================');
      }, 100);
    }
    return () => {};
  }, [route]);

  const loadCities = (citiesOfOperation) => {
    let cities = [];
    citiesOfOperation.map((child) => {
      let result = child.split(',');
      if (
        result &&
        result !== null &&
        result !== undefined &&
        result.length > 0
      ) {
        cities.push(result[0]);
      }
    });

    if (cities.length > 0) {
      return cities.toString().replace(/,/g, ', ');
    }
    return 'N/A';
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.parentStyle}>
          {isLoading ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator size={'small'} color={'#2b3252'} />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              {pageContent !== null ? (
                <View style={GlobalInclude.AppStyle.fill}>
                  <HeaderBar
                    title={
                      pageContent.businessName &&
                      pageContent.businessName !== undefined &&
                      pageContent.businessName !== null
                        ? pageContent.businessName
                        : 'N/A'
                    }
                    navigation={navigation}
                    customIcon={{
                      containerStyle: {height: scale(24), width: scale(24)},
                      iconColor: '#2b3252',
                      iconName: 'keyboard-backspace',
                      size: scale(24),
                      type: IconType[1],
                    }}
                    customIconPress={() => {
                      navigation.goBack();
                    }}
                  />
                  <View style={[g.bggray3, g.mt15, g.ml10, g.mr10]}>
                    {pageContent.coverImages &&
                    pageContent.coverImages !== null &&
                    pageContent.coverImages !== undefined &&
                    pageContent.coverImages.length > 0 ? (
                      <View style={{borderRadius: scale(10)}}>
                        {pageContent.coverImages.length > 1 ? (
                          <FlatListSlider
                            data={pageContent.coverImages}
                            component={
                              <Preview
                                ViewStyle={{borderRadius: 0}}
                                containerStyle={{borderRadius: 0}}
                                imageStyle={{borderRadius: 0}}
                              />
                            }
                            contentContainerStyle={{}}
                            autoscroll={false}
                          />
                        ) : (
                          <ProgresImage
                            source={{uri: pageContent.coverImages[0]}}
                            containerStyle={{
                              aspectRatio: 16 / 9,
                              borderRadius: scale(10),
                            }}
                            imageStyle={{
                              aspectRatio: 16 / 9,
                              borderRadius: scale(10),
                            }}
                            mode={'cover'}
                          />
                        )}
                      </View>
                    ) : (
                      <ProgresImage
                        source={GlobalInclude.Assets.DefaultImage}
                        containerStyle={{
                          aspectRatio: 16 / 9,
                          borderRadius: scale(10),
                        }}
                        imageStyle={{
                          aspectRatio: 16 / 9,
                          borderRadius: scale(10),
                        }}
                        mode={'cover'}
                      />
                    )}
                  </View>
                  <View style={[g.p15, g.pt10]}>
                    <Text
                      style={[g.fs14, g.mt5, g.FHNR, g.colorBlack]}
                      numberOfLines={2}>
                      {pageContent.categoryOfBusiness &&
                      pageContent.categoryOfBusiness !== undefined &&
                      pageContent.categoryOfBusiness !== null
                        ? pageContent.categoryOfBusiness
                        : 'N/A'}
                    </Text>
                    {pageContent.citiesOfOperation &&
                    pageContent.citiesOfOperation !== undefined &&
                    pageContent.citiesOfOperation !== null &&
                    pageContent.citiesOfOperation.length > 0 ? (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        <Text
                          style={[
                            g.fs12,
                            g.mt5,
                            g.FHNR,
                            g.colorBlack,
                            GlobalInclude.AppStyle.transform,
                          ]}>
                          {loadCities(pageContent.citiesOfOperation)}
                        </Text>
                      </ScrollView>
                    ) : (
                      <Text
                        style={[g.fs12, g.mt5, g.FHNR, g.colorBlack]}
                        numberOfLines={2}>
                        N/A
                      </Text>
                    )}
                  </View>
                  <ScrollableTabView
                    underlineColor={'#ffffff'}
                    initialPage={0}
                    tabBarActiveTextColor={'#2b3252'}
                    tabBarInactiveTextColor={'#bababa'}
                    tabBarTextStyle={{
                      fontSize: scale(15),
                      fontFamily: 'Lato-Regular',
                      margin: -5,
                    }}
                    tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
                    renderTabBar={() => (
                      <ScrollableTabBar style={styles.tabBarStyle} />
                    )}>
                    <AboutCompany tabLabel={'About'} content={pageContent} />
                    <ProductServices
                      tabLabel={'ProductServices'}
                      content={pageContent}
                    />
                    <CompanyPhotos tabLabel={'Media'} content={pageContent} />
                    <Location
                      tabLabel={'Location'}
                      latitude={latitude}
                      longitude={longitude}
                      content={pageContent}
                    />
                    <AluminiDetails
                      tabLabel={'AluminiDetails'}
                      content={pageContent}
                      navigation={navigation}
                    />
                    <Tags
                      tabLabel={'Tags'}
                      content={pageContent}
                      productTags={['help', 'structure', 'helo']}
                    />
                  </ScrollableTabView>
                </View>
              ) : (
                <View style={GlobalInclude.AppStyle.center}>
                  <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
                    No Record Found
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: scale(125),
            paddingTop: scale(10),
            paddingBottom: scale(10),
            alignContent: 'center',
            alignSelf: 'center',
            position: 'absolute',
            bottom: scale(2),
          }}>
          {pageContent !== null &&
            pageContent.companyContactPerson &&
            pageContent.companyContactPerson !== undefined &&
            pageContent.companyContactPerson !== null && (
              <CommonButton
                showLoader={false}
                title={'Contact Us'}
                onPress={() => {
                  if (refRBSheet && refRBSheet.current != null) {
                    refRBSheet.current.open();
                  }
                }}
              />
            )}
        </View>
      </SafeAreaView>

      {/* bottom sheet */}
      {pageContent !== null && (
        <RbSheet
          ref={refRBSheet}
          height={210}
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
          <Text style={[g.fs20, g.FHNB, g.txtLeft, g.colorBlue, g.mb5]}>
            {pageContent.companyContactPerson.name &&
            pageContent.companyContactPerson.name !== undefined &&
            pageContent.companyContactPerson.name !== null
              ? pageContent.companyContactPerson.name
              : 'N/A'}
          </Text>
          <Text
            style={[g.fs16, g.FHNR, g.txtLeft, g.colorBlack, g.mb10, g.ml10]}>
            {pageContent.companyContactPerson.designation &&
            pageContent.companyContactPerson.designation !== undefined &&
            pageContent.companyContactPerson.designation !== null
              ? pageContent.companyContactPerson.designation
              : 'N/A'}
          </Text>
          <View style={{flexDirection: 'row', flex: 1}}>
            <View
              style={{
                flex: 1,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (
                    pageContent.companyContactPerson.phone &&
                    pageContent.companyContactPerson.phone !== undefined &&
                    pageContent.companyContactPerson.phone !== null &&
                    pageContent.companyContactPerson.phone !== ''
                  ) {
                    Helpers.openDialler(pageContent.companyContactPerson.phone);
                  }
                }}
                activeOpacity={1}>
                <ProgresImage
                  source={GlobalInclude.Assets.ContactUs}
                  containerStyle={{
                    height: scale(28),
                    width: scale(28),
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                  }}
                  imageStyle={{
                    height: scale(28),
                    width: scale(28),
                  }}
                  mode={'contain'}
                />
              </TouchableOpacity>

              <Text style={[g.fs12, g.FHNR, g.txtCenter, g.colorBlack, g.mt10]}>
                {'Call'}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (
                    pageContent.companyContactPerson.whatsapp &&
                    pageContent.companyContactPerson.whatsapp !== undefined &&
                    pageContent.companyContactPerson.whatsapp !== null &&
                    pageContent.companyContactPerson.whatsapp !== ''
                  ) {
                    Helpers.shareToWhatsAppWithContact(
                      pageContent.companyContactPerson.whatsapp,
                      '',
                    );
                  }
                }}
                activeOpacity={1}>
                <ProgresImage
                  source={GlobalInclude.Assets.WhatsAppIcon}
                  containerStyle={{height: scale(28), width: scale(28)}}
                  imageStyle={{
                    height: scale(28),
                    width: scale(28),
                  }}
                  mode={'contain'}
                />
              </TouchableOpacity>
              <Text style={[g.fs12, g.FHNR, g.txtCenter, g.colorBlack, g.mt10]}>
                {'WhatsApp'}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (
                    pageContent.companyContactPerson.email &&
                    pageContent.companyContactPerson.email !== undefined &&
                    pageContent.companyContactPerson.email !== null &&
                    pageContent.companyContactPerson.email !== ''
                  ) {
                    Helpers.openEmail(pageContent.companyContactPerson.email);
                  }
                }}
                activeOpacity={1}>
                <ProgresImage
                  source={GlobalInclude.Assets.EmailIcon}
                  containerStyle={{height: scale(28), width: scale(28)}}
                  imageStyle={{
                    height: scale(28),
                    width: scale(28),
                  }}
                  mode={'contain'}
                />
              </TouchableOpacity>
              <Text style={[g.fs12, g.FHNR, g.txtCenter, g.colorBlack, g.mt10]}>
                {'Email'}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (
                    pageContent.companyContactPerson.websiteLink &&
                    pageContent.companyContactPerson.websiteLink !==
                      undefined &&
                    pageContent.companyContactPerson.websiteLink !== null &&
                    pageContent.companyContactPerson.websiteLink !== ''
                  ) {
                    Helpers.openLink(
                      pageContent.companyContactPerson.websiteLink,
                    );
                  }
                }}
                activeOpacity={1}>
                <ProgresImage
                  source={GlobalInclude.Assets.WebSite}
                  containerStyle={{height: scale(28), width: scale(28)}}
                  imageStyle={{
                    height: scale(28),
                    width: scale(28),
                  }}
                  mode={'contain'}
                />
              </TouchableOpacity>
              <Text style={[g.fs12, g.FHNR, g.txtCenter, g.colorBlack, g.mt10]}>
                {'Website'}
              </Text>
            </View>
          </View>
        </RbSheet>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    width: scale(30),
    height: scale(30),
    padding: scale(4),
  },
  tabBarStyle: {borderBottomWidth: 0, margin: 0},
  tabBarUnderlineStyle: {
    borderBottomColor: 'transparent',
    backgroundColor: 'white',
  },
});

export default BusinessDetails;
