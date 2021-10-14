import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import ProgressImage from '../ProgresImage';
import ImageList from './ImageList';

class GroupImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeImageIndex: 0,
      modalVisible: false,
    };
  }

  showImageListModal = (modalVisible, activeImageIndex) => {
    this.setState({activeImageIndex, modalVisible});
  };

  imageView(source) {
    return (
      <View style={styles.container}>
        <View style={styles.innerView}>
          <ProgressImage
            source={{uri: source}}
            containerStyle={styles.img}
            imageStyle={styles.img}
            mode={'cover'}
          />
        </View>
      </View>
    );
  }

  fourImages = () => {
    const {images, backgroundColor, title, extra} = this.props;
    const {modalVisible} = this.state;

    return (
      <View style={[styles.imageContainer, {backgroundColor}]}>
        {title && <Text style={styles.titleStyle}>{title}</Text>}
        <View style={styles.fourImagesInnerView}>
          {images.map((image, i) => (
            <TouchableOpacity
              key={`chat-image-${i}`}
              onPress={() => this.showImageListModal(!modalVisible, i)}
              activeOpacity={0.8}
              style={styles.flexBasisHalf}>
              {this.imageView(image.media.mediaUrl)}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  moreThanFourImages = () => {
    const {images, backgroundColor, title, extra} = this.props;
    const {modalVisible} = this.state;

    return (
      <View style={[styles.imageContainer, {backgroundColor}]}>
        {title && <Text style={styles.titleStyle}>{title}</Text>}
        <View style={styles.moreThanFourImagesInnerView}>
          <TouchableOpacity
            onPress={() => this.showImageListModal(!modalVisible, 0)}
            activeOpacity={0.8}
            style={styles.flexBasisHalf}>
            {this.imageView(images[0].media.mediaUrl)}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.showImageListModal(!modalVisible, 1)}
            activeOpacity={0.8}
            style={styles.flexBasisHalf}>
            {this.imageView(images[1].media.mediaUrl)}
          </TouchableOpacity>
        </View>

        <View style={styles.moreThanFourImagesInnerView}>
          <TouchableOpacity
            onPress={() => this.showImageListModal(!modalVisible, 2)}
            activeOpacity={0.8}
            style={styles.flexBasisHalf}>
            {this.imageView(images[2].media.mediaUrl)}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.showImageListModal(!modalVisible, 3)}
            activeOpacity={0.8}
            style={styles.flexBasisHalf}>
            <View style={styles.moreImagesOverlayContainer}>
              <View style={styles.moreImagesOverlay}>
                <Text style={styles.imagesCount}>+{images.length - 3}</Text>
              </View>
              {this.imageView(images[3].media.mediaUrl)}
            </View>
          </TouchableOpacity>
        </View>
        {extra && <Text style={styles.extraStyle}>{extra}</Text>}
      </View>
    );
  };

  render() {
    const {backgroundColor, images, saveOnLongPress, style, title, width} =
      this.props;
    const {activeImageIndex, modalVisible} = this.state;
    return (
      <ScrollView
        style={[{flexGrow: 1}, style, {width}]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {images.length === 4 && this.fourImages()}
        {images.length > 4 && this.moreThanFourImages()}

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            this.showImageListModal(!modalVisible, 0);
          }}>
          <ImageList
            saveOnLongPress={saveOnLongPress}
            index={activeImageIndex}
            backgroundColor={backgroundColor}
            setModalVisible={this.showImageListModal}
            images={images}
            title={title}
          />
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  extraStyle: {
    paddingRight: 5,
    textAlign: 'right',
  },
  flexBasisHalf: {
    flexBasis: '50%',
  },
  flexOne: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  fourImagesInnerView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    borderRadius: 5,
    flex: 1,
    marginBottom: 1,
    marginTop: 1,
    padding: 2,
  },
  imagesCount: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 30,
  },
  moreImagesOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 5,
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2,
  },
  moreImagesOverlayContainer: {
    height: '100%',
    position: 'relative',
    width: '100%',
  },
  moreThanFourImagesInnerView: {
    flex: 1,
    flexDirection: 'row',
    height: '50%',
  },
  titleStyle: {
    fontSize: 16,
    paddingLeft: 5,
  },
  container: {
    aspectRatio: 1,
    borderRadius: 5,
    width: '100%',
  },
  innerView: {
    backgroundColor: 'lightgray',
    borderRadius: 5,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  img: {
    borderRadius: 5,
    flex: 1,
    height: '100%',
    resizeMode: 'cover',
    width: '100%',
  },
});

export default GroupImages;
