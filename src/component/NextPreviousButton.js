import React from 'react';
import {View, StyleSheet} from 'react-native';
import CommonButton from './CommonButton';
import CommonButtonGray from './CommonButtonGray';
import grid from '../theme/grid';
import {scale} from '../theme/Scalling';

const NextPreviousButton = (props) => {
  return (
    <View style={styles.buttonContainer}>
      <View style={grid.flex1}>
        <CommonButtonGray
          showLoader={props.isLoading}
          title={props.prviousTitle ? props.prviousTitle : 'Previous'}
          onPress={() => {
            props.onPreviuosTab();
          }}
        />
      </View>
      <View style={{marginHorizontal: scale(10)}} />
      <View style={grid.flex1}>
        <CommonButton
          showLoader={props.isLoading}
          title={props.nextTitle ? props.nextTitle : 'Save & Next'}
          onPress={() => {
            props.onSaveTab();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    paddingTop: scale(10),
    paddingBottom: scale(10),
  },
});

export default NextPreviousButton;
