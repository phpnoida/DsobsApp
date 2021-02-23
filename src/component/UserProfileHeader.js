import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import g from '../theme/global';
import grid from '../theme/grid';
import {scale} from '../theme/Scalling';

const UserProfileHeader = (props) => {
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
              <Text style={[g.colorLightGray, g.fs14, g.FHNR, g.mt5]}>{`${
                props.schoolNo
              } ${
                props.house.toLowerCase().charAt(0).toUpperCase() +
                props.house.toLowerCase().slice(1)
              } ${
                props.section.charAt(0).toUpperCase() + props.section.slice(1)
              } ${props.batch}`}</Text>
            ) : null}
          </View>
          {props.userId !== global.userId ? (
            <TouchableOpacity
              style={{height: scale(24), width: scale(24)}}
              activeOpacity={0.8}
              onPress={() => {
                Alert.alert('Coming soon.');
              }}>
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
        <Text style={[g.colorLightGray, g.fs14, g.FHNR, g.mt5]}>
          {props.city.charAt(0).toUpperCase() + props.city.slice(1)}
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
