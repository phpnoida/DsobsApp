import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import ProgressImage from '../../component/ProgresImage';
import YoutubeView from '../../component/YoutubeItem';
import GroupImages from '../../component/GroupImage/GroupImages';
import moment from 'moment';
import ParsedText from 'react-native-parsed-text';
import Helper from '../../helper/Helper';
import Pdf from 'react-native-pdf';

import {isSameDay} from '../../helper/ChatHelper';
import {IconType} from '../../helper/Constants';
import {showMediaType, showImageThumb} from '../chat/ChatDelegates';
import Helpers from '../../helper/Helper';

const {height, width} = Dimensions.get('window');

class GroupChatItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isNewLine: false,
    };
  }
  isSameUser(currentMessage = {}, diffMessage = {}) {
    return !!(
      diffMessage.user &&
      currentMessage.user &&
      diffMessage.user._id === currentMessage.user._id
    );
  }

  renderLeftSide(currentMessage) {
    const {customFont, previousMessage, onTapUserName} = this.props;

    return (
      <View style={grid.col}>
        {currentMessage.isReported && this.renderReported()}
        <View style={[g.bgWhite, styles.bubbleLeft, g.p5]}>
          <View style={[grid.row, g.mt3, g.mb2]}>
            <View style={[grid.col]}>
              {!this.isSameUser(currentMessage, previousMessage) && (
                <TouchableOpacity
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                  onPress={() => {
                    onTapUserName();
                  }}>
                  <Text numberOfLines={1} style={[customFont, g.FHNB]}>
                    {currentMessage.authorId.name}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={[g.mr5, grid.justifyContentCenter, grid.alignItems]}>
              {this.renderDateComponent(currentMessage, true)}
            </View>
          </View>
          <View style={[g.mt5, g.mb5]}>
            {this.renderItem(currentMessage, true)}
          </View>
        </View>
        {currentMessage.isEdited &&
          !currentMessage.delete &&
          this.renderEditView()}
      </View>
    );
  }

  renderRightSide(currentMessage) {
    const {customFont, previousMessage, onTapUserName} = this.props;

    return (
      <View style={grid.col}>
        {currentMessage.isEdited &&
          !currentMessage.delete &&
          this.renderEditView()}
        {currentMessage.isReported && this.renderReported()}
        <View style={[g.bgGreenLight, styles.bubbleRight, g.p5]}>
          <View style={[grid.row, g.mt3, g.mb2]}>
            <View style={[grid.col]}>
              {!this.isSameUser(currentMessage, previousMessage) && (
                <TouchableOpacity
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                  onPress={() => {
                    onTapUserName();
                  }}>
                  <Text
                    numberOfLines={1}
                    style={[customFont, g.FHNB, g.colorBlack]}>
                    {currentMessage.authorId.name}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={[g.mr5, grid.justifyContentCenter, grid.alignItems]}>
              {this.renderDateComponent(currentMessage, false)}
            </View>
          </View>

          <View style={[g.mt5, g.mb5]}>
            {this.renderItem(currentMessage, false)}
          </View>
        </View>
      </View>
    );
  }

  renderReported() {
    const {customFont, onReportPress} = this.props;

    return (
      <TouchableOpacity
        style={styles.reportedContainer}
        onPress={onReportPress}>
        <View style={styles.reportedView}>
          <Text
            numberOfLines={1}
            style={[
              customFont,
              g.FHNB,
              g.colorWhite,
              grid.alignItems,
              grid.justifyContentCenter,
            ]}>
            Reported
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderItem(currentMessage, isLeft) {
    // 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT'
    const {onLongPress, onPress} = this.props;
    let messageContent = currentMessage.messageText;
    let mediaContent = '';
    let messageType = '';

    if (currentMessage.media !== undefined && currentMessage.media !== null) {
      mediaContent = currentMessage.media.mediaUrl;
      messageType = currentMessage.media.mediaType;
    }

    return (
      <View>
        {currentMessage.isHidden ? (
          <View>{this.renderRemovedMsg(isLeft)}</View>
        ) : (
          <TouchableOpacity
            onPress={onPress}
            hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
            onLongPress={onLongPress}
            activeOpacity={1}>
            {messageType === 'IMAGE' ? (
              <View>{this.renderImageComponent(mediaContent)}</View>
            ) : messageType === 'VIDEO' ? (
              <View>
                {this.renderVideoComponent(mediaContent, currentMessage)}
              </View>
            ) : messageType === 'AUDIO' ? (
              <View>{this.renderAudioComponent(mediaContent)}</View>
            ) : messageType === 'DOCUMENT' ? (
              <View>{this.renderPdfComponent(mediaContent)}</View>
            ) : messageType === 'EMOJI' ? (
              <View>{this.renderEmojiComponent(messageContent)}</View>
            ) : messageType === 'IMAGE_GROUP' ? (
              <View>{this.renderGroupImages(currentMessage)}</View>
            ) : null}

            {messageContent !== null &&
              messageContent !== undefined &&
              messageContent.trim().length > 0 &&
              messageType !== 'EMOJI' && (
                <View style={[grid.rowrow, {marginTop: scale(5)}]}>
                  {this.renderTextComponent(messageContent, isLeft)}
                </View>
              )}
          </TouchableOpacity>
        )}
      </View>
    );
  }

  renderEditView() {
    return (
      <View style={[styles.tickView, grid.alignItemsBottom, g.mb5]}>
        <GlobalInclude.BaseIcon
          containerStyle={{height: scale(16), width: scale(16)}}
          iconColor={GlobalInclude.Color.ColorPrimary}
          iconName={'edit'}
          iconSize={scale(16)}
          iconType={IconType[0]}
        />
      </View>
    );
  }

  renderRemovedMsg(isLeft) {
    const {customFont} = this.props;
    return (
      <View style={[grid.rowrow, grid.alignItems]}>
        <GlobalInclude.BaseIcon
          containerStyle={{height: scale(13), width: scale(13)}}
          iconColor={GlobalInclude.Color.ColorPrimary}
          iconName={'block'}
          iconSize={scale(12)}
          iconType={IconType[9]}
        />
        <Text
          style={[
            customFont,
            g.FHNR,
            g.ml2,
            g.colorBlack,
            g.txtCenterVertical,
            {textAlign: 'justify'},
          ]}>
          Admin has removed this message
        </Text>
      </View>
    );
  }

  renderDay() {
    const {previousMessage, currentMessage, customFont} = this.props;

    if (currentMessage && !isSameDay(currentMessage, previousMessage)) {
      return (
        <View style={styles.timeStamp}>
          <Text style={[customFont, g.FHNR, g.colorWhite]}>
            {moment(currentMessage.createdAt * 1000)
              .format('DD MMM YYYY')
              .toString()
              .toUpperCase()}
          </Text>
        </View>
      );
    }
    return null;
  }

  renderReplyMessage(currentMessage, isLeft) {
    const {customFont} = this.props;
    return (
      <View style={[styles.replayContainer, grid.col]}>
        <View
          style={[
            styles.renderBorder,
            {
              backgroundColor: GlobalInclude.Color.ColorPrimary,
            },
          ]}
        />
        <View
          style={[
            g.mt5,
            g.mb5,
            {marginRight: currentMessage.messageType === 1 ? 0 : scale(52)},
          ]}>
          <Text
            style={[
              customFont,
              g.FHNB,
              g.colorBlack,
              g.p3,
              GlobalInclude.AppStyle.transform,
            ]}>
            {currentMessage.replay.user._id === global.userId &&
            currentMessage.user._id === global.userId
              ? 'You'
              : Helper.concatName(currentMessage.replay.user)}
          </Text>
          <Text
            numberOfLines={2}
            style={[customFont, g.FHNR, g.colorBlack, g.p3]}>
            {currentMessage.messageType === 1
              ? currentMessage.message
              : showMediaType(currentMessage.messageType)}
          </Text>
        </View>
        <View
          style={{
            alignSelf: 'flex-end',
            position: 'absolute',
            right: 0,
            bottom: 0,
            top: 0,
            justifyContent: 'center',
          }}>
          {showImageThumb(currentMessage.media, currentMessage.messageType)}
        </View>
      </View>
    );
  }

  renderDateComponent(source, isLeft) {
    return (
      <View style={[grid.justifyContentRight, grid.alignItemsBottom]}>
        <Text
          style={[
            g.fs11,
            g.FHNR,
            g.colorGray5,
            grid.justifyContentRight,
            grid.alignItemsBottom,
            g.txtCenterVertical,
            isLeft && g.ml5,
            isLeft && g.mb2,
          ]}>
          {moment(new Date(source.createdAt * 1000)).fromNow()}
        </Text>
      </View>
    );
  }

  /**
   *
   * @Components
   *
   */
  renderAudioComponent(source) {
    const {customFont, currentMessage} = this.props;

    const {metaData} = currentMessage.media;

    return (
      <View style={[styles.audioMainContainer, grid.rowrow]}>
        <View
          style={{
            height: scale(40),
            width: scale(40),
            borderRadius: scale(42),
            backgroundColor: 'rgba(62,62,62,0.25)',
            margin: scale(3),
            marginHorizontal: scale(5),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <GlobalInclude.BaseIcon
            containerStyle={{
              height: scale(38),
              width: scale(38),
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}
            iconColor={GlobalInclude.Color.ColorPrimary}
            iconName={'headset'}
            iconSize={scale(30)}
            iconType={IconType[6]}
          />
        </View>
        <View style={[grid.col, grid.justifyContentCenter]}>
          <Text
            numberOfLines={1}
            style={[
              g.mb5,
              g.FHNR,
              g.colorBlue,
              g.txtCenterVertical,
              g.txtLeft,
              customFont,
            ]}>
            {metaData.fileName}
          </Text>
          <View style={[grid.rowrow]}>
            <Text
              style={[
                g.FHNM,
                g.colorGray,
                g.txtCenterVertical,
                g.txtLeft,
                g.fs12,
              ]}>
              {Helpers.humanFileSize(metaData.fileSize)}
            </Text>
            <Text
              style={[
                g.FHNM,
                g.colorGray,
                g.txtCenterVertical,
                g.txtLeft,
                g.fs12,
                g.ml5,
                {textTransform: 'uppercase'},
              ]}>
              {Helpers.getExtention(metaData.fileName)}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  renderVideoComponent(source, currentMessage) {
    const {metaData} = currentMessage.media;

    return (
      <>
        <YoutubeView
          link={source}
          containerWidth={width / 2}
          containerStyle={styles.youtubeVideo}
          overlayStyle={styles.overlayStyle}
          thumbStyle={styles.youtubeThumb}
          playIconstyle={styles.playIconstyle}
          playIconContainer={{
            height: scale(20),
            width: scale(20),
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          }}
          iconSize={scale(20)}
          showPlay={true}
        />
        {metaData !== undefined && metaData !== null && (
          <View style={g.p5}>
            {metaData.title !== undefined &&
              metaData.title !== null &&
              metaData.title !== '' && (
                <Text style={[g.fs14, g.FHNB, g.colorBlue]} numberOfLines={1}>
                  {metaData.title}
                </Text>
              )}
            {metaData.description !== undefined &&
              metaData.description !== null &&
              metaData.description !== '' && (
                <Text
                  style={[g.fs12, g.FHNR, g.colordarkGray, g.mt2]}
                  numberOfLines={2}>
                  {metaData.description}
                </Text>
              )}

            <ParsedText
              parse={[
                {
                  type: 'url',
                  style: styles.url,
                  onPress: this.handleUrlPress,
                },
              ]}
              childrenProps={{allowFontScaling: false}}
              style={[g.fs12, g.FHNM, g.mt2, g.colorSkyBlue]}>
              {source}
            </ParsedText>
          </View>
        )}
      </>
    );
  }

  renderImageComponent(source) {
    const {currentMessage} = this.props;
    if (
      currentMessage.extraObjects !== undefined &&
      currentMessage.extraObjects !== null
    ) {
      let ih = currentMessage.extraObjects.ih - scale(7);
      let iw = currentMessage.extraObjects.iw - scale(7);
      return (
        <ProgressImage
          source={{uri: source}}
          containerStyle={{height: ih, width: iw}}
          imageStyle={{height: ih, width: iw}}
          mode={'cover'}
        />
      );
    }
    return (
      <ProgressImage
        source={{uri: source}}
        containerStyle={styles.thumbStyle}
        imageStyle={styles.thumbStyle}
        mode={'cover'}
      />
    );
  }
  renderPdfComponent(source) {
    const {customFont, currentMessage} = this.props;
    return (
      <View>
        <View style={styles.pdfMainContainer}>
          <Pdf
            singlePage={true}
            enablePaging={true}
            enableAntialiasing={true}
            activityIndicator={
              <View style={styles.indicator}>
                <ActivityIndicator
                  color={GlobalInclude.Color.ColorPrimary}
                  size={'small'}
                />
              </View>
            }
            source={{
              uri: source,
            }}
            style={[styles.youtubeThumb]}
          />
        </View>

        {currentMessage.media.metaData !== undefined &&
          currentMessage !== null && (
            <View style={g.p5}>
              <View style={grid.row}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(20), width: scale(20)}}
                  iconColor={'#990f02'}
                  iconName={'pdffile1'}
                  iconSize={scale(17)}
                  iconType={IconType[10]}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    g.FHNR,
                    g.colorBlue,
                    g.txtCenterVertical,
                    g.txtLeft,
                    customFont,
                  ]}>
                  {currentMessage.media.metaData.fileName}
                </Text>
              </View>
              <View style={[grid.rowrow, g.mt5, g.ml10]}>
                <Text
                  style={[
                    g.FHNM,
                    g.colorGray,
                    g.txtCenterVertical,
                    g.txtLeft,
                    g.fs12,
                  ]}>
                  {Helpers.humanFileSize(
                    currentMessage.media.metaData.fileSize,
                  )}
                </Text>
                <Text
                  style={[
                    g.FHNM,
                    g.colorGray,
                    g.txtCenterVertical,
                    g.txtLeft,
                    g.fs12,
                    g.ml5,
                    {textTransform: 'uppercase'},
                  ]}>
                  {Helpers.getExtention(currentMessage.media.metaData.fileName)}
                </Text>
              </View>
            </View>
          )}
      </View>
    );
  }

  renderEmojiComponent(source, isLeft) {
    return (
      <View style={[grid.alignItems, grid.justifyContentCenter]}>
        <Text
          style={[
            g.FHNR,
            g.colorBlack,
            g.txtCenterVertical,
            g.txtCenter,

            {textAlign: 'justify', fontSize: scale(54)},
          ]}>
          {source}
        </Text>
      </View>
    );
  }

  renderTextComponent(source, isLeft) {
    const {customFont} = this.props;
    return (
      <ParsedText
        parse={[
          {type: 'url', style: styles.url, onPress: this.handleUrlPress},
          {type: 'phone', style: styles.phone, onPress: this.handlePhonePress},
          {type: 'email', style: styles.email, onPress: this.handleEmailPress},
          {pattern: /#(\w+)/, style: styles.hashTag},
        ]}
        childrenProps={{allowFontScaling: false}}
        onTextLayout={event => {
          //get all lines
          const {lines} = event.nativeEvent;
          if (lines.length > 0) {
            if (lines.length > 1) {
              this.setState({isNewLine: true});
            } else {
              this.setState({isNewLine: false});
            }
          } else {
            this.setState({isNewLine: true});
          }
        }}
        style={[
          customFont,
          g.FHNR,
          g.colorBlack,
          g.txtCenterVertical,
          {
            textAlign: 'justify',
          },
        ]}>
        {source}
      </ParsedText>
    );
  }
  handleEmailPress(email, matchIndex /*: number*/) {
    Helper.openEmail(email);
  }

  handleUrlPress(url, matchIndex /*: number*/) {
    Helper.openLink(url);
  }

  handlePhonePress(phone, matchIndex /*: number*/) {
    Helper.openDialler(phone);
  }

  renderGroupImages(currentMessage) {
    //{"_id": "61499999b8ddad5e96cc3936", "authorId": {"_id": "602cb54aa1714c5bd91862e0", "name": "Richa Sharma - 2021"}, "createdAt": 1632213401, "isHidden": false, "isReported": false, "media": {"mediaType": "IMAGE_GROUP", "metaData": {"imageArray": [Array]}}, "messageText": ""}

    let mediaContent = null;
    if (currentMessage.media !== undefined && currentMessage.media !== null) {
      mediaContent = currentMessage.media.metaData.imageArray;
    }
    console.log('====================================');
    console.log('mediaContent', JSON.stringify(mediaContent));
    console.log('====================================');
    return (
      <GroupImages
        images={mediaContent}
        style={{aspectRatio: 1 / 1, alignSelf: 'center'}}
        width={width / 2}
      />
    );
  }

  /**
   *
   * @Components
   *
   */

  render() {
    const {currentMessage, nextMessage, position} = this.props;
    const sameUser = this.isSameUser(currentMessage, nextMessage);

    return (
      <View>
        <View
          style={[
            g.pl5,
            g.pr5,
            {marginBottom: sameUser ? scale(5) : scale(10)},
            {marginBottom: scale(5), zIndex: 3},
          ]}>
          <View style={[grid.rowdir, grid.justifyContentCenter]}>
            {this.renderDay()}
          </View>

          {position === 'right'
            ? this.renderRightSide(currentMessage)
            : this.renderLeftSide(currentMessage)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bubbleLeft: {
    borderRadius: scale(10),
    marginHorizontal: scale(6),
  },
  bubbleRight: {
    borderTopLeftRadius: scale(10),
    borderBottomLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    borderBottomRightRadius: 0,
    paddingBottom: scale(5),
    marginHorizontal: scale(6),
  },
  timeStamp: {
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    marginBottom: 10,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 7,
  },
  imageStyle: {
    aspectRatio: 1 / 1,
    alignSelf: 'flex-end',
    width: scale(40),
    borderRadius: scale(40),
  },

  viewRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
  },
  viewLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  youtubeVideo: {
    aspectRatio: 16 / 9,
    width: width / 2 + 100,
    alignSelf: 'center',
    borderRadius: scale(6),
    justifyContent: 'center',
  },
  youtubeThumb: {
    aspectRatio: 16 / 9,
    width: width / 2 + 100,
    alignSelf: 'center',
    borderRadius: scale(6),
  },
  overlayStyle: {
    backgroundColor: '#00000066',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
    borderRadius: scale(6),
  },
  thumbStyle: {
    aspectRatio: 1 / 1,
    width: width / 2,
    alignSelf: 'center',
    borderRadius: scale(6),
  },
  playIconstyle: {
    position: 'absolute',
    zIndex: 9,
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(62,62,62,0.5)',
    height: scale(36),
    width: scale(36),
    borderRadius: scale(100),
  },
  tick: {
    fontSize: 10,
    backgroundColor: 'transparent',
    color: '#fff',
  },
  tickView: {
    flexDirection: 'row',
    marginRight: 5,
  },
  username: {
    top: -3,
    left: 0,
    fontSize: 12,
    backgroundColor: 'transparent',
    color: '#aaa',
  },
  usernameView: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: scale(10),
    marginBottom: scale(10),
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: scale(8),
  },
  text: {
    backgroundColor: GlobalInclude.Color.ColorPrimary,
    color: 'white',
    fontSize: scale(14),
    paddingVertical: scale(8),
    paddingHorizontal: scale(10),
    borderRadius: scale(15),
    ...g.FHNR,
    letterSpacing: 1,
  },
  renderBorder: {
    marginStart: scale(3),
    width: scale(3),
    borderRadius: 0,
    borderBottomLeftRadius: scale(10),
    borderTopLeftRadius: scale(10),
  },
  replayContainer: {
    marginTop: scale(3),
    borderRadius: scale(6),
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: scale(3),
    paddingEnd: scale(3),
    width: '100%',
  },
  url: {
    textDecorationLine: 'underline',
  },
  email: {
    textDecorationLine: 'underline',
  },
  phone: {
    textDecorationLine: 'underline',
    color: GlobalInclude.Color.ColorPrimary,
  },
  hashTag: {
    fontStyle: 'italic',
  },
  pdfContainer: {
    backgroundColor: 'white',
    borderRadius: 0,
  },
  indicator: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  audioMainContainer: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: scale(6),
    width: width - 80,
  },
  pdfMainContainer: {
    borderRadius: scale(6),
    width: width / 2,
    alignSelf: 'center',
  },
  reportedContainer: {
    alignSelf: 'flex-end',
    marginRight: scale(30),
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: scale(6),
  },
  reportedView: {
    backgroundColor: 'red',
    borderRadius: scale(6),
    padding: scale(4),
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    marginBottom: -8,
  },
});

export default GroupChatItem;
