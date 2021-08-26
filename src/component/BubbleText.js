import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {AutoSizeText, ResizeTextMode} from 'react-native-auto-size-text';
import GlobalInclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';
import grid from '../theme/grid';
import g from '../theme/global';
import Helpers from '../helper/Helper';
import ParsedText from 'react-native-parsed-text';

const BubbleTextComponent = ({truncatedText, fullText, showMore, fontSize}) => {
  const [more, setMore] = React.useState(false);
  return (
    <Text
      style={[
        {
          marginHorizontal: scale(6),
          marginVertical: scale(6),
          fontSize: fontSize,
        },
        g.colorBlack,
        g.FHNR,
      ]}>
      {!more ? (showMore ? `${truncatedText}...` : truncatedText) : fullText}
      {showMore && (
        <TouchableOpacity
          onPress={() => setMore(!more)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              textAlign: 'center',
              marginLeft: 10,
              color: GlobalInclude.Color.ColorPrimary,
            }}>
            {more ? 'See Less' : 'See More'}
          </Text>
        </TouchableOpacity>
      )}
    </Text>
  );
};

const BubbleText = ({source, customFont}) => {
  const [isNewLine, setIsNewLine] = React.useState(false);

  const handleEmailPress = (email, matchIndex /*: number*/) => {
    Helpers.openEmail(email);
  };

  const handleUrlPress = (url, matchIndex /*: number*/) => {
    Helpers.openLink(url);
  };

  const handlePhonePress = (phone, matchIndex /*: number*/) => {
    Helpers.openDialler(phone);
  };

  return (
    <ParsedText
      parse={[
        {type: 'url', style: styles.url, onPress: handleUrlPress},
        {type: 'phone', style: styles.phone, onPress: handlePhonePress},
        {type: 'email', style: styles.email, onPress: handleEmailPress},
        {pattern: /#(\w+)/, style: styles.hashTag},
      ]}
      childrenProps={{allowFontScaling: false}}
      onTextLayout={event => {
        //get all lines
        const {lines} = event.nativeEvent;
        console.log('length', lines.length);
        console.log('height', lines[0].height);
        if (lines.length > 0) {
          let height = lines[0].height;
          if (height < 16) {
            setIsNewLine(true);
          }
        }
      }}
      style={[
        customFont,
        g.FHNR,
        g.colorBlack,
        g.txtCenterVertical,
        {textAlign: 'justify'},
      ]}>
      {source}
    </ParsedText>
  );
};

const styles = StyleSheet.create({
  url: {
    textDecorationLine: 'underline',
  },
  email: {
    textDecorationLine: 'underline',
  },
  hashTag: {
    fontStyle: 'italic',
  },
});

export default BubbleText;
