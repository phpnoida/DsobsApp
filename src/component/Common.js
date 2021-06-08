import React from 'react';
import {View, Image, Text, TouchableOpacity, Dimensions} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import g from '../theme/global';
import {scale} from '../theme/Scalling';
import grid from '../theme/grid';
import CheckBoxIOS from 'react-native-check-box';
import ProgressImage from './ProgresImage';
import Radio from './Radio';
import Helper from '../helper/Helper';
import {IconType} from '../helper/Constants';
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
    <View style={GlobalInclude.AppStyle.fillCenter}>
      <Text
        style={[
          g.colorBlack,
          g.FHNM,
          g.fs12,
          g.textCenter,
          grid.alignItems,
          grid.justifyContentCenter,
        ]}>
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

export const showUser = (image, title, subTitle, extraTitle, onPress) => {
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
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
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
        <View style={{minHeight: 65, flex: 1}}>
          <Text
            style={[g.fs14, g.FHNM, g.txtLeft, g.colorBlack]}
            numberOfLines={2}>
            {title && title !== undefined && title !== null && title !== ''
              ? title
              : ''}
          </Text>
          <View style={{marginVertical: scale(2)}} />
          <Text
            style={[
              g.fs12,
              g.FHNR,
              g.txtLeft,
              g.colorGray1,
              grid.alignItems,
              grid.justifyContentCenter,
            ]}>
            {subTitle &&
            subTitle !== undefined &&
            subTitle !== null &&
            subTitle !== ''
              ? subTitle
              : ''}
          </Text>
          <View style={{marginVertical: scale(2)}} />
          {extraTitle &&
          extraTitle !== undefined &&
          extraTitle !== null &&
          extraTitle !== '' ? (
            <Text
              style={[
                g.fs12,
                g.FHNR,
                g.txtLeft,
                grid.alignItems,
                grid.justifyContentCenter,
                g.colorGray1,
              ]}>
              {extraTitle}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const renderRadioButton = (radioObj, onSelect) => {
  return radioObj.map((item, key) => {
    return (
      <View
        key={key}
        style={{
          marginEnd: scale(8),
          marginStart: scale(2),
          alignSelf: 'center',
        }}>
        <Radio
          item={item}
          title={item.label}
          onRadioSelect={onSelect}
          selected={item.selected}
          radioStyle={{
            height: scale(15),
            width: scale(15),
            borderRadius: 100,
            borderWidth: scale(1.5),
            borderColor: GlobalInclude.Color.ColorPrimary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: scale(3),
          }}
          selectedStyle={{
            height: scale(6),
            width: scale(6),
            borderRadius: scale(30),
            backgroundColor: GlobalInclude.Color.ColorPrimary,
          }}
        />
      </View>
    );
  });
};

export const generateMenuOption = (menuTitle, icon, type, onPress) => {
  return (
    <View
      style={[
        g.bb1,
        {borderBottomColor: '#e5e5e5', padding: 15, paddingLeft: 0},
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        style={[grid.rowdir, grid.alignItems]}
        onPress={onPress}>
        <GlobalInclude.BaseIcon
          containerStyle={{height: scale(20), width: scale(20)}}
          iconColor={GlobalInclude.Color.ColorPrimary}
          iconName={icon}
          iconSize={scale(20)}
          iconType={IconType[type]}
        />
        <Text style={[{marginLeft: 15, fontSize: 16}, g.FHNR, g.colordarkGray]}>
          {menuTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const generateHeader = (title, required) => {
  return (
    <View style={[grid.rowdir, grid.alignItemsTop]}>
      <Text style={g.labeltext1}>{title}</Text>
      {required && <Text style={g.colorRed}>*</Text>}
    </View>
  );
};