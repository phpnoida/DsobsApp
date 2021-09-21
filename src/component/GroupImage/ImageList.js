import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
  Text,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import GlobalInclude from '../../globalInclude/Globalinclude';
import {IconType} from '../../helper/Constants';
import {scale} from '../../theme/Scalling';
import ProgressImage from '../ProgresImage';
import HeaderBar from '../HeaderBar';

class ImageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgToShow: 0,
      showImg: false,
    };
  }

  componentDidMount() {
    const {index} = this.props;
    setTimeout(() => {
      this.scrollView.scrollTo({
        y: index * Dimensions.get('window').width,
      });
    }, 0);
  }

  showImg = () => {
    const {showImg} = this.state;
    this.setState({showImg: !showImg});
  };

  showImgInModal = indexOfImg => {
    this.setState({imgToShow: indexOfImg, showImg: true});
  };

  renderBackBtn = () => {
    const {setModalVisible, title} = this.props;

    return (
      <View style={styles.backBtnView}>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={styles.backBtnTouchableOpacity}>
          <GlobalInclude.BaseIcon
            containerStyle={{height: scale(30), width: scale(30)}}
            iconColor={'#000'}
            iconName={'close'}
            iconSize={scale(30)}
            iconType={IconType[8]}
          />
        </TouchableOpacity>
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
    );
  };

  renderImages = () => {
    const {images, backgroundColor} = this.props;
    const imagesToRender = images.map((img, i) => (
      <TouchableOpacity
        key={`List-Image-${i + 1}`}
        style={[styles.clickableImg, {backgroundColor}]}
        onPress={() => this.showImgInModal(i)}
        activeOpacity={0.8}>
        <ProgressImage
          source={{uri: img.media.mediaUrl}}
          containerStyle={{width: '100%', aspectRatio: 1 / 1}}
          imageStyle={{width: '100%', aspectRatio: 1 / 1}}
          mode={'cover'}
        />
      </TouchableOpacity>
    ));
    return imagesToRender;
  };

  render() {
    const {showImg, imgToShow} = this.state;
    const {setModalVisible, title, images} = this.props;

    const imageUrls = images.map((image, index) => {
      return {url: image.media.mediaUrl, key: index};
    });
    return (
      <View style={styles.container}>
        <HeaderBar
          onGoBack={() => {
            setModalVisible(false);
          }}
          showBack={true}
          showLabel
          title={'Image List'}
        />
        {/* {this.renderBackBtn()} */}
        <ScrollView
          ref={view => (this.scrollView = view)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {this.renderImages()}
        </ScrollView>

        <View style={styles.modalView}>
          <Modal
            visible={showImg}
            transparent={false}
            onRequestClose={() => this.setState({showImg: false})}>
            <ImageViewer
              index={imgToShow}
              loadingRender={() => (
                <ActivityIndicator size="small" color="#eee" />
              )}
              imageUrls={imageUrls}
              pageAnimateTime={0}
            />
          </Modal>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backBtnTouchableOpacity: {
    justifyContent: 'center',
    width: 35,
  },
  backBtnView: {
    flexDirection: 'row',
    height: 'auto',
    width: '100%',
  },
  caption: {
    color: 'lightgray',
    padding: 5,
    textAlign: 'center',
  },
  clickableImg: {
    marginBottom: 5,
    padding: 3,
  },
  container: {
    flex: 1,
  },
  modalView: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    padding: 5,
    paddingRight: 35,
  },
});

export default ImageList;
