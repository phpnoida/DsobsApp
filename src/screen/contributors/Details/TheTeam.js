import React from 'react';
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
    console.log(item);
    const component = (
      <View key={i}>
        {showUser(item.profilePic, item.name, item.batch, null, () => {
          if (item.fromSchool) {
            navigation.navigate('UserProfile', {
              userId: item._id,
            });
          }
        })}
      </View>
    );

    componentArray.push(component);
  }
  return componentArray;
};

const TheTeam = ({content, navigation}) => (
  <ScrollView
    style={[g.pl10, g.pr10, grid.flex1]}
    contentContainerStyle={g.pb30}
    showsVerticalScrollIndicator={false}>
    <View style={g.p5}>
      <>
        <TouchableOpacity
          style={[grid.row, grid.alignItems]}
          activeOpacity={0.8}
          onPress={() => {}}>
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
              source={GlobalInclude.Assets.DefaultProfile}
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
              John Karter
            </Text>
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
              Batch-1994
            </Text>
            <View style={{marginVertical: scale(2)}} />
          </View>
          <NumberFormat
            value={13000}
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
      </>

      {/* {content.organizer &&
      content.organizer !== undefined &&
      content.organizer !== null &&
      content.organizer.length > 0 ? (
        <>
          <View style={[g.ml10, g.mb15]}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
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
                  source={GlobalInclude.Assets.DefaultProfile}
                  containerStyle={{
                    aspectRatio: 1 / 1,
                    height: scale(70),
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                  imageStyle={{
                    aspectRatio: 1 / 1,
                  }}
                  mode={'cover'}
                />
              </View>
              <View style={{minHeight: 65, flex: 1}}>
                <Text
                  style={[
                    g.fs14,
                    g.FHNM,
                    g.txtLeft,
                    g.colorBlack,
                    GlobalInclude.AppStyle.transform,
                  ]}
                  numberOfLines={2}>
                  John Karter
                </Text>
                <View style={{marginVertical: scale(2)}} />
                <Text
                  style={[
                    g.fs12,
                    g.FHNR,
                    g.txtLeft,
                    g.colorGray1,
                    grid.alignItems,
                    grid.justifyContentCenter,
                  ]}>
                  Batch-1994
                </Text>
                <View style={{marginVertical: scale(2)}} />
              </View>
            </TouchableOpacity>
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
      )} */}
    </View>
  </ScrollView>
);

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
