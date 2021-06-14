import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
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
import ResponsiveImage from './ResponsiveImage';
import Pdf from 'react-native-pdf';
import FitImage from './FitImage';
import SeeMore from './SeeMore/SeeMore';

const {width: displayWidth} = Dimensions.get('window');

class PostFeedCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {visibility: true};
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

  _renderImage = (url) => {
    return (
      <ProgressImage
        source={{uri: url}}
        containerStyle={{width: '100%', aspectRatio: 1 / 1}}
        mode={'contain'}
      />
    );
  };

  _renderDoc = (url) => {
    return (
      <View>
        <View style={{width: '100%', aspectRatio: 1 / 1}}>
          <Pdf
            singlePage={true}
            source={{
              uri: url,
            }}
            style={styles.centerDoc}
          />
          <View style={styles.pdfIcon}>
            <GlobalInclude.BaseIcon
              containerStyle={{height: scale(36), width: scale(36)}}
              iconColor={'#E61A2D'}
              iconName={'file-pdf-o'}
              iconSize={scale(36)}
              iconType={IconType[4]}
            />
          </View>
        </View>
      </View>
    );
  };

  _showPDFThumb = () => {
    return (
      <View
        style={[
          GlobalInclude.AppStyle.fillCenter,
          g.lightGray,
          {marginHorizontal: 3, marginVertical: 3},
        ]}>
        <View style={[grid.rowrow, grid.justifyContentCenter]}>
          <GlobalInclude.BaseIcon
            containerStyle={{height: scale(48), width: scale(48)}}
            iconColor={'#E61A2D'}
            iconName={'file-pdf-o'}
            iconSize={scale(48)}
            iconType={IconType[4]}
          />
        </View>
      </View>
    );
  };

  _renderOne = (item) => {
    return (
      <View style={GlobalInclude.AppStyle.fullWidth}>
        {item[0].type === 1 ? (
          <View>
            {/* <ProgressImage
              source={{uri: item[0].file}}
              containerStyle={{width: '100%', aspectRatio: 1 / 1}}
              mode={'contain'}
            /> */}
            <ResponsiveImage source={{uri: item[0].file}} />
          </View>
        ) : item[0].type === 3 ? (
          <View>{this._renderDoc(item[0].file)}</View>
        ) : (
          <View />
        )}
      </View>
    );
  };

  _renderTwo = (item) => {
    return (
      <View
        style={{
          flex: 1,
          aspectRatio: 2 / 1,
          overflow: 'hidden',
          flexDirection: 'row',
        }}>
        <View style={styles.fillView}>
          {item[0].type === 1 ? (
            this._renderImage(item[0].file)
          ) : item[0].type === 3 ? (
            this._showPDFThumb()
          ) : (
            <View />
          )}
        </View>

        <View style={styles.fillView}>
          {item[1].type === 1 ? (
            this._renderImage(item[1].file)
          ) : item[1].type === 3 ? (
            this._showPDFThumb()
          ) : (
            <View />
          )}
        </View>
      </View>
    );
  };

  _renderThree = (item) => {
    return (
      <View
        style={{
          flex: 1,
          aspectRatio: 2 / 1,
          overflow: 'hidden',
          flexDirection: 'row',
        }}>
        <View style={styles.fillView}>
          {item[0].type === 1 ? (
            this._renderImage(item[0].file)
          ) : item[0].type === 3 ? (
            this._showPDFThumb()
          ) : (
            <View />
          )}
        </View>
        <View style={styles.fillView}>
          <View style={styles.fillView}>
            {item[1].type === 1 ? (
              this._renderImage(item[1].file)
            ) : item[1].type === 3 ? (
              this._showPDFThumb()
            ) : (
              <View />
            )}
          </View>
          <View style={styles.fillView}>
            {item[2].type === 1 ? (
              this._renderImage(item[2].file)
            ) : item[2].type === 3 ? (
              this._showPDFThumb()
            ) : (
              <View />
            )}
          </View>
        </View>
      </View>
    );
  };

  _renderFour = (item) => {
    return (
      <View
        style={{
          flex: 1,
          aspectRatio: 2 / 1,
          overflow: 'hidden',
          flexDirection: 'row',
        }}>
        <View style={styles.fillView}>
          <View style={styles.fillView}>
            {item[0].type === 1 ? (
              this._renderImage(item[0].file)
            ) : item[0].type === 3 ? (
              this._showPDFThumb()
            ) : (
              <View />
            )}
          </View>
          <View style={styles.fillView}>
            {item[1].type === 1 ? (
              this._renderImage(item[1].file)
            ) : item[1].type === 3 ? (
              this._showPDFThumb()
            ) : (
              <View />
            )}
          </View>
        </View>

        <View style={styles.fillView}>
          <View style={styles.fillView}>
            {item[2].type === 1 ? (
              this._renderImage(item[2].file)
            ) : item[2].type === 3 ? (
              this._renderDoc(item[2].file)
            ) : (
              <View />
            )}
          </View>
          <View style={styles.fillView}>
            {item[3].type === 1 ? (
              this._renderImage(item[3].file)
            ) : item[3].type === 3 ? (
              this._renderDoc(item[3].file)
            ) : (
              <View />
            )}
          </View>
        </View>
      </View>
    );
  };

  _renderFive = (item) => {
    return (
      <View
        style={{
          flex: 1,
          aspectRatio: 2 / 1,
          overflow: 'hidden',
          flexDirection: 'row',
          backgroundColor: 'orange',
        }}>
        <View style={styles.fillView}>
          <View style={styles.fillView}>
            {item[0].type === 1 ? (
              this._renderImage(item[0].file)
            ) : item[0].type === 3 ? (
              this._renderDoc(item[0].file)
            ) : (
              <View />
            )}
          </View>
          <View style={styles.fillView}>
            {item[1].type === 1 ? (
              this._renderImage(item[1].file)
            ) : item[1].type === 3 ? (
              this._renderDoc(item[1].file)
            ) : (
              <View />
            )}
          </View>
        </View>

        <View style={styles.fillView}>
          <View style={styles.fillView}>
            {item[2].type === 1 ? (
              this._renderImage(item[2].file)
            ) : item[2].type === 3 ? (
              this._renderDoc(item[2].file)
            ) : (
              <View />
            )}
          </View>
          <View style={styles.fillView}>
            {item[3].type === 1 ? (
              this._renderImage(item[3].file)
            ) : item[3].type === 3 ? (
              this._renderDoc(item[3].file)
            ) : (
              <View />
            )}
            <View
              style={{
                position: 'absolute',
                right: 5,
                bottom: 5,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 3,
                height: scale(40),
                width: scale(40),
                backgroundColor: 'rgba(229, 229, 229,0.5)',
                borderRadius: scale(60),
              }}>
              <Text
                style={[
                  g.fs18,
                  g.FHNM,
                  g.colorBlue,
                  grid.alignItems,
                  grid.justifyContentCenter,
                ]}>
                +1
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  _showViewByType = (item) => {
    return item.length === 1 ? (
      this._renderOne(item)
    ) : item.length === 2 ? (
      this._renderTwo(item)
    ) : item.length === 3 ? (
      this._renderThree(item)
    ) : item.length === 4 ? (
      this._renderFour(item)
    ) : item.length === 5 ? (
      this._renderFive(item)
    ) : (
      <View />
    );
  };

  _getFontSize = (text) => {
    if (text.trim().length < 100) {
      return scale(23);
    } else if (text.trim().length > 100 && text.trim().length < 600) {
      return scale(20);
    } else if (text.trim().length > 600 && text.trim().length < 1000) {
      return scale(17);
    } else {
      return scale(15);
    }
  };

  render() {
    return (
      <View onLayout={this.props.onLayout} style={[g.mb15, g.bgWhite, g.pb7]}>
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
                      <Text
                        style={[
                          g.fs15,
                          g.FHNM,
                          g.colorBlue,
                          GlobalInclude.AppStyle.transform,
                        ]}>
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
                          iconColor={GlobalInclude.Color.ColorPrimaryLight}
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
                  g.FHNR,
                  g.colorBlack,
                  grid.justifyContentCenter,
                  grid.alignItems,
                ]}>
                {this.props.body}
              </Text>
            </View>
          ) : (
            <View style={[g.ml10, g.mr10, grid.flex1]}>
              {this.props.body !== undefined &&
              this.props.body !== null &&
              this.props.body !== '' ? (
                <View>
                  {this.props.body.length <= 800 ? (
                    <Text
                      style={[
                        g.FHNR,
                        grid.justifyContentCenter,
                        grid.alignItems,
                        {
                          textAlign: 'justify',
                          letterSpacing: 0.5,
                          fontWeight: '400',
                          fontSize: scale(18),
                          color: 'rgb(5,5,5)',
                          fontFamily: 'SegoeUI',
                        },
                      ]}>
                      {this.props.body}
                    </Text>
                  ) : (
                    <SeeMore numberOfLines={7}>{this.props.body}</SeeMore>
                  )}
                </View>
              ) : null}
            </View>
          )}

          {/* <MoreInfo text={this.props.body} linesToTruncate={4} /> */}

          {/* Post message */}

          {/* Post Image */}
          {this.props.links.length > 0 ? (
            <View>
              {this.props.links[0].type === 2 ? (
                <View />
              ) : (
                this._showViewByType(this.props.links)
              )}
            </View>
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
  pdfIcon: {
    position: 'absolute',
    zIndex: 2,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerUI: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
  centerDoc: {
    aspectRatio: 1 / 1,
    width: displayWidth,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
  fillView: {flex: 1},
});
export default PostFeedCard;
