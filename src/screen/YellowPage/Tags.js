import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';

const Tags = ({content}) => (
  <ScrollView style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15]}>
    <View>
      {content.tags &&
      content.tags !== undefined &&
      content.tags !== null &&
      content.tags.length > 0 ? (
        <View style={grid.displayinlineBlock}>
          {content.tags.map((v, i) => {
            return (
              <TouchableOpacity
                key={i.toString()}
                style={{margin: scale(4)}}
                activeOpacity={1}>
                <View style={[g.tagStyle, grid.rowdir]}>
                  <Text style={[g.tagTxtStyle, g.mr10]}>{v}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={GlobalInclude.AppStyle.center}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            Currently No Data Uploaded!
          </Text>
        </View>
      )}
    </View>
  </ScrollView>
);

export default Tags;
