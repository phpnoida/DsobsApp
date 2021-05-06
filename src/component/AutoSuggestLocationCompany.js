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

const AutoSuggestLocationCompany = ({searchedData, onPress, onLongPress}) => {
  const loadSuggestions = () => {
    var data = searchedData.map((row, index) => {
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
              borderRadius: scale(93),
              width: scale(73),
              height: scale(73),
              alignItems: 'center',
              alignSelf: 'flex-start',
            }}
          />
          <Text style={style.userName} numberOfLines={2}>
            {row.label}
          </Text>
          <Text style={style.userName} numberOfLines={2}>
            {row.value}
          </Text>
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
  userName: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    textAlign: 'center',
    fontSize: scale(11),
    color: '#333333',
    fontFamily: 'Lato-Regular',
    marginTop: scale(5),
    textTransform: 'capitalize',
  },
});

export default AutoSuggestLocationCompany;
