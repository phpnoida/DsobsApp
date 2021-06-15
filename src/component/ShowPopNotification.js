import React, {useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Animated,
  Dimensions,
  Text,
} from 'react-native';

import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';
import CommonButton from './CommonButton';
import ProgressImage from './ProgresImage';
import FlatListSlider from './FlatListSlider';
import Preview from './Preview';
import SliderImage from './SliderImage';
import g from '../theme/global';
import grid from '../theme/grid';

const {height: displayHeight, width: displayWidth} = Dimensions.get('window');

const ShowPopNotification = (props) => {
  const [showModal, setShowModal] = useState(true);
  const [layoutWidth, setLayoutWidth] = useState(0);
  const {imagelink} = props;
  console.log('====================================');
  console.log('imagelink', imagelink);
  console.log('====================================');
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
            <View style={GlobalInclude.AppStyle.fill}>
              <View
                style={[
                  grid.rowdir,
                  grid.alignItems,
                  grid.justifyContentCenter,
                ]}>
                <Text
                  style={[
                    g.fs18,
                    g.FHNB,
                    g.colorBlue,
                    grid.col,
                    grid.justifyContentCenter,
                    g.txtCenter,
                  ]}
                  numberOfLines={2}>
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
                onLayout={(event) => {
                  const {width} = event.nativeEvent.layout;
                  console.log('width', width);
                  setLayoutWidth(width);
                }}>
                <FlatListSlider
                  width={layoutWidth}
                  loop={false}
                  data={imagelink}
                  component={<SliderImage itemWidth={layoutWidth} />}
                  autoscroll={false}
                  indicator={imagelink.length > 1 ? true : false}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <CommonButton
                  title={'Take me Home'}
                  radius={scale(12)}
                  onPress={() => {
                    setShowModal(!showModal);
                    props.onButtonPress();
                  }}
                />
              </View>
              <View style={styles.button}>
                <CommonButton
                  title={'Check It Out'}
                  radius={scale(12)}
                  onPress={() => {
                    setShowModal(!showModal);
                    props.onButtonPress();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    alignItems: 'center',
    borderRadius: scale(10),
    height: '65%',
  },
  buttonCircle: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(30),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    alignContent: 'center',
    marginEnd: scale(6),
    marginTop: scale(10),
    marginBottom: scale(5),
  },
  imageStyle: {
    aspectRatio: 1 / 1,
    borderRadius: 0,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    paddingTop: scale(10),
    paddingBottom: scale(10),
    alignContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
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
