import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import ProgressImage from '../../../component/ProgresImage';
import {IconType} from '../../../helper/Constants';
import Toast from '../../../component/Toast';
import Helper from '../../../helper/Helper';
import moment from 'moment';

let commentId = '';
let lastIndex = -1;
const Comments = ({
  content,
  postUserComment,
  updateUserCommentData,
  removeIndex,
}) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const renderList = () => {
    return content.map((item, index) => {
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
                {item.authorId !== undefined &&
                item.authorId !== null &&
                item.authorId.profileImg !== undefined &&
                item.authorId.profileImg !== null &&
                item.authorId.profileImg !== '' ? (
                  <ProgressImage
                    source={{uri: item.authorId.profileImg}}
                    containerStyle={styles.imageStyle}
                    mode={'cover'}
                  />
                ) : (
                  <ProgressImage
                    source={GlobalInclude.Assets.DefaultProfile}
                    containerStyle={styles.imageStyle}
                    mode={'cover'}
                  />
                )}
              </View>
            </View>
            <View>
              <Text style={[g.fs14, g.FHNR, g.colordarkGray]}>
                {item.authorId !== undefined && item.authorId !== null
                  ? Helper.concatName(item.authorId)
                  : 'N/A'}
              </Text>
              <Text style={[g.fs12, g.FHNR, g.colorBlue, g.mt5]}>
                {moment(item.postedDate).fromNow()}
              </Text>
              <Text style={[g.fs15, g.FHNR, g.colorLightGray, g.mt5]}>
                {item.commentText !== undefined &&
                item.commentText !== null &&
                item.commentText !== ''
                  ? item.commentText
                  : 'N/A'}
              </Text>
            </View>
          </View>
          {global.userId === item.authorId._id ? (
            <View style={[grid.rowdir, g.mb5, grid.justifyContentRight]}>
              <TouchableOpacity
                hitSlop={{top: 10, bottom: 10, left: 10, right: 0}}
                activeOpacity={0.8}
                onPress={() => {
                  lastIndex = index;
                  commentId = item._id;
                  setCommentError('');
                  setCommentText(item.commentText);
                  setShowCommentModal(true);
                }}
                style={[
                  grid.rowdir,
                  grid.alignItems,
                  grid.justifyContentCenter,
                  g.bgBlue,
                  g.mr10,
                  styles.iconContainer,
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
                onPress={() => {
                  removeIndex(item._id, index, (status) => {
                    Toast.show({
                      title: 'Congratulations',
                      text: 'Comment removed successfully',
                      color: '#228B22',
                      timing: 3000,
                    });
                  });
                }}
                style={[
                  grid.rowdir,
                  grid.alignItems,
                  grid.justifyContentCenter,
                  g.bgBlue,
                  styles.iconContainer,
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
          ) : null}
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
        {content &&
        content !== undefined &&
        content !== null &&
        content.length > 0 ? (
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
                {commentId !== '' ? 'Update Your Comment' : 'Post Your Comment'}
              </Text>
              <TextInput
                maxLength={1500}
                placeholder={'Write Text Here'}
                underlineColorAndroid="transparent"
                multiline={true}
                value={commentText}
                autoFocus
                style={[
                  g.mt10,
                  g.bgWhite,
                  g.textareaStyle,
                  {minHeight: 160, maxHeight: 160, height: 160},
                ]}
                onChangeText={(comment) => {
                  setCommentText(comment);
                }}
              />
              <Text style={[g.fs12, g.FHNR, g.mb5, g.pt10, g.txtRight]}>
                {`Max 1000 characters: ${commentText.length}`}
              </Text>
              {commentError &&
              commentError !== null &&
              commentError.length > 0 ? (
                <Text style={g.errorMsg}>{commentError}</Text>
              ) : null}
              <View style={[grid.rowdir, g.mt10]}>
                <View style={[g.btn, g.mr5, {width: scale(130)}]}>
                  {isCommenting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text
                      style={[g.fs12, g.FHNR, g.txtCenter, g.colorWhite]}
                      onPress={() => {
                        if (
                          commentText.length === 0 ||
                          commentText.trim() === ''
                        ) {
                          setCommentError('This field is required!');
                        } else {
                          setIsCommenting(true);
                          if (commentId !== '') {
                            updateUserCommentData(
                              commentText,
                              commentId,
                              lastIndex,
                              (status) => {
                                setIsCommenting(false);
                                setShowCommentModal(false);
                                setCommentText('');
                                if (status) {
                                  Toast.show({
                                    title: 'Congratulations',
                                    text: 'Comment added successfully',
                                    color: '#228B22',
                                    timing: 3000,
                                  });
                                }
                              },
                            );
                          } else {
                            postUserComment(commentText, (status) => {
                              setIsCommenting(false);
                              setShowCommentModal(false);
                              setCommentText('');
                              if (status) {
                                Toast.show({
                                  title: 'Congratulations',
                                  text: 'Comment updated successfully',
                                  color: '#228B22',
                                  timing: 3000,
                                });
                              }
                            });
                          }
                        }
                      }}>
                      {commentId !== '' ? 'Update Comment' : 'Post Comment'}
                    </Text>
                  )}
                </View>

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
const styles = StyleSheet.create({
  imageStyle: {
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    width: scale(35),
    justifyContent: 'center',
  },
  iconContainer: {
    width: scale(22),
    height: scale(22),
    borderRadius: scale(22),
    elevation: 1,
  },
});
export default Comments;
