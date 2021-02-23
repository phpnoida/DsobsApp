/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import Globalinclude from '../../globalInclude/Globalinclude';
import {scale} from '../../theme/Scalling';

const generateView = (title, subTitle) => {
  return (
    <View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {}}
        style={[g.boxShadow, g.bgWhite, g.br3, g.mb10, g.p15]}>
        <View style={[grid.rowdir, grid.alignItems]}>
          <View style={[grid.col, g.pl15]}>
            <Text style={[g.colordarkGray, g.fs16, g.FHNB, g.mb5]}>
              {title}
            </Text>
            <Text style={[g.colorLightGray, g.fs14, g.FHNR]}>{subTitle}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const AboutMe = (props) => {
  return (
    <View style={{paddingStart: scale(15), paddingEnd: scale(15), flex: 1}}>
      {props.aboutMe === '' &&
      props.schoolMemories === '' &&
      props.philosophy === '' &&
      props.hobbies === '' &&
      props.favMusician === '' &&
      props.favMovies === '' &&
      props.favBooks === '' &&
      props.favPeople === '' &&
      props.philanthorpy === '' &&
      props.favSportsTeams === '' ? (
        <View style={Globalinclude.AppStyle.fillCenter}>
          <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
            Currently No Data Uploaded!
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{padding: scale(5)}}>
            {props.aboutMe !== ''
              ? generateView('About me', props.aboutMe)
              : null}
            {props.schoolMemories !== ''
              ? generateView('Memories of School', props.schoolMemories)
              : null}
            {props.philosophy !== ''
              ? generateView(
                  'Personal/Professional Philosophy',
                  props.philosophy,
                )
              : null}
            {props.hobbies !== ''
              ? generateView('Hobbies - Interests', props.hobbies)
              : null}
            {props.favMusician !== ''
              ? generateView('Favourite Musicians / Groups', props.favMusician)
              : null}
            {props.favMovies !== ''
              ? generateView('Favourite Movies', props.favMovies)
              : null}
            {props.favBooks !== ''
              ? generateView('Favourite Books', props.favBooks)
              : null}
            {props.favPeople !== ''
              ? generateView('People I Look Up To', props.favPeople)
              : null}
            {props.philanthorpy !== ''
              ? generateView('Philanthrophy', props.philanthorpy)
              : null}
            {props.favSportsTeams !== ''
              ? generateView('Sports Teams You Support', props.favSportsTeams)
              : null}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default AboutMe;
