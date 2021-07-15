import React, {useRef} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import UploadMedia from '../../component/UploadMedia';

const TabSeven = (props) => {
  const uploadRef = useRef();
  return (
    <View style={g.mt45}>
      <Text style={[g.fs24, g.FHNB, g.mb20, g.colorBlack, g.txtCenter]}>
        Choose a Profile Photo
      </Text>
      <View style={[g.mb5, grid.rowdir, grid.justifyContentCenter]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => {
            if (
              uploadRef &&
              uploadRef.current !== undefined &&
              uploadRef.current !== null
            ) {
              uploadRef.current.open();
            }
          }}>
          <View
            style={[
              g.bglightGray,
              g.br3,
              g.oh,
              {
                height: scale(144),
                width: scale(144),
                borderRadius: 100,
                borderWidth: 3,
                borderColor: GlobalInclude.Color.ColorPrimary,
                alignContent: 'center',
              },
            ]}>
            {props.profileImg !== '' ? (
              <Image
                style={{aspectRatio: 1 / 1}}
                resizeMode="cover"
                source={{uri: props.profileImg}}
              />
            ) : (
              <Image
                style={{
                  height: scale(144),
                  width: scale(144),
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
                resizeMode="contain"
                source={GlobalInclude.Assets.AppLogo}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <Text style={[g.fs18, g.FHNB, g.mb20, g.colorBlack, g.txtCenter]}>
        Pick a photo of your profile
      </Text>

      {props.profileImg !== '' ? (
        <View style={[grid.rowdir, grid.justifyContentCenter]}>
          <TouchableOpacity
            style={[g.btnL, {width: scale(150), height: scale(45)}]}
            onPress={(e) => {
              if (
                uploadRef &&
                uploadRef.current !== undefined &&
                uploadRef.current !== null
              ) {
                uploadRef.current.open();
              }
            }}
            activeOpacity={0.8}>
            <Text style={[g.colorWhite, g.FHNR, g.fs15, g.txtCenter]}>
              Upload Photo
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <UploadMedia
        refRBSheet={uploadRef}
        media={{
          image: false,
          video: true,
          document: true,
          audio: true,
        }}
        supportMultiple={false}
        onPickMedia={(media) => {
          uploadRef.current.close();
          if (media !== undefined && media !== null) {
            console.log('media', media);
            props.onSelectImage(media[0]);
          }
        }}
      />
    </View>
  );
};

export default TabSeven;
