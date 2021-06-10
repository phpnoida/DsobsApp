import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {AutoSizeText, ResizeTextMode} from 'react-native-auto-size-text';
import GlobalInclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';
import grid from '../theme/grid';
import g from '../theme/global';

const MoreLessComponent = ({truncatedText, fullText, showMore, fontSize}) => {
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

const MoreInfo = ({text, linesToTruncate}) => {
  const [clippedText, setClippedText] = React.useState(false);
  const [showMore, setShowMore] = React.useState(true);
  const [fontSize, setFontSize] = React.useState(scale(15));
  return clippedText ? (
    <MoreLessComponent
      truncatedText={clippedText}
      fullText={text}
      showMore={showMore}
      fontSize={fontSize}
    />
  ) : (
    <Text
      style={[
        {marginHorizontal: scale(6), marginVertical: scale(6)},
        g.colorBlack,
        g.FHNR,
      ]}
      onTextLayout={(event) => {
        //get all lines
        const {lines} = event.nativeEvent;
        console.log('length', lines.length);
        if (lines.length < 2) {
          setFontSize(scale(24));
        } else if (lines.length > 2 && lines.length < 5) {
          setFontSize(scale(20));
        } else if (lines.length > 4) {
          setFontSize(scale(18));
        }
        let clipped = lines
          .splice(0, linesToTruncate)
          .map((line) => line.text)
          .join('');
        //substring with some random digit, this might need more work here based on the font size
        //
        //setClippedText(text.substr(0, text.length - 9));
        setShowMore(clipped.length === text.length ? false : true);
        setClippedText(clipped);
      }}>
      {text}
    </Text>
  );
};

export default MoreInfo;
