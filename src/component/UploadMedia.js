import React from 'react';
import {
  Text,
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import g from '../theme/global';
import grid from '../theme/grid';
import {scale} from '../theme/Scalling';
import GlobalInclude from '../globalInclude/Globalinclude';

const UploadMedia = ({refRBSheet}) => {
  const generateIcon = (name, label, enabled) => {
    return (
      <TouchableOpacity
        style={[g.p10, g.m10, g.bglightGray, styles.mainBox]}
        activeOpacity={0.8}
        enabled={enabled}
        onPress={() => {}}>
        <View style={[grid.rowdir, grid.justifyContentCenter]}>
          <Image
            source={name}
            resizeMode={'contain'}
            resizeMethod={'auto'}
            style={styles.menuIcon}
          />
        </View>
        <Text style={[g.txtCenter, g.fs16, g.pt5, g.FHNB, g.colordarkGray]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <RBSheet
      ref={refRBSheet}
      height={290}
      minClosingHeight={50}
      onClose={() => {}}
      duration={350}
      closeOnDragDown={true}
      customStyles={{
        container: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          padding: 20,
        },
      }}>
      <View style={[grid.rowdir, grid.flexwrap, g.mt5]}>
        {generateIcon(GlobalInclude.Assets.CameraAttach, 'Image', true)}
        {generateIcon(GlobalInclude.Assets.VideoAttach, 'Video', true)}
      </View>
      <View style={[grid.rowdir, grid.flexwrap, g.mt5]}>
        {generateIcon(GlobalInclude.Assets.AudioAttach, 'Audio', false)}
        {generateIcon(GlobalInclude.Assets.DocAttach, 'Document', true)}
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  menuIcon: {
    height: scale(36),
    width: scale(36),
  },
  mainBox: {
    borderRadius: 10,
    flex: 1 / 2,
  },
});

export default UploadMedia;
