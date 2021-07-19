import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Platform,
  ScrollView,
  Dimensions,
  UIManager,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';

import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import CommonButton from './CommonButton';
import ProgressImage from './ProgresImage';
import {IconType} from '../helper/Constants';

import g from '../theme/global';
import grid from '../theme/grid';
const deviceWidth = Dimensions.get('window').width;

const ShowPopNotification = ({imageData, onClose, uplodFinalImages}) => {
  const [showModal, setShowModal] = useState(true);
  const [mediaData, setMediaData] = useState([]);

  useEffect(() => {
    setMediaData(imageData);
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    return () => {};
  }, []);

  const removeIndex = (index) => {
    Alert.alert(
      'Are you sure you want to delete it?',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => {
            let oldData = mediaData;
            oldData.splice(index, 1);
            setMediaData([...oldData]);

            if (oldData.length === 0) {
              setShowModal(!showModal);
              onClose();
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderMediaItem = () => {
    let componentArray = [];

    mediaData.map((item, index) => {
      const component = (
        <View
          key={index}
          style={{
            width: deviceWidth / 3 - 27,
            marginTop: 10,
            marginRight: 5,
            marginLeft: 5,
          }}>
          <View style={[g.br3, g.oh, g.bglightGray]}>
            <ProgressImage
              source={{uri: item.path}}
              containerStyle={{aspectRatio: 1 / 1}}
              imageStyle={{
                aspectRatio: 1 / 1,
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              removeIndex(index);
            }}
            style={[
              g.boxShadow,
              g.bgBlue,
              {
                position: 'absolute',
                top: -10,
                right: -7,
                height: 30,
                width: 30,
                borderRadius: 26,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <GlobalInclude.BaseIcon
              containerStyle={{
                height: 20,
                width: 20,
                justifyContent: 'center',
              }}
              iconColor={'white'}
              iconName={'close'}
              iconSize={20}
              iconType={IconType[10]}
            />
          </TouchableOpacity>
        </View>
      );
      componentArray.push(component);
    });
    return componentArray;
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <Modal
        transparent={false}
        onRequestClose={() => {
          setShowModal(!showModal);
          onClose();
        }}
        animationType={'slide'}
        statusBarTranslucent={true}
        presentationStyle={'overFullScreen'}
        visible={showModal}>
        <SafeAreaView style={GlobalInclude.AppStyle.fill}>
          <View style={styles.modalView}>
            <View style={styles.container}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  marginEnd: scale(40),
                  marginStart: scale(40),
                }}>
                <Text style={[g.fs16, g.FHNB, g.colordarkGray, g.txtCenter]}>
                  Selected Images
                </Text>
              </View>
              <View style={[grid.col, grid.rowdir, g.ml15]}>
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(!showModal);
                    onClose();
                  }}>
                  <Image
                    source={GlobalInclude.Assets.Back}
                    style={styles.back}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* data */}
            <ScrollView>
              <View
                style={[
                  {
                    marginLeft: 15,
                    marginRight: 15,
                    padding: 10,
                  },
                  g.br3,
                ]}>
                <View style={[grid.rowdir, grid.flexwrap]}>
                  {renderMediaItem()}
                </View>
              </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <CommonButton
                title={'Upload'}
                radius={scale(12)}
                onPress={() => {
                  setShowModal(!showModal);
                  uplodFinalImages(mediaData);
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'white',
    flex: 1,
    width: '100%',
  },
  containerView: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: scale(10),
    flex: 1,
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
    width: scale(190),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    alignContent: 'center',
    alignSelf: 'center',
    marginHorizontal: scale(8),
  },
  back: {
    width: scale(30),
    height: scale(30),
    padding: scale(4),
    alignSelf: 'flex-end',
  },
  container: {flexDirection: 'row', height: scale(50), alignItems: 'center'},
});

export default ShowPopNotification;
