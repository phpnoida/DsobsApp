import React from 'react';
import {Text, Dimensions} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Helper from '../helper/Helper';
import RadioButton from './RadioButton';
import {scale} from '../theme/Scalling';
import g from '../theme/global';
import grid from '../theme/grid';

const {height} = Dimensions.get('window');

const YearSelectionSheet = ({refRBSheet, title, onSelect}) => (
  <RBSheet
    ref={refRBSheet}
    height={height / 2}
    minClosingHeight={50}
    duration={350}
    closeOnDragDown={true}
    customStyles={{
      container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
      },
    }}>
    <Text style={[g.fs18, g.FHNB, g.txtCenter, g.colorBlack, g.mt5, g.mb15]}>
      {title}
    </Text>
    <RadioButton
      PROP={Helper.generateYearList(false, -1)}
      onRadioSelect={(value) => {
        onSelect(value);
      }}
    />
  </RBSheet>
);

export default YearSelectionSheet;
