import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import GlobalInclude from '../../globalInclude/Globalinclude';
import TopHeaderView from '../../component/TopHeaderView';
import {scale} from '../../theme/Scalling';
import g from '../../theme/global';
import grid from '../../theme/grid';
import CommonButton from '../../component/CommonButton';

const {width} = Dimensions.get('window');

const Teachers = ({navigation}) => {
  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <TopHeaderView navigation={navigation} index={6} />
      <SafeAreaView
        style={[
          GlobalInclude.AppStyle.contentSpace,
          GlobalInclude.AppStyle.fill,
          g.bgWhite,
        ]}>
        <View style={GlobalInclude.AppStyle.fill}>
          <Image
            source={GlobalInclude.Assets.AppLogo}
            style={{
              width: width - 170,
              height: 200,
              alignSelf: 'center',
              marginBottom: scale(10),
            }}
            resizeMode={'cover'}
          />
          <Text
            style={[
              g.fs18,
              g.FHNB,
              g.Fbold,
              g.colorBlack,
              g.txtCenter,
              {letterSpacing: 1},
            ]}>
            {'Giving Back to Our Masters'}
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[g.ml10, g.mr10, g.pt15, g.pb15]}>
            <Text
              style={[
                g.fs15,
                g.colorBlack,
                {
                  textAlign: 'justify',
                  justifyContent: 'center',
                  alignContent: 'center',
                  textAlignVertical: 'center',
                  letterSpacing: 1,
                  lineHeight: 25,
                },
              ]}>
              Our Masters at Doon not only taught and educated us, some of them
              played a substantial role in shaping us as the men we eventually
              became.
            </Text>
            <Text
              style={[
                g.fs15,
                g.mt10,
                g.colorBlack,
                {
                  textAlign: 'justify',
                  justifyContent: 'center',
                  alignContent: 'center',
                  textAlignVertical: 'center',
                  letterSpacing: 1,
                  lineHeight: 25,
                },
              ]}>
              This is a section of thanks to our Masters.
            </Text>
            <Text
              style={[
                g.fs15,
                g.mt10,
                g.colorBlack,
                {
                  textAlign: 'justify',
                  justifyContent: 'center',
                  alignContent: 'center',
                  textAlignVertical: 'center',
                  letterSpacing: 1,
                  lineHeight: 25,
                },
              ]}>
              We have listed the names, and contact details of Masters if any of
              us would like to get in touch with them.
            </Text>
            <Text
              style={[
                g.fs15,
                g.mt10,
                g.colorBlack,
                {
                  textAlign: 'justify',
                  justifyContent: 'center',
                  alignContent: 'center',
                  textAlignVertical: 'center',
                  letterSpacing: 1,
                  lineHeight: 25,
                },
              ]}>
              We also have a list of Volunteers,DOSCOS from different
              professional fields that have volunteers to do services - free or
              at cost, for our retired Masters.
            </Text>
          </ScrollView>
        </View>
        <View style={[grid.rowdir, grid.justifyContentCenter, g.mt10, g.mb10]}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            <CommonButton
              showLoader={false}
              title={'Masters'}
              onPress={() => {
                navigation.navigate('TeachersList');
              }}
            />
          </View>

          <View style={{marginHorizontal: scale(10)}} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              alignContent: 'center',
              alignSelf: 'center',
            }}>
            <CommonButton
              showLoader={false}
              title={'Volunteers'}
              onPress={() => {
                navigation.navigate('VolunteerList');
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default Teachers;
