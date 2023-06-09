import React from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import g from '../theme/global';
import grid from '../theme/grid';
import {scale} from '../theme/Scalling';

const UserProfileHeader = props => {
  const showLastSeen = timestamp => {
    let month_names = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    if (timestamp > 0) {
      console.log(timestamp);
      var dateVal = new Date(timestamp * 1000);
      var date = dateVal.getDate();
      var month = dateVal.getMonth();
      var year = dateVal.getFullYear();
      var hours = dateVal.getHours();
      var minutes = dateVal.getMinutes();
      var newformat = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12;
      hours = hours ? hours : 12;
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;

      return `Last seen: ${month_names[month]} ${date}, ${year}`;
    } else {
      return 'Not Logged In Yet';
    }
  };

  return (
    <View style={styles.headerContainer}>
      {props.profileImg !== '' ? (
        <Image
          style={{
            aspectRatio: 1 / 1,
            height: scale(90),
            width: scale(90),
            borderRadius: scale(90),
          }}
          resizeMode={'cover'}
          source={{uri: props.profileImg}}
        />
      ) : (
        <Image
          style={{height: scale(90), width: scale(90)}}
          resizeMode="cover"
          source={GlobalInclude.Assets.AppLogo}
        />
      )}
      <View style={[g.ml15, grid.col]}>
        <View style={[grid.rowrow, grid.justifyContent]}>
          <View style={[g.pr10, grid.col]}>
            <Text style={[g.colordarkGray, g.fs18, g.FHNB]} onPress={() => {}}>
              {props.firstName.trim()} {props.lastName.trim()}
            </Text>
            {props.batch ? (
              <Text
                style={[
                  g.colorLightGray,
                  g.fs14,
                  g.FHNR,
                  g.mt5,
                  GlobalInclude.AppStyle.transform,
                ]}>{`${props.schoolNo} ${props.house} ${props.section} ${props.batch}`}</Text>
            ) : null}
          </View>
          {props.userId !== global.userId ? (
            <TouchableOpacity
              style={{height: scale(24), width: scale(24)}}
              activeOpacity={0.8}
              onPress={() => props.checkChatStatus()}>
              <Image
                source={GlobalInclude.Assets.ChatBlue}
                resizeMode="contain"
                style={{height: scale(24), width: scale(24)}}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text style={[g.colorLightGray, g.fs14, g.FHNR, g.mt5]}>
          {props.profession}
        </Text>
        <Text
          style={[
            g.colorLightGray,
            g.fs14,
            g.FHNR,
            g.mt5,
            {textTransform: 'capitalize'},
          ]}>
          {props.city}
        </Text>
        <Text style={[g.colorLightGray, g.fs14, g.FHNR, g.mt5]}>
          {showLastSeen(props.lastseen)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: scale(15),
    paddingBottom: scale(10),
    flexDirection: 'row',
  },
});

export default UserProfileHeader;
