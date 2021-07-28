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
import Color from '../theme/Colors';

const windowWidth = Dimensions.get('window').width;

const ModalAlert = (props) => {
  const [showModal, setShowModal] = useState(props.status);

  const {header} = props;
  const {subHeader} = props;
  const {okButton} = props;
  const {cancelButton} = props;

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
                props.closeAction();
              }}
              style={styles.buttonCircle}
              background={TouchableNativeFeedback.SelectableBackground()}>
              <Icon name="close" color={Color.ColorPrimary} size={24} />
            </TouchableOpacity>

            {header && <Text style={styles.headerText}>{header}</Text>}
            {subHeader && <Text style={styles.modalText}>{subHeader}</Text>}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: scale(6),
              }}>
              {okButton && okButton !== null && (
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(!showModal);
                    props.okAction();
                  }}
                  style={styles.buttonBlue}
                  background={TouchableNativeFeedback.SelectableBackground()}>
                  <Text style={{color: '#ffffff', fontSize: scale(14)}}>
                    {okButton}
                  </Text>
                </TouchableOpacity>
              )}

              {cancelButton && (
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(!showModal);
                    props.cancelAction();
                  }}
                  style={styles.buttonBlue}
                  background={TouchableNativeFeedback.SelectableBackground()}>
                  <Text style={{color: '#ffffff', fontSize: scale(14)}}>
                    {cancelButton}
                  </Text>
                </TouchableOpacity>
              )}
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
    width: windowWidth - 50,
    backgroundColor: 'white',
    borderRadius: scale(6),
    padding: scale(7),
    alignItems: 'center',
    justifyContent: 'center',
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
    ...g.colorBlue,
  },
  modalText: {
    fontSize: scale(12),
    textAlign: 'center',
    marginLeft: scale(10),
    marginRight: scale(10),
    marginBottom: scale(10),
    marginTop: scale(5),
    textAlignVertical: 'center',
    ...g.FHNR,
    ...g.colorBlue,
  },
  buttonBlue: {
    borderRadius: scale(5),
    backgroundColor: Color.ColorPrimary,
    minWidth: scale(100),
    height: scale(35),
    paddingStart: scale(15),
    paddingEnd: scale(15),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',

    margin: scale(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  buttonCircle: {
    width: 24,
    height: 24,
    borderRadius: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
});

export default ModalAlert;
