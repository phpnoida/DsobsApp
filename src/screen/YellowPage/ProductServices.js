import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';

const ProductServices = ({params}) => (
  <ScrollView
    style={[g.pl15, g.pr15, grid.flex1]}
    showsVerticalScrollIndicator={false}>
    <View style={[grid.rowdir, grid.alignItems, g.mt5, g.mb5]}>
      <Text
        style={{
          fontSize: scale(16),
          fontFamily: 'Lato-Bold',
          color: '#333333',
          fontWeight: 'bold',
          lineHeight: 18,
        }}>
        Services Offered
      </Text>
      <View
        style={{
          height: 1,
          width: scale(60),
          backgroundColor: '#333333',
          justifyContent: 'center',
          alignSelf: 'center',
          marginStart: scale(6),
        }}
      />
    </View>
    <Text
      style={[g.fs16, g.mt5, g.ml5, g.FHNR, g.colorBlack, grid.justifyContent]}>
      In publishing and graphic design, Lorem ipsum is a placeholder text
      commonly used to demonstrate the visual form of a document or a typeface
      without relying on meaningful content. In publishing and graphic design,
      Lorem ipsum is a placeholder text commonly used to demonstrate the visual
      form of a document or a typeface without relying on meaningful content. In
      publishing and graphic design, Lorem ipsum is a placeholder text commonly
      used to demonstrate the visual form of a document or a typeface without
      relying on meaningful content
    </Text>
  </ScrollView>
);

export default ProductServices;
