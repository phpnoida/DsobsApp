import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import ProgressImage from '../../component/ProgresImage';
import YoutubeView from '../../component/YoutubeView';
import moment from 'moment';
import ParsedText from 'react-native-parsed-text';
import Helper from '../../helper/Helper';

import {isSameUser, isSameDay} from '../../helper/ChatHelper';
import {IconType} from '../../helper/Constants';
import {showMediaType, showImageThumb} from './ChatDelegates';

const {height, width} = Dimensions.get('window');

class ChatItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderTicks() {
    const {currentMessage} = this.props;
    if (
      currentMessage &&
      currentMessage.user &&
      currentMessage.user._id !== global.userId
    ) {
      return null;
    }
    if (
      currentMessage &&
      (currentMessage.isSent || currentMessage.isRead || currentMessage.pending)
    ) {
      let tickIcon = '',
        iconColor = '#323232';

      if (currentMessage.isSent) {
        tickIcon = 'md-checkmark-outline';
        iconColor = '#cccccc';
      }
      if (currentMessage.isDelivered) {
        tickIcon = 'md-checkmark-done-outline';
        iconColor = '#cccccc';
      }
      if (currentMessage.isRead) {
        tickIcon = 'md-checkmark-done-outline';
        iconColor = GlobalInclude.Color.ColorPrimary;
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
        style={[
          customFont,
          g.FHNR,
          g.colorBlack,
          g.txtCenterVertical,
          {textAlign: 'justify'},
        ]}>
        {source}
      </ParsedText>
    );
  }

  renderEmojiComponent(source, isLeft) {
    return (
      <Text
        style={[
          g.FHNR,
          g.colorBlack,
          g.txtCenterVertical,
          {textAlign: 'justify', fontSize: scale(54)},
        ]}>
        {source}
      </Text>
    );
  }

  renderImageComponent(source) {
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
    return (
      <View style={[styles.youtubeView, grid.alignItems]}>
        <GlobalInclude.BaseIcon
          containerStyle={{height: scale(64), width: scale(64)}}
          iconColor={'#E61A2D'}
          iconName={'file-pdf-o'}
          iconSize={scale(64)}
          iconType={IconType[4]}
        />
      </View>
    );
  }
  renderAudioComponent(source) {
    return (
      <View style={[styles.youtubeView, grid.alignItems]}>
        <GlobalInclude.BaseIcon
          containerStyle={{height: scale(64), width: scale(64)}}
          iconColor={'#E61A2D'}
          iconName={'file-audio-o'}
          iconSize={scale(64)}
          iconType={IconType[4]}
        />
      </View>
    );
  }
  renderVideoComponent(source) {
    return (
      <YoutubeView
        link={source}
        containerStyle={styles.youtubeView}
        overlayStyle={styles.overlayStyle}
        thumbStyle={styles.thumbStyle}
        playIconstyle={styles.playIconstyle}
        playIconContainer={{
          height: scale(20),
          width: scale(20),
        }}
        iconSize={scale(20)}
        showPlay={true}
      />
    );
  }

  renderDateComponent(source, isLeft) {
    const {customFont} = this.props;
    return (
      <View
        style={[
          isLeft ? grid.justifyContentLeft : grid.justifyContentRight,
          isLeft ? grid.alignSelf : grid.alignItemsBottom,
        ]}>
        <Text
          style={[
            customFont,
            g.FHNR,
            g.colorBlue,
            isLeft ? grid.justifyContentLeft : grid.justifyContentRight,
            isLeft ? grid.alignSelf : grid.alignItemsBottom,
            g.txtCenterVertical,
            isLeft && g.ml5,
            isLeft && g.mb2,
          ]}>
          {Helper.getChatDate(source.createdAt)}
        </Text>
      </View>
    );
  }

  renderAvtar() {
    const {nextMessage, currentMessage, isGroup} = this.props;

    if (!isGroup) {
      return null;
    }

    if (!isSameUser(currentMessage, nextMessage)) {
      return (
        <ProgressImage
          source={{uri: currentMessage.user.profileImg}}
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
    return (
      <View style={[grid.rowdir]}>
        {this.renderAvtar()}
        <View style={[g.ml5, g.bgWhite, styles.bubbleLeft]}>
          {this.renderItem(currentMessage, true)}
        </View>
        {currentMessage.isEdited &&
          !currentMessage.delete &&
          this.renderEditView()}
      </View>
    );
  }

  renderRightSide(currentMessage) {
    return (
      <View style={[grid.rowdir, styles.viewRight]}>
        {currentMessage.isEdited &&
          !currentMessage.delete &&
          this.renderEditView()}
        <View style={[g.bgGreenLight, styles.bubbleRight]}>
          {this.renderItem(currentMessage, false)}
        </View>
      </View>
    );
  }

  renderItem(currentMessage, isLeft) {
    let style = {
      paddingHorizontal: scale(0.5),
      paddingTop: scale(3),
      paddingBottom: scale(3),
    };
    let messageContent = '';
    let mediaContent = '';
    let messageType = '';
    if (
      currentMessage.replay !== undefined &&
      currentMessage.replay !== null &&
      Object.keys(currentMessage.replay).length > 0
    ) {
      messageContent = currentMessage.replay.message;
      mediaContent = currentMessage.replay.media;
      messageType = currentMessage.replay.messageType;
    } else {
      messageContent = currentMessage.message;
      mediaContent = currentMessage.media;
      messageType = currentMessage.messageType;
    }

    return (
      <View>
        {currentMessage.replay !== undefined &&
          currentMessage.replay !== null &&
          Object.keys(currentMessage.replay).length > 0 &&
          this.renderReplyMessage(currentMessage, isLeft)}
        {currentMessage.delete ? (
          <View style={style}>{this.renderRemovedMsg(isLeft)}</View>
        ) : (
          <View>
            {messageType === 2 ? (
              <View style={style}>
                {this.renderImageComponent(mediaContent)}
              </View>
            ) : messageType === 3 ? (
              <View style={style}>
                {this.renderVideoComponent(mediaContent)}
              </View>
            ) : messageType === 4 ? (
              <View style={style}>
                {this.renderAudioComponent(mediaContent)}
              </View>
            ) : messageType === 5 ? (
              <View style={style}>{this.renderPdfComponent(mediaContent)}</View>
            ) : messageType === 6 ? (
              <View style={style}>
                {this.renderEmojiComponent(messageContent)}
              </View>
            ) : null}
            {messageContent !== null &&
              messageContent !== undefined &&
              messageContent.trim().length > 0 &&
              messageType !== 6 && (
                <View
                  style={[
                    mediaContent !== '' ? {paddingHorizontal: scale(4)} : style,
                  ]}>
                  {this.renderTextComponent(messageContent, isLeft)}
                </View>
              )}
          </View>
        )}

        <View
          style={[grid.rowrow, isLeft ? styles.viewLeft : styles.viewRight]}>
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
  renderRemovedMsg(isLeft) {
    const {customFont} = this.props;
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
          This message has been deleted
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
            {moment(currentMessage.createdAt)
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
    const {currentMessage, nextMessage, position, onLongPress, onPress} =
      this.props;
    const sameUser = isSameUser(currentMessage, nextMessage);

    return (
      <View>
        {currentMessage.system ? (
          this.renderSystemMessage()
        ) : (
          <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={1}
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
          </TouchableOpacity>
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
    borderRadius: scale(10),
  },
  thumbStyle: {
    aspectRatio: 1 / 1,
    height: scale(165),
    borderRadius: scale(10),
  },
  playIconstyle: {
    position: 'absolute',
    zIndex: 9,
    bottom: 15,
    left: 15,
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
  hashTag: {
    fontStyle: 'italic',
  },
});

export default ChatItem;
