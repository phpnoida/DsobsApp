import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import g from '../theme/global';
import {scale} from '../theme/Scalling';
import grid from '../theme/grid';
import Helper from '../helper/Helper';
import ProgresImage from './ProgresImage';

const AutoSuggestUser = ({searchedUser, onPress, onLongPress}) => {
  const loadSuggestions = () => {
    var data = searchedUser.map((row, index) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          style={style.suggestionContainer}
          onLongPress={() => {
            if (onLongPress) {
              onLongPress(row, index);
            }
          }}
          onPress={() => {
            onPress(row, index);
          }}>
          <View
            style={{
              backgroundColor: '#323232',
              borderRadius: scale(10),
              height: scale(93),
            }}>
            {row.profileImg !== '' ? (
              <ProgresImage
                source={{uri: row.profileImg}}
                containerStyle={[
                  g.oh,
                  g.bglightGray,
                  {
                    width: '100%',
                    height: scale(93),
                    borderRadius: scale(10),
                  },
                ]}
                mode={'cover'}
              />
            ) : (
              <View />
            )}
          </View>
          <Text style={style.userName}>{Helper.concatName(row)}</Text>
          {row.batch ? (
            <Text style={[g.fs12, g.colorBlack, g.FHNR, {margin: scale(2)}]}>
              {row.batch}
            </Text>
          ) : null}
          {row.schoolNumber ? (
            <Text style={[g.fs12, g.colorBlack, g.FHNR, {margin: scale(2)}]}>
              {row.schoolNumber}
            </Text>
          ) : null}
          <View style={{flexDirection: 'row'}}>
            {row.house ? (
              <Text style={[g.fs12, g.colorBlack, g.FHNR, {margin: scale(2)}]}>
                {row.house.toLowerCase().charAt(0).toUpperCase() +
                  row.house.toLowerCase().slice(1)}
              </Text>
            ) : null}
            {row.section ? (
              <Text style={[g.fs12, g.colorBlack, g.FHNR, {margin: scale(2)}]}>
                {row.section}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      );
    });
    return data;
  };

  return (
    <View style={[g.AutoCompleteList1, g.p10]}>
      <Text style={[g.colordarkGray, g.fs12, g.FHNM, g.pb5]}>
        Search Suggestion:
      </Text>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {loadSuggestions()}
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  suggestionContainer: {
    width: scale(73),
    marginEnd: scale(10),
    marginTop: scale(6),
    marginBottom: scale(6),
  },
});

export default AutoSuggestUser;
