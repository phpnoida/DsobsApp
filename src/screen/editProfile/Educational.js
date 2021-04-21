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
import NextPreviousButton from '../../component/NextPreviousButton';
import {updateUserProfile} from '../../Actions/UserActions';

const generateOptionList = (defaultValue) => {
  let optionList = [];
  optionList.push({
    key: 'Days',
    text: 'Days',
    selected: defaultValue === 'Days' ? true : false,
    unitId: 4,
  });
  optionList.push({
    key: 'Weeks',
    text: 'Weeks',
    selected: defaultValue === 'Weeks' ? true : false,
    unitId: 5,
  });
  optionList.push({
    key: 'Months',
    text: 'Months',
    selected: defaultValue === 'Months' ? true : false,
    unitId: 6,
  });
  optionList.push({
    key: 'Years',
    text: 'Years',
    selected: defaultValue === 'Years' ? true : false,
    unitId: 7,
  });
  return optionList;
};

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
const DURATION_UNIT = {
  1: 'Secs',
  2: 'Mins',
  3: 'Hours',
  4: 'Days',
  5: 'Weeks',
  6: 'Months',
  7: 'Years',
};

var lastSelectedIndex = -1;
var selectedUnit = 4;
let responseMessage = '';
let textColorStyle = [];
const Educational = (props) => {
  const {profileData} = props;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [showContactUsModal, setShowContactUsModal] = useState(false);

  const [instituteName, setInstituteName] = useState('');
  const [trainingNature, setTrainingNature] = useState('');
  const [totalDays, setTotalDays] = useState('');
  const [selectedOption, setSelectedOption] = useState('Days');
  const [showOptionList, setShowOptionList] = useState(false);

  const [valueFrom, setValueFrom] = useState(-1);
  const [showFromYear, setShowFromYear] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [educational, setEducational] = useState([]);

  useEffect(() => {
    setEducational(profileData.uersEducational);
    return () => {};
  }, [profileData]);

  const inputHandler = (fieldName, fieldValue) => {
    if (fieldName === 'instituteName') {
      setInstituteName(fieldValue);
    } else if (fieldName === 'trainingNature') {
      setTrainingNature(fieldValue);
    } else if (fieldName === 'totalDays') {
      setTotalDays(fieldValue);
    }
  };

  const generateHeader = (title, required) => {
    return (
      <View style={[grid.rowdir, grid.alignItemsTop]}>
        <Text style={g.labeltext1}>{title}</Text>
        {required && <Text style={g.colorRed}>*</Text>}
      </View>
    );
  };

  const inflateLinks = ({index, item}) => {
    return (
      <EditLinksExperience
        indexName={index}
        mainTitle={item.institute}
        header={item.trainingNature}
        subHeader={`${item.trainingYear} | ${item.trainingPeriod} ${
          DURATION_UNIT[item.trainingUnit]
        }`}
        onDeletePress={() => {
          lastSelectedIndex = index;
          props.removeIndex(() => {
            removeItem();
          });
        }}
        onEditPress={() => {
          setIsEdit(true);
          setErrorMessage({});
          lastSelectedIndex = index;
          setInstituteName(item.institute);
          setTrainingNature(item.trainingNature);
          setTotalDays(item.trainingPeriod);
          setSelectedOption(DURATION_UNIT[item.trainingUnit]);
          setValueFrom(item.trainingYear);
        }}
      />
    );
  };

  const addNewLink = (updateMode) => {
    setErrorMessage({});
    if (instituteName.trim() === '') {
      setErrorMessage({instituteName: 'This field is required!'});
    } else if (trainingNature.trim() === '') {
      setErrorMessage({trainingNature: 'This field is required!'});
    } else if (totalDays.trim() === '') {
      setErrorMessage({totalDays: 'This field is required!'});
    } else {
      let insertedItem = {
        institute: instituteName,
        trainingNature: trainingNature,
        trainingPeriod: totalDays,
        trainingUnit: selectedUnit,
        trainingYear: valueFrom,
        image: '',
        video: '',
        link: '',
      };
      let oldData = educational;
      if (updateMode) {
        oldData[lastSelectedIndex] = insertedItem;
        setEducational([...oldData]);
      } else {
        oldData.push(insertedItem);
        setEducational([...oldData]);
      }
      setIsEdit(false);
      setInstituteName('');
      setTrainingNature('');
      setTotalDays('');
      setSelectedOption('Days');
      setValueFrom(-1);
      selectedUnit = 4;
      lastSelectedIndex = -1;
    }
  };

  const removeItem = () => {
    if (lastSelectedIndex > educational.length) {
      return;
    }
    let oldData = educational;
    oldData.splice(lastSelectedIndex, 1);
    setEducational([...oldData]);
  };

  /**
   *
   * API Section start
   *
   */
  const updateProfileDetails = () => {
    let requestData = {
      uersEducational: educational,
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

  if (valueFrom === -1) {
    textColorStyle = [];
    textColorStyle.push({color: '#ddd'});
  } else {
    textColorStyle = [];
    textColorStyle.push({color: '#000000'});
  }

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
            {showOptionList && (
              <YearSelection
                title={'Select'}
                yearList={generateOptionList(selectedOption)}
                onItemSelect={(value) => {
                  selectedUnit = value.unitId;
                  setSelectedOption(value.key);
                  setShowOptionList(false);
                }}
                onCloseAction={() => {
                  setShowOptionList(false);
                }}
              />
            )}

            {showFromYear && (
              <YearSelection
                title={'Year of Training/Gradution'}
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
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Name of Institute (Required)'}
                value={instituteName}
                onChangeText={(value) => inputHandler('instituteName', value)}
              />
              {errorMessage.instituteName &&
                errorMessage.instituteName.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.instituteName}
                  </Text>
                )}
            </View>

            <View style={g.mb20}>
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Nature of Training/Degree (Required)'}
                value={trainingNature}
                onChangeText={(value) => inputHandler('trainingNature', value)}
              />
              {errorMessage.trainingNature &&
                errorMessage.trainingNature.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.trainingNature}
                  </Text>
                )}
            </View>
            <View style={g.mb15}>
              {generateHeader('Duration of Program', true)}
              <View style={{marginBottom: scale(5)}} />
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Number of'}
                value={totalDays}
                onChangeText={(value) => inputHandler('totalDays', value)}
              />
              {errorMessage.totalDays && errorMessage.totalDays.length > 0 && (
                <Text style={[g.errorMsg, g.pt5]}>
                  {errorMessage.totalDays}
                </Text>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setShowOptionList(true);
              }}
              style={[grid.rowdir, grid.alignItems, g.inputWhite, g.mb15]}>
              <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
                {selectedOption}
              </Text>
              <View style={[styles.triangleShape, props.arrowColor]} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setShowFromYear(true);
              }}
              style={[grid.rowdir, grid.alignItems, g.inputWhite]}>
              <Text
                style={[grid.col, g.FHNR, textColorStyle]}
                numberOfLines={1}>
                {valueFrom !== -1 ? valueFrom : 'Year of Training/Graduation'}
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
                    Add this Training
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

            <View>
              {educational.length > 0 && (
                <View>
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={educational}
                    renderItem={inflateLinks}
                  />
                </View>
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
        <NextPreviousButton
          isLoading={isLoading}
          onPreviuosTab={() => {
            props.onPreviuosTab();
          }}
          onSaveTab={() => {
            updateProfileDetails();
            //props.onSaveTab();
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

export default Educational;
