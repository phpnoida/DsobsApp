import React from 'react';
import {View, Image, Text} from 'react-native';
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
