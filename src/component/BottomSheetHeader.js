import React from 'react';
import {Text, View, TextInput} from 'react-native';
import g from '../theme/global';
import grid from '../theme/grid';
import {scale} from '../theme/Scalling';
import Icons from 'react-native-vector-icons/FontAwesome';

const BottomSheetHeader = (props) => {
  return (
    <View style={g.mb15}>
      <Text style={[g.fs18, g.FHNB, g.txtCenter, g.colorBlack, g.mt5, g.mb15]}>
        {props.title}
      </Text>
      {props.showSearch && (
        <View style={[g.pl15, g.pr15]}>
          <View style={g.searchInputView}>
            <Icons name={'search'} color={'#dddddd'} size={scale(16)} />

            <TextInput
              maxLength={200}
              underlineColorAndroid="transparent"
              style={[grid.rowdir, g.fs16, g.ml5]}
              keyboardType="default"
              placeholder={'Search'}
              returnKeyType="search"
              onChangeText={(search) => props.onSeachQuery(search)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default BottomSheetHeader;
