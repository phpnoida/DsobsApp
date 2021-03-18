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
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {IconType, APP_NAME, URL_REGX} from '../../helper/Constants';
import TopHeaderView from '../../component/TopHeaderView';
import Helper from '../../helper/Helper';
import axios from 'axios';
import ProgresImage from '../../component/ProgresImage';

const {height, width} = Dimensions.get('window');

const GalleryListing = ({navigation}) => {
  const [pageContent, setPageContent] = useState([]);

  useEffect(() => {
    let dummyArray = [];
    axios.get('https://picsum.photos/v2/list?page=2&limit=200').then((res) => {
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
          video: element,
        };
        dummyArray.push(dummyData);
      }

      setPageContent(dummyArray);
    });
    return () => {};
  }, []);

  const loadFirstSixImages = (imageArray) => {
    let data = imageArray.slice(0, 6);

    let calloutSection = data.map((item, index) => {
      return (
        <View
          key={index}
          style={{
            width: width / 3 - 27,
            marginTop: 10,
            marginRight: 5,
            marginLeft: 5,
          }}>
          <View style={[g.br3, g.oh, g.bggray]}>
            <ProgresImage
              source={GlobalInclude.Assets.DefaultImage}
              containerStyle={{aspectRatio: 1 / 1}}
              imageStyle={{
                aspectRatio: 1 / 1,
              }}
            />
          </View>
        </View>
      );
    });
    return calloutSection;
  };

  const generateGalleryView = ({item, index}) => {
    return (
      <View
        key={index}
        style={[
          {marginRight: 15, marginLeft: 15, padding: 10},
          g.mb5,
          g.mt10,
          g.pb15,
          g.bgWhite,
          g.boxShadow,
          {borderRadius: 10, shadowOffset: {width: 2}},
        ]}>
        <View
          style={[
            grid.rowdir,
            grid.alignItemsBottom,
            grid.justifyContent,
            g.pl5,
            g.pr5,
          ]}>
          <View style={[grid.col, g.pr15]}>
            <Text style={[g.colorBlack, g.fs14, g.FHNM]}>{item.title}</Text>
          </View>
          <View style={g.w60}></View>
        </View>
        {/* Pictures */}
        <View style={[g.oh]}>
          <View style={[grid.rowdir, grid.flexwrap]}>
            {loadFirstSixImages(item.video)}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <View style={[GlobalInclude.AppStyle.fill]}>
          <View style={GlobalInclude.AppStyle.contentSpace}>
            <TopHeaderView
              index={4}
              navigation={navigation}
              label={'Upload Photos'}
              showLabel={true}
              onLabelPress={() => {}}
            />
            <View style={[grid.rowdir, g.mt10, g.mb10]}>
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
                      g.fs16,
                      grid.col,
                      grid.justifyContentCenter,
                    ]}
                    keyboardType={'default'}
                    placeholder={'Search by(Title)'}
                    onChangeText={(text) => {}}
                  />
                </View>
              </View>
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
                data={pageContent}
                showsVerticalScrollIndicator={false}
                renderItem={generateGalleryView}
                keyExtractor={(item, index) => index.toString()}
                style={{marginBottom: scale(15)}}
                contentContainer={{paddingTop: scale(10)}}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
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
});

export default GalleryListing;
