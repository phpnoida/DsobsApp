import React from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import g from '../theme/global';
import grid from '../theme/grid';
import CheckBoxIOS from 'react-native-check-box';

export const drawCheckbox = (title, checked, onClick) => {
  return (
    <View style={[grid.rowdir, grid.alignItems]}>
      <CheckBoxIOS
        checkBoxColor={'#2b3252'}
        style={[g.mr2, g.br3, {maxWidth: 23, height: 20}]}
        onClick={() => {
          onClick();
        }}
        isChecked={checked}
        checkedImage={
          <Image
            source={GlobalInclude.Assets.CheckboxChecked}
            style={{maxWidth: 20, height: 20}}
          />
        }
        unCheckedImage={
          <Image
            source={GlobalInclude.Assets.CheckboxDefault}
            style={{maxWidth: 20, height: 20}}
          />
        }
      />
      <Text style={[g.colordarkGray, g.FHNR, grid.col, g.fs12]}>{title}</Text>
    </View>
  );
};

export const renderNoDataComponent = () => {
  return (
    <View style={GlobalInclude.AppStyle.center}>
      <Text style={[g.colorBlack, g.FHNM, g.fs12, g.textCenter]}>
        No Record Found
      </Text>
    </View>
  );
};

export const uploadMediaButton = (onPress) => {
  return (
    <TouchableOpacity style={grid.rowdir} onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          g.bglightGray,
          grid.col,
          g.mr10,
          {padding: 15, borderRadius: 10},
        ]}>
        <Text style={[g.fs16, g.FHNR, g.colorLightGray]}>Upload Media</Text>
      </View>
      <View
        style={[
          g.p15,
          g.bglightGray,
          {
            width: 50,
            height: 50,
            borderRadius: 10,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
        <Image
          source={GlobalInclude.Assets.UploadIcon}
          resizeMode="contain"
          style={[g.w20, {height: 23}, grid.justifyContent, grid.alignItems]}
        />
      </View>
    </TouchableOpacity>
  );
};
