import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import moment from 'moment';

const OtherDetails = ({content}) => {
  const isExist = (key) => {
    if (content !== undefined && content !== null) {
      if (content[key] !== undefined && content[key] !== null) {
        return content[key];
      }
    }
    return null;
  };

  const makeRow = (header, value) => {
    return (
      <View style={[grid.rowdir, g.mb2]}>
        <View style={[grid.col, grid.justifyContentCenter]}>
          <Text
            style={[
              g.colordarkGray,
              g.fs15,
              g.FHNM,
              grid.alignItems,
              grid.justifyContentCenter,
            ]}>
            {header}
          </Text>
        </View>
        <View style={{marginHorizontal: scale(1)}} />
        <View style={[g.inputWhite, grid.col]}>
          <Text
            style={[
              g.colorBlack,
              g.fs12,
              g.FHNM,
              grid.alignItems,
              grid.justifyContentCenter,
            ]}>
            {value}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{padding: scale(10), paddingBottom: scale(70)}}>
          <Text
            style={[
              g.colorBlue,
              g.fs15,
              g.FHNB,
              grid.alignItems,
              grid.justifyContentCenter,
              g.txtCenter,
            ]}>
            Job Details
          </Text>
          {makeRow(
            'Profession',
            isExist('profession') &&
              isExist('profession') !== null &&
              isExist('profession') !== undefined
              ? isExist('profession')
              : 'N/a',
          )}
          {makeRow(
            'Salary',
            isExist('annualSalary') &&
              isExist('annualSalary') !== null &&
              isExist('annualSalary') !== undefined
              ? isExist('annualSalary') + ' CTC'
              : 'N/a',
          )}
          {makeRow(
            'Positions',
            isExist('numOfPosition') &&
              isExist('numOfPosition') !== null &&
              isExist('numOfPosition') !== undefined
              ? isExist('numOfPosition') + ' Positions'
              : 'N/a',
          )}
          {makeRow(
            'Job Nature',
            isExist('nature') &&
              isExist('nature') !== null &&
              isExist('nature') !== undefined
              ? isExist('nature') + ' Position'
              : 'N/a',
          )}
          {makeRow(
            'Gender',
            isExist('nature') &&
              isExist('nature') !== null &&
              isExist('nature') !== undefined
              ? isExist('gender') === 0
                ? 'Male'
                : isExist('gender') === 1
                ? 'Female'
                : 'Any'
              : 'N/a',
          )}
          {makeRow(
            'Age Criteria',
            isExist('ageBracket') &&
              isExist('ageBracket') !== null &&
              isExist('ageBracket') !== undefined
              ? isExist('ageBracket').min +
                  '-' +
                  isExist('ageBracket').max +
                  ' Yrs'
              : 'N/a',
          )}
          {makeRow(
            'Posted On',
            isExist('postDate') &&
              isExist('postDate') !== null &&
              isExist('postDate') !== undefined
              ? moment(isExist('postDate')).format('DD, MMMM, YYYY')
              : 'N/a',
          )}
          <Text
            style={[
              g.colorBlue,
              g.fs15,
              g.FHNB,
              grid.alignItems,
              grid.justifyContentCenter,
              g.txtCenter,
            ]}>
            Location
          </Text>
          {makeRow(
            'City/Location',
            isExist('city') &&
              isExist('city') !== null &&
              isExist('city') !== undefined
              ? isExist('city')
              : 'N/a',
          )}
          {makeRow(
            'Country',
            isExist('country') &&
              isExist('country') !== null &&
              isExist('country') !== undefined
              ? isExist('country')
              : 'N/a',
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default OtherDetails;
