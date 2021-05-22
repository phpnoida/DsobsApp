import React from 'react';
import {Text, View, Image} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonButton from '../../component/CommonButton';
import NumberFormat from 'react-number-format';

const TabSix = ({onSaveTab}) => {
  const listFee = (title, value, large) => {
    return (
      <View style={[g.mb5, grid.rowdir]}>
        <View
          style={[grid.flex1, {justifyContent: 'center', alignSelf: 'center'}]}>
          <Text
            style={{
              fontSize: scale(14),
              fontFamily: 'Lato-Bold',
              color: '#000000',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {title}
          </Text>
        </View>
        <View style={[grid.flex1, grid.justifyContentCenter]}>
          <NumberFormat
            value={value}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'₹'}
            decimalScale={2}
            fixedDecimalScale
            renderText={(formattedValue) => (
              <Text
                style={{
                  fontSize: large ? scale(20) : scale(16),
                  fontFamily: 'Lato-Bold',
                  color: large ? GlobalInclude.Color.ColorPrimary : '#000000',
                  marginBottom: scale(5),
                }}>
                {formattedValue}
              </Text>
            )}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15, g.pt20]}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        style={grid.flex1}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={g.pb30}>
          {listFee('Annual Listing Fee', 5000.0, false)}
          {listFee('GST (18%)', 480.0, false)}
          {listFee('Payable', 5480.0, true)}

          <Image
            source={GlobalInclude.Assets.AppLogo}
            resizeMode={'contain'}
            style={{
              height: '60%',
              width: '60%',
              alignSelf: 'center',
              justifyContent: 'center',
            }}
            resizeMethod={'auto'}
          />
        </View>
      </KeyboardAwareScrollView>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: scale(150),
          paddingTop: scale(10),
          paddingBottom: scale(10),
          alignContent: 'center',
          alignSelf: 'center',
        }}>
        <CommonButton
          showLoader={false}
          title={'Pay Now'}
          onPress={() => {
            onSaveTab();
          }}
        />
      </View>
    </View>
  );
};

export default TabSix;
