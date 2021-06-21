import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {scale} from '../../../theme/Scalling';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {IconType} from '../../../helper/Constants';
import Helpers from '../../../helper/Helper';
import {
  getUserPostSettings,
  getCategories,
  doSetUserPostSettings,
} from '../../../Actions/TickerActions';
import CommonButton from '../../../component/CommonButton';

let userPostSettings = [];

const ViewPost = ({params}) => {
  const [categrories, setCategrories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (global.isConnected) {
      setLoading(true);
      getPostSettings();
    }

    return () => {};
  }, []);

  const getCategory = () => {
    getCategories(
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let categoryArray = [];
              if (data.data !== null) {
                data.data.map((item, index) => {
                  categoryArray.push({
                    key: item.id,
                    text: Helpers.capitalize(item.name),
                    selected: isContain(item.id),
                  });
                });
                categoryArray.push({
                  key: 100,
                  text: Helpers.capitalize('People i Follow'),
                  selected: isContain(100),
                });
              }
              setCategrories(categoryArray);
              setLoading(false);
            }
          }
        }
      },
      (error) => {
        setLoading(false);
      },
    );
  };

  const isContain = (catId) => {
    if (
      userPostSettings === undefined ||
      userPostSettings == null ||
      userPostSettings.length === 0
    ) {
      return false;
    } else {
      if (userPostSettings.includes(0)) {
        return true;
      }
      return userPostSettings.includes(catId);
    }
  };

  const getPostSettings = () => {
    getUserPostSettings(
      (response) => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            console.log('====================================');
            console.log('data', data);
            console.log('====================================');

            if (data.status) {
              if (data.data !== null) {
                let settings = data.data.postSettings;
                userPostSettings = settings;

                console.log('settings', settings);

                setTimeout(() => {
                  getCategory();
                }, 500);
              }
            }
          }
        }
      },
      (error) => {
        getPostSettings();
      },
    );
  };

  const setUserSettings = () => {
    setIsSubmitting(true);

    let checkedCategory = [];

    let oldData = categrories;

    for (let i = 0; i < oldData.length; i++) {
      const element = oldData[i];
      if (element.selected) {
        checkedCategory.push(element.key);
      }
    }

    let requestObject = {
      postSettings: checkedCategory,
    };
    doSetUserPostSettings(
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
              Alert.alert('Settings updated', '');
              setTimeout(() => {
                getPostSettings();
              }, 500);
            }
          }
        }
      },
      (error) => {
        setIsSubmitting(false);
        getCategory();
      },
    );
  };

  const selectItem = (index) => {
    let oldData = categrories;
    oldData[index].selected = !oldData[index].selected;
    setCategrories([...oldData]);
  };

  const isAnyChecked = () => {
    let oldData = categrories;

    for (let i = 0; i < oldData.length; i++) {
      const element = oldData[i];
      if (element.selected) {
        return true;
      }
    }
    return false;
  };

  return (
    <View style={[grid.flex1, g.pl10, g.pr10]}>
      <View style={grid.flex1}>
        <View style={GlobalInclude.AppStyle.fill}>
          {loading ? (
            <View style={GlobalInclude.AppStyle.fillCenter}>
              <ActivityIndicator
                size={'small'}
                color={GlobalInclude.Color.ColorPrimary}
              />
            </View>
          ) : (
            <View style={GlobalInclude.AppStyle.fill}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {categrories.map((v, i) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        selectItem(i);
                      }}
                      key={i.toString()}
                      activeOpacity={1}>
                      <View style={[g.tagStyle, grid.rowdir, grid.alignItems]}>
                        <GlobalInclude.BaseIcon
                          containerStyle={{
                            height: scale(28),
                            width: scale(28),
                            justifyContent: 'center',
                            marginEnd: scale(5),
                          }}
                          iconColor={GlobalInclude.Color.ColorPrimary}
                          iconName={
                            v.selected
                              ? 'checkbox-marked-outline'
                              : 'checkbox-blank-outline'
                          }
                          iconSize={scale(22)}
                          iconType={IconType[1]}
                        />
                        <Text
                          style={[
                            g.tagTxtStyle,
                            v.selected ? g.colorBlue : g.colorBlack,
                            v.selected ? g.FHNB : g.FHNR,
                          ]}>
                          {v.text}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
      <View style={[styles.filterButton, g.mb10]}>
        <CommonButton
          showLoader={isSubmitting}
          title={'Apply'}
          onPress={() => {
            if (isAnyChecked()) {
              setUserSettings();
            } else {
              Alert.alert(
                'Required Selection',
                'You must select at least one option from View Post',
              );
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

export default ViewPost;
