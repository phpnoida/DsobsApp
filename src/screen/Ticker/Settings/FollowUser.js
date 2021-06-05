import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {scale} from '../../../theme/Scalling';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {IconType} from '../../../helper/Constants';
import AutoSuggestUser from '../../../component/AutoSuggestUser';
import ProgressImage from '../../../component/ProgresImage';
import CommonButton from '../../../component/CommonButton';

let searchVal = '';

let itemArray = [
  {title: 'Name-1', key: 1},
  {title: 'Name-2', key: 1},
  {title: 'Name-3', key: 1},
  {title: 'Name-4', key: 1},
  {title: 'Name-5', key: 1},
  {title: 'Name-6', key: 1},
];

const FollowUser = ({params}) => {
  const [searchedUser, setSearchedUser] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(itemArray);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [removeFollowing, setRemoveFollowing] = useState(false);
  const [showNoFollowing, setShowNoFollowing] = useState(false);

  const removeUser = (index) => {
    let oldData = selectedUsers;
    oldData.splice(index, 1);
    setSelectedUsers([...oldData]);

    if (oldData.length === 0) {
      setShowNoFollowing(true);
    }
  };

  const showFollowing = (index, item) => {
    return (
      <View style={[grid.rowdir, g.p10, g.pl5, g.pr5]}>
        <TouchableOpacity style={[grid.row]} activeOpacity={0.9}>
          <View
            style={[
              g.mr10,
              g.bggray,
              g.oh,
              {
                width: scale(40),
                height: scale(40),
                borderRadius: scale(50),
              },
            ]}>
            <ProgressImage
              source={GlobalInclude.Assets.DefaultProfile}
              containerStyle={styles.imageStyle}
              mode={'cover'}
            />
          </View>
          <View style={[grid.justifyContentCenter]}>
            <Text style={[g.fs15, g.FHNM, g.colorBlue]}>
              {item.title} - 1994
            </Text>
            <Text
              style={[
                g.fs14,
                g.FHNR,
                g.colorBlack,
                grid.justifyContentCenter,
                grid.alignItems,
                g.txtCenterVertical,
                g.mt5,
              ]}>
              Batch - 1994
            </Text>
          </View>
        </TouchableOpacity>

        {removeFollowing && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              removeUser(index);
            }}
            style={[g.mr7, grid.justifyContentCenter, grid.alignItems]}>
            <GlobalInclude.BaseIcon
              containerStyle={{height: scale(22), width: scale(22)}}
              iconColor={GlobalInclude.Color.ColorPrimary}
              iconName={'remove-user'}
              iconSize={scale(22)}
              iconType={IconType[9]}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[grid.flex1, g.pl10, g.pr10]}>
      {showNoFollowing ? (
        <View style={GlobalInclude.AppStyle.fillCenter}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            You Don't have any followed users start following user by click on
            follow button
          </Text>
          <View style={[styles.filterButton, g.mt10]}>
            <CommonButton
              showLoader={false}
              title={'Follow'}
              onPress={() => {
                setSelectedUsers(itemArray);
                setShowNoFollowing(false);
              }}
            />
          </View>
        </View>
      ) : (
        <View style={[grid.flex1]}>
          <View style={g.mb15}>
            <View style={[grid.rowdir, grid.alignItemsTop]}>
              <Text style={g.labeltext1}>Search User</Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={[g.inputWhite]}
              autoCapitalize={'words'}
              value={searchUserQuery}
              placeholder={'Search user here'}
              onChangeText={(value) => {
                searchVal = value;
                setSearchUserQuery(value);
                // if (value.length > 0) {
                //   doSearchUser(value);
                // } else {
                //   setSearchedUser([]);
                // }
              }}
            />
          </View>
          {searchedUser.length > 0 && (
            <AutoSuggestUser
              searchedUser={searchedUser}
              onPress={(row, index) => {
                let oldData = selectedUsers;
                if (oldData.length < 3) {
                  searchVal = '';
                  oldData.push(row);
                  setSearchUserQuery('');
                  setSelectedUsers([...oldData]);
                  setSearchedUser([]);
                }
              }}
            />
          )}

          <View style={grid.flex1}>
            <ScrollView>
              <View style={[g.mt10]}>
                {selectedUsers.map((item, index) => {
                  return <View>{showFollowing(index, item)}</View>;
                })}
              </View>
            </ScrollView>
          </View>
          {selectedUsers.length > 0 && (
            <View style={[styles.filterButton, g.mb10]}>
              <CommonButton
                showLoader={false}
                title={removeFollowing ? 'Done' : 'Remove User'}
                onPress={() => {
                  setRemoveFollowing(!removeFollowing);
                }}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    width: scale(40),
    justifyContent: 'center',
  },
  fitImage: {
    borderRadius: scale(10),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
});

export default FollowUser;
