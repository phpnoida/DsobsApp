import React from 'react';
import {Text, View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import GlobalInclude from '../globalInclude/Globalinclude';
import grid from '../theme/grid';
import {scale} from '../theme/Scalling';
import {CommonActions} from '@react-navigation/native';
import MyStatusBar from '../component/MyStatusBar';
const slides = [
  {
    key: 'somethun',
    image: require('../../Assets/Icon/slide_one.jpg'),
  },
  {
    key: 'somethun-dos',
    image: require('../../Assets/Icon/slide_two.jpg'),
  },
  {
    key: 'somethun2',
    image: require('../../Assets/Icon/slide_three.jpg'),
  },
  {
    key: 'somethun4',
    image: require('../../Assets/Icon/slide_four.jpg'),
  },
];

const AppTour = ({navigation}) => {
  const _onDone = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  const renderImage = ({item}) => {
    return (
      <Image
        source={item.image}
        resizeMode={'contain'}
        style={{
          height: '90%',
          width: '90%',
          alignSelf: 'center',
          justifyContent: 'center',
        }}
        resizeMethod={'auto'}
      />
    );
  };

  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <MyStatusBar backgroundColor={'#fff'} />
      <View style={GlobalInclude.AppStyle.parentStyle}>
        <View style={[grid.rowdir, grid.justifyContentRight]}>
          <TouchableOpacity
            onPress={() => {
              _onDone();
            }}>
            <Text
              style={{
                color: '#999',
                marginEnd: scale(15),
                fontSize: scale(15),
                marginBottom: scale(5),
                marginTop: scale(5),
              }}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>
        <View style={grid.flex1}>
          <AppIntroSlider
            data={slides}
            pageNum={0}
            onDone={() => _onDone()}
            renderItem={renderImage}
            bottomButton
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCircle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppTour;
