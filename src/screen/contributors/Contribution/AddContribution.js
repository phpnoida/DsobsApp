import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
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
import {APP_NAME} from '../../../helper/Constants';
import CommonButton from '../../../component/CommonButton';
import CommonButtonGray from '../../../component/CommonButtonGray';
import _ from 'lodash';
import NumberFormat from 'react-number-format';
import {addUserContribution} from '../../../Actions/ContributionActions';
import {CommonActions} from '@react-navigation/native';

let responseMessage = '';
let contributeId = '';

const AddContribution = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [viewType] = useState(route?.params?.type ?? undefined);
  const [postData] = useState(route?.params?.request ?? undefined);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

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
    const fullName = `${global.userDetails.prefix} ${global.userDetails.firstName} ${global.userDetails.lastName}`;
    const address = global.userDetails.permanentAddress;

    setName(fullName);
    setAddress(address);

    return () => {};
  }, []);

  /****
   *
   * API Section
   *
   */

  const submitRequest = () => {
    setErrorMessage({});

    if (name.trim().length === 0) {
      setErrorMessage({fullName: 'This field is required'});
    } else if (address.trim().length === 0) {
      setErrorMessage({address: 'This field is required'});
    } else if (
      panNumber.trim() !== '' &&
      !Helper.validateRegex('[A-Z]{5}[0-9]{4}[A-Z]{1}', panNumber)
    ) {
      setErrorMessage({panNumber: 'Please enter valid pan number'});
    } else {
      // const index = _.findIndex(attributes, child => child.selected);
      // const showATG = attributes[index].selected;
      const request = {
        panNumber: panNumber,
        address: address,
        ATG: showPan,
      };

      const cloneData = JSON.parse(JSON.stringify(postData));
      const {_id} = cloneData;
      contributeId = _id;

      delete cloneData._id;
      delete cloneData.title;
      const merged = {...cloneData, ...request};

      console.log('Reqest', merged);

      if (global.isConnected) {
        setIsLoading(true);
        addUserContribution(
          _id,
          merged,
          response => {
            setIsLoading(false);
            if (response && response !== null) {
              if (
                response.data &&
                response.data !== undefined &&
                response.response !== null
              ) {
                let data = response.data;
                responseMessage = data.message;
                if (data.status) {
                  setShowSuccessModal(old => !old);
                } else {
                  setShowErrorModal(old => !old);
                }
              }
            }
          },
          (error, message) => {
            setIsLoading(false);
            responseMessage = message;
            setShowErrorModal(old => !old);
          },
        );
      }
    }
  };

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
          postData !== null && postData.indianCitizen
            ? 'Indian Citizens'
            : 'International Citizens'
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
                value={parseFloat(postData?.amount ?? 0)}
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
                  onPress={() => {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 1,
                        routes: [
                          {name: 'Dashboard'},
                          {name: 'ContributonsList'},
                          {
                            name: 'ContributonDetails',
                            params: {openLastPage: true, data: contributeId},
                          },
                        ],
                      }),
                    );
                  }}
                />
              </View>
              <View style={[g.ml5, g.mr5]} />
              <View style={grid.col}>
                <CommonButton
                  showLoader={false}
                  customStyle={{height: scale(45)}}
                  title={'Goto Home'}
                  onPress={() => {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 1,
                        routes: [
                          {name: 'Dashboard'},
                          {name: 'ContributonsList'},
                        ],
                      }),
                    );
                  }}
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
                {errorMessage.fullName && errorMessage.fullName.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.fullName}
                  </Text>
                )}
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
                  {errorMessage.panNumber &&
                    errorMessage.panNumber.length > 0 && (
                      <Text style={[g.errorMsg, g.pt5]}>
                        {errorMessage.panNumber}
                      </Text>
                    )}
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
                {errorMessage.address && errorMessage.address.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.address}
                  </Text>
                )}
              </View>
            </View>
            <View style={[g.mb10, g.ml15, g.mr15]}>
              <CommonButton
                showLoader={isLoading}
                title={'Contribute Now'}
                onPress={() => {
                  submitRequest();
                }}
              />
            </View>
          </ScrollView>
        )}

        {errorModal && (
          <GlobalInclude.ModalAlert
            status={errorModal}
            header={responseMessage}
            okButton={'Okay'}
            okAction={() => {
              setShowErrorModal(false);
            }}
            closeAction={() => {
              setShowErrorModal(false);
            }}
          />
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
