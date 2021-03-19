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
import FilterSheet from 'react-native-raw-bottom-sheet';
import CommonButton from '../../component/CommonButton';
import ProgresImage from '../../component/ProgresImage';

const {height, width} = Dimensions.get('window');

let lastIndex = 0;
let pageTitle = '';
let arrayItems = [];
let imageWidth = width;
let imageHeight = height;
let ratio = 0;

const GalleryDetail = ({route, navigation}) => {
  if (route !== undefined && route !== null) {
    console.log('route', route);
    arrayItems = route.params.data;
    pageTitle = route.params.title;
    lastIndex = route.params.index;
  }

  const [title, setTitle] = useState(pageTitle);
  const [data, setData] = useState([...arrayItems]);
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    let image = data[lastIndex];

    Image.getSize(image.download_url, (height, width) => {
      if (width !== undefined && width !== null) {
        if (imageWidth > width) {
          imageWidth = width;
        }
      }
      setIsFetching(false);
    });

    return () => {};
  }, []);

  const showTaggedUsers = () => {
    let componentArray = [];

    for (let i = 0; i < 6; i++) {
      const component = (
        <View
          key={i}
          style={[
            g.ml10,
            {
              width: width / 3 - 40,
              marginRight: 10,
              justifyContent: 'center',
              alignSelf: 'center',
            },
          ]}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
            <View
              style={[
                g.bglightGray,
                g.oh,
                {
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignSelf: 'center',
                },
              ]}>
              <Image
                source={GlobalInclude.Assets.DefaultProfile}
                style={{aspectRatio: 1 / 1}}
                resizeMode="cover"
              />
            </View>
            <View style={{height: 80, width: 100}}>
              <Text
                style={[g.fs14, g.FHNR, g.txtCenter, g.colorBlack, g.mt10]}
                numberOfLines={2}>
                Rahul
              </Text>
              <Text style={[g.fs14, g.FHNR, g.txtCenter, g.colorGray1]}>
                {'Batch 2021'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );

      componentArray.push(component);
    }
    return componentArray;
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <View style={GlobalInclude.AppStyle.fill}>
          <HeaderBar
            navigation={navigation}
            title={title}
            showLabel={true}
            label={'Tag'}
            onLabelPress={() => {}}
          />
          {isFetching ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator size={'small'} color={'#2b3252'} />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={grid.flex1}>
              <ProgresImage
                source={{uri: 'https://picsum.photos/900/200'}}
                containerStyle={{aspectRatio: 16 / 9, width: imageWidth}}
                imageStyle={{
                  aspectRatio: 16 / 9,
                  width: imageWidth,
                }}
              />
              <Text style={[g.fs14, g.FHNR, g.colorGray1, g.p15, g.pt5]}>
                About This Image
              </Text>

              <View style={[g.p15, g.pt0]}>
                <View
                  style={[
                    grid.rowrow,
                    grid.alignItems,
                    grid.justifyContentCenter,
                    grid.justifyContent,
                    g.mb10,
                  ]}>
                  <Text
                    style={[
                      g.fs16,
                      g.FHNB,
                      g.colordarkGray,
                      g.ml10,
                      grid.alignItems,
                      grid.justifyContentCenter,
                      g.txtCenter,
                    ]}>
                    People in the image
                  </Text>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
                    <Image
                      source={GlobalInclude.Assets.Menu}
                      style={styles.back}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <View style={[grid.row, g.mt10, grid.flexwrap]}>
                  {showTaggedUsers()}
                </View>
              </View>
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
    justifyContent: 'center',
  },
});

export default GalleryDetail;
