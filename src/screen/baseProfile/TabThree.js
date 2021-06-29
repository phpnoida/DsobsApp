import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import Icons from 'react-native-vector-icons/FontAwesome';
import {scale} from '../../theme/Scalling';
import Radio from '../../component/Radio';
import Globalinclude from '../../globalInclude/Globalinclude';
import DatePickerView from '../../component/DatePickerView';
import DateTimePicker from '@react-native-community/datetimepicker';
import Helper from '../../helper/Helper';

const createGenderRadioButtons = (value) => {
  return [
    {
      key: '1',
      label: 'Male',
      selected: value === '1' || false,
    },
    {
      key: '0',
      label: 'Female',
      selected: value === '0' || false,
    },
  ];
};

const renderRadioButton = (gender, props) => {
  const radioObj = createGenderRadioButtons(gender);
  return radioObj.map((item, key) => {
    return (
      <View key={key} style={{margin: scale(5)}}>
        <Radio
          item={item}
          title={item.label}
          onRadioSelect={(value) => {
            props.onGenderChange(value.key);
          }}
          selected={item.selected}
        />
      </View>
    );
  });
};

const TabThree = (props) => {
  const {errorMessage} = props;
  return (
    <View style={g.mt45}>
      <Text style={[g.fs24, g.FHNB, g.mb15, g.colorBlack]}>
        Personal Info...
      </Text>
      <View style={[g.mb15]}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={[g.labeltext1]}>DOB</Text>
        </View>
        <TouchableOpacity
          style={[g.inputWhite]}
          onPress={() => {
            props.openDatePicker();
          }}>
          <Text
            style={[grid.col, g.FHNR, {textAlignVertical: 'center'}]}
            numberOfLines={1}>
            {props.selectedDate}
          </Text>
          <View style={{position: 'absolute', right: 10, top: 12, zIndex: 2}}>
            <Icons name={'calendar'} color={'#bababa'} size={scale(18)} />
          </View>
        </TouchableOpacity>
        {errorMessage.emptyBirthDate &&
          errorMessage.emptyBirthDate.length > 0 && (
            <Text style={[g.errorMsg, g.pt5]}>
              {errorMessage.emptyBirthDate}
            </Text>
          )}
      </View>

      <View style={[g.mb15]}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={[g.labeltext1]}>Blood Group</Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={() => props.showBloodGroup()}
          style={[grid.rowdir, grid.alignItems, g.inputWhite]}>
          <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
            {props.bloodGroup}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[g.mb15]}>
        <View style={[grid.rowdir, grid.alignItemsTop]}>
          <Text style={[g.labeltext1]}>Gender</Text>
          <Text style={[g.colorRed]}>*</Text>
        </View>
        <View style={[grid.rowdir]}>
          {renderRadioButton(props.selectedGender, props)}

          <TouchableOpacity
            onPress={() => {
              props.setLgbtqia(!props.lgbtqia);
            }}
            style={{
              width: scale(100),
              flexDirection: 'row',
              alignItems: 'center',
            }}
            activeOpacity={1}>
            <View style={styles.otherGenderContainer}>
              {props.lgbtqia ? (
                <Icons
                  name={'check-square'}
                  color={Globalinclude.Color.ColorPrimary}
                  size={scale(14)}
                />
              ) : (
                <View style={styles.defaultOtherGender} />
              )}
            </View>
            <Text style={[g.fs14, g.colorBlack, g.ml10]}>LGBTQIA</Text>
          </TouchableOpacity>
        </View>
        {errorMessage.emptyGender && errorMessage.emptyGender.length > 0 && (
          <Text style={[g.errorMsg, g.pt5]}>{errorMessage.emptyGender}</Text>
        )}
      </View>

      {props.showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          testID={'dateTimePicker'}
          value={new Date(props.birthDate)}
          mode={'date'}
          display={'spinner'}
          maximumDate={new Date()}
          dateFormat={'day month year'}
          onChange={(event, selected) => {
            // const currentDate = selected || new Date();
            // let obj = Helper.formateDate(currentDate);
            // props.setSelectedDate(obj.displayDate, obj.serverDate);

            if (event && event !== null && event !== undefined) {
              if (event.type === 'set') {
                const currentDate = selected || new Date();
                let obj = Helper.formateDate(currentDate);
                props.setSelectedDate(obj.displayDate, obj.serverDate);
              }
            } else {
              props.openDatePicker();
            }
          }}
          onTouchCancel={(event) => {
            props.openDatePicker();
          }}
        />
      )}

      {props.showDatePicker && Platform.OS === 'ios' && (
        <DatePickerView
          defaultDate={props.birthDate}
          onCloseAction={() => {
            props.openDatePicker();
          }}
          onDateSelect={(obj) => {
            props.setSelectedDate(obj.displayDate, obj.serverDate);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  triangleShape: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#dddddd',
    marginLeft: 8,
  },
  otherGenderContainer: {
    marginStart: scale(15),
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  defaultOtherGender: {
    width: scale(14),
    height: scale(14),
    backgroundColor: '#ced4da',
    borderRadius: 2,
  },
});

export default TabThree;
