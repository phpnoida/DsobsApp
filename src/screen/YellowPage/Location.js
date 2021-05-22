import React, {useEffect} from 'react';
import {Text, View, ScrollView, TouchableOpacity} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import ProgresImage from '../../component/ProgresImage';
import {createOpenLink} from '../../helper/CreateMapLink';
import {MAP_KEY} from '../../helper/Constants';
import Geocoder from 'react-native-geocoding';

const Location = ({latitude, longitude, content}) => {
  var url = `http://maps.google.com/maps/api/staticmap?center==${latitude},${longitude},&zoom=18&markers=${latitude},${longitude}%7C${latitude},${longitude}&path=color:0x0000FF80%7Cweight:5%${latitude},${longitude}&&size=640x480&sensor=TRUE_OR_FALSE&key=${MAP_KEY}`;

  const travelType = 'public_transport';

  useEffect(() => {
    Geocoder.init(MAP_KEY);

    Geocoder.from(latitude, longitude)
      .then((json) => {
        var addressComponent = json.results[0].address_components[0];
        console.log(addressComponent);
      })
      .catch((error) => console.warn(error));
    return () => {};
  }, [latitude, longitude]);

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
                  createOpenLink({
                    travelType,
                    provider: 'google',
                    latitude: latitude,
                    longitude: longitude,
                  });
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
          <View style={[g.boxShadow, g.bgWhite, g.br3, g.p5, g.mt20]}>
            <View style={[grid.rowdir, grid.alignItems]}>
              <View style={[grid.col, g.pl15]}>
                <Text style={[g.colordarkGray, g.fs16, g.FHNB, g.mb5]}>
                  {content.businessName &&
                  content.businessName !== undefined &&
                  content.businessName !== null &&
                  content.businessName !== ''
                    ? content.businessName
                    : 'N/A'}
                </Text>
                <Text style={[g.colorLightGray, g.fs14, g.FHNR]}>
                  {content.companyAddress &&
                  content.companyAddress !== undefined &&
                  content.companyAddress !== null &&
                  content.companyAddress !== ''
                    ? content.companyAddress
                    : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Location;
