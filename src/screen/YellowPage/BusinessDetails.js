import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import g from '../../theme/global';
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
import {ScrollView} from 'react-native';

const BusinessDetails = ({navigation}) => {
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
            <ScrollView style={[GlobalInclude.AppStyle.fill]}>
              <View
                style={[
                  g.bggray3,
                  g.mt20,
                  g.ml15,
                  g.mr15,
                  {borderRadius: scale(10)},
                ]}>
                <ProgresImage
                  source={GlobalInclude.Assets.DefaultImage}
                  containerStyle={{height: scale(230), borderRadius: scale(10)}}
                  imageStyle={{
                    aspectRatio: 1 / 1,
                    borderRadius: scale(10),
                  }}
                  mode={'cover'}
                />
                <ProgresImage
                  source={{
                    uri: `https://picsum.photos/seed/${new Date().getMilliseconds()}/200/300`,
                  }}
                  containerStyle={{
                    height: scale(75),
                    width: scale(75),
                    borderRadius: scale(8),
                    position: 'absolute',
                    top: scale(10),
                    left: scale(10),
                  }}
                  imageStyle={{
                    aspectRatio: 1 / 1,
                    borderRadius: scale(8),
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
                  Montréal
                </Text>
              </View>
              <ScrollableTabView
                underlineColor={'#ffffff'}
                style={{flex: 1}}
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
                <AboutCompany tabLabel={'AboutCompany'} />
                <ProductServices tabLabel={'ProductServices'} />
                <CompanyPhotos tabLabel={'CompanyPhotos'} />
                <Location tabLabel={'Location'} />
                <AluminiDetails tabLabel={'AluminiDetails'} />
                <Tags
                  tabLabel={'Tags'}
                  productTags={['help', 'structure', 'helo']}
                />
              </ScrollableTabView>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
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
