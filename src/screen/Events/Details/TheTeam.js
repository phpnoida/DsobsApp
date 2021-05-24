import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {showUser} from '../../../component/Common';
import Helper from '../../../helper/Helper';

const showTaggedUsers = (navigation, users) => {
  let componentArray = [];

  for (let i = 0; i < users.length; i++) {
    let item = users[i];
    const component = (
      <View key={i}>
        {showUser(item.profileImg, item.name, item.batch, item.type, () => {
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

const TheTeam = ({content, navigation}) => {
  let userData = [];

  if (
    content.organizer &&
    content.organizer !== undefined &&
    content.organizer !== null
  ) {
    content.organizer.map((organizer) => {
      organizer.type = 'Organiser';
    });

    userData = userData.concat(content.organizer);
  }
  if (
    content.attendees &&
    content.attendees !== undefined &&
    content.attendees !== null
  ) {
    content.attendees.map((attendees) => {
      attendees.type = 'Attending';
    });
    userData = userData.concat(content.attendees);
  }

  return (
    <ScrollView
      style={[g.pl10, g.pr10, grid.flex1]}
      contentContainerStyle={g.pb30}
      showsVerticalScrollIndicator={false}>
      <View style={g.p5}>
        {userData &&
        userData !== undefined &&
        userData !== null &&
        userData.length > 0 ? (
          <View style={grid.displayinlineBlock}>
            {showTaggedUsers(navigation, userData)}
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
};

export default TheTeam;
