import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';
import g from '../theme/global';
import grid from '../theme/grid';
import {IconType} from '../helper/Constants';

const SocialWorkSearch = ({changeText, filterQuery, onFilterPress}) => {
  return (
    <View>
      {/* search container */}
      <View style={[grid.rowdir, g.mb5, g.pt15]}>
        <View style={[g.br3, grid.col, g.mr5]}>
          <View style={[g.inputNew, grid.rowdir]}>
            <GlobalInclude.BaseIcon
              containerStyle={style.searchIcon}
              iconColor={'#dddddd'}
              iconName={'search'}
              iconSize={scale(20)}
              iconType={IconType[4]}
            />
            <TextInput
              value={filterQuery}
              underlineColorAndroid="transparent"
              style={[
                g.inputNew,
                g.pl0,
                g.fs18,
                grid.col,
                grid.justifyContentCenter,
              ]}
              autoCapitalize={'words'}
              placeholder={'Type more than 2 characters'}
              onChangeText={(text) => {
                changeText(text);
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onFilterPress()}
          style={[g.fliterBtnNew, grid.alignItems, grid.justifyContentCenter]}>
          <Image
            source={GlobalInclude.Assets.Filter}
            resizeMode="contain"
            style={{width: 16}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  searchIcon: {
    height: scale(20),
    width: scale(20),
    alignSelf: 'center',
    marginEnd: scale(6),
    marginStart: scale(6),
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
  filterText: {
    paddingTop: 12,
    paddingBottom: 12,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
});

export default SocialWorkSearch;
