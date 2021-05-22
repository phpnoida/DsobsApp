import React, {useState} from 'react';
import {
  Text,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import g from '../theme/global';
import GlobalInclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';
import grid from '../theme/grid';
import {IconType} from '../helper/Constants';
import DatePicker from 'react-native-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CommonButton from './CommonButton';
import Helper from '../helper/Helper';

const windowWidth = Dimensions.get('window').width;

const DatePickerView = (props) => {
  const [date, setDate] = useState(new Date());
  return (
    <Modal
      animationType="slide"
      transparent={true}
      hardwareAccelerated={true}
      visible={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.headerView}>
            <Text style={[g.fs16, g.colorWhite, grid.col]}>
              {'Pick a date'}
            </Text>
            <View style={grid.justifyContentRight}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  props.onCloseAction();
                }}
                hitSlop={{
                  top: 15,
                  bottom: 15,
                  left: 15,
                  right: 15,
                }}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(26), width: scale(26)}}
                  iconColor={'#808080'}
                  iconName={'close'}
                  iconSize={scale(26)}
                  iconType={IconType[8]}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* content */}
          <View
            style={{
              width: '100%',
              padding: scale(6),
            }}>
            {/* <DatePicker
                date={date}
                onDateChange={setDate}
                mode={'date'}
                androidVariant={'iosClone'}
                maximumDate={new Date()}
              /> */}
            <DateTimePicker
              testID={'dateTimePicker'}
              value={date}
              mode={'date'}
              display={'spinner'}
              maximumDate={props.maxDate ? props.maxDate : undefined}
              minimumDate={props.minDate ? props.minDate : undefined}
              dateFormat={'day month year'}
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date;
                setDate(currentDate);
              }}
            />
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: scale(150),
              paddingTop: scale(10),
              paddingBottom: scale(10),
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            <CommonButton
              showLoader={false}
              title={'Confirm'}
              onPress={() => {
                let obj = Helper.formateDate(date);
                props.onDateSelect(obj);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    paddingTop: scale(130),
    alignItems: 'center',
    backgroundColor: 'rgba(62,62,62,0.5)',
  },
  modalView: {
    width: windowWidth - 50,
    backgroundColor: 'white',
    borderRadius: scale(6),
    paddingBottom: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerView: {
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    padding: scale(5),
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    borderTopRightRadius: scale(6),
    borderTopLeftRadius: scale(6),
  },
  headerText: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: scale(16),
    textAlign: 'center',
    ...g.FHNR,
    ...g.colorBlue,
  },
  modalText: {
    fontSize: scale(12),
    textAlign: 'center',
    marginLeft: scale(10),
    marginRight: scale(10),
    marginBottom: scale(10),
    marginTop: scale(5),
    textAlignVertical: 'center',
    ...g.FHNR,
    ...g.colorBlue,
  },
  buttonBlue: {
    borderRadius: scale(5),
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    minWidth: scale(100),
    height: scale(35),
    paddingStart: scale(15),
    paddingEnd: scale(15),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#ffffff',
    fontSize: scale(14),
    margin: scale(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  buttonCircle: {
    width: 24,
    height: 24,
    borderRadius: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  radioCircle: {
    height: scale(14),
    width: scale(14),
    borderRadius: 100,
    borderWidth: scale(1.5),
    borderColor: GlobalInclude.Color.ColorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(5),
  },
  selectedRb: {
    height: scale(6),
    width: scale(6),
    borderRadius: scale(30),
    backgroundColor: GlobalInclude.Color.ColorPrimary,
  },
});

export default DatePickerView;
