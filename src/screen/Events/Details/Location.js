import React from 'react';
import {Text, View, ScrollView, TouchableOpacity, Linking} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import ProgresImage from '../../../component/ProgresImage';
import {createOpenLink} from '../../../helper/CreateMapLink';
import {MAP_KEY} from '../../../helper/Constants';
import Helper from '../../../helper/Helper';

const Location = ({content}) => {
  let latitude = 28.5904933,
    longitude = 77.3001552;

  // if (
  //   content.googleMapLink &&
  //   content.googleMapLink !== undefined &&
  //   content.googleMapLink !== null &&
  //   content.googleMapLink !== ''
  // ) {
  //   let locationDetail = Helper.getLatLngFromMap(content.googleMapLink);
  //   if (
  //     locationDetail &&
  //     locationDetail !== null &&
  //     locationDetail.latitude !== 0 &&
  //     locationDetail.longitude !== 0
  //   ) {
  //     latitude = locationDetail.latitude;
  //     longitude = locationDetail.longitude;
  //   }
  // }

  var url = `http://maps.google.com/maps/api/staticmap?center==${latitude},${longitude},&zoom=18&markers=${latitude},${longitude}%7C${latitude},${longitude}&path=color:0x0000FF80%7Cweight:5%${latitude},${longitude}&&size=640x480&sensor=TRUE_OR_FALSE&key=${MAP_KEY}`;

  const travelType = 'public_transport';

  return (
    <ScrollView
      style={[g.pl10, g.pr10, grid.flex1]}
      contentContainerStyle={g.pb30}
      showsVerticalScrollIndicator={false}>
      {latitude === 0.0 || longitude === 0.0 ? (
        <View style={GlobalInclude.AppStyle.fillCenter}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            Currently No Data Uploaded!
          </Text>
        </View>
      ) : (
        <View style={{padding: scale(5), paddingBottom: scale(70)}}>
          <View style={[g.bggray3, {borderRadius: scale(10)}]}>
            <ProgresImage
              source={{uri: url}}
              containerStyle={{height: scale(110), borderRadius: scale(10)}}
              imageStyle={{
                height: scale(110),
                borderRadius: scale(10),
              }}
              mode={'cover'}
            />

            <View
              style={{
                position: 'absolute',
                right: 0,
                zIndex: 2,
                height: '100%',
                width: scale(64),
                backgroundColor: 'rgba(62,62,62,0.5)',
                borderRadius: scale(10),
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  // createOpenLink({
                  //   travelType,
                  //   provider: 'google',
                  //   latitude: latitude,
                  //   longitude: longitude,
                  // });

                  Linking.canOpenURL(content.googleMapLink).then(
                    (supported) => {
                      if (supported) {
                        Linking.openURL(content.googleMapLink);
                      } else {
                        console.log(
                          "Don't know how to open URI: " +
                            content.googleMapLink,
                        );
                      }
                    },
                  );
                }}>
                <ProgresImage
                  source={GlobalInclude.Assets.MapLocation}
                  containerStyle={{height: scale(36), width: scale(36)}}
                  imageStyle={{
                    height: scale(36),
                    width: scale(36),
                  }}
                  mode={'cover'}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* <View style={[g.boxShadow, g.bgWhite, g.br3, g.p5, g.mt20]}>
            <View style={[grid.rowdir, grid.alignItems]}>
              <View style={[grid.col, g.pl15]}>
                <Text style={[g.colordarkGray, g.fs16, g.FHNB, g.mb5]}>
                  {content.title &&
                  content.title !== undefined &&
                  content.title !== null &&
                  content.title !== ''
                    ? content.title
                    : 'N/A'}
                </Text>
                <Text style={[g.colorLightGray, g.fs14, g.FHNR]}>
                  {content.venue &&
                  content.venue !== undefined &&
                  content.venue !== null &&
                  content.venue !== ''
                    ? content.venue
                    : 'N/A'}
                </Text>
              </View>
            </View>
          </View> */}
        </View>
      )}
    </ScrollView>
  );
};

export default Location;
