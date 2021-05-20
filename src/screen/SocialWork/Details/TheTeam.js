import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import ProgresImage from '../../../component/ProgresImage';

const {width} = Dimensions.get('window');

const showTaggedUsers = (navigation, users) => {
  let componentArray = [];

  for (let i = 0; i < users.length; i++) {
    let item = users[i];
    console.log(item);
    const component = (
      <TouchableOpacity
        onPress={() => {
          if (item.fromSchool) {
            navigation.navigate('UserProfile', {
              userId: item._id,
            });
          }
        }}
        key={i}
        style={[
          g.ml10,
          g.mb5,
          styles.imageContainer,
          users.length > 2 ? styles.viewCenter : {},
        ]}>
        <View activeOpacity={0.8} style={styles.viewCenter}>
          <View style={[g.bglightGray, g.oh, styles.profileBackground]}>
            <ProgresImage
              source={
                item.profilePic !== undefined &&
                item.profilePic !== null &&
                item.profilePic !== ''
                  ? {uri: item.profilePic}
                  : GlobalInclude.Assets.DefaultProfile
              }
              containerStyle={styles.imageStyle}
              mode={'cover'}
            />
          </View>
          <View style={GlobalInclude.AppStyle.fill}>
            {/* <Text
              style={[
                g.fs12,
                g.FHNR,
                g.txtCenter,
                g.colorBlack,
                g.mt10,
                GlobalInclude.AppStyle.transform,
              ]}>
              {`Participant ${i + 1}`}
            </Text> */}
            <Text
              style={[
                g.fs14,
                g.FHNB,
                g.txtCenter,
                g.colorBlue,
                g.mt5,
                GlobalInclude.AppStyle.transform,
                styles.userNameCenter,
              ]}
              numberOfLines={2}>
              {item.name && item.name !== undefined && item.name !== null
                ? item.name
                : 'N/A'}
            </Text>
            <Text
              style={[
                g.fs14,
                g.FHNR,
                g.txtCenter,
                g.colorGray1,
                grid.alignItems,
                g.mt5,
              ]}>
              {item.batch && item.batch !== undefined && item.batch !== null
                ? item.batch
                : 'N/A'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
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
      {content.participants &&
      content.participants !== undefined &&
      content.participants !== null &&
      content.participants.length > 0 ? (
        <View style={grid.displayinlineBlock}>
          {showTaggedUsers(navigation, content.participants)}
        </View>
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
