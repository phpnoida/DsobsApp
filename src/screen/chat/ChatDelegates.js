import React from 'react';
import ProgressImage from '../../component/ProgresImage';
import {scale} from '../../theme/Scalling';
import Helper from '../../helper/Helper';

export function showMediaType(messageType) {
  switch (messageType) {
    case 2:
      return 'Photo';
    default:
      return 'Media';
  }
}

export function showImageThumb(source, type) {
  if (type === 2) {
    return (
      <ProgressImage
        source={{uri: source}}
        containerStyle={{
          height: scale(48),
          aspectRatio: 1 / 1,
          borderRadius: 0,
          borderBottomRightRadius: scale(6),
          borderTopRightRadius: scale(6),
        }}
        imageStyle={{
          height: scale(48),
          aspectRatio: 1 / 1,
          borderRadius: 0,
          borderBottomRightRadius: scale(6),
          borderTopRightRadius: scale(6),
        }}
        mode={'cover'}
      />
    );
  } else if (type === 3) {
    let videoId = Helper.GetYoutubeId(source);
    return (
      <ProgressImage
        source={{uri: Helper.loadYoutubeThumb(videoId)}}
        containerStyle={{
          height: scale(48),
          aspectRatio: 1 / 1,
          borderRadius: 0,
          borderBottomRightRadius: scale(6),
          borderTopRightRadius: scale(6),
        }}
        imageStyle={{
          height: scale(48),
          aspectRatio: 1 / 1,
          borderRadius: 0,
          borderBottomRightRadius: scale(6),
          borderTopRightRadius: scale(6),
        }}
        mode={'cover'}
      />
    );
  } else {
    return null;
  }
}
