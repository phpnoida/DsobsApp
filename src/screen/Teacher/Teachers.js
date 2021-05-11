import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import TopHeaderView from '../../component/TopHeaderView';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';

const {width} = Dimensions.get('window');

const Teachers = ({navigation}) => {
  return (
    <View style={GlobalInclude.AppStyle.topSpace}>
      <SafeAreaView style={GlobalInclude.AppStyle.parentStyle}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[GlobalInclude.AppStyle.contentSpace, g.bgWhite]}>
            <TopHeaderView navigation={navigation} index={6} />
            <View style={[grid.rowdir, grid.justifyContentCenter, g.mb20]}>
              <Image
                source={GlobalInclude.Assets.AppLogo}
                style={{width: width - 170, height: 200}}
                resizeMode={'cover'}
              />
            </View>
            <Text
              style={[
                g.fs16,
                g.FHNM,
                g.colordarkGray,
                g.txtCenter,
                {letterSpacing: 1},
              ]}>
              {'Giving Back to Our Masters'}
            </Text>
            <View style={[g.mt20]}>
              <View style={[g.mt20]}>
                <Text
                  style={[
                    g.fs14,
                    g.mb10,
                    g.colorLightGray,
                    {textAlign: 'justify'},
                  ]}>
                  {
                    'Our Masters at Doon, not only taught and educated us, some of them played a substantial role in shaping us as the men we eventually became. This is a section of thanks to our Masters. We have listed the names, and contact details of Masters if any of us would like to get in touch with them. We also have a section of Servers, Doscos from different professional fields that have volunteered to do services, free, or at cost, for our retired Masters.'
                  }
                </Text>
              </View>
            </View>
            <View style={[grid.rowdir, grid.justifyContentCenter, g.mt45]}>
              <TouchableOpacity
                style={[g.bbtnNew, g.mr10]}
                activeOpacity={1}
                onPress={() => {
                  navigation.navigate('TeachersList');
                }}>
                <Text style={[g.bbtnNewtxt]}>Contact A</Text>
                <Text style={[g.bbtnNewtxt]}>Teacher</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[g.bbtnNew, g.ml10]}
                activeOpacity={1}
                onPress={() => {
                  navigation.navigate('VolunteerList');
                }}>
                <Text style={[g.bbtnNewtxt]}>Contact A</Text>
                <Text style={[g.bbtnNewtxt]}>Volunteer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const richTextStyles = StyleSheet.create({
  p: {
    textAlign: 'justify',
    paddingStart: scale(4),
    paddingEnd: scale(4),
  },
});

const style = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    padding: scale(6),
  },
  mainContainer: {
    backgroundColor: '#ffffff',
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
    marginTop: scale(5),
    marginStart: scale(5),
    marginEnd: scale(5),
    marginBottom: scale(15),
  },
  videoContainer: {
    height: scale(200),
    width: '100%',
    borderRadius: scale(15),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
  },
  overlayStyle: {
    backgroundColor: '#00000066',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: scale(15),
  },
  thumbStyle: {
    borderRadius: scale(15),
    height: scale(200),
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  playIconstyle: {
    position: 'absolute',
    zIndex: 9,
    bottom: 15,
    left: 15,
  },
  childVideoContainer: {
    height: scale(100),
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
  },
  childThumb: {
    height: scale(100),
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  seeMore: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  showChildVideo: {
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    paddingBottom: 15,
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(150),
    alignContent: 'center',
    alignSelf: 'center',
  },
  contentContainer: {
    width: '100%',
    paddingStart: scale(10),
    paddingEnd: scale(10),
    paddingTop: scale(5),
    paddingBottom: scale(10),
  },
  closeButton: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
    flex: 1,
  },
});

export default Teachers;
