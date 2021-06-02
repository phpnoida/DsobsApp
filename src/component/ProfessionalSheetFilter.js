import React from 'react';
import {Dimensions} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheetHeader from './BottomSheetHeader';
import RadioButton from './RadioButton';
import {scale} from '../theme/Scalling';

const {height} = Dimensions.get('window');

const ProfessionalSheetFilter = ({
  refRBSheet,
  dataList,
  searchProfession,
  selectedProfession,
  setSelectedProfession,
  onClose,
}) => (
  <RBSheet
    ref={refRBSheet}
    height={height - 150}
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
      title={'Select Profession'}
      showSearch={true}
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

export default ProfessionalSheetFilter;
