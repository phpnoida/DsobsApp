import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import NextPreviousButton from '../../component/NextPreviousButton';
import {updateUserProfile} from '../../Actions/UserActions';
import {scale} from '../../theme/Scalling';

let responseMessage = '';
const AboutMe = (props) => {
  const {profileData} = props;

  const [isLoading, setIsLoading] = useState(false);
  const [showContactUsModal, setShowContactUsModal] = useState(false);

  const [aboutMe, setAboutMe] = useState('');
  const [memoriesOfSchool, setMemoriesOfSchool] = useState('');
  const [philosophy, setPhilosophy] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [favMusician, setFavMusician] = useState('');
  const [favMovies, setFavMovies] = useState('');
  const [favBooks, setFavBooks] = useState('');
  const [favPeople, setFavPeople] = useState('');
  const [philanthorpy, setPhilanthorpy] = useState('');
  const [favSportsTeams, setFavSportsTeams] = useState('');

  useEffect(() => {
    setAboutMe(profileData.aboutMe);
    setMemoriesOfSchool(profileData.schoolMemories);
    setPhilosophy(profileData.philosophy);
    setHobbies(profileData.hobbies);
    setFavMusician(profileData.favMusician);
    setFavMovies(profileData.favMovies);
    setFavBooks(profileData.favBooks);
    setFavPeople(profileData.favPeople);
    setPhilanthorpy(profileData.philanthorpy);
    setFavSportsTeams(profileData.favSportsTeams);
    return () => {};
  }, [profileData]);

  /**
   *
   * API Section start
   *
   */
  const updateProfileDetails = () => {
    let requestData = {};

    if (aboutMe !== undefined && aboutMe !== null) {
      requestData.aboutMe = aboutMe;
    }
    if (memoriesOfSchool !== undefined && memoriesOfSchool !== null) {
      requestData.schoolMemories = memoriesOfSchool;
    }
    if (philosophy !== undefined && philosophy !== null) {
      requestData.philosophy = philosophy;
    }
    if (hobbies !== undefined && hobbies !== null) {
      requestData.hobbies = hobbies;
    }
    if (favMusician !== undefined && favMusician !== null) {
      requestData.favMusician = favMusician;
    }
    if (favMovies !== undefined && favMovies !== null) {
      requestData.favMovies = favMovies;
    }
    if (favBooks !== undefined && favBooks !== null) {
      requestData.favBooks = favBooks;
    }
    if (favPeople !== undefined && favPeople !== null) {
      requestData.favPeople = favPeople;
    }
    if (favSportsTeams !== undefined && favSportsTeams !== null) {
      requestData.favSportsTeams = favSportsTeams;
    }
    if (philanthorpy !== undefined && philanthorpy !== null) {
      requestData.philanthorpy = philanthorpy;
    }

    if (Object.keys(requestData).length !== 0) {
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
            console.log('error', error);
            setIsLoading(false);
            responseMessage = message;
            setShowContactUsModal(true);
          },
        );
      }
    } else {
      setTimeout(() => {
        props.onSaveTab();
      }, 500);
    }
  };
  /**
   *
   * API Section end
   *
   */

  const inputHandler = (fieldName, fieldValue) => {
    if (fieldName === 'aboutMe') {
      setAboutMe(fieldValue);
    } else if (fieldName === 'memoriesOfSchool') {
      setMemoriesOfSchool(fieldValue);
    } else if (fieldName === 'philosophy') {
      setPhilosophy(fieldValue);
    } else if (fieldName === 'hobbies') {
      setHobbies(fieldValue);
    } else if (fieldName === 'favMusician') {
      setFavMusician(fieldValue);
    } else if (fieldName === 'favMovies') {
      setFavMovies(fieldValue);
    } else if (fieldName === 'favBooks') {
      setFavBooks(fieldValue);
    } else if (fieldName === 'favPeople') {
      setFavPeople(fieldValue);
    } else if (fieldName === 'philanthorpy') {
      setPhilanthorpy(fieldValue);
    } else if (fieldName === 'favSportsTeams') {
      setFavSportsTeams(fieldValue);
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

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
      style={GlobalInclude.AppStyle.fill}>
      <View style={GlobalInclude.AppStyle.fill}>
        <KeyboardAwareScrollView
          style={[g.mt20, grid.flex1]}
          showsVerticalScrollIndicator={false}>
          <View style={[grid.flex1]}>
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
            {generateHeader('About Me', false)}
            <View style={{marginBottom: scale(2)}} />
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={6}
              multiline={true}
              style={[g.inputWhite, {height: 100, textAlignVertical: 'top'}]}
              autoCapitalize="words"
              placeholder="Enter your text here"
              value={aboutMe}
              onChangeText={(value) => inputHandler('aboutMe', value)}
            />
            <View style={{marginVertical: scale(10)}} />
            {generateHeader('Memories of School', false)}
            <View style={{marginBottom: scale(2)}} />
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={6}
              multiline={true}
              style={[g.inputWhite, {height: 100, textAlignVertical: 'top'}]}
              autoCapitalize="words"
              placeholder="Enter your text here"
              value={memoriesOfSchool}
              onChangeText={(value) => inputHandler('memoriesOfSchool', value)}
            />
            <View style={{marginVertical: scale(10)}} />
            {generateHeader('Personal/Professional Philosophy', false)}
            <View style={{marginBottom: scale(2)}} />
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={6}
              multiline={true}
              style={[g.inputWhite, {height: 100, textAlignVertical: 'top'}]}
              autoCapitalize="words"
              placeholder="Enter your text here"
              value={philosophy}
              onChangeText={(value) => inputHandler('philosophy', value)}
            />
            <View style={{marginVertical: scale(10)}} />
            {generateHeader('Hobbies Interests Tags', false)}
            <View style={{marginBottom: scale(2)}} />
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={6}
              multiline={true}
              style={[g.inputWhite, {height: 100, textAlignVertical: 'top'}]}
              autoCapitalize="words"
              placeholder="Enter your text here"
              value={hobbies}
              onChangeText={(value) => inputHandler('hobbies', value)}
            />
            <View style={{marginVertical: scale(10)}} />
            {generateHeader('Favourite Musician/Groups', false)}
            <View style={{marginBottom: scale(2)}} />
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={6}
              multiline={true}
              style={[g.inputWhite, {height: 100, textAlignVertical: 'top'}]}
              autoCapitalize="words"
              placeholder="Enter your text here"
              value={favMusician}
              onChangeText={(value) => inputHandler('favMusician', value)}
            />
            <View style={{marginVertical: scale(10)}} />
            {generateHeader('Favourite Movies', false)}
            <View style={{marginBottom: scale(2)}} />
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={6}
              multiline={true}
              style={[g.inputWhite, {height: 100, textAlignVertical: 'top'}]}
              autoCapitalize="words"
              placeholder="Enter your text here"
              value={favMovies}
              onChangeText={(value) => inputHandler('favMovies', value)}
            />
            <View style={{marginVertical: scale(10)}} />
            {generateHeader('Favourite Books', false)}
            <View style={{marginBottom: scale(2)}} />
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={6}
              multiline={true}
              style={[g.inputWhite, {height: 100, textAlignVertical: 'top'}]}
              autoCapitalize="words"
              placeholder="Enter your text here"
              value={favBooks}
              onChangeText={(value) => inputHandler('favBooks', value)}
            />
            <View style={{marginVertical: scale(10)}} />
            {generateHeader('People I Look Up To', false)}
            <View style={{marginBottom: scale(2)}} />
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={6}
              multiline={true}
              style={[g.inputWhite, {height: 100, textAlignVertical: 'top'}]}
              autoCapitalize="words"
              placeholder="Enter your text here"
              value={favPeople}
              onChangeText={(value) => inputHandler('favPeople', value)}
            />
            <View style={{marginVertical: scale(10)}} />
            {generateHeader('Philanthropy', false)}
            <View style={{marginBottom: scale(2)}} />
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={6}
              multiline={true}
              style={[g.inputWhite, {height: 100, textAlignVertical: 'top'}]}
              autoCapitalize="words"
              placeholder="Enter your text here"
              value={philanthorpy}
              onChangeText={(value) => inputHandler('philanthorpy', value)}
            />
            <View style={{marginVertical: scale(10)}} />
            {generateHeader('Sports Teams I Support', false)}
            <View style={{marginBottom: scale(2)}} />
            <TextInput
              underlineColorAndroid="transparent"
              numberOfLines={6}
              multiline={true}
              style={[g.inputWhite, {height: 100, textAlignVertical: 'top'}]}
              autoCapitalize="words"
              placeholder="Enter your text here"
              value={favSportsTeams}
              onChangeText={(value) => inputHandler('favSportsTeams', value)}
            />
            <View style={{marginBottom: scale(40)}} />
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

export default AboutMe;
