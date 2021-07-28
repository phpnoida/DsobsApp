import React from 'react';
import {Text, View, ScrollView} from 'react-native';
import {scale} from '../../../theme/Scalling';
import Helpers from '../../../helper/Helper';
import {showUser} from '../../../component/Common';
const PostedBy = ({content, navigation}) => (
  <View>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View
        style={{
          padding: scale(10),
          paddingBottom: scale(70),
          alignSelf: 'flex-start',
        }}>
        {showUser(
          content.userId.profileImg,
          Helpers.concatName(content.userId),
          `Batch ${content.userId.batch}`,
          null,
          () => {
            setTimeout(() => {
              navigation.navigate('UserProfile', {
                userId: content.userId._id,
              });
            }, 350);
          },
        )}
      </View>
    </ScrollView>
  </View>
);

export default PostedBy;
