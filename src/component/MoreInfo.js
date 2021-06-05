import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {AutoSizeText, ResizeTextMode} from 'react-native-auto-size-text';
import GlobalInclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';
import grid from '../theme/grid';
import g from '../theme/global';

const MoreLessComponent = ({truncatedText, fullText, showMore}) => {
  const [more, setMore] = React.useState(false);
  return (
    <AutoSizeText
      fontSizePresets={[26, 22, 18]}
      numberOfLines={more ? undefined : 3}
      minFontSize={26}
      fontSize={26}
      style={[
        {marginHorizontal: scale(6), marginVertical: scale(6)},
        g.colorBlack,
        g.FHNR,
      ]}
      mode={
        more ? ResizeTextMode.min_font_size : ResizeTextMode.preset_font_sizes
      }>
      {!more ? `${truncatedText}...` : fullText}
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
    </AutoSizeText>
  );
};

const MoreInfo = ({text, linesToTruncate}) => {
  const [clippedText, setClippedText] = React.useState(false);
  const [showMore, setShowMore] = React.useState(true);
  return clippedText ? (
    <MoreLessComponent
      truncatedText={clippedText}
      fullText={text}
      showMore={showMore}
    />
  ) : (
    <AutoSizeText
      fontSizePresets={[26, 22, 18]}
      numberOfLines={linesToTruncate}
      mode={ResizeTextMode.preset_font_sizes}
      style={[
        {marginHorizontal: scale(6), marginVertical: scale(6)},
        g.colorBlack,
        g.FHNR,
      ]}
      onTextLayout={(event) => {
        //get all lines
        const {lines} = event.nativeEvent;
        //get lines after it truncate
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
    </AutoSizeText>
  );
};

export default MoreInfo;
