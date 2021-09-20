import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import ProgressImage from '../../component/ProgresImage';
import Helpers from '../../helper/Helper';

const GroupMembers = ({groupData, onTap}) => {
  const [groupAdmin, setGroupAdmin] = useState([]);

  useEffect(() => {
    let adminArray = [];

    let superAdmin = groupData.superAdmins;
    superAdmin[0].isSuperAdmin = true;
    superAdmin[0].isAdmin = true;

    adminArray.push(superAdmin[0]);

    let admins = groupData.admins;

    admins.forEach(element => {
      element.isAdmin = true;
      adminArray.push(element);
    });

    setGroupAdmin(adminArray);

    return () => {};
  }, [groupData]);

  const showTaggedUsers = userTag => {
    let componentArray = [];
    for (let i = 0; i < userTag.length; i++) {
      let item = userTag[i];
      console.log('====================================');
      console.log('item', item);
      console.log('====================================');
      const component = (
        <View
          style={[
            i < userTag.length - 1 ? styles.bottomLine : {},
            g.mb5,
            g.ml5,
            g.mr5,
          ]}
          key={i}>
          <TouchableOpacity
            style={[grid.col]}
            activeOpacity={1}
            onPress={() => {
              onTap(item, i);
            }}>
            <View style={[grid.rowdir, g.mb5, grid.alignItems]}>
              <View
                style={[
                  {
                    height: scale(48),
                    width: scale(48),
                    borderRadius: scale(90),
                  },
                  grid.alignItems,
                  grid.justifyContentCenter,
                  g.mr10,
                ]}>
                {item.profileImg !== null &&
                item.profileImg !== undefined &&
                item.profileImg !== '' ? (
                  <ProgressImage
                    source={{uri: item.profileImg}}
                    containerStyle={{
                      aspectRatio: 1 / 1,
                      height: scale(48),
                      width: scale(48),
                      borderRadius: scale(90),
                    }}
                    imageStyle={{
                      aspectRatio: 1 / 1,
                      height: scale(48),
                      width: scale(48),
                      borderRadius: scale(90),
                    }}
                    mode={'cover'}
                  />
                ) : (
                  <View
                    style={[
                      {
                        height: scale(48),
                        width: scale(48),
                        borderRadius: scale(90),
                      },
                      g.bggray,
                      g.oh,
                      grid.alignItems,
                      grid.justifyContentCenter,
                    ]}>
                    <Text
                      style={[
                        g.fs28,
                        g.FHNM,
                        g.colorWhite,
                        GlobalInclude.AppStyle.transform,
                      ]}>
                      {item.firstName.charAt(0)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={grid.col}>
                <View style={[grid.rowdir]}>
                  <Text
                    style={[
                      g.colordarkGray,
                      g.fs14,
                      g.FHNR,
                      g.txtLeft,
                      grid.col,
                    ]}>
                    {Helpers.capitalize(Helpers.concatName(item))}
                  </Text>
                  {item.isAdmin && (
                    <Text style={[g.colordarkGray, g.fs14, g.FHNM, g.txtLeft]}>
                      Admin
                    </Text>
                  )}
                </View>

                <View style={[g.mt2, g.mb2]} />
                <Text style={[g.colordarkGray, g.fs14, g.FHNR, g.txtLeft]}>
                  Batch {item.batch}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );

      componentArray.push(component);
    }
    return componentArray;
  };

  return (
    <ScrollView
      style={[g.pl10, g.pr10, grid.flex1]}
      contentContainerStyle={g.pb30}
      showsVerticalScrollIndicator={false}>
      <View style={[g.mt10, g.mb10, g.pl5, g.pr5]}>
        <Text style={[g.colordarkGray, g.fs14, g.FHNR, g.txtLeft, g.mb5]}>
          Group Admin
        </Text>
        <View style={[g.ml5]}>
          {groupAdmin && groupAdmin.length > 0 && showTaggedUsers(groupAdmin)}
        </View>
        {groupData.users && groupData.users.length > 0 && (
          <>
            <Text style={[g.colordarkGray, g.fs14, g.FHNR, g.txtLeft]}>
              Group Member(s)
            </Text>
            <View style={[g.ml5]}>{showTaggedUsers(groupData.users)}</View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: scale(15),
    paddingBottom: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },

  bottomLine: {
    borderBottomColor: '#ebebe4',
    borderBottomWidth: 1,
  },
  userNameView: {
    justifyContent: 'flex-start',
    textAlign: 'left',
    fontSize: scale(10),
    color: '#333333',
    fontFamily: 'Lato-Regular',
    marginTop: scale(5),
  },
  removeUserContainer: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    borderRadius: scale(30),
  },
  userProfileContainer: {
    height: scale(65),
    width: '100%',
    borderRadius: scale(8),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  userProfileView: {
    height: scale(75),
    width: '100%',
    borderRadius: scale(8),
  },
  selectedUserContainer: {
    width: scale(60),
    marginEnd: scale(10),
    marginTop: scale(6),
    marginBottom: scale(6),
  },
  userProfiileView: {
    height: '100%',
    width: '100%',
    borderRadius: scale(6),
  },
});
export default GroupMembers;
