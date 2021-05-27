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
import Radio from '../../component/Radio';
import YearSelection from '../../component/YearSelection';
import EditLinksExperience from '../../component/EditLinksExperience';
import NextPreviousButton from '../../component/NextPreviousButton';
import {updateUserProfile} from '../../Actions/UserActions';

const createGenderRadioButtons = (defaultChecked, value) => {
  return [
    {
      key: '0',
      label: 'No',
      selected: defaultChecked === 0 ? true : false,
    },
    {
      key: '1',
      label: 'Yes',
      selected: defaultChecked === 1 ? true : false,
    },
  ];
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

var lastSelectedIndex = -1;
let responseMessage = '';

const ProfessionalDetails = (props) => {
  const {profileData} = props;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [showContactUsModal, setShowContactUsModal] = useState(false);

  const [linkedIn, setLinkedIn] = useState(profileData.linkedinUrl);
  const [designation, setDesignation] = useState(profileData.designation);
  const [businessSector, setBusinessSector] = useState(
    profileData.businessSector,
  );
  const [company, setCompany] = useState(profileData.company);
  const [secondaryBusinessSector, setSecondaryBusinessSector] = useState(
    profileData.secondaryBusinessSector,
  );
  const [mentoring, setMentoring] = useState(profileData.mentoring);
  const [experience, setExperience] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [valueFrom, setValueFrom] = useState(-1);
  const [showFromYear, setShowFromYear] = useState(false);
  const [valueTo, setValueTo] = useState(-1);
  const [showToYear, setshowToYear] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userExperience, setUserExperience] = useState(
    profileData.uersExperience,
  );

  useEffect(() => {
    setLinkedIn(profileData.linkedinUrl);
    setDesignation(profileData.designation);
    setBusinessSector(profileData.businessSector);
    setCompany(profileData.company);
    setSecondaryBusinessSector(profileData.secondaryBusinessSector);
    setMentoring(profileData.mentoring);
    setUserExperience(profileData.uersExperience);

    return () => {};
  }, [profileData]);

  /**
   *
   * API Section start
   *
   */
  const updateProfileDetails = () => {
    let requestData = {
      mentoring: mentoring,
      uersExperience: userExperience,
    };

    if (linkedIn !== undefined && linkedIn !== null) {
      requestData.linkedinUrl = linkedIn;
    }
    if (designation !== undefined && designation !== null) {
      requestData.designation = designation;
    }
    if (businessSector !== undefined && businessSector !== null) {
      requestData.businessSector = businessSector;
    }
    if (company !== undefined && company !== null) {
      requestData.company = company;
    }
    if (
      secondaryBusinessSector !== undefined &&
      secondaryBusinessSector !== null
    ) {
      requestData.secondaryBusinessSector = secondaryBusinessSector;
    }

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

  const inputHandler = (fieldName, fieldValue) => {
    if (fieldName === 'linkedIn') {
      setLinkedIn(fieldValue);
    } else if (fieldName === 'designation') {
      setDesignation(fieldValue);
    } else if (fieldName === 'company') {
      setCompany(fieldValue);
    } else if (fieldName === 'businessSector') {
      setBusinessSector(fieldValue);
    } else if (fieldName === 'secondaryBusinessSector') {
      setSecondaryBusinessSector(fieldValue);
    } else if (fieldName === 'experience') {
      setExperience(fieldValue);
    } else if (fieldName === 'companyName') {
      setCompanyName(fieldValue);
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

  const renderRadioButton = (radioObj, type) => {
    return radioObj.map((item, key) => {
      return (
        <View
          key={key}
          style={{
            marginEnd: scale(2),
            marginStart: scale(2),
            alignSelf: 'center',
          }}>
          <Radio
            item={item}
            title={item.label}
            onRadioSelect={(value) => {
              if (type === 1) {
                setMentoring(!mentoring);
              }
            }}
            selected={item.selected}
            radioStyle={styles.radioCircle}
            selectedStyle={styles.selectedRb}
          />
        </View>
      );
    });
  };

  const removeItem = () => {
    if (lastSelectedIndex > userExperience.length) {
      return;
    }
    let oldData = userExperience;
    oldData.splice(lastSelectedIndex, 1);
    setUserExperience([...oldData]);
  };

  const inflateLinks = ({index, item}) => {
    return (
      <EditLinksExperience
        indexName={index}
        mainTitle={item.company}
        header={item.designation}
        subHeader={`${item.fromYear}${item.toYear ? ' - ' + item.toYear : ''}`}
        onDeletePress={() => {
          lastSelectedIndex = index;
          props.removeIndex(() => {
            removeItem();
          });
        }}
        onEditPress={() => {
          setIsEdit(true);
          lastSelectedIndex = index;
          setExperience(item.designation);
          setCompanyName(item.company);
          setValueFrom(item.fromYear);
          setValueTo(
            item.toYear === 'ongoing' ? 'Ongoing' : parseInt(item.toYear, 10),
          );
        }}
      />
    );
  };

  const addNewLink = (updateMode) => {
    setErrorMessage({});
    if (experience.trim() === '') {
      setErrorMessage({experience: 'This field is required.'});
    } else if (companyName.trim() === '') {
      setErrorMessage({companyName: 'This field is required.'});
    } else {
      let insertedItem = {
        company: companyName,
        designation: experience,
        fromYear: valueFrom,
        toYear: valueTo === 'Ongoing' ? 'ongoing' : parseInt(valueTo, 10),
        image: '',
        video: '',
        link: '',
      };

      if (updateMode) {
        let oldData = userExperience;
        oldData[lastSelectedIndex] = insertedItem;
        setUserExperience([...oldData]);
      } else {
        let oldData = userExperience;
        oldData.push(insertedItem);
        setUserExperience([...oldData]);
      }
      setIsEdit(false);
      lastSelectedIndex = -1;
      setExperience('');
      setCompanyName('');
      setValueFrom(-1);
      setValueTo(-1);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
      style={GlobalInclude.AppStyle.fill}>
      <View style={GlobalInclude.AppStyle.fill}>
        <KeyboardAwareScrollView
          style={[g.mt20, g.mb20]}
          showsVerticalScrollIndicator={false}>
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
          {showToYear && (
            <YearSelection
              title={'Select Year'}
              yearList={generateYearList(true, valueTo)}
              onItemSelect={(value) => {
                setValueTo(value.key === 'Ongoing' ? 'ongoing' : value.key);
                setshowToYear(false);
              }}
              onCloseAction={() => {
                setshowToYear(false);
              }}
            />
          )}
          <View style={[grid.flex1, g.pb30]}>
            <View style={g.mb15}>
              {generateHeader('My LinkedIn Page', false)}
              <View style={{marginbottom: scale(5)}} />
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Enter your text here'}
                value={linkedIn}
                onChangeText={(value) => inputHandler('linkedIn', value)}
              />
            </View>

            <View style={g.mb15}>
              {generateHeader('Current Role / Designation', false)}
              <View style={{marginbottom: scale(5)}} />
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Enter your text here'}
                value={designation}
                onChangeText={(value) => inputHandler('designation', value)}
              />
            </View>
            <View style={g.mb15}>
              {generateHeader('Company Name', false)}
              <View style={{marginbottom: scale(5)}} />
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Enter your text here'}
                value={company}
                onChangeText={(value) => inputHandler('company', value)}
              />
            </View>
            <View style={g.mb15}>
              {generateHeader('Sector of Business', false)}
              <View style={{marginbottom: scale(5)}} />
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Enter your text here'}
                value={businessSector}
                onChangeText={(value) => inputHandler('businessSector', value)}
              />
            </View>

            <View style={g.mb20}>
              {generateHeader('Secondary Sector of Business', false)}
              <View style={{marginbottom: scale(5)}} />
              <TextInput
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Enter your text here'}
                value={secondaryBusinessSector}
                onChangeText={(value) =>
                  inputHandler('secondaryBusinessSector', value)
                }
              />
            </View>
            <View style={g.mb15}>
              {generateHeader('Open To Mentoring', false)}
              <View style={{marginbottom: scale(5)}} />
              <View style={[grid.rowdir, grid.flex1, g.mt5]}>
                {renderRadioButton(
                  createGenderRadioButtons(mentoring ? 1 : 0, mentoring),
                  1,
                )}
              </View>
            </View>

            <View
              style={{
                borderBottomWidth: 0.5,
                backgroundColor: '#c9c9c9',
                marginBottom: 15,
              }}
            />
            <View style={[grid.rowdir, grid.alignItemsTop]}>
              <Text style={g.labeltext1}>Past Work Experience</Text>
            </View>
            <View style={[g.textAreaContainer, g.mb15]}>
              <TextInput
                keyboardType={'default'}
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Worked as- Role / Designation'}
                maxLength={264}
                onChangeText={(value) => inputHandler('experience', value)}
                value={experience}
                editable={true}
              />
              {errorMessage.experience &&
                errorMessage.experience.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.experience}
                  </Text>
                )}
            </View>

            <View style={[g.textAreaContainer, g.mb15]}>
              <TextInput
                keyboardType={'default'}
                underlineColorAndroid="transparent"
                style={g.inputWhite}
                placeholder={'Name of company'}
                maxLength={264}
                onChangeText={(value) => inputHandler('companyName', value)}
                value={companyName}
                editable={true}
              />
              {errorMessage.companyName &&
                errorMessage.companyName.length > 0 && (
                  <Text style={[g.errorMsg, g.pt5]}>
                    {errorMessage.companyName}
                  </Text>
                )}
            </View>
            <TouchableOpacity
              activeOpacity={1}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              onPress={() => {
                setShowFromYear(true);
              }}
              style={[grid.rowdir, grid.alignItems, g.inputWhite, g.mb15]}>
              <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
                {valueFrom !== -1 ? valueFrom : 'From'}
              </Text>
              <View style={[styles.triangleShape, props.arrowColor]} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              onPress={() => {
                setshowToYear(true);
              }}
              style={[grid.rowdir, grid.alignItems, g.inputWhite, g.mb15]}>
              <Text style={[grid.col, g.FHNR]} numberOfLines={1}>
                {valueTo !== -1 ? valueTo : 'To'}
              </Text>
              <View style={[styles.triangleShape, props.arrowColor]} />
            </TouchableOpacity>
            <View>
              <View style={[grid.row, g.pt15, grid.justifyContentRight]}>
                {!isEdit ? (
                  <Text
                    style={[g.btn]}
                    onPress={(e) => {
                      addNewLink(false);
                    }}>
                    Add this Experience
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
              {userExperience.length > 0 && (
                <View>
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={userExperience}
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

export default ProfessionalDetails;
