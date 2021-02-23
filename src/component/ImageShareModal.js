import React, {useState} from 'react';
import {
  Text,
  View,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import g from '../theme/global';
import {scale} from '../theme/Scalling';
import Icon from 'react-native-vector-icons/AntDesign';
import GlobaInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';

const windowWidth = Dimensions.get('window').width;

const ImageShareModal = (props) => {
  const [showModal, setShowModal] = useState(props.status);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
        hardwareAccelerated={true}
        visible={showModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                setShowModal(!showModal);
                props.onCloseAction(-1);
              }}
              style={styles.buttonCircle}
              background={TouchableNativeFeedback.SelectableBackground()}>
              <GlobaInclude.BaseIcon
                containerStyle={{height: scale(26), width: scale(26)}}
                iconColor={'#808080'}
                iconName={'close'}
                iconSize={scale(26)}
                iconType={IconType[8]}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Share This Image</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: scale(6),
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(!showModal);
                  props.onCloseAction(1);
                }}
                style={styles.buttonBlue}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <GlobaInclude.BaseIcon
                  containerStyle={{height: scale(20), width: scale(20)}}
                  iconColor={'#fff'}
                  iconName={'share-alt'}
                  iconSize={scale(20)}
                  iconType={IconType[4]}
                />
                <Text style={styles.buttonText}>SHARE ON GROUP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowModal(!showModal);
                  props.onCloseAction(2);
                }}
                style={styles.buttonBlue}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <GlobaInclude.BaseIcon
                  containerStyle={{height: scale(20), width: scale(20)}}
                  iconColor={'#fff'}
                  iconName={'share-alt'}
                  iconSize={scale(20)}
                  iconType={IconType[4]}
                />
                <Text style={styles.buttonText}>SHARE ON MESSANGER</Text>
              </TouchableOpacity>
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
    width: windowWidth - 24,
    height: scale(120),
    backgroundColor: '#fff',
    borderRadius: scale(6),
    padding: scale(5),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerText: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: scale(16),
    textAlign: 'center',
    ...g.FHNR,
    ...g.colorDarkBlur,
  },
  buttonText: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: scale(10),
    textAlign: 'center',
    marginStart: scale(4),
    ...g.FHNR,
    ...g.colorWhite,
  },
  buttonBlue: {
    borderRadius: scale(5),
    backgroundColor: '#2b3252',
    flex: 1,
    height: scale(35),
    paddingStart: scale(5),
    paddingEnd: scale(5),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    margin: scale(3),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    flexDirection: 'row',
  },
  buttonCircle: {
    width: scale(26),
    height: scale(26),
    borderRadius: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginEnd: scale(6),
    marginTop: scale(6),
  },
});

export default ImageShareModal;
