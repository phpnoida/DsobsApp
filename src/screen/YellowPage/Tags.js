import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';

const Tags = ({productTags}) => (
  <ScrollView style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15]}>
    <View style={grid.displayinlineBlock}>
      {productTags.map((v, i) => {
        return (
          <TouchableOpacity
            key={i.toString()}
            onLongPress={() => {
              selectedIndex = i;
              setShowRemoveAlert(true);
            }}
            style={{margin: scale(4)}}
            activeOpacity={1}>
            <View style={[g.tagStyle, grid.rowdir]}>
              <Text style={[g.tagTxtStyle, g.mr10]}>{v}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  </ScrollView>
);

export default Tags;
