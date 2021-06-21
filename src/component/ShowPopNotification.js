import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Text,
  FlatList,
  UIManager,
} from 'react-native';

import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';
import CommonButton from './CommonButton';
import SliderImage from './SliderImage';
import ProgressImage from './ProgresImage';
import Indicator from './Indicator';
import g from '../theme/global';
import grid from '../theme/grid';

const ShowPopNotification = (props) => {
  const flatListRef = useRef();
  const [showModal, setShowModal] = useState(true);
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const {imagelink} = props;

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    return () => {};
  }, []);

  const onViewableItemsChanged = ({viewableItems}) => {
    if (viewableItems.length > 0) {
      let tmpIndex = viewableItems[0].index;
      setCurrentIndex(tmpIndex);
    }
  };
  const viewabilityConfigCallbackPairs = useRef([{onViewableItemsChanged}]);

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <Modal
        transparent={false}
        onRequestClose={() => {
          setShowModal(!showModal);
          props.onClose();
        }}
        animationType={'slide'}
        statusBarTranslucent={true}
        presentationStyle={'overFullScreen'}
        visible={showModal}>
        <View style={styles.modalView}>
          <View style={styles.containerView}>
            <View
              style={[
                grid.rowdir,
                grid.alignItems,
                grid.justifyContentCenter,
                g.pt5,
                g.pb5,
              ]}>
              <Text
                style={[
                  g.fs18,
                  g.FHNB,
                  g.colorBlue,
                  grid.justifyContentCenter,
                  g.txtCenter,
                  g.txtCenterVertical,
                  grid.alignItems,
                ]}>
                Pop Notifications
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(!showModal);
                  props.onClose();
                }}
                style={styles.buttonCircle}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(30), width: scale(30)}}
                  iconColor={'#000'}
                  iconName={'close'}
                  iconSize={scale(30)}
                  iconType={IconType[8]}
                />
              </TouchableOpacity>
            </View>

            <View
              style={GlobalInclude.AppStyle.fill}
              onLayout={(event) => {
                const {width} = event.nativeEvent.layout;
                setLayoutWidth(width);
              }}>
              <FlatList
                ref={flatListRef}
                horizontal
                pagingEnabled={true}
                snapToInterval={layoutWidth}
                decelerationRate="fast"
                bounces={false}
                data={imagelink}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <ProgressImage
                    source={{uri: item.imagelink}}
                    containerStyle={{
                      width: layoutWidth,
                      flex: 1,
                    }}
                    mode={'cover'}
                  />
                )}
                keyExtractor={(item, index) => item.toString() + index}
                viewabilityConfigCallbackPairs={
                  viewabilityConfigCallbackPairs.current
                }
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(data, index) => ({
                  length: layoutWidth,
                  offset: layoutWidth * index,
                  index,
                })}
                windowSize={1}
                initialNumToRender={1}
                maxToRenderPerBatch={1}
                removeClippedSubviews={true}
              />
            </View>
            <Indicator
              itemCount={imagelink.length}
              currentIndex={currentIndex % imagelink.length}
              indicatorStyle={{
                height: scale(10),
                width: scale(10),
                borderRadius: scale(10),
                marginHorizontal: scale(4),
              }}
              indicatorContainerStyle={{
                marginTop: scale(10),
                marginBottom: scale(10),
              }}
              indicatorActiveColor={GlobalInclude.Color.ColorPrimary}
              indicatorInActiveColor={'#bdc3c7'}
              indicatorActiveWidth={scale(10)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <CommonButton
                title={'Take me Home'}
                radius={scale(12)}
                onPress={() => {
                  setShowModal(!showModal);
                  props.onClose();
                }}
              />
            </View>
            <View style={styles.button}>
              <CommonButton
                title={'Check It Out'}
                radius={scale(12)}
                onPress={() => {
                  setShowModal(!showModal);
                  props.onButtonPress(imagelink[currentIndex]);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'rgba(62,62,62,1)',
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(10),
  },
  containerView: {
    backgroundColor: 'white',
    width: '100%',
    alignSelf: 'center',
    borderRadius: scale(10),
    flex: 1,
    marginTop: scale(60),
  },
  buttonCircle: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(30),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    alignContent: 'center',
    position: 'absolute',
    right: 5,
    top: 5,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: scale(20),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    alignContent: 'center',
    alignSelf: 'center',
    marginHorizontal: scale(8),
  },
});

export default ShowPopNotification;
