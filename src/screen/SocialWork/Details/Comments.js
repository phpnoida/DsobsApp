import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import ProgressImage from '../../../component/ProgresImage';
import {IconType} from '../../../helper/Constants';

const Tags = ({content, productTags}) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const renderList = () => {
    return productTags.map((item, index) => {
      return (
        <View style={g.mb5} key={index}>
          <View style={[grid.rowdir]}>
            <View>
              <View
                style={[
                  g.mr10,
                  g.bggray,
                  g.oh,
                  {width: scale(35), borderRadius: scale(50)},
                ]}>
                <ProgressImage
                  source={GlobalInclude.Assets.DefaultProfile}
                  containerStyle={{
                    aspectRatio: 1 / 1,
                    alignSelf: 'center',
                    width: scale(35),
                    justifyContent: 'center',
                  }}
                  mode={'cover'}
                />
              </View>
            </View>
            <View>
              <Text style={[g.fs14, g.FHNR, g.colordarkGray]}>Rahul Kumar</Text>
              <Text style={[g.fs12, g.FHNR, g.colorBlue, g.mt5]}>
                12/02/2021
              </Text>
              <Text style={[g.fs15, g.FHNR, g.colorLightGray, g.mt5]}>
                This is static design
              </Text>
            </View>
          </View>
          <View style={[grid.rowdir, g.mb5, grid.justifyContentRight]}>
            <TouchableOpacity
              hitSlop={{top: 10, bottom: 10, left: 10, right: 0}}
              activeOpacity={0.8}
              onPress={() => {
                setShowCommentModal(true);
              }}
              style={[
                grid.rowdir,
                grid.alignItems,
                grid.justifyContentCenter,
                g.bgBlue,
                g.mr10,
                {
                  width: scale(22),
                  height: scale(22),
                  borderRadius: scale(22),
                  elevation: 1,
                },
              ]}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(12), width: scale(12)}}
                iconColor={'#fff'}
                iconName={'pencil'}
                iconSize={scale(12)}
                iconType={IconType[4]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              activeOpacity={0.8}
              onPress={() => {}}
              style={[
                grid.rowdir,
                grid.alignItems,
                grid.justifyContentCenter,
                g.bgBlue,
                {
                  width: scale(22),
                  height: scale(22),
                  borderRadius: scale(22),
                  elevation: 1,
                },
              ]}>
              <GlobalInclude.BaseIcon
                containerStyle={{height: scale(12), width: scale(12)}}
                iconColor={'#fff'}
                iconName={'close'}
                iconSize={scale(12)}
                iconType={IconType[4]}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15]}>
      <View style={[grid.rowdir, grid.justifyContentRight, g.mb10]}>
        <Text
          style={g.btn}
          onPress={() => {
            setShowCommentModal(true);
          }}>
          {'Submit your comments'}
        </Text>
      </View>
      <View>
        {productTags &&
        productTags !== undefined &&
        productTags !== null &&
        productTags.length > 0 ? (
          <ScrollView
            contentContainerStyle={{paddingBottom: scale(70)}}
            showsVerticalScrollIndicator={false}>
            {renderList()}
          </ScrollView>
        ) : (
          <View style={GlobalInclude.AppStyle.center}>
            <Text style={[g.fs16, g.FHNB, g.colorBlack]}>
              Currently No Data Uploaded!
            </Text>
          </View>
        )}
      </View>

      <Modal
        transparent={true}
        visible={showCommentModal}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          setShowCommentModal(false);
        }}>
        <ScrollView
          contentContainerStyle={[
            g.bgBlack,
            grid.flex1,
            g.p15,
            {paddingTop: '25%'},
          ]}>
          <View style={grid.col}>
            <View style={[g.bgWhite, g.p15, g.br3]}>
              <View style={[grid.justifyContentRight, grid.rowdir]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setShowCommentModal(false);
                  }}
                  hitSlop={{
                    top: 15,
                    bottom: 15,
                    left: 15,
                    right: 15,
                  }}>
                  <GlobalInclude.BaseIcon
                    containerStyle={{height: scale(26), width: scale(26)}}
                    iconColor={'#808080'}
                    iconName={'close'}
                    iconSize={scale(26)}
                    iconType={IconType[8]}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[g.fs12, g.FHNR, g.mb5, g.pt10]}>
                Post Your Comment
              </Text>
              <TextInput
                maxLength={1000}
                placeholder={'Write Text Here'}
                underlineColorAndroid="transparent"
                multiline={true}
                autoFocus
                style={[
                  g.mt10,
                  g.bgWhite,
                  g.textareaStyle,
                  {minHeight: 100, maxHeight: 100, height: 100},
                ]}
                onChangeText={(comment) => {}}
              />
              <Text style={[g.fs12, g.FHNR, g.mb5, g.pt10, g.txtRight]}>
                Max 1000 characters: 0
              </Text>
              <View style={[grid.rowdir, g.mt10]}>
                {isCommenting ? (
                  <ActivityIndicator size="large" color="#666666" />
                ) : (
                  <Text style={[g.btn, g.mr5, g.fs12]} onPress={() => {}}>
                    Post Comment
                  </Text>
                )}

                <Text
                  style={[g.btn, g.bggray, g.fs12]}
                  onPress={() => {
                    setShowCommentModal(false);
                  }}>
                  Cancel
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default Tags;
