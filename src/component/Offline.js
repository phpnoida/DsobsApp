import React from 'react';
import {Text, View, Image} from 'react-native';

import g from '../theme/global';
import grid from '../theme/grid';
import GlobalInclude from '../globalInclude/Globalinclude';

const Offline = () => (
  <View
    style={[grid.rowdir, grid.alignItems, grid.justifyContentCenter, g.mh100]}>
    <View style={[g.bgWhite, g.p15]}>
      <Text style={[g.fs11, g.txtCenter]}>No Internet Connection.</Text>
      <View
        style={[
          grid.rowdir,
          grid.alignItems,
          grid.justifyContentCenter,
          g.pt20,
          g.pb20,
        ]}>
        <Image
          style={[{width: 100, height: 100}]}
          resizeMode="contain"
          source={GlobalInclude.Assets.NoNetwork}
        />
      </View>
      <Text style={[g.fs11, g.txtCenter]}>No internet connection found.</Text>
      <Text style={[g.fs11, g.txtCenter]}>Please check your connection.</Text>
    </View>
  </View>
);

export default Offline;
