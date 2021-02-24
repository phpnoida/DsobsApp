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
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {IconType} from '../../helper/Constants';
import {getVideos} from '../../Actions/VideoActions';
import YoutubeView from '../../component/YoutubeView';
import TopHeaderView from '../../component/TopHeaderView';
const Video = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState([]);

  useEffect(() => {
    getVideoData('');
    return () => {};
  }, []);

  /**
   * ************************************************
   * API Section Start
   * ************************************************
   */

  const getVideoData = (searchQuery) => {
    setIsLoading(true);
    getVideos(
      searchQuery,
      (response) => {
        setIsLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              setPageContent([...data.data]);
            }
          }
        }
      },
      (error) => {
        setIsLoading(false);
        console.log('error', error);
      },
    );
  };

  /**
   * ************************************************
   * API Section End
   * ************************************************
   */

  const renderVideos = () => {
    return pageContent.map((item, index) => {
      return (
        <View>
          {item.videos !== undefined && item.videos.length > 0 ? (
            <View
              style={[
                g.bgWhite,
                g.boxShadow,
                g.mb15,
                {margin: scale(5), borderRadius: scale(6)},
              ]}>
              <View style={g.bggray3}>
                <YoutubeView
                  link={item.videos[0].videoLink}
                  containerStyle={style.videoContainer}
                  overlayStyle={style.overlayStyle}
                  thumbStyle={style.thumbStyle}
                />
              </View>
              <View style={[g.p15]}>
                <Text style={[g.FHNB, g.fs15, g.colorBlack]}>
                  {item.title ? item.title : ''}
                </Text>
                <Text
                  style={[g.fs14, g.mt5, g.FHNR, g.colorBlack]}
                  numberOfLines={2}>
                  {item.videos[0].about}
                </Text>
              </View>
            </View>
          ) : (
            <View />
          )}
        </View>
      );
    });
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <SafeAreaView
        style={[
          GlobalInclude.AppStyle.parentStyle,
          {paddingHorizontal: scale(10)},
        ]}>
        <View style={{paddingHorizontal: scale(5)}}>
          <TopHeaderView
            index={11}
            onIconPress={() => {
              navigation.goBack();
            }}
            onTabPress={() => {}}
          />
        </View>
        <View style={[grid.rowdir, g.mb15, g.mt10, g.ml5, g.mr5]}>
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
                  g.fs18,
                  grid.col,
                  grid.justifyContentCenter,
                ]}
                keyboardType={'default'}
                placeholder={'Search'}
                onChangeText={(text) => {
                  getVideoData(text);
                }}
              />
            </View>
          </View>
        </View>
        {isLoading ? (
          <View style={GlobalInclude.AppStyle.fillCenter}>
            <ActivityIndicator size={'small'} color={'#2b3252'} />
          </View>
        ) : (
          <View style={GlobalInclude.AppStyle.fill}>
            {pageContent === null || pageContent.length === 0 ? (
              <View style={GlobalInclude.AppStyle.fillCenter}>
                <Image
                  style={{height: scale(100), width: scale(100)}}
                  source={GlobalInclude.Assets.AppLogo}
                />
                <Text style={[g.colorGray8, g.FHNM, g.fs18]}>
                  No Content Found
                </Text>
              </View>
            ) : (
              <View style={GlobalInclude.AppStyle.fill}>
                <ScrollView
                  style={[GlobalInclude.AppStyle.fill]}
                  scrollEventThrottle={1000}
                  showsVerticalScrollIndicator={false}>
                  {renderVideos()}
                </ScrollView>
              </View>
            )}
          </View>
        )}
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
  mainContainer: {
    backgroundColor: '#ffffff',
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
    marginTop: scale(5),
    marginStart: scale(5),
    marginEnd: scale(5),
    marginBottom: scale(15),
  },
  videoContainer: {
    height: scale(200),
    width: '100%',
    borderRadius: scale(6),
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
    borderRadius: scale(6),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  thumbStyle: {
    height: scale(200),
    width: '100%',
    borderRadius: scale(6),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});

export default Video;
