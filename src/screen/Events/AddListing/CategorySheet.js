import React from 'react';
import {Dimensions} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheetHeader from '../../../component/BottomSheetHeader';
import RadioButton from '../../../component/RadioButton';
import {scale} from '../../../theme/Scalling';

const {height} = Dimensions.get('window');

const CategorySheet = ({
  refRBSheet,
  dataList,
  searchProfession,
  selectedProfession,
  setSelectedProfession,
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
    <BottomSheetHeader
      title={'Select Nature'}
      showSearch={false}
      onSeachQuery={(query) => {
        searchProfession(query);
      }}
    />

    <RadioButton
      defaultSelected={selectedProfession}
      PROP={dataList}
      onRadioSelect={(value) => {
        setSelectedProfession(value.text.toString());
      }}
    />
  </RBSheet>
);

export default CategorySheet;
