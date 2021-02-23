import React, {useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';

import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';
import DocView from 'react-native-pdf';

const DocViewer = (props) => {
  /**
   * Here you have to pass valid media content if media content is in different format you have to reformat like below
   * [
   *  { type: 2,thumbnail: 'https://www.youtube.com/embed/EngW7tLk6R8' }
   * ]
   * Here type ===1 is image and 2 is video
   */
  const [mediaContent] = useState(props.mediaContent);
  const [showModal, setShowModal] = useState(true);
  console.log('mediaContent', mediaContent);

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      {/* image slider modal */}
      <Modal
        transparent={true}
        onRequestClose={() => {
          setShowModal(!showModal);
          props.onClose();
        }}
        visible={showModal}>
        <View style={styles.modalView}>
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
          <DocView
            source={{uri: mediaContent}}
            onLoadComplete={(numberOfPages, filePath) => {
              // console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              // console.log(`current page: ${page}`);
            }}
            onError={(error) => {
              // console.log(error);
            }}
            onPressLink={(uri) => {
              // console.log(`Link presse: ${uri}`)
            }}
            style={GlobalInclude.AppStyle.fullSize}
          />
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
    backgroundColor: 'rgba(62,62,62,0.5)',
    flex: 1,
    width: '100%',
  },
  buttonCircle: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(30),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
});

export default DocViewer;
