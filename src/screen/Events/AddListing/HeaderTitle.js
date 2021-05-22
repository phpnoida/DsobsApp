import React from 'react';
import {Text, View} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';

export const generateHeader = (title, required) => {
  return (
    <View style={[grid.rowdir, grid.alignItemsTop]}>
      <Text style={g.labeltext1}>{title}</Text>
      {required && <Text style={g.colorRed}>*</Text>}
    </View>
  );
};
