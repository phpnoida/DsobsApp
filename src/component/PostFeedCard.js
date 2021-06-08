import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';
import g from '../theme/global';
import grid from '../theme/grid';
import {IconType} from '../helper/Constants';
import ProgressImage from '../component/ProgresImage';
import moment from 'moment';
import Helpers from '../helper/Helper';
import MoreInfo from './MoreInfo';
import FlatListSlider from './FlatListSlider';
import SliderImage from './SliderImage';

class PostFeedCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  showMediaIcon(status, iconName, iconType, label, onPress) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        disabled={status === 2}
        style={[grid.rowrow, grid.alignItems, grid.justifyContentCenter]}>
        <GlobalInclude.BaseIcon
          containerStyle={{height: scale(28), width: scale(28)}}
          iconColor={
            status === 2 ? '#ebebe4' : GlobalInclude.Color.ColorPrimary
          }
          iconName={iconName}
          iconSize={scale(28)}
          iconType={IconType[iconType]}
        />
        <Text
          style={[
            g.fs13,
            g.FHNM,
            status === 2 ? g.colorDisabled : g.colorBlue,
            grid.alignItems,
            grid.justifyContentCenter,
          ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View
        onLayout={this.props.onLayout}
        style={[g.mb15, g.bgWhite, g.pb7]}
        key={this.props.itemIndex}>
        <View style={[grid.justifyContentCenter, {borderRadius: scale(10)}]}>
          {/* User Row */}
          <View style={[grid.rowdir, g.p10, g.pl5, g.pr5]}>
            <TouchableOpacity
              style={grid.row}
              activeOpacity={0.9}
              onPress={this.props.onClickUser}>
              <View
                style={[
                  g.mr10,
                  g.bggray,
                  g.oh,
                  {
                    width: scale(40),
                    height: scale(40),
                    borderRadius: scale(50),
                  },
                ]}>
                {this.props.author.profileImg !== undefined &&
                this.props.author.profileImg !== null &&
                this.props.author.profileImg !== '' ? (
                  <ProgressImage
                    source={{uri: this.props.author.profileImg}}
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
              {this.props.author !== undefined && this.props.author !== null && (
                <View style={[grid.justifyContentCenter, grid.flex1]}>
                  <View style={grid.rowdir}>
                    <View style={[grid.col]}>
                      <Text style={[g.fs15, g.FHNM, g.colorBlue]}>
                        {`${Helpers.concatName(this.props.author)} - ${
                          this.props.author.batch
                        }`}
                      </Text>
                    </View>

                    {this.props.status !== 2 && (
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.props.onClickPostOptions}
                        style={[
                          g.mr7,
                          grid.justifyContentCenter,
                          grid.alignItems,
                        ]}>
                        <GlobalInclude.BaseIcon
                          containerStyle={{height: scale(22), width: scale(22)}}
                          iconColor={GlobalInclude.Color.ColorPrimary}
                          iconName={'dots-three-horizontal'}
                          iconSize={scale(22)}
                          iconType={IconType[9]}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text
                    style={[
                      g.fs14,
                      g.FHNR,
                      g.colorBlack,
                      grid.justifyContentCenter,
                      grid.alignItems,
                      g.txtCenterVertical,
                      g.mt5,
                    ]}>
                    {moment(this.props.postedAt * 1000).fromNow()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* User Row */}

          {/* Post Content */}

          {/* Post message */}

          {this.props.status === 2 ? (
            <View style={styles.emptyArea}>
              <Text
                style={[
                  g.fs18,
                  g.FHNM,
                  g.colorBlack,
                  grid.justifyContentCenter,
                  grid.alignItems,
                ]}>
                {this.props.body}
              </Text>
            </View>
          ) : (
            <View>
              {this.props.body !== undefined &&
              this.props.body !== null &&
              this.props.body !== '' ? (
                <MoreInfo text={this.props.body} linesToTruncate={3} />
              ) : null}
            </View>
          )}

          {/* Post message */}

          {/* Post Image */}
          {this.props.links.length > 0 ? (
            <FlatListSlider
              data={this.props.links}
              component={<SliderImage />}
              autoscroll={false}
              indicator={this.props.links.length > 1 ? true : false}
            />
          ) : null}
          {/*  */}

          {/* Post Content */}

          {/* Post operations */}
          <View style={[grid.rowdir, g.mt8]}>
            <View
              style={[grid.row, grid.alignItems, grid.justifyContentCenter]}>
              <View>
                {this.showMediaIcon(this.props.status, 'like', 8, 'Likes', () =>
                  this.props.onClickMediaOption(1),
                )}
                {this.props.totalLikes > 0 && (
                  <Text
                    style={[
                      g.fs12,
                      g.FHNB,
                      g.colorWhite,
                      grid.justifyContentCenter,
                      g.txtCenter,
                      g.txtCenterVertical,
                      g.bgBlue,
                      styles.totalLikes,
                    ]}>
                    {this.props.totalLikes}
                  </Text>
                )}
              </View>
            </View>

            <View
              style={[grid.row, grid.alignItems, grid.justifyContentCenter]}>
              <View>
                {this.showMediaIcon(
                  this.props.status,
                  'comment',
                  8,
                  'Comments',
                  () => this.props.onClickMediaOption(2),
                )}
                {this.props.totalComments > 0 && (
                  <Text
                    style={[
                      g.fs12,
                      g.FHNB,
                      g.colorWhite,
                      grid.justifyContentCenter,
                      g.txtCenter,
                      g.txtCenterVertical,
                      g.bgBlue,
                      styles.totalComments,
                    ]}>
                    {this.props.totalComments}
                  </Text>
                )}
              </View>
            </View>
            {/* <View
              style={[grid.row, grid.alignItems, grid.justifyContentCenter]}>
              {this.showMediaIcon(
                this.props.status,
                'share-google',
                8,
                'Share',
                () => this.props.onClickMediaOption(3),
              )}
            </View> */}
          </View>
          {/* Post operations */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    width: scale(40),
    justifyContent: 'center',
  },
  totalComments: {
    position: 'absolute',
    top: -5,
    left: -13,
    borderRadius: scale(30),
    height: scale(22),
    width: scale(22),
  },
  totalLikes: {
    position: 'absolute',
    top: -5,
    left: -13,
    borderRadius: scale(30),
    height: scale(22),
    width: scale(22),
  },
  emptyArea: {
    height: scale(120),
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
export default PostFeedCard;
