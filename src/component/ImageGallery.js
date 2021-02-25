import React, {useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Image,
  ScrollView,
} from 'react-native';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';
import {IconType} from '../helper/Constants';
import ImageViewer from 'react-native-image-zoom-viewer';
import DocViewer from '../component/DocViewer';
import ImageShareModal from '../component/ImageShareModal';
import YoutubeView from '../component/YoutubeView';

let imageArray = [];
let documentItem = '';
const ImageGallery = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDocViewer, setShowDocViewer] = useState(false);

  /**
   * Here you have to pass valid media content if media content is in different format you have to reformat like below
   * [
   *  { type: 2,thumbnail: 'https://www.youtube.com/embed/EngW7tLk6R8' }
   * ]
   * Here type ===1 is image and 2 is video
   */
  const [mediaContent] = useState(props.mediaContent);
  const [lastIndex, setIastIndex] = useState(0);

  const openImage = () => {
    if (mediaContent.length > 0) {
      imageArray = [];
      mediaContent.map((item) => {
        if (item.type === 1) {
          imageArray.push({url: item.thumbnail});
        }
      });
    }
    if (imageArray.length > 0) {
      setShowModal(!showModal);
    }
  };

  const openShareOptions = () => {
    setShowShareModal(!showShareModal);
  };

  const _renderPhotos = () => {
    let photosArray = [];
    mediaContent.map((item, index) => {
      let type = item.type;
      const image = (
        <View
          style={{
            width: scale(85),
            height: scale(85),
            margin: scale(4),
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          key={index.toString()}>
          {type === 1 && (
            <TouchableOpacity
              onPress={() => {
                //setIastIndex(index);
                openImage();
              }}
              onLongPress={() => {
                console.log('long press');
                openShareOptions();
              }}
              key={index}
              style={{
                height: '100%',
                width: '100%',
                borderRadius: scale(6),
              }}
              activeOpacity={1}>
              <Image
                key={index}
                style={{
                  width: scale(85),
                  height: scale(85),
                  borderRadius: scale(6),
                }}
                resizeMode={'cover'}
                source={{uri: item.thumbnail}}
                resizeMethod={'auto'}
              />
            </TouchableOpacity>
          )}
          {type === 2 && (
            <View
              key={index}
              style={{
                height: '100%',
                width: '100%',
                justifyContent: 'center',
              }}>
              <YoutubeView
                link={item.thumbnail}
                containerStyle={{
                  width: scale(85),
                  height: scale(85),
                  borderRadius: scale(6),
                  justifyContent: 'center',
                }}
                iconName={'play-circle-o'}
                iconType={'font-awesome'}
              />
            </View>
          )}
          {type === 3 && (
            <TouchableOpacity
              onPress={() => {
                console.log('item', item);
                documentItem = item.fileName;
                setShowDocViewer(true);
              }}
              key={index}
              style={{
                height: '100%',
                width: '100%',
                borderRadius: scale(6),
              }}
              activeOpacity={1}>
              <View
                key={index}
                style={{
                  borderRadius: scale(6),
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  borderWidth: 0.5,
                  height: '100%',
                  width: '100%',
                }}>
                <GlobalInclude.BaseIcon
                  containerStyle={{height: scale(36), width: scale(36)}}
                  iconColor={'#000'}
                  iconName={'file-pdf-o'}
                  iconSize={scale(36)}
                  iconType={IconType[4]}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      );

      photosArray.push(image);
    });
    return photosArray;
  };

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {mediaContent.length > 0 && (
          <View style={styles.mediaButtonContainer}>{_renderPhotos()}</View>
        )}
      </ScrollView>
      {/* image slider modal */}
      <Modal
        transparent={true}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
        visible={showModal}>
        <View style={styles.modalView}>
          <TouchableOpacity
            onPress={() => {
              setShowModal(!showModal);
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
          {console.log('lastIndex', lastIndex)}
          <ImageViewer
            imageUrls={imageArray}
            index={lastIndex}
            enablePreload={true}
            onChange={(index) => {
              setIastIndex(index);
            }}
            backgroundColor={'rgba(62,62,62,0.5)'}
            renderIndicator={() => {
              <View />;
            }}
          />
        </View>
      </Modal>
      {/* image share modal */}
      {showShareModal && (
        <ImageShareModal
          status={showShareModal}
          onCloseAction={(type) => {
            setShowShareModal(!showShareModal);
          }}
        />
      )}

      {/* doc viewer */}
      {showDocViewer && (
        <DocViewer
          mediaContent={documentItem}
          onClose={() => {
            setShowDocViewer(false);
          }}
        />
      )}
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
  mediaButtonContainer: {
    backgroundColor: '#ffffff',
    borderRadius: scale(10),
    margin: scale(6),
    flex: 1,
    shadowColor: '#333333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    padding: scale(5),
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    width: '100%',
  },
  buttonCircle: {
    width: 24,
    height: 24,
    borderRadius: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: scale(30),
    right: scale(15),
    zIndex: 9,
  },
});

export default ImageGallery;
