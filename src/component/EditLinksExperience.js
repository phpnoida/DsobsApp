import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';

import g from '../theme/global';
import grid from '../theme/grid';
import {scale} from '../theme/Scalling';
import {IconType} from '../helper/Constants';
import GlobalInclude from '../globalInclude/Globalinclude';

const EditLinksExperience = (props) => {
  console.log('====================================');
  console.log(props);
  console.log('====================================');
  return (
    <TouchableOpacity activeOpacity={1}>
      <View
        style={[
          g.mt10,
          {borderTopWidth: 1, borderTopColor: '#cccccc', paddingTop: scale(10)},
        ]}>
        <View style={[grid.col, g.pr10]}>
          {props.mainTitle && props.mainTitle !== '' ? (
            <Text style={styles.menuHeader}>{props.mainTitle}</Text>
          ) : null}
          {props.header && props.header !== '' ? (
            <View>
              <View style={{margin: scale(1)}} />
              <Text style={styles.menuTitle}>{props.header}</Text>
            </View>
          ) : null}

          {props.subHeader && props.subHeader !== '' ? (
            <View>
              <View style={{margin: scale(1)}} />
              <Text style={styles.menuTitle}>{props.subHeader}</Text>
            </View>
          ) : null}

          {props.description && props.description !== '' && (
            <View>
              <View style={{margin: scale(1)}} />
              <Text style={styles.menuTitle}>{props.description}</Text>
            </View>
          )}
          {props.image && props.image !== '' ? (
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: '#b2b2b2',
                width: scale(36),
                height: scale(24),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: scale(3),
              }}
              onPress={() => {
                props.onImagePress();
              }}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(20), width: scale(20)}}
                iconColor={'#fff'}
                iconName={'file-image-o'}
                iconSize={scale(20)}
                iconType={IconType[4]}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.optionContainer}>
          <View style={grid.rowdir}>
            <Text
              style={[g.btn, grid.col, g.bggray5, g.mr5]}
              onPress={() => {
                props.onDeletePress();
              }}>
              Delete
            </Text>
            <Text
              style={[g.btn, grid.col, g.bggray5]}
              onPress={() => {
                props.onEditPress();
              }}>
              Edit
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuTitle: {
    color: '#bababa',
    fontSize: scale(13),
    fontFamily: 'Lato-Regular',
    textAlign: 'left',
  },
  menuHeader: {
    color: 'black',
    fontSize: scale(13),
    fontFamily: 'Lato-Bold',
    textAlign: 'left',
  },
  optionContainer: {
    width: scale(140),
    alignSelf: 'flex-end',
    padding: scale(5),
  },
});

export default EditLinksExperience;
