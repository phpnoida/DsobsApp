import React from 'react';
import {
  Text,
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import g from '../theme/global';
import grid from '../theme/grid';
import CommonButton from './CommonButton';
import {scale} from '../theme/Scalling';

const {height} = Dimensions.get('window');

const CategoryFilterSheet = ({
  refRBSheet,
  title,
  buttonText,
  dataList,
  onSelect,
  onPress,
  onClose,
}) => (
  <RBSheet
    ref={refRBSheet}
    height={height / 2 + 70}
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
        padding: 20,
      },
    }}>
    <Text
      style={[g.mt15, g.colorBlue, g.fs18, g.FHNB, styles.filterText, g.mb15]}>
      {title}
    </Text>

    <View style={grid.flex1}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {dataList.map((item, index) => {
          return (
            <View key={index}>
              <TouchableOpacity
                activeOpacity={1}
                style={[
                  g.mb15,
                  grid.rowdir,
                  grid.alignItems,
                  grid.justifyContent,
                ]}
                onPress={() => {
                  onPress(item, index);
                }}>
                <Text
                  style={[
                    g.fs15,
                    g.FHNB,
                    g.colorBlack,
                    item.isSelected ? g.colorBlue : g.colorGray5,
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>

    <View style={styles.filterButton}>
      <CommonButton
        showLoader={false}
        title={buttonText}
        onPress={() => {
          onSelect();
        }}
      />
    </View>
  </RBSheet>
);
const styles = StyleSheet.create({
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
  filterText: {
    paddingTop: 12,
    paddingBottom: 12,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
  },
});
export default CategoryFilterSheet;
