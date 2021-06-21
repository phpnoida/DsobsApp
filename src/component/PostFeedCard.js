import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import GlobalInclude from '../globalInclude/Globalinclude';
import {scale} from '../theme/Scalling';
import g from '../theme/global';
import grid from '../theme/grid';
import {IconType} from '../helper/Constants';
import ProgressImage from '../component/ProgresImage';
import moment from 'moment';
import Helpers from '../helper/Helper';
import FlatListSlider from './FlatListSlider';
import SliderImage from './SliderImage';
import Pdf from 'react-native-pdf';
import SeeMore from './SeeMore/SeeMore';
import YoutubeView from './YoutubeView';

const {width: displayWidth} = Dimensions.get('window');

class PostFeedCard extends PureComponent {
  constructor(props) {
    super(props);
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

  _renderDoc = (url) => {
    return (
      <View>
        <View style={{width: '100%', aspectRatio: 16 / 9}}>
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

  _renderOne = (item) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onItemCallback(item, 0);
        }}
        activeOpacity={1}
        style={GlobalInclude.AppStyle.fullWidth}>
        {item[0].type === 1 ? (
          <View>
            <ProgressImage
              source={{uri: item[0].file}}
              containerStyle={{width: '100%', aspectRatio: 1 / 1}}
              mode={'cover'}
            />
          </View>
        ) : item[0].type === 3 ? (
          <View>{this._renderDoc(item[0].file)}</View>
        ) : (
          <View />
        )}
      </TouchableOpacity>
    );
  };

  _showViewByType = (item) => {
    return item.length === 1 ? (
      this._renderOne(item)
    ) : (
      <FlatListSlider
        loop={false}
        data={item}
        component={
          <SliderImage
            onItemCallBack={(post, index) =>
              this.props.onItemCallback(item, index)
            }
          />
        }
        autoscroll={false}
        indicator={item.length > 1 ? true : false}
      />
    );
  };

  _showMedia = () => {
    return (
      <View>
        {this.props.links.length > 0 ? (
          <View style={{width: displayWidth}}>
            {this.props.links[0].type === 2 ? (
              <View style={g.bggray3}>
                <YoutubeView
                  link={this.props.links[0].file}
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
              </View>
            ) : (
              this._showViewByType(this.props.links)
            )}
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    return (
      <View onLayout={this.props.onLayout} style={[g.mb15, g.bgWhite, g.pb7]}>
        <View style={[grid.justifyContentCenter, {borderRadius: scale(10)}]}>
          <View style={grid.rowdir}>
            <View
              style={[
                grid.col,
                grid.justifyContentCenter,
                {height: scale(30)},
              ]}>
              <Text
                style={[
                  g.ml10,
                  g.fs15,
                  g.FHNM,
                  g.colorBlue,
                  GlobalInclude.AppStyle.transform,
                ]}>
                {this.props.categoryMsg}
              </Text>
            </View>
          </View>
          <View style={styles.shadowLine} />
          {/* User Row */}
          <View style={[grid.rowdir, g.p10, g.pt5, g.pl5, g.pr5]}>
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
                    {this.props.status !== 2 && this.props.feedType === 'Main' && (
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
            <View>
              {this.props.categoryId === 4 || this.props.categoryId === 5 ? (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    this.props.navigation.navigate('CommonWebPage', {
                      link: this.props.fullUrl,
                    });
                  }}>
                  <View style={[g.ml10, g.mr10, grid.flex1, g.mb5]}>
                    <SeeMore numberOfLines={4} style={styles.txtStyle}>
                      {this.props.body}
                    </SeeMore>
                  </View>
                  {this.props.categoryId === 5 ? (
                    this._showMedia()
                  ) : (
                    <ProgressImage
                      source={{uri: this.props.links[0].file}}
                      containerStyle={styles.newsImage}
                      mode={'cover'}
                    />
                  )}

                  <View style={[g.ml10, g.mr10, grid.flex1, g.mt8]}>
                    {this.props.linkHost !== undefined &&
                      this.props.linkHost !== null &&
                      this.props.linkHost !== '' && (
                        <Text
                          style={
                            ([
                              styles.txtSmallText,
                              g.fs15,
                              g.colorGray2,
                              grid.justifyContentCenter,
                              grid.alignItemsTop,
                            ],
                            {textTransform: 'uppercase'})
                          }>
                          {this.props.linkHost.replace('www.', '')}
                        </Text>
                      )}
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#ebebe4',
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 1,
                        flex: 1,
                        marginTop: scale(2),
                        marginBottom: scale(2),
                      }}
                    />
                    {this.props.title !== undefined &&
                      this.props.title !== null &&
                      this.props.title !== '' && (
                        <Text
                          style={[
                            styles.txtSmallText,
                            g.fs14,
                            grid.justifyContentCenter,
                            grid.alignItemsTop,
                          ]}>
                          {this.props.title}
                        </Text>
                      )}
                  </View>
                </TouchableOpacity>
              ) : this.props.categoryId === 1 ||
                this.props.categoryId === 2 ||
                this.props.categoryId === 6 ||
                this.props.categoryId === 7 ? (
                <View>
                  {this.props.links.length > 0 ? (
                    <View>
                      <View style={[g.ml10, g.mr10, grid.flex1, g.mb5]}>
                        <Text
                          style={[
                            grid.justifyContentCenter,
                            grid.alignItems,
                            styles.txtSmallText,
                            g.fs15,
                            g.FHNM,
                          ]}>
                          {this.props.body}
                        </Text>
                      </View>
                      {this._showMedia()}
                    </View>
                  ) : this.props.colorCode !== undefined &&
                    this.props.colorCode !== '' ? (
                    <View
                      style={[
                        styles.contentArea,
                        {
                          backgroundColor: this.props.colorCode,
                          padding: scale(8),
                        },
                      ]}>
                      <Text
                        style={[
                          styles.txtSmallText,
                          {
                            color: Helpers.getContrastYIQ(this.props.colorCode),
                          },
                          grid.justifyContentCenter,
                          grid.alignItems,
                          g.txtCenter,
                          g.fs15,
                          g.FHNM,
                        ]}>
                        {this.props.body}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.txtSmallText,
                        g.fs15,
                        g.FHNM,
                        g.ml10,
                        g.mr10,
                        grid.flex1,
                        g.mb5,
                      ]}>
                      {this.props.body}
                    </Text>
                  )}
                </View>
              ) : (
                <View>
                  <View style={[g.ml10, g.mr10, grid.flex1]}>
                    {this.props.body !== undefined &&
                    this.props.body !== null &&
                    this.props.body !== '' ? (
                      <View>
                        {this.props.body.length <= 800 ? (
                          <Text
                            style={[
                              grid.justifyContentCenter,
                              grid.alignItems,
                              styles.txtSmallText,
                              g.fs15,
                              g.FHNM,
                            ]}>
                            {this.props.body}
                          </Text>
                        ) : (
                          <SeeMore numberOfLines={6} style={styles.txtStyle}>
                            {this.props.body}
                          </SeeMore>
                        )}
                      </View>
                    ) : null}
                  </View>
                  {this._showMedia()}
                </View>
              )}
            </View>
          )}

          {/* Post Content */}

          {/* Post operations */}
          <View style={[grid.rowdir, g.mt8]}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                this.props.onClickMediaOption(1);
              }}
              disabled={this.props.status === 2}
              style={[grid.row, grid.alignItems, grid.justifyContentCenter]}>
              <Image
                source={GlobalInclude.Assets.TickerLike}
                resizeMode={'contain'}
                resizeMethod={'auto'}
                tintColor={
                  this.props.status === 2
                    ? '#ebebe4'
                    : GlobalInclude.Color.ColorPrimary
                }
                style={[
                  {
                    height: scale(18),
                    width: scale(18),
                    ...Platform.select({
                      ios: {
                        tintColor:
                          this.props.status === 2
                            ? '#ebebe4'
                            : GlobalInclude.Color.ColorPrimary,
                      },
                    }),
                  },
                ]}
              />
              <Text
                style={[
                  g.ml5,
                  g.fs13,
                  g.FHNM,
                  this.props.status === 2 ? g.colorDisabled : g.colorBlue,
                  grid.alignItems,
                  grid.justifyContentCenter,
                ]}>
                {`${
                  this.props.totalLikes > 0 ? this.props.totalLikes : ''
                }   Likes`}
              </Text>
            </TouchableOpacity>

            <View
              style={[grid.row, grid.alignItems, grid.justifyContentCenter]}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  this.props.onClickMediaOption(2);
                }}
                disabled={this.props.status === 2}
                style={[
                  grid.rowrow,
                  grid.alignItems,
                  grid.justifyContentCenter,
                ]}>
                <Image
                  source={GlobalInclude.Assets.TickerComment}
                  resizeMode={'contain'}
                  resizeMethod={'auto'}
                  tintColor={
                    this.props.status === 2
                      ? '#ebebe4'
                      : GlobalInclude.Color.ColorPrimary
                  }
                  style={[
                    styles.menuIcon,
                    {
                      height: scale(18),
                      width: scale(18),
                      ...Platform.select({
                        ios: {
                          tintColor:
                            this.props.status === 2
                              ? '#ebebe4'
                              : GlobalInclude.Color.ColorPrimary,
                        },
                      }),
                    },
                  ]}
                />

                <Text
                  style={[
                    g.ml5,
                    g.fs13,
                    g.FHNM,
                    this.props.status === 2 ? g.colorDisabled : g.colorBlue,
                    grid.alignItems,
                    grid.justifyContentCenter,
                  ]}>
                  {`${
                    this.props.totalComments > 0 ? this.props.totalComments : ''
                  }   Comments`}
                </Text>
              </TouchableOpacity>
            </View>
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

  emptyArea: {
    height: scale(120),
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  contentArea: {
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    //aspectRatio: 1 / 1,
    minHeight: scale(130),
  },
  pdfIcon: {
    position: 'absolute',
    zIndex: 2,
    bottom: 15,
    left: 15,
  },
  centerDoc: {
    aspectRatio: 16 / 9,
    width: displayWidth,
  },
  fillView: {flex: 1},
  youtubeView: {
    height: scale(200),
    width: '100%',
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
  },
  thumbStyle: {
    height: scale(200),
    width: '100%',
  },
  playIconstyle: {
    position: 'absolute',
    zIndex: 9,
    bottom: 15,
    left: 15,
  },
  shadowLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#ebebe4',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
    flex: 1,
    marginHorizontal: scale(5),
  },
  txtStyle: {
    fontWeight: '400',
    color: '#262626',
    ...g.fs15,
    ...g.FHNM,
  },
  txtSmallText: {
    ...g.fs15,
    ...g.FHNM,
    color: '#262626',
    textAlign: 'auto',
  },
  newsImage: {width: '100%', aspectRatio: 16 / 9},
});
export default PostFeedCard;
