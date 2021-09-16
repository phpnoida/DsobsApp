import React, {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import ProgressImage from '../../component/ProgresImage';

const BatchGroups = ({content}) => {
  const [postData, setPostData] = useState([
    {
      title: 'The Teenage Mutant Ninja Turtles',
      info: 'Lorem ipsum may be used as a placeholder before final copy is available',
      members: Math.floor(Math.random() * 100),
      newPost: Math.floor(Math.random() * (60 - 0 + 1)) + 0,
      groupImage: `https://source.unsplash.com/random/${new Date()}`,
    },
    {
      title: 'Turtley Awesome Crew',
      info: 'Lorem ipsum may be used as a placeholder before final copy is available',
      members: Math.floor(Math.random() * 100),
      newPost: Math.floor(Math.random() * (60 - 0 + 1)) + 0,
      groupImage: `https://source.unsplash.com/random/${new Date().getTime()}`,
    },
  ]);

  const renderGroupItem = ({item, index}) => {
    return (
      <View key={index}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{
            marginBottom: scale(15),
          }}>
          <View style={[g.bgWhite, g.boxShadow, {borderRadius: scale(10)}]}>
            <View style={[g.bggray3, style.backgroundBorder]}>
              <View style={style.imageStyle}>
                <ProgressImage
                  source={{
                    uri: item.groupImage,
                  }}
                  containerStyle={style.coverImage}
                  imageStyle={style.coverImage}
                  mode={'cover'}
                />
                {item.newPost > 0 && (
                  <View style={style.newPostContainer}>
                    <Text
                      numberOfLines={1}
                      style={[
                        g.FHNB,
                        g.fs20,
                        g.colorWhite,
                        GlobalInclude.AppStyle.transform,
                      ]}>
                      {item.newPost.toString()}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        g.FHNB,
                        g.fs16,
                        g.colorWhite,
                        GlobalInclude.AppStyle.transform,
                      ]}>
                      New
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={g.p10}>
              <Text
                numberOfLines={1}
                style={[
                  g.FHNB,
                  g.fs18,
                  g.colorBlue,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {item.title}
              </Text>
              <Text
                style={[
                  g.fs14,
                  g.mt5,
                  g.FHNR,
                  GlobalInclude.AppStyle.transform,
                  g.colorGray,
                ]}
                numberOfLines={2}>
                {item.info}
              </Text>
              <Text
                style={[g.fs16, g.mt5, g.FHNM, g.colordarkGray]}
                numberOfLines={1}>
                {item.members} Member(s)
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={false}
        extraData={postData}
        data={postData}
        onEndReachedThreshold={0.1}
        renderItem={renderGroupItem}
        contentContainerStyle={{
          paddingStart: scale(15),
          paddingEnd: scale(15),
          paddingBottom: scale(200),
        }}
        bounces={false}
        keyExtractor={(v, i) => i.toString()}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const style = StyleSheet.create({
  imageStyle: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: scale(10),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  coverImage: {height: '100%', width: '100%'},
  grayColorText: {color: '#bababa'},
  backgroundBorder: {
    borderRadius: scale(10),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  newPostContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(62,62,62,0.6)',
    paddingHorizontal: scale(13),
    paddingVertical: scale(7),
    ...grid.alignItems,
    ...grid.justifyContentCenter,
  },
});

export default BatchGroups;
