import React, {useState, useEffect} from 'react';
import {Text, View, Image, Dimensions, TouchableOpacity} from 'react-native';
import Video from 'react-native-video';
import axios from 'axios';
import VideoPlayer from '../src/component/VideoPlayer';
const ImageDemo = ({params}) => {
  return (
    <VideoPlayer
      playerLink={
        'https://150vod-adaptive.akamaized.net/exp=1626938895~acl=%2F45ba3756-15de-426f-9fcf-f66b62b0903d%2F%2A~hmac=2e09bd823844355cc2596e1925e1370dc2f99457ed096165a04d139aa036f172/45ba3756-15de-426f-9fcf-f66b62b0903d/sep/video/98515e42,053c36cc,14b6240b,3fce670a,615187cc/audio/91bc0e10,2f188586/master.m3u8?query_string_ranges=1'
      }
    />
  );
};

export default ImageDemo;
