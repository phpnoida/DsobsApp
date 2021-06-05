import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import g from '../../../../theme/global';
import grid from '../../../../theme/grid';
import {scale} from '../../../../theme/Scalling';
import RadioButton from '../../../../component/RadioButton';
import CommonButton from '../../../../component/CommonButton';

let itemArray = [
  {text: 'Send Notification on All Comments', key: 1},
  {text: 'Twice a day', key: 2},
  {text: 'Once a day', key: 3},
  {text: 'Send no Notification', key: 4},
];

const MyPost = ({params}) => {
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

export default MyPost;
