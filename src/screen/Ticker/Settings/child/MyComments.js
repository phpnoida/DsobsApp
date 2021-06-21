import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import g from '../../../../theme/global';
import grid from '../../../../theme/grid';
import {scale} from '../../../../theme/Scalling';
import RadioButton from '../../../../component/RadioButton';
import CommonButton from '../../../../component/CommonButton';
import {
  getUserNotificationSettings,
  doSetUserNotificationSettings,
} from '../../../../Actions/TickerActions';

let itemArray = [
  {text: 'Send No Notification', key: 4, id: 0},
  {text: 'Twice a day', key: 2, id: 2},
  {text: 'Once a day', key: 3, id: 3},
  {text: 'Send Notification on All Replies', key: 1, id: 1},
];

let selectedSetting = '';
let defaultSelected = '';

const MyComments = ({params}) => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [filterList, setFilterList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (global.isConnected) {
      getPostSettings();
    }
    return () => {};
  }, []);

  const getPostSettings = () => {
    getUserNotificationSettings(
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              if (data.data !== null) {
                let settings = data.data;

                if (
                  settings.myCommentNotifySettings !== undefined &&
                  settings.myCommentNotifySettings !== null
                ) {
                  //myCommentNotifySettings=  0-no notification 1-send notification on all comments 2-twice a day 3-one a day
                  let myCommentNotifySettings =
                    settings.myCommentNotifySettings;
                  selectedSetting = myCommentNotifySettings;
                  defaultSelected = myCommentNotifySettings;
                  switch (myCommentNotifySettings) {
                    case 0:
                      setSelectedFilter('Send No Notification');
                      break;
                    case 1:
                      setSelectedFilter('Send Notification on All Replies');
                      break;
                    case 2:
                      setSelectedFilter('Twice a day');
                      break;
                    case 3:
                      setSelectedFilter('Once a day');
                      break;
                    default:
                      setSelectedFilter('');
                      break;
                  }
                }
                setFilterList(itemArray);
              }
            }
          }
        }
      },
      (error) => {},
    );
  };

  const setUserSettings = () => {
    setIsSubmitting(true);

    let requestObject = {
      myCommentNotifySettings: selectedSetting,
    };
    doSetUserNotificationSettings(
      requestObject,
      (response) => {
        setIsSubmitting(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              selectedSetting = '';
              setSelectedFilter('');
              setFilterList([]);
              Alert.alert('Congratulations', 'Settings updated');
              setTimeout(() => {
                getPostSettings();
              }, 500);
            }
          }
        }
      },
      (error) => {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        setIsSubmitting(false);
        getPostSettings();
      },
    );
  };

  return (
    <View style={[grid.flex1, g.pl10, g.pr10]}>
      <View style={grid.flex1}>
        <RadioButton
          defaultSelected={selectedFilter}
          PROP={filterList}
          onRadioSelect={(item) => {
            console.log('item', item);
            selectedSetting = item.id;
            defaultSelected = '';
            setSelectedFilter(item.text.toString());
          }}
        />
      </View>
      <View style={[styles.filterButton, g.mb10]}>
        <CommonButton
          showLoader={isSubmitting}
          title={'Apply'}
          onPress={() => {
            if (selectedSetting === '') {
              Alert.alert('Required Selection', 'You must select one setting');
            } else if (defaultSelected === selectedSetting) {
              Alert.alert('Already Selected', 'Settings already selected');
            } else {
              setUserSettings();
            }
          }}
        />
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

export default MyComments;
