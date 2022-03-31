import React, {useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import ProgresImage from '../../../component/ProgresImage';
import {showUser} from '../../../component/Common';
import NumberFormat from 'react-number-format';

const {width} = Dimensions.get('window');

const showTaggedUsers = (navigation, users) => {
  let componentArray = [];

  for (let i = 0; i < users.length; i++) {
    let item = users[i];
    let contributorName = '';
    if (item.fromSchool) {
      contributorName = item?.contributerId?.name ?? '';
    } else {
      contributorName = item?.contributerName ?? '';
    }
    const component = (
      <View key={i}>
        <TouchableOpacity
          style={[grid.row, grid.alignItems, g.mb10]}
          activeOpacity={0.8}
          onPress={() => {
            if (item.fromSchool) {
              navigation.navigate('UserProfile', {
                userId: item?.contributerId?._id,
              });
            }
          }}>
          <View
            style={[
              g.bglightGray,
              g.oh,
              {
                borderRadius: 100,
                justifyContent: 'center',
                alignSelf: 'center',
              },
            ]}>
            <ProgresImage
              source={
                item?.image !== undefined &&
                item?.image !== null &&
                item?.image !== ''
                  ? {uri: item.image}
                  : GlobalInclude.Assets.DefaultProfile
              }
              containerStyle={{
                aspectRatio: 1 / 1,
                height: scale(50),
                alignSelf: 'center',
                justifyContent: 'center',
              }}
              imageStyle={{
                aspectRatio: 1 / 1,
              }}
              mode={'cover'}
            />
          </View>
          <View style={[grid.col, grid.justifyContentCenter, g.ml10]}>
            <Text
              style={[
                g.fs14,
                g.FHNB,
                g.txtLeft,
                g.colorBlack,
                GlobalInclude.AppStyle.transform,
              ]}
              numberOfLines={1}>
              {item?.showName ? contributorName : 'Anonymous'}
            </Text>
            {item?.showName ? (
              <>
                <View style={{marginVertical: scale(2)}} />
                <Text
                  style={[
                    g.fs12,
                    g.FHNR,
                    g.txtLeft,
                    g.colordarkGray,
                    grid.alignItems,
                    grid.justifyContentCenter,
                  ]}>
                  {item?.contributerId?.batch ?? ''}
                </Text>
              </>
            ) : null}

            <View style={{marginVertical: scale(2)}} />
          </View>
          <NumberFormat
            value={item?.totalContribute ?? 0}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'₹'}
            decimalScale={2}
            fixedDecimalScale
            renderText={formattedValue => (
              <Text
                style={[
                  grid.alignItems,
                  g.fs16,
                  g.FHNB,
                  GlobalInclude.AppStyle.upper,
                  GlobalInclude.AppStyle.textCenter,
                  g.colorBlue,
                ]}
                numberOfLines={1}>
                {formattedValue}
              </Text>
            )}
          />
        </TouchableOpacity>
      </View>
    );

    componentArray.push(component);
  }
  return componentArray;
};

const TheTeam = ({content, navigation}) => {
  return (
    <ScrollView
      style={[g.pl10, g.pr10, grid.flex1]}
      contentContainerStyle={g.pb30}
      showsVerticalScrollIndicator={false}>
      <View style={g.p5}>
        {content.contributor &&
        content.contributor !== undefined &&
        content.contributor !== null &&
        content.contributor.length > 0 ? (
          <>
            <View style={[g.ml10, g.mb15]}>
              {showTaggedUsers(navigation, content.contributor)}
            </View>
          </>
        ) : (
          <View>
            <View style={GlobalInclude.AppStyle.center}>
              <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
                Currently No Data Uploaded!
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: width / 3 - 40,
    marginRight: 10,
  },
  viewCenter: {justifyContent: 'center', alignSelf: 'center'},
  profileBackground: {
    borderRadius: 100,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  imageStyle: {
    aspectRatio: 1 / 1,
    height: scale(70),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  userNameCenter: {height: scale(30), textAlignVertical: 'center'},
});
export default TheTeam;
