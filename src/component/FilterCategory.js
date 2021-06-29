import React from 'react';
import {Dimensions, Text} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import RadioButton from './RadioButton';
import {scale} from '../theme/Scalling';
import g from '../theme/global';

const {height} = Dimensions.get('window');

const FilterCategory = ({
  refRBSheet,
  dataList,
  title,
  selectedFilter,
  setSelectedFilter,
  onClose,
}) => (
  <RBSheet
    ref={refRBSheet}
    height={height - 130}
    minClosingHeight={50}
    onClose={() => {
      if (onClose) {
        onClose();
      }
    }}
    duration={350}
    closeOnDragDown={true}
    customStyles={{
      container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingStart: scale(15),
        paddingEnd: scale(15),
        paddingBottom: scale(20),
      },
    }}>
    <Text style={[g.fs18, g.FHNB, g.txtCenter, g.colorBlack, g.mt10, g.mb10]}>
      {title}
    </Text>

    <RadioButton
      defaultSelected={selectedFilter}
      PROP={dataList}
      onRadioSelect={(item) => {
        setSelectedFilter(item.text.toString(), item);
      }}
    />
  </RBSheet>
);

export default FilterCategory;
