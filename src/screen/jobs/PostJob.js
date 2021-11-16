import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Image,
  useWindowDimensions,
  Platform,
  Alert,
} from 'react-native';
import CountryPicker, {
  getAllCountries,
} from 'react-native-country-picker-modal';
import RBSheet from 'react-native-raw-bottom-sheet';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import GlobalInclude from '../../globalInclude/Globalinclude';
import HeaderBar from '../../component/HeaderBar';
import {IconType, APP_NAME} from '../../helper/Constants';
import grid from '../../theme/grid';
import g from '../../theme/global';
import {scale} from '../../theme/Scalling';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {generateHeader} from '../../component/Common';
import BottomSheetHeader from '../../component/BottomSheetHeader';
import CommonButton from '../../component/CommonButton';
import ProfessionalSheet from '../../component/ProfessionalSheetFilter';
import RadioButton from '../../component/RadioButton';
import Radio from '../../component/Radio';
import DatePickerView from '../../component/DatePickerView';
import DateTimePicker from '@react-native-community/datetimepicker';
import NextPreviousButton from '../../component/NextPreviousButton';
import {getProfessionList} from '../../Actions/UserActions';
import {addJobData, getJobNature, editJobs} from '../../Actions/JobsActions';
import UploadMedia from '../../component/UploadMedia';

let professionListMain = [];
let countryListMain = [];
let responseMessage = '';
let isSuccess = false;
let isInEditMode = false;
let postId = '';

const AddJobPost = ({route, navigation}) => {
  const deviceWidth = useWindowDimensions().width;
  const deviceHeight = useWindowDimensions().height;
  const professionRef = useRef();
  const countryRef = useRef();
  const jobNatureRef = useRef();
  const uploadRef = useRef();

  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [professionList, setProfessionList] = useState([]);
  const [countryCodeList, setCountryCodeList] = useState([]);
  const [jobNatureList, setJobNatureList] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [ageCriteria, setAgeCriteria] = useState({
    selectedMinimumAge: 1,
    selectedMaximumAge: 70,
  });
  const [accessEmail, setAccessEmail] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobCountry, setJobCountry] = useState('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [salary, setSalary] = useState('');
  const [totalPositions, setTotalPositions] = useState('');
  const [jobNature, setJobNature] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDetail, setJobDetail] = useState('');
  const [selectedGender, setSelectedGender] = useState('2');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [logoData, setLogoData] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let countryNames = [];
    getAllCountries().then(data => {
      if (data && data !== undefined && data !== null) {
        data.map((item, index) => {
          countryNames.push({key: index, text: item.name, value: item.name});
        });
        setCountryCodeList(countryNames);
        countryListMain = countryNames;
      }
    });

    professionListMain = [];
    responseMessage = '';
    postId = '';
    isSuccess = false;
    isInEditMode = false;
    if (global.isConnected) {
      setAccessEmail(global.userDetails.email);
      getProfession();
    }
    if (route.params !== undefined && route.params !== null) {
      isInEditMode = route.params.data.inEditMode;

      if (isInEditMode) {
        setupDefaultData(route.params.data.data);
      }
    }
    return () => {};
  }, [route, setupDefaultData, getProfession]);

  const setupDefaultData = useCallback(
    defaultData => {
      if (defaultData && defaultData !== undefined && defaultData !== null) {
        setSelectedProfession(defaultData.profession);
        setAgeCriteria({
          ...ageCriteria,
          selectedMaximumAge: defaultData.ageBracket.max,
          selectedMinimumAge: defaultData.ageBracket.min,
        });
        setAccessEmail(defaultData.email);
        setJobLocation(defaultData.city);
        setJobCountry(defaultData.country);
        setCompany(defaultData.forCompany);
        setDesignation(defaultData.designation);
        setSalary(defaultData.annualSalary);
        setTotalPositions(defaultData.numOfPosition.toString());
        setJobNature(defaultData.nature);
        setJobTitle(defaultData.title);
        setJobDetail(defaultData.description);
        setSelectedGender(defaultData.gender.toString());
        setSelectedDate(new Date(defaultData.postDate));

        if (defaultData.logo !== undefined && defaultData.logo !== null) {
          let tmpLogo = {
            thumbnail: defaultData.logo,
          };
          setLogoData(tmpLogo);
        }

        postId = defaultData._id;
      }
    },
    [ageCriteria],
  );

  /*****
   *
   * API Section
   *
   */
  const getProfession = useCallback(() => {
    getProfessionList(
      response => {
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let professionArray = [];
              if (data.data !== null) {
                data.data.map((item, index) => {
                  professionArray.push({key: index, text: item});
                });
              }
              professionListMain = professionArray;
              setProfessionList(professionArray);
            }
          }
        }
        setTimeout(() => {
          getNature();
        }, 100);
      },
      error => {
        setTimeout(() => {
          getNature();
        }, 100);
      },
    );
  }, []);

  const getNature = () => {
    getJobNature(
      response => {
        setLoading(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;

            if (data.status) {
              let tmpArray = [];
              if (data.data !== null) {
                data.data.map((item, index) => {
                  tmpArray.push({key: index, text: item, selected: false});
                });
              }
              setJobNatureList(tmpArray);
            }
          }
        }
      },
      error => {
        setLoading(false);
      },
    );
  };

  const saveJob = requestObject => {
    addJobData(
      requestObject,
      response => {
        setLoader(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              isSuccess = true;
              responseMessage =
                'You have successfully posted your requirements to the Jobs Section!\n\nYou can edit, modify and close this position from the app.';
              setShowErrorMessage(true);
            } else {
              responseMessage = 'Error while posting your request!';
              setShowErrorMessage(true);
            }
          }
        }
      },
      (code, error) => {
        setLoader(false);
        Alert.alert('Something went wrong', error);
      },
    );
  };

  const editJobData = requestObject => {
    editJobs(
      postId,
      requestObject,
      response => {
        setLoader(false);
        if (response && response !== null) {
          if (
            response.data &&
            response.data !== undefined &&
            response.data !== null
          ) {
            let data = response.data;
            if (data.status) {
              isSuccess = true;
              responseMessage =
                'You have successfully updated your requirements to the Jobs Section!';
              setShowErrorMessage(true);
            } else {
              responseMessage = 'Error while posting your request!';
              setShowErrorMessage(true);
            }
          }
        }
      },
      (code, error) => {
        setLoader(false);
        Alert.alert('Something went wrong', error);
      },
    );
  };

  /*****
   *
   * API Section
   *
   */

  const submitData = () => {
    setErrorMessage({});
    if (accessEmail.trim() === '' || accessEmail.trim().length === 0) {
      setErrorMessage({accessEmail: 'This field is required'});
    } else if (
      selectedProfession.trim() === '' ||
      selectedProfession.trim().length === 0
    ) {
      setErrorMessage({selectedProfession: 'This field is required'});
    } else if (jobLocation.trim() === '' || jobLocation.trim().length === 0) {
      setErrorMessage({jobLocation: 'This field is required'});
    } else if (jobCountry.trim() === '' || jobCountry.trim().length === 0) {
      setErrorMessage({jobCountry: 'This field is required'});
    } else if (company.trim() === '' || company.trim().length === 0) {
      setErrorMessage({company: 'This field is required'});
    } else if (designation.trim() === '' || designation.trim().length === 0) {
      setErrorMessage({designation: 'This field is required'});
    } else if (salary.trim() === '' || salary.trim().length === 0) {
      setErrorMessage({salary: 'This field is required'});
    } else if (jobNature.trim() === '' || jobNature.trim().length === 0) {
      setErrorMessage({jobNature: 'This field is required'});
    } else if (parseInt(totalPositions, 10) === 0) {
      setErrorMessage({totalPositions: 'Position must be higher then 0'});
    } else if (jobTitle.trim() === '' || jobTitle.trim().length === 0) {
      setErrorMessage({jobTitle: 'This field is required'});
    } else if (jobDetail.trim() === '' || jobDetail.trim().length === 0) {
      setErrorMessage({jobDetail: 'This field is required'});
    } else {
      let requestObject = {
        title: jobTitle,
        description: jobDetail,
        ageBracket: {
          max: ageCriteria.selectedMaximumAge,
          min: ageCriteria.selectedMinimumAge,
        },
        email: accessEmail,
        userId: global.userId,
        designation: designation,
        city: jobLocation,
        country: jobCountry,
        annualSalary: salary,
        profession: selectedProfession,
        forCompany: company,
        numOfPosition: parseInt(totalPositions, 10),
        nature: jobNature,
        gender: parseInt(selectedGender, 10),
        postDate: selectedDate.getTime(),
      };

      if (logoData !== undefined && logoData !== null) {
        requestObject.logo = logoData.thumbnail;
      } else {
        requestObject.logo = '';
      }

      if (global.isConnected) {
        setLoader(true);
        if (isInEditMode) {
          editJobData(requestObject);
        } else {
          saveJob(requestObject);
        }
      }
    }
  };

  const searchProfession = searchText => {
    if (searchText.length > 0) {
      var filtered = professionListMain.filter(element =>
        element.text.toLowerCase().includes(searchText.toLowerCase()),
      );
      setProfessionList([...filtered]);
    } else {
      setProfessionList([...professionListMain]);
    }
  };

  const searchCountry = searchText => {
    if (searchText.length > 0) {
      var filtered = countryListMain.filter(element =>
        element.text.toLowerCase().includes(searchText.toLowerCase()),
      );
      setCountryCodeList([...filtered]);
    } else {
      setCountryCodeList([...countryListMain]);
    }
  };

  const sliderValueChange = value => {
    setAgeCriteria({
      ...ageCriteria,
      selectedMaximumAge: value[1],
      selectedMinimumAge: value[0],
    });
  };

  const createGenderRadioButtons = value => {
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
      {
        key: '2',
        label: 'Any',
        selected: value === '2' || false,
      },
    ];
  };

  const renderRadioButton = gender => {
    const radioObj = createGenderRadioButtons(gender);
    return radioObj.map((item, key) => {
      return (
        <View key={key} style={{margin: scale(5)}}>
          <Radio
            item={item}
            title={item.label}
            onRadioSelect={value => {
              setSelectedGender(value.key);
            }}
            selected={item.selected}
          />
        </View>
      );
    });
  };

  const handleInput = (key, value) => {
    let oldData = errorMessage;
    switch (key) {
      case 'accessEmail':
        setAccessEmail(value);
        delete oldData.accessEmail;
        setErrorMessage(oldData);
        break;
      case 'jobLocation':
        setJobLocation(value);
        delete oldData.jobLocation;
        setErrorMessage(oldData);
        break;
      case 'jobCountry':
        setJobCountry(value);
        delete oldData.jobCountry;
        setErrorMessage(oldData);
        break;
      case 'company':
        setCompany(value);
        delete oldData.company;
        setErrorMessage(oldData);
        break;
      case 'designation':
        setDesignation(value);
        delete oldData.designation;
        setErrorMessage(oldData);
        break;
      case 'salary':
        setSalary(value);
        delete oldData.salary;
        setErrorMessage(oldData);
        break;
      case 'totalPositions':
        setTotalPositions(value);
        delete oldData.totalPositions;
        setErrorMessage(oldData);
        break;
      case 'jobTitle':
        setJobTitle(value);
        delete oldData.jobTitle;
        setErrorMessage(oldData);
        break;
      case 'jobDetail':
        setJobDetail(value);
        delete oldData.jobDetail;
        setErrorMessage(oldData);
        break;
    }
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <HeaderBar
        title={isInEditMode ? 'Edit a Job' : 'Post a Job'}
        navigation={navigation}
        showBack={true}
      />
      <SafeAreaView style={GlobalInclude.AppStyle.topSpace}>
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
              <View
                style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15, g.pt30]}>
                <KeyboardAwareScrollView
                  keyboardShouldPersistTaps={'handled'}
                  style={grid.flex1}
                  showsVerticalScrollIndicator={false}>
                  <View style={grid.flex1}>
                    <View style={g.mb15}>
                      {generateHeader(
                        'My E-Mail Id for Receiving Application(s)',
                        true,
                      )}
                      <TextInput
                        underlineColorAndroid="transparent"
                        style={g.inputWhite}
                        value={accessEmail}
                        maxLength={264}
                        keyboardType={'default'}
                        autoCapitalize={'none'}
                        returnKeyType={'done'}
                        placeholder={'Type your email address'}
                        onChangeText={value => {
                          handleInput('accessEmail', value);
                        }}
                      />
                      {errorMessage.accessEmail &&
                        errorMessage.accessEmail.length > 0 && (
                          <Text style={[g.errorMsg, g.pt5]}>
                            {errorMessage.accessEmail}
                          </Text>
                        )}
                    </View>

                    <View style={g.mb15}>
                      {generateHeader('Select Profession', true)}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={g.inputWhite}
                        onPress={() => {
                          if (professionRef.current !== null) {
                            professionRef.current.open();
                          }
                        }}>
                        <View style={grid.rowdir}>
                          <Text
                            style={[
                              grid.col,
                              g.FHNR,
                              grid.justifyContentCenter,
                              {textAlignVertical: 'center'},
                            ]}
                            numberOfLines={1}>
                            {selectedProfession !== ''
                              ? selectedProfession
                              : 'Profession'}
                          </Text>
                          <View style={style.triangleShape} />
                        </View>
                      </TouchableOpacity>
                      {errorMessage.selectedProfession &&
                        errorMessage.selectedProfession.length > 0 && (
                          <Text style={[g.errorMsg, g.pt5]}>
                            {errorMessage.selectedProfession}
                          </Text>
                        )}
                    </View>
                    <View style={g.mb15}>
                      <View style={[grid.rowdir, grid.alignItemsTop]}>
                        <Text style={g.labeltext1}>Age Bracket</Text>
                        <Text style={g.colorRed}>*</Text>

                        <Text
                          style={[
                            g.labeltext1,
                            g.ml5,
                          ]}>{`${ageCriteria.selectedMinimumAge}-${ageCriteria.selectedMaximumAge}`}</Text>
                      </View>

                      <View style={[g.pl15, g.pr15]}>
                        <MultiSlider
                          values={[
                            ageCriteria.selectedMinimumAge,
                            ageCriteria.selectedMaximumAge,
                          ]}
                          markerStyle={{
                            height: 20,
                            width: 20,
                            borderRadius: 15,
                            backgroundColor: '#ffffff',
                            borderWidth: 2,
                            borderColor: '#001fa3',
                          }}
                          selectedStyle={{backgroundColor: '#001fa3'}}
                          sliderLength={deviceWidth - 80}
                          onValuesChange={sliderValueChange}
                          min={1}
                          max={70}
                          step={1}
                          snapped
                          allowOverlap={false}
                        />
                      </View>
                      {errorMessage.ageCriteria &&
                        errorMessage.ageCriteria.length > 0 && (
                          <Text style={[g.errorMsg, g.pt5]}>
                            {errorMessage.ageCriteria}
                          </Text>
                        )}
                    </View>
                    <View style={g.mb15}>
                      {generateHeader('Job City/Location', true)}
                      <TextInput
                        underlineColorAndroid="transparent"
                        style={g.inputWhite}
                        value={jobLocation}
                        maxLength={100}
                        keyboardType={'default'}
                        autoCapitalize={'words'}
                        returnKeyType={'done'}
                        placeholder={'Type the location here'}
                        onChangeText={value => {
                          handleInput('jobLocation', value);
                        }}
                      />
                      {errorMessage.jobLocation &&
                        errorMessage.jobLocation.length > 0 && (
                          <Text style={[g.errorMsg, g.pt5]}>
                            {errorMessage.jobLocation}
                          </Text>
                        )}
                    </View>
                    <View style={g.mb15}>
                      {generateHeader('Job Country', true)}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={g.inputWhite}
                        onPress={() => {
                          if (
                            countryRef &&
                            countryRef.current !== undefined &&
                            countryRef.current !== null
                          ) {
                            countryRef.current.open();
                          }
                        }}>
                        <View style={grid.rowdir}>
                          <Text
                            style={[
                              grid.col,
                              g.FHNR,
                              grid.justifyContentCenter,
                              {textAlignVertical: 'center'},
                            ]}
                            numberOfLines={1}>
                            {jobCountry !== '' ? jobCountry : 'Select Country'}
                          </Text>
                          <View style={style.triangleShape} />
                        </View>
                      </TouchableOpacity>

                      {errorMessage.jobCountry &&
                        errorMessage.jobCountry.length > 0 && (
                          <Text style={[g.errorMsg, g.pt5]}>
                            {errorMessage.jobCountry}
                          </Text>
                        )}
                    </View>
                    <View style={g.mb15}>
                      {generateHeader('Company', true)}
                      <TextInput
                        underlineColorAndroid="transparent"
                        style={g.inputWhite}
                        value={company}
                        maxLength={100}
                        keyboardType={'default'}
                        autoCapitalize={'words'}
                        returnKeyType={'done'}
                        placeholder={'eg. Incred Applications Pvt. Ltd.'}
                        onChangeText={value => {
                          handleInput('company', value);
                        }}
                      />
                      {errorMessage.company &&
                        errorMessage.company.length > 0 && (
                          <Text style={[g.errorMsg, g.pt5]}>
                            {errorMessage.company}
                          </Text>
                        )}
                    </View>
                    <View style={g.mb15}>
                      {generateHeader('Designation', true)}
                      <TextInput
                        underlineColorAndroid="transparent"
                        style={g.inputWhite}
                        value={designation}
                        maxLength={100}
                        keyboardType={'default'}
                        autoCapitalize={'words'}
                        returnKeyType={'done'}
                        placeholder={'eg. Marketing Executive'}
                        onChangeText={value => {
                          handleInput('designation', value);
                        }}
                      />
                      {errorMessage.designation &&
                        errorMessage.designation.length > 0 && (
                          <Text style={[g.errorMsg, g.pt5]}>
                            {errorMessage.designation}
                          </Text>
                        )}
                    </View>
                    <View style={g.mb15}>
                      {generateHeader('Annual Salary', true)}
                      <TextInput
                        underlineColorAndroid="transparent"
                        style={g.inputWhite}
                        value={salary}
                        maxLength={100}
                        keyboardType={'default'}
                        autoCapitalize={'characters'}
                        returnKeyType={'done'}
                        placeholder={'Enter Salary'}
                        onChangeText={value => {
                          handleInput('salary', value);
                        }}
                      />
                      {errorMessage.salary &&
                        errorMessage.salary.length > 0 && (
                          <Text style={[g.errorMsg, g.pt5]}>
                            {errorMessage.salary}
                          </Text>
                        )}
                    </View>

                    <View style={[grid.row, g.mb15]}>
                      <View style={grid.col}>
                        {generateHeader('Number of Position(s)', true)}
                        <TextInput
                          underlineColorAndroid="transparent"
                          style={g.inputWhite}
                          value={totalPositions}
                          maxLength={5}
                          keyboardType={'number-pad'}
                          returnKeyType={'done'}
                          placeholder={'Position(s)'}
                          onChangeText={value => {
                            handleInput('totalPositions', value);
                          }}
                        />
                        {errorMessage.totalPositions &&
                          errorMessage.totalPositions.length > 0 && (
                            <Text style={[g.errorMsg, g.pt5]}>
                              {errorMessage.totalPositions}
                            </Text>
                          )}
                      </View>
                      <View style={g.p10} />
                      <View style={grid.col}>
                        {generateHeader('Nature of Hire', true)}
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={g.inputWhite}
                          onPress={() => {
                            if (jobNatureRef.current !== null) {
                              jobNatureRef.current.open();
                            }
                          }}>
                          <View style={grid.rowdir}>
                            <Text
                              style={[
                                grid.col,
                                g.FHNR,
                                grid.justifyContentCenter,
                                {textAlignVertical: 'center'},
                              ]}
                              numberOfLines={1}>
                              {jobNature !== '' ? jobNature : 'Select Nature'}
                            </Text>
                            <View style={style.triangleShape} />
                          </View>
                        </TouchableOpacity>
                        {errorMessage.jobNature &&
                          errorMessage.jobNature.length > 0 && (
                            <Text style={[g.errorMsg, g.pt5]}>
                              {errorMessage.jobNature}
                            </Text>
                          )}
                      </View>
                    </View>
                    <View style={g.mb15}>
                      {generateHeader('Title of Job Post', true)}
                      <TextInput
                        underlineColorAndroid="transparent"
                        style={g.inputWhite}
                        value={jobTitle}
                        maxLength={1000}
                        keyboardType={'default'}
                        autoCapitalize={'sentences'}
                        returnKeyType={'done'}
                        placeholder={'Type here'}
                        onChangeText={value => {
                          handleInput('jobTitle', value);
                        }}
                      />
                      {errorMessage.jobTitle &&
                        errorMessage.jobTitle.length > 0 && (
                          <Text style={[g.errorMsg, g.pt5]}>
                            {errorMessage.jobTitle}
                          </Text>
                        )}
                    </View>
                    <View style={g.mb15}>
                      {generateHeader('Text of Job Post', true)}
                      <TextInput
                        underlineColorAndroid="transparent"
                        style={{
                          height: 120,
                          color: 'black',
                          textAlignVertical: 'top',
                          backgroundColor: '#f8f8f8',
                          padding: scale(10),
                          margin: 0,
                          fontSize: scale(12),
                          borderRadius: scale(8),
                          fontFamily: 'Lato-Regular',
                          justifyContent: 'center',
                        }}
                        multiline={true}
                        value={jobDetail}
                        maxLength={3000}
                        keyboardType={'default'}
                        autoCapitalize={'sentences'}
                        returnKeyType="done"
                        blurOnSubmit={true}
                        placeholder={'Type here'}
                        onChangeText={value => {
                          handleInput('jobDetail', value);
                        }}
                      />
                      {errorMessage.jobDetail &&
                        errorMessage.jobDetail.length > 0 && (
                          <Text style={[g.errorMsg, g.pt5]}>
                            {errorMessage.jobDetail}
                          </Text>
                        )}
                    </View>

                    <View style={g.mb15}>
                      {generateHeader('Gender', true)}
                      <View
                        style={[
                          grid.rowdir,
                          {
                            height: scale(38),
                            alignSelf: 'center',
                            alignContent: 'center',
                          },
                        ]}>
                        {renderRadioButton(selectedGender)}
                      </View>
                    </View>
                    {/* <View style={g.mb15}>
                      {generateHeader('Post Ad Date', true)}
                      <TouchableOpacity
                        style={[g.inputWhite]}
                        onPress={() => {
                          setShowDatePicker(true);
                        }}>
                        <Text
                          style={[
                            grid.col,
                            g.FHNR,
                            {textAlignVertical: 'center'},
                          ]}
                          numberOfLines={1}>
                          {moment(selectedDate).format('DD/MM/YYYY')}
                        </Text>
                        <View
                          style={{
                            position: 'absolute',
                            right: 10,
                            top: 12,
                            zIndex: 2,
                          }}>
                          <GlobalInclude.BaseIcon
                            containerStyle={{
                              height: scale(14),
                              width: scale(14),
                            }}
                            iconColor={'#bababa'}
                            iconName={'calendar'}
                            iconSize={scale(14)}
                            iconType={IconType[4]}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                     */}
                    <View style={g.mb15}>
                      {generateHeader('Upload Company Logo', false)}
                      <View style={[grid.rowdir]}>
                        <TouchableOpacity
                          style={[grid.col, g.mr10]}
                          activeOpacity={1}
                          onPress={() => {
                            if (
                              uploadRef.current !== null &&
                              uploadRef.current !== undefined
                            ) {
                              uploadRef.current.open();
                            }
                          }}>
                          <View
                            style={[
                              grid.row,
                              g.inputWhite,
                              grid.alignItems,
                              g.pb5,
                              g.pt5,
                            ]}>
                            <GlobalInclude.BaseIcon
                              containerStyle={{
                                height: scale(28),
                                width: scale(28),
                                justifyContent: 'center',
                              }}
                              iconColor={'#bababa'}
                              iconName={'download'}
                              iconSize={scale(22)}
                              iconType={IconType[4]}
                            />
                            <Text
                              style={[
                                grid.col,
                                g.fs14,
                                g.colorLightGray,
                                g.FHNR,
                              ]}>
                              {logoData !== null
                                ? 'Image Uploaded'
                                : 'Click to Upload Image'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => {
                            if (
                              uploadRef.current !== null &&
                              uploadRef.current !== undefined
                            ) {
                              uploadRef.current.open();
                            }
                          }}
                          style={[
                            g.p15,
                            g.bglightGray,
                            {
                              width: 50,
                              height: 50,
                              borderRadius: 10,
                              alignSelf: 'center',
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                          ]}>
                          <Image
                            source={GlobalInclude.Assets.UploadIcon}
                            resizeMode="contain"
                            style={[
                              g.w20,
                              {height: 23},
                              grid.justifyContent,
                              grid.alignItems,
                            ]}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </KeyboardAwareScrollView>
                {isInEditMode ? (
                  <NextPreviousButton
                    isLoading={loader}
                    nextTitle={'Save/Update'}
                    prviousTitle={'Position Filled'}
                    onPreviuosTab={() => {
                      setShowModal(!showModal);
                    }}
                    onSaveTab={() => {
                      submitData();
                    }}
                  />
                ) : (
                  <View style={style.buttonContainer}>
                    <CommonButton
                      showLoader={loader}
                      title={'Post Now'}
                      onPress={() => submitData()}
                    />
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
      <ProfessionalSheet
        refRBSheet={professionRef}
        dataList={professionList}
        searchProfession={query => {
          searchProfession(query);
        }}
        selectedProfession={selectedProfession}
        setSelectedProfession={value => {
          console.log('value', value);
          setSelectedProfession(value);
          setProfessionList([...professionListMain]);
          let oldData = errorMessage;
          delete oldData.selectedProfession;
          setErrorMessage(oldData);
          professionRef.current.close();
        }}
        onClose={() => {}}
      />

      <RBSheet
        ref={countryRef}
        height={deviceHeight - 150}
        minClosingHeight={50}
        duration={350}
        closeOnDragDown={true}
        customStyles={{
          container: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingStart: scale(15),
            paddingEnd: scale(15),
            paddingBottom: scale(20),
          },
        }}>
        <BottomSheetHeader
          title={'Select Country'}
          showSearch={true}
          onSeachQuery={query => {
            searchCountry(query);
          }}
        />

        <RadioButton
          capitalize={true}
          defaultSelected={jobCountry}
          PROP={countryCodeList}
          onRadioSelect={value => {
            setJobCountry(value.text);
            setCountryCodeList([...countryListMain]);
            countryRef.current.close();
          }}
        />
      </RBSheet>
      <RBSheet
        ref={jobNatureRef}
        height={300}
        minClosingHeight={50}
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
          style={[g.fs18, g.FHNB, g.txtCenter, g.colorBlack, g.mt5, g.mb15]}>
          Select Hire Nature
        </Text>
        <RadioButton
          PROP={jobNatureList}
          defaultSelected={jobNature}
          onRadioSelect={value => {
            setJobNature(value.text);
            jobNatureRef.current.close();
          }}
        />
      </RBSheet>
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          testID={'dateTimePicker'}
          value={new Date()}
          mode={'date'}
          display={'spinner'}
          minimumDate={new Date()}
          dateFormat={'day month year'}
          onChange={(event, selected) => {
            if (event && event !== null && event !== undefined) {
              if (event.type === 'set') {
                const currentDate = selected || new Date();
                setShowDatePicker(false);
                setTimeout(() => {
                  setSelectedDate(currentDate);
                }, 100);
              } else {
                setShowDatePicker(false);
              }
            } else {
              setShowDatePicker(false);
            }
          }}
          onTouchCancel={event => {
            setShowDatePicker(false);
          }}
        />
      )}
      {showDatePicker && Platform.OS === 'ios' && (
        <DatePickerView
          onCloseAction={() => {
            setShowDatePicker(false);
          }}
          onDateSelect={obj => {
            setSelectedDate(obj.serverDate);
          }}
        />
      )}
      {showErrorMessage && (
        <GlobalInclude.ModalAlert
          status={showErrorMessage}
          header={responseMessage}
          okButton={isSuccess ? 'Okay' : `Contact ${APP_NAME}`}
          okAction={() => {
            setShowErrorMessage(!showErrorMessage);
            if (isSuccess) {
              navigation.goBack();
            }
          }}
          closeAction={() => {
            setShowErrorMessage(!showErrorMessage);
          }}
        />
      )}
      {/* country code picker */}
      {showCountryPicker && (
        <CountryPicker
          withFilter={true}
          modalProps={{animationType: 'slide'}}
          visible
          withFlag={false}
          onClose={() => {
            setShowCountryPicker(false);
          }}
          onSelect={country => {
            handleInput('jobCountry', country.name);
          }}
        />
      )}
      {showModal && (
        <GlobalInclude.ModalAlert
          status={showModal}
          header={'Would you Like To Close This Job ?'}
          okButton={'No'}
          cancelButton={'Yes'}
          okAction={() => {
            setShowModal(!showModal);
          }}
          cancelAction={() => {
            setShowModal(!showModal);

            let requestObject = {
              status: 3,
            };
            editJobData(requestObject);
          }}
          closeAction={() => {
            setShowModal(!showModal);
          }}
        />
      )}
      <UploadMedia
        navigation={navigation}
        refRBSheet={uploadRef}
        media={{
          image: false,
          video: true,
          document: true,
          audio: true,
        }}
        supportMultiple={false}
        onPickMedia={media => {
          uploadRef.current.close();
          if (media !== undefined && media !== null) {
            console.log('media', media);
            setLogoData(media[0]);
          }
        }}
      />
    </View>
  );
};

const style = StyleSheet.create({
  addTag: {
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    color: '#ffffff',
    textAlign: 'center',
    fontSize: scale(16),
    padding: scale(8),
    borderRadius: scale(8),
    overflow: 'hidden',
    width: scale(80),
  },
  addImageStyle: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: scale(16),
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
    borderTopColor: '#d6d6d6',
    marginLeft: 8,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
  },
});

export default AddJobPost;
