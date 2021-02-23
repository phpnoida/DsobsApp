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
import ImageViewer from 'react-native-image-zoom-viewer';

const ZoomImage = (props) => {
  /**
   * Here you have to pass valid media content if media content is in different format you have to reformat like below
   * [
   *  { type: 2,thumbnail: 'https://www.youtube.com/embed/EngW7tLk6R8' }
   * ]
   * Here type ===1 is image and 2 is video
   */
  const [mediaContent] = useState(props.mediaContent);
  const [showModal, setShowModal] = useState(true);

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      {/* image slider modal */}
      <Modal
        transparent={false}
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
          <ImageViewer
            imageUrls={mediaContent}
            index={0}
            enablePreload={true}
            backgroundColor={'rgba(62,62,62,0.5)'}
            renderIndicator={() => {
              <View />;
            }}
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
    backgroundColor: 'rgba(62,62,62,1)',
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
    marginEnd: scale(15),
    marginTop: scale(15),
    backgroundColor: 'white',
  },
});

export default ZoomImage;
