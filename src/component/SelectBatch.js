import React from 'react';
import {Text, Dimensions} from 'react-native';
import Helper from '../helper/Helper';
import RBSheet from 'react-native-raw-bottom-sheet';
import RadioButton from '../component/RadioButton';
import g from '../theme/global';

let height = Dimensions.get('window').height;

const SelectBatch = (props) => {
  return (
    <RBSheet
      ref={(ref) => {
        props.batchSheet = ref;
      }}
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
        Select Batch
      </Text>
      <RadioButton
        PROP={Helper.generateYearList(false,-1)}
        onRadioSelect={(value) => {
          props.setSelectedBatch(value.text.toString());
          props.batchSheet.close();
        }}
      />
    </RBSheet>
  );
};

export default SelectBatch;
