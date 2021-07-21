import React, {useState, useEffect} from 'react';
import {Text, View, Image, Dimensions, TouchableOpacity} from 'react-native';
import Video from 'react-native-video';
import axios from 'axios';
const ImageDemo = ({params}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
      }}>
      <TouchableOpacity
        onPress={() => {
          axios
            .get(`https://player.vimeo.com/video/576796728/config`)
            .then((data) => {
              if (data.status) {
                //console.log('data.data', JSON.stringify(data.data));

                if (data.data !== null && data.data !== undefined) {
                  let postData = data.data;
                  let thumbUrl = postData.video.thumbs.base;
                  let videoUrl =
                    postData.request.files.hls.cdns[
                      postData.request.files.hls.default_cdn
                    ].url;

                  console.log('thumbURL', thumbUrl);
                  console.log('videoUrl', videoUrl);
                }
              }
            });

          // fetch(`https://player.vimeo.com/video/576796728/config`)
          //   .then((res) => res.json())
          //   .then((res) => {
          //
          //     let videoUrl =
          //       res.request.files.hls.cdns[res.request.files.hls.default_cdn]
          //         .url;

          //     console.log('Response', res.video);
          //   });
          console.log('Response');
        }}>
        <Text>Touch Me</Text>
      </TouchableOpacity>
      <Video
        source={{
          uri: 'https://150vod-adaptive.akamaized.net/exp=1626877056~acl=%2F45ba3756-15de-426f-9fcf-f66b62b0903d%2F%2A~hmac=19b0f58696b438caf94a8bbcc76d8330a99e07d0809426d1131970fe5e1de28d/45ba3756-15de-426f-9fcf-f66b62b0903d/sep/video/98515e42,053c36cc,14b6240b,3fce670a,615187cc/audio/91bc0e10,2f188586/master.m3u8?query_string_ranges=1',
        }}
        resizeMode={'cover'}
        style={{height: 300, width: 300}}
        playInBackground={true}
        playWhenInactive={true}
        controls={false}
        focusable={false}
        repeat={true}
        onError={(err) => {
          console.log('video errr', err);
        }}
      />
    </View>
  );
};

export default ImageDemo;
