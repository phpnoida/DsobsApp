import React, {useLayoutEffect, useState} from 'react';
import {View, SafeAreaView, ActivityIndicator} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import {WebView} from 'react-native-webview';
import HeaderBar from '../component/HeaderBar';
import {scale} from '../theme/Scalling';

const CommonWebPage = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <HeaderBar navigation={navigation} />,
    });
    return () => {};
  }, [navigation]);

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar navigation={navigation} />
      <SafeAreaView style={GlobalInclude.AppStyle.fill}>
        <View style={GlobalInclude.AppStyle.parentStyle}>
          <WebView
            style={{marginTop: scale(10)}}
            source={{uri: route.params.link}}
            scalesPageToFit
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
