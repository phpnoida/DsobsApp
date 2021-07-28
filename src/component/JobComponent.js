import React, {PureComponent} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';
import g from '../theme/global';
import grid from '../theme/grid';
import ProgressImage from '../component/ProgresImage';

export default class JobComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  concateLocation = (item) => {
    let locationString = '';

    if (item.city !== undefined && item.city !== null && item.city !== '') {
      locationString += item.city + ', ';
    }

    if (
      item.country !== undefined &&
      item.country !== null &&
      item.country !== ''
    ) {
      locationString += item.country;
    }
    return locationString;
  };

  render() {
    const {
      item: {logo, status, title, forCompany},
      onTouchItem,
    } = this.props;
    return (
      <View>
        <TouchableOpacity
          onPress={onTouchItem}
          activeOpacity={1}
          style={{
            marginBottom: scale(15),
            marginHorizontal: scale(15),
          }}>
          <View
            style={[g.bgWhite, g.boxShadow, {borderRadius: scale(10)}, g.p10]}>
            <View style={grid.rowdir}>
              <ProgressImage
                source={
                  logo !== undefined && logo !== null && logo !== ''
                    ? {uri: logo}
                    : GlobalInclude.Assets.MainLogo
                }
                containerStyle={{
                  height: scale(65),
                  width: scale(65),
                  borderRadius: scale(10),
                }}
                imageStyle={{
                  height: scale(65),
                  width: scale(65),
                  borderRadius: scale(10),
                }}
                mode={'contain'}
              />
              <View style={[grid.col, g.ml5]}>
                <Text
                  numberOfLines={1}
                  style={[
                    g.txtRight,
                    status === 1 ? g.FHNB : g.FHNM,
                    g.fs13,
                    GlobalInclude.AppStyle.transform,
                    status === 1
                      ? g.colorBlue
                      : status === 2
                      ? g.colorGray
                      : g.colordarkGray,
                  ]}>
                  {status === 1 ? 'Open' : 'Closed'}
                </Text>
              </View>
            </View>
            <View style={g.mt5}>
              <Text
                numberOfLines={2}
                style={[
                  g.FHNM,
                  g.fs14,
                  g.colorBlack,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {title !== undefined && title !== null && title !== ''
                  ? title
                  : 'N/A'}
              </Text>

              <Text
                numberOfLines={1}
                style={[
                  g.FHNM,
                  g.fs14,
                  g.colorGray,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {forCompany !== undefined &&
                forCompany !== null &&
                forCompany !== ''
                  ? forCompany
                  : 'N/A'}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  g.FHNM,
                  g.fs14,
                  g.colorGray,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {this.concateLocation(this.props.item)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
