import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import {scale} from '../../theme/Scalling';
import GlobalInclude from '../../globalInclude/Globalinclude';
import ProgressImage from '../../component/ProgresImage';
import YoutubeView from '../../component/YoutubeView';
import moment from 'moment';
import Pdf from 'react-native-pdf';

import {isSameUser, isSameDay} from '../../helper/ChatHelper';
import {IconType} from '../../helper/Constants';

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
      return (
        <View style={styles.tickView}>
          {!!currentMessage.isSent && <Text style={[styles.tick]}>✓</Text>}
          {!!currentMessage.isRead && <Text style={[styles.tick]}>✓</Text>}
          {!!currentMessage.pending && <Text style={[styles.tick]}>🕓</Text>}
        </View>
      );
    }
    return null;
  }

  renderTextComponent(source, isLeft) {
    const {customFont} = this.props;
    return (
      <Text
        style={[
          customFont,
          g.FHNR,
          isLeft ? g.colorBlack : g.colorWhite,
          g.txtCenterVertical,
          {textAlign: 'justify'},
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
      <View style={[grid.justifyContentRight, grid.alignItemsBottom]}>
        <Text
          style={[
            customFont,
            g.FHNM,
            isLeft ? g.colorBlue : g.colorWhite,
            grid.justifyContentRight,
            grid.alignItemsBottom,
            g.txtCenterVertical,
            g.mt5,
          ]}>
          {moment(source.createdAt).fromNow()}
        </Text>
      </View>
    );
  }

  renderAvtar() {
    const {nextMessage, currentMessage} = this.props;

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

  renderLeftSide(currentMessage) {
    return (
      <View style={[grid.rowdir]}>
        {this.renderAvtar()}
        <View style={[g.ml5, g.bggray3, styles.bubbleLeft]}>
          {currentMessage.messageType === 1
            ? this.renderTextComponent(currentMessage.message, true)
            : currentMessage.messageType === 2
            ? this.renderImageComponent(currentMessage.media)
            : currentMessage.messageType === 3
            ? this.renderVideoComponent(currentMessage.media)
            : currentMessage.messageType === 4
            ? this.renderAudioComponent(currentMessage.media)
            : currentMessage.messageType === 5
            ? this.renderPdfComponent(currentMessage.media)
            : null}

          {this.renderDateComponent(currentMessage, true)}
        </View>
      </View>
    );
  }

  renderRightSide(currentMessage) {
    return (
      <View style={[grid.rowdir, styles.viewRight]}>
        <View style={[g.bgBlue, styles.bubbleRight]}>
          {currentMessage.messageType === 1
            ? this.renderTextComponent(currentMessage.message, false)
            : currentMessage.messageType === 2
            ? this.renderImageComponent(currentMessage.media)
            : currentMessage.messageType === 3
            ? this.renderVideoComponent(currentMessage.media)
            : currentMessage.messageType === 4
            ? this.renderAudioComponent(currentMessage.media)
            : currentMessage.messageType === 5
            ? this.renderPdfComponent(currentMessage.media)
            : null}

          <View style={[grid.rowrow, styles.viewRight]}>
            {this.renderDateComponent(currentMessage, false)}
            <View style={{marginHorizontal: scale(5)}} />
            {this.renderTicks()}
          </View>
        </View>
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
    const {currentMessage, nextMessage, position} = this.props;
    const sameUser = isSameUser(currentMessage, nextMessage);

    return (
      <View
        style={[
          g.pl5,
          g.pr5,
          {marginBottom: sameUser ? 2 : 10},
          {marginBottom: 2},
        ]}>
        <View style={[grid.rowdir, grid.justifyContentCenter]}>
          {this.renderDay()}
        </View>
        {position === 'right'
          ? this.renderRightSide(currentMessage)
          : this.renderLeftSide(currentMessage)}
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
    paddingHorizontal: scale(6),
    paddingTop: scale(8),
    paddingBottom: scale(8),
    maxWidth: width - 80,
  },
  bubbleRight: {
    borderTopLeftRadius: scale(10),
    borderBottomLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    borderBottomRightRadius: 0,
    paddingHorizontal: scale(6),
    paddingTop: scale(8),
    paddingBottom: scale(8),
    maxWidth: width - 80,
  },
  viewRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
  },
  youtubeView: {
    height: scale(180),
    width: scale(160),
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
    height: scale(180),
    width: scale(160),
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
    marginRight: 10,
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
});

export default ChatItem;
