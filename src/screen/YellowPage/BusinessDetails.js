import React, {useState, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
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

const {height, width} = Dimensions.get('window');

const BusinessDetails = ({navigation}) => {
  const refRBSheet = useRef();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.parentStyle}>
          <HeaderBar
            title={'Incred Applications Pvt. Ltd.'}
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
          {isLoading ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator size={'small'} color={'#2b3252'} />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              <View
                style={[
                  g.bggray3,
                  g.mt15,
                  g.ml10,
                  g.mr10,
                  {borderRadius: scale(10)},
                ]}>
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
              </View>
              <View style={[g.p15, g.pt10]}>
                <Text
                  style={[g.fs14, g.mt5, g.FHNR, g.colorBlack]}
                  numberOfLines={2}>
                  IT/Information Technology
                </Text>
                <Text
                  style={[g.fs12, g.mt5, g.FHNR, g.colorBlack]}
                  numberOfLines={2}>
                  Montréal - New Delhi - Sydney - Jaipur - Ontario
                </Text>
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
                <AboutCompany tabLabel={'About'} />
                <ProductServices tabLabel={'ProductServices'} />
                <CompanyPhotos tabLabel={'Media'} />
                <Location tabLabel={'Location'} />
                <AluminiDetails tabLabel={'AluminiDetails'} />
                <Tags
                  tabLabel={'Tags'}
                  productTags={['help', 'structure', 'helo']}
                />
              </ScrollableTabView>
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
          <CommonButton
            showLoader={false}
            title={'Contact Us'}
            onPress={() => {
              if (refRBSheet && refRBSheet.current != null) {
                refRBSheet.current.open();
              }
            }}
          />
        </View>
      </SafeAreaView>

      {/* bottom sheet */}
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
        <Text style={[g.fs24, g.FHNB, g.txtLeft, g.colorBlue, g.mb5]}>
          Elon Musk
        </Text>
        <Text style={[g.fs18, g.FHNR, g.txtLeft, g.colorBlack, g.mb10]}>
          CEO
        </Text>

        <View style={[grid.rowdir, grid.justifyContentCenter, g.mt10]}>
          <TouchableOpacity onPress={() => {}} activeOpacity={1}>
            <ProgresImage
              source={GlobalInclude.Assets.ContactUs}
              containerStyle={{height: scale(40), width: scale(40)}}
              imageStyle={{
                height: scale(40),
                width: scale(40),
              }}
              mode={'contain'}
            />
          </TouchableOpacity>
          <View style={{marginHorizontal: scale(10)}} />
          <TouchableOpacity onPress={() => {}} activeOpacity={1}>
            <ProgresImage
              source={GlobalInclude.Assets.WhatsAppIcon}
              containerStyle={{height: scale(40), width: scale(40)}}
              imageStyle={{
                height: scale(40),
                width: scale(40),
              }}
              mode={'contain'}
            />
          </TouchableOpacity>
          <View style={{marginHorizontal: scale(10)}} />
          <TouchableOpacity onPress={() => {}} activeOpacity={1}>
            <ProgresImage
              source={GlobalInclude.Assets.EmailIcon}
              containerStyle={{height: scale(40), width: scale(40)}}
              imageStyle={{
                height: scale(40),
                width: scale(40),
              }}
              mode={'contain'}
            />
          </TouchableOpacity>
          <View style={{marginHorizontal: scale(10)}} />
          <TouchableOpacity onPress={() => {}} activeOpacity={1}>
            <ProgresImage
              source={GlobalInclude.Assets.WebSite}
              containerStyle={{height: scale(40), width: scale(40)}}
              imageStyle={{
                height: scale(40),
                width: scale(40),
              }}
              mode={'contain'}
            />
          </TouchableOpacity>
        </View>
      </RbSheet>
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
