import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import {scale} from '../../../theme/Scalling';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import ProgressImage from '../../../component/ProgresImage';
import YoutubeView from '../../../component/YoutubeItem';
import GroupImages from '../../../component/GroupImage/GroupImages';
import moment from 'moment';
import ParsedText from 'react-native-parsed-text';
import Helper from '../../../helper/Helper';
import Pdf from 'react-native-pdf';

import {isSameDay} from '../../../helper/ChatHelper';
import {IconType} from '../../../helper/Constants';
import {showImageThumb} from '../../chat/ChatDelegates';
import Helpers from '../../../helper/Helper';

const {width} = Dimensions.get('window');

class ChatItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isNewLine: false,
    };
  }

  isSameUser(currentMessage = {}, diffMessage = {}) {
    return !!(
      diffMessage.authorId &&
      currentMessage.authorId &&
      diffMessage.authorId._id === currentMessage.authorId._id
    );
  }

  renderTicks() {
    const {currentMessage, groupMembers, isGroup} = this.props;
    if (
      currentMessage &&
      currentMessage.authorId &&
      currentMessage.authorId._id !== global.userId
    ) {
      return null;
    }
    if (currentMessage) {
      let tickIcon = '',
        iconColor = '#323232';

      tickIcon = 'checkmark-done-sharp';
      iconColor = '#cccccc';
      if (currentMessage) {
        if (currentMessage.messageRead === 1) {
          tickIcon = 'checkmark-done-sharp';
          iconColor = '#34b7f1';
        }
      }

      return (
        <View style={styles.tickView}>
          <GlobalInclude.BaseIcon
            containerStyle={{height: scale(16), width: scale(16)}}
            iconColor={iconColor}
            iconName={tickIcon}
            iconSize={scale(16)}
            iconType={IconType[6]}
          />
        </View>
      );
    }
    return null;
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
          g.textJustify,
        ]}>
        {source}
      </ParsedText>
    );
  }

  renderGroupImages(currentMessage) {
    let mediaContent = null;
    if (currentMessage.media !== undefined && currentMessage.media !== null) {
      mediaContent = currentMessage.media.metaData.imageArray;
    }
    return (
      <GroupImages
        images={mediaContent}
        style={{aspectRatio: 1 / 1, alignSelf: 'center'}}
        width={width / 2}
      />
    );
  }

  renderEmojiComponent(source, isLeft) {
    return (
      <Text
        style={[
          g.FHNR,
          g.colorBlack,
          g.txtCenterVertical,
          g.textJustify,
          g.fs36,
        ]}>
        {source}
      </Text>
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
          containerStyle={{height: ih, width: iw, borderRadius: scale(6)}}
          imageStyle={{height: ih, width: iw, borderRadius: scale(6)}}
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
    const {extraObjects} = currentMessage.media;
    return (
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
          style={[styles.youtubeThumb, styles.pdfContainer]}
        />
        {extraObjects !== undefined && currentMessage !== null && (
          <View
            style={[
              {maxWidth: width - 120},
              grid.rowrow,
              g.p5,
              grid.alignItems,
              grid.justifyContentCenter,
            ]}>
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
                {extraObjects?.fileName}
              </Text>
            </View>
            <View style={[grid.rowrow, g.ml5]}>
              <Text
                style={[
                  g.FHNM,
                  g.colorGray,
                  g.txtCenterVertical,
                  g.txtLeft,
                  g.fs12,
                ]}>
                {Helpers.humanFileSize(extraObjects?.fileSize)}
              </Text>
              <Text
                style={[
                  g.FHNM,
                  g.colorGray,
                  g.txtCenterVertical,
                  g.txtLeft,
                  g.fs12,
                  g.ml5,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {Helpers.getExtention(extraObjects?.fileName)}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
  renderAudioComponent(source) {
    const {customFont, currentMessage} = this.props;
    const {extraObjects} = currentMessage.media;
    return (
      <View style={[styles.pdfMainContainer, grid.rowrow]}>
        <View style={styles.audioBox}>
          <GlobalInclude.BaseIcon
            containerStyle={styles.audioIcon}
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
            {extraObjects?.fileName}
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
              {Helpers.humanFileSize(extraObjects?.fileSize)}
            </Text>
            <Text
              style={[
                g.FHNM,
                g.colorGray,
                g.txtCenterVertical,
                g.txtLeft,
                g.fs12,
                g.ml5,
                GlobalInclude.AppStyle.transform,
              ]}>
              {Helpers.getExtention(extraObjects?.fileName)}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  renderVideoComponent(source, currentMessage) {
    const {extraObjects} = currentMessage.media;
    return (
      <YoutubeView
        extraObjects={extraObjects}
        link={source}
        containerWidth={width - 120}
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
          {Helper.getChatDate(source.createdAt * 1000)}
        </Text>
      </View>
    );
  }

  renderAvtar() {
    const {nextMessage, currentMessage, isGroup} = this.props;

    if (isGroup) {
      return null;
    }

    if (!this.isSameUser(currentMessage, nextMessage)) {
      return (
        <ProgressImage
          source={{uri: currentMessage.authorId.profileImg}}
          containerStyle={styles.imageStyle}
          imageStyle={styles.imageStyle}
          mode={'cover'}
        />
      );
    }
    return <View style={styles.imageStyle} />;
  }

  renderReplyMessage(currentMessage, isLeft) {
    const {customFont} = this.props;
    let parentMessage = currentMessage.parentMessageId;
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
            g.ml5,
            g.mt5,
            g.mb5,
            {marginRight: parentMessage.media.mediaType === '' ? 0 : scale(52)},
          ]}>
          <Text
            style={[
              customFont,
              g.FHNB,
              g.colorBlack,
              g.p3,
              GlobalInclude.AppStyle.transform,
            ]}>
            {parentMessage.authorId._id === global.userId &&
            currentMessage.authorId._id === global.userId
              ? 'You'
              : parentMessage.authorId.firstName}
          </Text>
          <Text
            numberOfLines={2}
            style={[customFont, g.FHNR, g.colorBlack, g.p3]}>
            {parentMessage.media.mediaType === ''
              ? parentMessage.messageText
              : parentMessage.media.mediaType}
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
          {showImageThumb(
            currentMessage.media.mediaUrl,
            currentMessage.media.mediaType === 'IMAGE'
              ? 2
              : currentMessage.media.mediaType === 'VIDEO'
              ? 3
              : 4,
          )}
        </View>
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

  renderLeftSide(currentMessage) {
    const {isGroup, customFont, messageColor, previousMessage, onTapUserName} =
      this.props;
    let color = '#000000';

    // let isFound =
    //   messageColor !== undefined && messageColor !== null
    //     ? messageColor.filter(item => item.userId === currentMessage.user._id)
    //     : [];
    // if (isFound.length > 0) {
    //   color = isFound[0].color;
    // }

    return (
      <View style={[grid.rowdir]}>
        {/* {this.renderAvtar()} */}
        <View style={[g.ml5, g.bgWhite, styles.bubbleLeft]}>
          {isGroup && !this.isSameUser(currentMessage, previousMessage) && (
            <TouchableOpacity
              style={{zIndex: 1}}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              onPress={() => {
                onTapUserName();
              }}>
              <Text
                numberOfLines={1}
                style={[customFont, g.FHNB, g.pt4, g.pl5, {color: color}]}>
                {Helper.capitalize(currentMessage?.authorId?.firstName ?? '')}
                {currentMessage?.authorId?.batch !== undefined &&
                currentMessage?.authorId?.batch !== null
                  ? ' ' + '-' + currentMessage?.authorId?.batch + ' '
                  : ''}
              </Text>
            </TouchableOpacity>
          )}
          {this.renderItem(currentMessage, true)}
        </View>
        {currentMessage.isEdited &&
          currentMessage.isDeleted === -1 &&
          this.renderEditView()}
      </View>
    );
  }

  renderRightSide(currentMessage) {
    return (
      <View style={[grid.rowdir, styles.viewRight]}>
        {currentMessage.isEdited &&
          currentMessage.isDeleted === -1 &&
          this.renderEditView()}
        <View style={[g.bgGreenLight, styles.bubbleRight]}>
          {this.renderItem(currentMessage, false)}
        </View>
      </View>
    );
  }

  renderItem(currentMessage, isLeft) {
    // 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT'
    const {onLongPress, onPress, isGroup} = this.props;

    let style = {
      paddingHorizontal: scale(1),
      paddingTop: scale(3),
      paddingBottom: scale(3),
    };

    let messageContent = currentMessage.messageText;
    let mediaContent = '';
    let messageType = '';

    if (currentMessage.media !== undefined && currentMessage.media !== null) {
      mediaContent = currentMessage.media.mediaUrl;
      messageType = currentMessage.media.mediaType;
    }

    if (messageType === '') {
      style = {};
      style = {
        paddingHorizontal: scale(8),
        paddingTop: isGroup ? scale(3) : scale(9),
        paddingBottom: scale(4),
      };
    }

    return (
      <View>
        {currentMessage.parentMessageId !== undefined &&
          currentMessage.parentMessageId !== null &&
          Object.keys(currentMessage.parentMessageId).length > 0 &&
          this.renderReplyMessage(currentMessage, isLeft)}
        {currentMessage.isHidden ? (
          <View style={style}>{this.renderHideMsg(isLeft)}</View>
        ) : currentMessage.isDeleted > -1 ? (
          <View>{this.renderRemovedMsg(isLeft)}</View>
        ) : (
          <TouchableOpacity
            onPress={onPress}
            hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
            onLongPress={onLongPress}
            activeOpacity={1}>
            {messageType === 'IMAGE' ? (
              <View style={style}>
                {this.renderImageComponent(mediaContent)}
              </View>
            ) : messageType === 'VIDEO' ? (
              <View style={style}>
                {this.renderVideoComponent(mediaContent, currentMessage)}
              </View>
            ) : messageType === 'AUDIO' ? (
              <View style={style}>
                {this.renderAudioComponent(mediaContent)}
              </View>
            ) : messageType === 'DOCUMENT' ? (
              <View style={style}>{this.renderPdfComponent(mediaContent)}</View>
            ) : messageType === 'EMOJI' ? (
              <View style={style}>
                {this.renderEmojiComponent(messageContent)}
              </View>
            ) : messageType === 'IMAGE_GROUP' ? (
              <View style={style}>
                {this.renderGroupImages(currentMessage)}
              </View>
            ) : null}
            {messageContent !== null &&
              messageContent !== undefined &&
              messageContent?.trim().length > 0 &&
              messageType !== 'EMOJI' && (
                <View
                  style={[
                    grid.rowrow,
                    mediaContent !== '' ? {paddingHorizontal: scale(4)} : style,
                  ]}>
                  {this.renderTextComponent(messageContent, isLeft)}
                </View>
              )}
          </TouchableOpacity>
        )}

        <View style={[grid.rowrow, styles.viewRight]}>
          {this.renderDateComponent(currentMessage, isLeft)}
          <View style={{marginHorizontal: scale(3)}} />
          {this.renderTicks()}
        </View>
      </View>
    );
  }

  renderSystemMessage() {
    const {currentMessage, customFont} = this.props;
    return (
      <View style={[styles.container]}>
        <View>
          <Text style={[styles.text, customFont]}>
            {currentMessage.message}
          </Text>
        </View>
      </View>
    );
  }

  renderHideMsg(isLeft) {
    const {customFont, currentMessage} = this.props;
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
          Admin has removed this message.
        </Text>
      </View>
    );
  }

  renderRemovedMsg(isLeft) {
    const {customFont, currentMessage} = this.props;
    return (
      <View style={[grid.rowrow, grid.alignItems, grid.justifyContentCenter]}>
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
            g.ml5,
            g.colorBlack,
            g.txtCenterVertical,
            {textAlign: 'justify'},
          ]}>
          {currentMessage.isDeleted === 0
            ? currentMessage?.authorId?._id === global.userId
              ? 'You removed this message'
              : `${currentMessage?.authorId?.firstName} has removed message`
            : 'Admin has removed this message'}
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

  render() {
    const {currentMessage, nextMessage, position} = this.props;
    const sameUser = this.isSameUser(currentMessage, nextMessage);
    return (
      <View>
        {currentMessage.system ? (
          this.renderSystemMessage()
        ) : (
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
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  bubbleLeft: {
    borderTopLeftRadius: scale(10),
    borderBottomLeftRadius: 0,
    borderTopRightRadius: scale(10),
    borderBottomRightRadius: scale(10),
    paddingHorizontal: scale(3),
    paddingBottom: scale(5),
    maxWidth: width - 80,
  },
  bubbleRight: {
    borderTopLeftRadius: scale(10),
    borderBottomLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    borderBottomRightRadius: 0,
    paddingHorizontal: scale(3),
    paddingBottom: scale(5),
    maxWidth: width - 80,
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
    width: width - 120,
    aspectRatio: 16 / 9,
    borderRadius: 0,
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    justifyContent: 'center',
  },
  youtubeThumb: {
    width: width - 120,
    aspectRatio: 16 / 9,
    borderRadius: 0,
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  youtubeView: {
    aspectRatio: 1 / 1,
    height: scale(165),
    borderRadius: scale(10),
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
    borderRadius: 0,
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
  },
  thumbStyle: {
    aspectRatio: 1 / 1,
    height: scale(165),
    borderRadius: scale(10),
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
    borderTopLeftRadius: scale(8),
    borderTopRightRadius: scale(8),
  },
  indicator: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  pdfMainContainer: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: scale(6),
    width: width - 120,
  },
  audioBox: {
    height: scale(40),
    width: scale(40),
    borderRadius: scale(42),
    backgroundColor: 'rgba(62,62,62,0.25)',
    margin: scale(3),
    marginHorizontal: scale(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioIcon: {
    height: scale(38),
    width: scale(38),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});

export default ChatItem;
