import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Text,
  ScrollView,
} from 'react-native';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import {IconType} from '../../../helper/Constants';
import {generateHeader} from '../../../component/Common';
import Radio from '../../../component/Radio';
import HeaderBar from '../../../component/HeaderBar';
import Helper from '../../../helper/Helper';
import {APP_NAME, URL_REGX} from '../../../helper/Constants';
import CommonButton from '../../../component/CommonButton';
import CommonButtonGray from '../../../component/CommonButtonGray';
import _ from 'lodash';
import NumberFormat from 'react-number-format';

let postData = {};

const AddContribution = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [viewType] = useState(route?.params?.type ?? undefined);
  const [postData] = useState(route?.params?.data ?? undefined);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [name, setName] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [address, setAddress] = useState('');
  const [showPan, setShowPan] = useState(true);
  const [attributes, setAttributes] = useState([
    {
      key: '1',
      label: 'ATG Certificate for Income Tax Rebate',
      selected: true,
    },
    {
      key: '2',
      label: "I don't need an ATG Certificate",
      selected: false,
    },
  ]);

  useEffect(() => {
    
    return () => {};
  }, []);

  /****
   *
   * API Section
   *
   */

  /****
   *
   * API Section
   *
   */

  const renderRadioButton = radioObj => {
    return radioObj.map((item, key) => {
      return (
        <View key={key} style={style.radioStyle}>
          <Radio
            item={item}
            title={item.label}
            onRadioSelect={value => {
              let oldData = attributes;
              oldData.forEach(element => {
                element.selected = false;
              });
              const index = _.findIndex(
                oldData,
                child => child.key === value.key,
              );
              oldData[index].selected = true;
              setShowPan(value.key === '1' ? true : false);
              setAttributes([...oldData]);
            }}
            selected={item.selected}
            radioStyle={style.radioCircle}
            selectedStyle={style.selectedRb}
          />
        </View>
      );
    });
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar
        title={
          postData !== null &&
          postData.title &&
          postData.title !== undefined &&
          postData.title !== null
            ? postData.title
            : APP_NAME
        }
        navigation={navigation}
        customIcon={{
          containerStyle: {height: scale(30), width: scale(30)},
          iconColor: GlobalInclude.Color.ColorPrimary,
          iconName: 'keyboard-backspace',
          size: scale(30),
          type: IconType[1],
        }}
        customIconPress={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
        {showSuccessModal ? (
          <View style={[grid.col, g.ml15, g.mr15]}>
            <View
              style={[
                grid.col,
                grid.alignItems,
                grid.justifyContentCenter,
                g.ml15,
                g.mr15,
              ]}>
              <Text
                style={[
                  g.fs24,
                  g.FHNB,
                  GlobalInclude.AppStyle.transform,
                  g.colorGray,
                  g.txtCenter,
                  g.txtCenterVertical,
                ]}>
                Thank You!
              </Text>
              <Text
                style={[
                  g.fs18,
                  g.FHNR,
                  g.colordarkGray,
                  g.txtCenter,
                  g.txtCenterVertical,
                  g.mt10,
                ]}>
                We have successfully received
              </Text>
              <Text
                style={[
                  g.fs18,
                  g.FHNR,
                  g.colordarkGray,
                  g.txtCenter,
                  g.txtCenterVertical,
                ]}>
                your contribution of
              </Text>
              <NumberFormat
                value={2500}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'₹'}
                decimalScale={2}
                fixedDecimalScale
                renderText={formattedValue => (
                  <Text
                    style={[
                      g.fs20,
                      g.FHNB,
                      GlobalInclude.AppStyle.upper,
                      g.colorBlue,
                      g.mt5,
                      g.mb5,
                    ]}
                    numberOfLines={1}>
                    {formattedValue}
                  </Text>
                )}
              />
              <Text
                style={[
                  g.fs18,
                  g.FHNR,
                  g.colordarkGray,
                  g.txtCenter,
                  g.txtCenterVertical,
                ]}>
                towards
              </Text>
              <Text
                style={[
                  g.fs20,
                  g.FHNB,
                  g.colorBlue,
                  g.txtCenter,
                  g.txtCenterVertical,
                  g.mt5,
                ]}>
                {postData?.title ?? APP_NAME}
              </Text>
            </View>

            <View style={[grid.rowrow, g.mb10, grid.alignItems]}>
              <View style={grid.col}>
                <CommonButtonGray
                  showLoader={false}
                  customStyle={{height: scale(45)}}
                  title={'View Contributors'}
                  onPress={() => {}}
                />
              </View>
              <View style={[g.ml5, g.mr5]} />
              <View style={grid.col}>
                <CommonButton
                  showLoader={false}
                  customStyle={{height: scale(45)}}
                  title={'Goto Home'}
                  onPress={() => {}}
                />
              </View>
            </View>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={GlobalInclude.AppStyle.fill}
            contentContainerStyle={{flexGrow: 1}}>
            <View style={[GlobalInclude.AppStyle.fill, g.pl10, g.pr10, g.pt15]}>
              <Text
                style={[
                  g.fs18,
                  g.FHNM,
                  GlobalInclude.AppStyle.transform,
                  g.colorGray,
                  g.txtCenter,
                  g.txtCenterVertical,
                ]}>
                Please fill following details for our records
              </Text>

              {viewType === '2' ? (
                <View style={[g.mt10, g.mb15]}>
                  {renderRadioButton(attributes)}
                </View>
              ) : null}

              <View style={g.mb15}>
                {generateHeader('Name', false)}
                <TextInput
                  underlineColorAndroid="transparent"
                  style={[g.inputWhite]}
                  autoCapitalize="words"
                  placeholder="Enter your text here"
                  value={name}
                  onChangeText={value => setName(value)}
                />
              </View>

              {showPan && viewType === '2' && (
                <View style={g.mb15}>
                  {generateHeader('PAN Number', false)}
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={[g.inputWhite]}
                    autoCapitalize="words"
                    placeholder="Enter your text here"
                    value={panNumber}
                    onChangeText={value => setPanNumber(value)}
                  />
                </View>
              )}

              <View style={g.mb15}>
                {generateHeader('Address', false)}
                <TextInput
                  underlineColorAndroid="transparent"
                  numberOfLines={5}
                  multiline={true}
                  value={address}
                  style={[
                    g.inputWhite,
                    {height: 100, textAlignVertical: 'top'},
                  ]}
                  onChangeText={value => setAddress(value)}
                />
              </View>
            </View>
            <View style={[g.mb10, g.ml15, g.mr15]}>
              <CommonButton
                showLoader={false}
                title={'Contribute Now'}
                onPress={() => {}}
              />
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  radioCircle: {
    height: scale(15),
    width: scale(15),
    borderRadius: 100,
    borderWidth: scale(1.5),
    borderColor: GlobalInclude.Color.ColorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(3),
  },
  selectedRb: {
    height: scale(6),
    width: scale(6),
    borderRadius: scale(30),
    backgroundColor: GlobalInclude.Color.ColorPrimary,
  },
  radioStyle: {
    marginEnd: scale(8),
    marginStart: scale(2),
    marginBottom: scale(10),
  },
});

export default AddContribution;
