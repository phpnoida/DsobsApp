import React from 'react';
import {Dimensions} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheetHeader from './BottomSheetHeader';
import RadioButton from './RadioButton';
import {scale} from '../theme/Scalling';

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
    <BottomSheetHeader title={title} showSearch={false} />

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
