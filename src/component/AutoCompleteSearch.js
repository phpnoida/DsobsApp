import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
  Linking,
} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';
import g from '../theme/global';
import grid from '../theme/grid';
import {IconType, APP_NAME, URL_REGX} from '../helper/Constants';

const {height, width} = Dimensions.get('window');
const tablet = width >= 768;

const AutoCompleteSearch = ({params}) => {
  const drawCheckbox = (title, checked, onClick) => {
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

  return (
    <View>
      <View style={[grid.rowdir, grid.alignItems, g.mt10]}>
        <Text style={[g.fs16, g.FHNR, g.colordarkGray, grid.col]}>
          {'Search By'}
        </Text>
      </View>
      {/* search container */}

      <View
        style={[
          grid.rowdir,
          grid.alignItems,
          g.mt10,
          g.mb10,
          tablet && g.pt10,
        ]}>
        <View
          style={{
            width: scale(120),
          }}>
          {drawCheckbox('Name/Batch/House/Number', false, () => {})}
        </View>
        <View
          style={{
            width: scale(75),
            marginStart: scale(3),
            marginEnd: scale(3),
          }}>
          {drawCheckbox('Album', false, () => {})}
        </View>
        <View
          style={{
            width: scale(65),
          }}>
          {drawCheckbox('Year', false, () => {})}
        </View>
        <View style={[grid.col, {marginStart: scale(3)}]}>
          {drawCheckbox('Tags', false, () => {})}
        </View>
      </View>
    </View>
  );
};

export default AutoCompleteSearch;
