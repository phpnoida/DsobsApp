import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  StyleSheet,
  FlatList,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import YearSelection from '../../component/YearSelection';
import EditLinksExperience from '../../component/EditLinksExperience';
import Radio from '../../component/Radio';
import NextPreviousButton from '../../component/NextPreviousButton';
import {updateUserProfile} from '../../Actions/UserActions';

const generateYearList = (onGoing, defaultChecked) => {
  let year = '';
  let yearList = [];
  let cYear = new Date().getFullYear();
  let sYear = 1920;

  for (let i = 0; i <= cYear - sYear; i++) {
    year = sYear + i;
    yearList.push({
      key: year,
      text: year,
      selected: year === defaultChecked ? true : false,
    });
  }
  yearList.reverse();

  if (onGoing) {
    yearList.splice(0, 0, {
      key: 'Ongoing',
      text: 'Ongoing',
      selected: defaultChecked === 'Ongoing' ? true : false,
    });
  }
  return yearList;
};

const createGenderRadioButtons = (defaultChecked) => {
  return [
    {
      key: '0',
      label: 'In School',
      selected: defaultChecked === 0 ? true : false,
    },
    {
      key: '1',
      label: 'After School',
      selected: defaultChecked === 1 ? true : false,
    },
  ];
};

var lastSelectedIndex = -1;
let responseMessage = '';

const Awards = (props) => {
  const {profileData} = props;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [showContactUsModal, setShowContactUsModal] = useState(false);

  const [awardName, setAwardName] = useState('');
  const [awardCategory, setAwardCategory] = useState('');
  const [valueFrom, setValueFrom] = useState(-1);
  const [showFromYear, setShowFromYear] = useState(false);
  const [awardPlace, setAwardPlace] = useState('In School');
  const [isEdit, setIsEdit] = useState(false);
  const [awardList, setAwardList] = useState([]);

  useEffect(() => {
    setAwardList(profileData.awards);
    return () => {};
  }, [profileData]);

  const inputHandler = (fieldName, fieldValue) => {
    if (fieldName === 'awardName') {
      setAwardName(fieldValue);
    } else if (fieldName === 'awardCategory') {
      setAwardCategory(fieldValue);
    }
  };

  const inflateLinks = ({index, item}) => {
    return (
      <EditLinksExperience
        indexName={index}
        mainTitle={item.awardPlace}
        header={item.awardName}
        subHeader={item.awarCategory}
        description={item.awardYear}
        onDeletePress={() => {
          lastSelectedIndex = index;
          props.removeIndex(() => {
            removeLink();
          });
        }}
        onEditPress={() => {
          setIsEdit(true);
          setErrorMessage({});
          lastSelectedIndex = index;
          setAwardName(item.awardName);
          setAwardCategory(item.awarCategory);
          setValueFrom(item.awardYear);
          setAwardPlace(item.awardPlace);
        }}
      />
    );
  };

  const renderRadioButton = (radioObj) => {
    return radioObj.map((item, key) => {
      return (
        <View
          key={key}
          style={{
            marginEnd: scale(12),
            marginStart: scale(2),
            alignSelf: 'center',
          }}>
          <Radio
            item={item}
            title={item.label}
            onRadioSelect={(value) => {
              setAwardPlace(value.label);
            }}
            selected={item.selected}
            radioStyle={styles.radioCircle}
            selectedStyle={styles.selectedRb}
          />
        </View>
      );
    });
  };

  const addNewLink = (updateMode) => {
    if (awardName.trim() === '') {
      setErrorMessage({awardName: 'This field is required'});
    } else if (awardCategory.trim() === '') {
      setErrorMessage({awardCategory: 'This field is required'});
    } else {
      let object = {
        awardPlace: awardPlace,
        awardName: awardName,
        awarCategory: awardCategory,
        awardYear: valueFrom,
        video: '',
        link: '',
        image: '',
      };

      if (updateMode) {
        let oldData = awardList;
        oldData[lastSelectedIndex] = object;
        setAwardList([...oldData]);
      } else {
        let oldData = awardList;
        oldData.push(object);
        setAwardList([...oldData]);
      }
      setIsEdit(false);
      setErrorMessage({});
      lastSelectedIndex = -1;
      setAwardName('');
      setAwardCategory('');
      setValueFrom(-1);
      setAwardPlace('In School');
    }
  };

  const removeLink = () => {
    if (lastSelectedIndex > awardList.length) {
      return;
    }
    let oldData = awardList;
    oldData.splice(lastSelectedIndex, 1);
    setAwardList([...oldData]);
  };

  /**
   *
   * API Section start
   *
   */
  const updateProfileDetails = () => {
    let requestData = {
      awards: awardList,
    };

    if (global.isConnected) {
      setIsLoading(true);
      updateUserProfile(
        requestData,
        (response) => {
          setIsLoading(false);

          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.response !== null
            ) {
              let data = response.data;
              if (data.status) {
                props.updateData(data.data);
                setTimeout(() => {
                  props.onSaveTab();
                }, 500);
              }
            }
          }
        },
        (error, message) => {
          setIsLoading(false);
          responseMessage = message;
          setShowContactUsModal(!showContactUsModal);
        },
      );
    }
  };
  /**
   *
   * API Section end
   *
   */

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
      style={GlobalInclude.AppStyle.fill}>
      <View style={GlobalInclude.AppStyle.fill}>
        <KeyboardAwareScrollView
          style={[g.mt20, g.mb20]}
          showsVerticalScrollIndicator={false}>
          <View style={[grid.flex1, g.pb30]}>
            {showContactUsModal && (
              <GlobalInclude.ModalAlert
                status={showContactUsModal}
                header={responseMessage}
                okButton={'Okay'}
                okAction={() => {
                  setShowContactUsModal(false);
                }}
                closeAction={() => {
                  setShowContactUsModal(false);
                }}
              />
            )}
            {showFromYear && (
              <YearSelection
                title={'Select Year'}
                yearList={generateYearList(false, valueFrom)}
                onItemSelect={(value) => {
                  setValueFrom(value.key);
                  setShowFromYear(false);
                }}
                onCloseAction={() => {
                  setShowFromYear(false);
                }}
              />
            )}

            <View style={g.mb15}>
              <View style={[grid.rowdir, grid.flex1, g.mt5]}>
                {renderRadioButton(
                  createGenderRadioButtons(
                    awardPlace === 'In School' ? 0 : 1,
                    awardPlace,
                  ),
                )}
              </View>
            </View>
            <View style={g.mb15}>
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Name of Award'}
                value={awardName}
                onChangeText={(value) => inputHandler('awardName', value)}
              />
              {errorMessage.awardName && errorMessage.awardName.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.awardName}
                </Text>
              )}
            </View>

            <View style={g.mb15}>
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Category of Award'}
                value={awardCategory}
                onChangeText={(value) => inputHandler('awardCategory', value)}
              />
              {errorMessage.awardCategory &&
                errorMessage.awardCategory.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.awardCategory}
                  </Text>
                )}
            </View>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setShowFromYear(true);
              }}
              style={[grid.rowdir, grid.alignItems, g.inputWhite]}>
              <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
                {valueFrom !== -1 ? valueFrom : 'Select Year'}
              </Text>
              <View style={[styles.triangleShape, props.arrowColor]} />
            </TouchableOpacity>
            <View>
              <View style={[grid.row, g.mt20, grid.justifyContentRight]}>
                {!isEdit ? (
                  <Text
                    style={[g.btn]}
                    onPress={(e) => {
                      addNewLink(false);
                    }}>
                    Add this Award
                  </Text>
                ) : (
                  <Text
                    style={[g.btn]}
                    onPress={(e) => {
                      addNewLink(true);
                    }}>
                    Update
                  </Text>
                )}
              </View>
            </View>

            {awardList.length > 0 && (
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={awardList}
                renderItem={inflateLinks}
              />
            )}
          </View>
        </KeyboardAwareScrollView>
        <NextPreviousButton
          isLoading={isLoading}
          onPreviuosTab={() => {
            props.onPreviuosTab();
          }}
          onSaveTab={() => {
            //props.onSaveTab();
            updateProfileDetails();
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  radioCircle: {
    height: scale(15),
    width: scale(15),
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
});

export default Awards;
