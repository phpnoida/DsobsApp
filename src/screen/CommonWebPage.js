import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import {WebView} from 'react-native-webview';
import HeaderBar from '../component/HeaderBar';
import {scale} from '../theme/Scalling';

const {height, width} = Dimensions.get('window');

const CommonWebPage = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar navigation={navigation} showBack={true} />
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.parentStyle}>
          <WebView
            style={{
              height: height,
              width,
              resizeMode: 'cover',
              flex: 1,
              marginTop: scale(10),
            }}
            source={{uri: route.params.link}}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            onLoadStart={() => {
              setIsLoading(true);
            }}
            onLoadEnd={() => {
              setIsLoading(false);
            }}
          />

          {isLoading && (
            <ActivityIndicator
              size={'large'}
              color={'#2b3252'}
              style={{
                alignSelf: 'center',
                position: 'absolute',
                justifyContent: 'center',
                top: 0,
                bottom: 0,
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CommonWebPage;
