import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import g from '../../../../theme/global';
import grid from '../../../../theme/grid';
import {scale} from '../../../../theme/Scalling';
import RadioButton from '../../../../component/RadioButton';
import CommonButton from '../../../../component/CommonButton';
let itemArray = [
  {text: 'Send Notification on All New Posts', key: 1},
  {text: 'Every Hour', key: 2},
  {text: 'Every 2 Hours', key: 3},
  {text: 'Twice a day', key: 4},
  {text: 'Once a day', key: 5},
  {text: 'Send Notification', key: 6},
];

const GeneralPost = ({params}) => {
  const [categrories, setCategrories] = useState(itemArray);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [filterList, setFilterList] = useState(itemArray);

  return (
    <View style={[grid.flex1, g.pl10, g.pr10]}>
      <View style={grid.flex1}>
        <RadioButton
          defaultSelected={selectedFilter}
          PROP={filterList}
          onRadioSelect={(item) => {
            setSelectedFilter(item.text.toString());
          }}
        />
      </View>
      <View style={[styles.filterButton, g.mb10]}>
        <CommonButton showLoader={false} title={'Done'} onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
});

export default GeneralPost;
