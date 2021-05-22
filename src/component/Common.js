import React from 'react';
import {View, Image, Text, TouchableOpacity, Dimensions} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import g from '../theme/global';
import {scale} from '../theme/Scalling';
import grid from '../theme/grid';
import CheckBoxIOS from 'react-native-check-box';
import ProgressImage from './ProgresImage';
import Helper from '../helper/Helper';
const {height, width} = Dimensions.get('window');

export const drawCheckbox = (title, checked, onClick) => {
  return (
    <View style={[grid.rowdir, grid.alignItems]}>
      <CheckBoxIOS
        checkBoxColor={GlobalInclude.Color.ColorPrimary}
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

export const showUser = (image, title, subTitle, onPress) => {
  return (
    <View
      style={[
        g.ml10,
        g.mb15,
        {
          width: width / 3 - 40,
          marginRight: 10,
          justifyContent: 'center',
          alignSelf: 'center',
        },
      ]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <View
          style={[
            g.bglightGray,
            g.oh,
            {
              borderRadius: 100,
              justifyContent: 'center',
              alignSelf: 'center',
            },
          ]}>
          <ProgressImage
            source={
              image !== undefined && image !== null && image !== ''
                ? {uri: image}
                : GlobalInclude.Assets.DefaultProfile
            }
            containerStyle={{
              aspectRatio: 1 / 1,
              height: scale(70),
              alignSelf: 'center',
              justifyContent: 'center',
            }}
            imageStyle={{
              aspectRatio: 1 / 1,
            }}
            mode={'cover'}
          />
        </View>
        <View style={{height: 65, width: 100}}>
          {title && title !== undefined && title !== null && title !== '' ? (
            <Text
              style={[g.fs14, g.FHNR, g.txtCenter, g.colorBlack, g.mt5, g.mb5]}
              numberOfLines={2}>
              {title}
            </Text>
          ) : null}

          {subTitle &&
          subTitle !== undefined &&
          subTitle !== null &&
          subTitle !== '' ? (
            <Text style={[g.fs14, g.FHNR, g.txtCenter, g.colorGray1]}>
              {subTitle}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};
