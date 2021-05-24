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
import {showUser} from '../../../component/Common';

const {width} = Dimensions.get('window');

const showTaggedUsers = (navigation, users) => {
  let componentArray = [];

  for (let i = 0; i < users.length; i++) {
    let item = users[i];
    const component = (
      <View key={i}>
        {showUser(item.profilePic, item.name, item.batch, () => {
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
