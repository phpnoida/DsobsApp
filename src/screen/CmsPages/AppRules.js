import React, {useLayoutEffect} from 'react';
import {View, Dimensions, StyleSheet, SafeAreaView} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {AppRulesArticle} from './Data';
import {scale} from '../../theme/Scalling';
import HTML from 'react-native-render-html';
import g from '../../theme/global';
import {ScrollView} from 'react-native-gesture-handler';
import {APP_NAME} from '../../helper/Constants';

const AppRules = ({navigation}) => {
  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar
        showBack={true}
        navigation={navigation}
        title={`${APP_NAME} Memorandum and Rules`}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.ViewStyle}>
        <ScrollView style={g.p10} showsVerticalScrollIndicator={false}>
          <HTML
            source={{
              html:
                '<div>' +
                AppRulesArticle.replace(/<p[^>]*><br><\/p>/g, '<br>')
                  .replace(/<h3[^>]*><br><\/h3>/g, '')
                  .replace(/(<br\s*\/?>){1,}/gi, '<br>')
                  .replace(/(\r\n|\n|\r)/gm, '')
                  .replace(/(<br\s*\/?>)/gi, '') +
                '</div>',
            }}
            baseFontStyle={{fontSize: scale(12)}}
            textSelectable={false}
            defaultTextProps={{allowFontScaling: true}}
            tagsStyles={richTextStyles}
            allowWhitespaceNodes={false}
            containerStyle={styles.container}
            contentWidth={Dimensions.get('window').width - 30}
          />
        </ScrollView>
      </SafeAreaView>
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

const richTextStyles = StyleSheet.create({
  p: {
    textAlign: 'justify',
    paddingStart: scale(4),
    paddingEnd: scale(4),
  },
});

export default AppRules;
