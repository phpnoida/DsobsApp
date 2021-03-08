import React from 'react';
import {Text, View, TouchableOpacity, Linking, StyleSheet} from 'react-native';
import g from '../theme/global';
import grid from '../theme/grid';
import GlobalInclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';
import {IconType} from '../helper/Constants';

/**
 * Here this component is use for work experience in Professional, Training tab and in relation tab.
 * this is common component pass parameters and main title is used for relation tab
 */

const WorkExperience = (props) => {
  return (
    <TouchableOpacity
      key={props.indexName}
      activeOpacity={1}
      onPress={() => {}}
      style={[g.boxShadow, g.bgWhite, g.br3, g.mb5, g.p15]}>
      <View style={[grid.rowdir, grid.alignItems]}>
        <View style={grid.col}>
          {props.mainTitle && (
            <Text style={styles.menuHeader}>{props.mainTitle}</Text>
          )}
          <View style={{marginTop: scale(2)}} />
          <Text style={styles.menuTitle}>{props.header}</Text>
          <View style={{margin: scale(1)}} />
          <Text style={styles.menuTitle}>{props.subHeader}</Text>
          <View style={{margin: scale(1)}} />
          <Text style={styles.menuTitle}>{props.description}</Text>
        </View>
        <View
          style={[grid.rowrow, grid.justifyContentRight, grid.alignItemsTop]}>
          {props.video ? (
            <TouchableOpacity
              activeOpacity={1}
              style={[g.iconstyle1, g.mr5, {aspectRatio: 1 / 1}]}
              onPress={() => {}}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(20), width: scale(20)}}
                iconColor={'#fff'}
                iconName={'play-circle'}
                iconSize={scale(20)}
                iconType={IconType[4]}
              />
            </TouchableOpacity>
          ) : null}
          {props.link ? (
            <TouchableOpacity
              activeOpacity={1}
              style={[g.iconstyle1, g.mr5, {aspectRatio: 1 / 1}]}
              onPress={() => Linking.openURL(props.link)}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(20), width: scale(20)}}
                iconColor={'#fff'}
                iconName={'link'}
                iconSize={scale(20)}
                iconType={IconType[4]}
              />
            </TouchableOpacity>
          ) : null}
          {props.image ? (
            <TouchableOpacity
              activeOpacity={1}
              style={[g.iconstyle1, {aspectRatio: 1 / 1}]}
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
    color: '#333333',
    fontSize: scale(13),
    fontFamily: 'Lato-Bold',
    textAlign: 'left',
  },
});

export default WorkExperience;
