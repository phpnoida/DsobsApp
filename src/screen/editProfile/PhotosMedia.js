import React, {useState, useEffect, useRef} from 'react';
import {Text, View, ScrollView} from 'react-native';
import g from '../../theme/global';
import grid from '../../theme/grid';
import GlobalInclude from '../../globalInclude/Globalinclude';
import NextPreviousButton from '../../component/NextPreviousButton';
import {updateUserProfile} from '../../Actions/UserActions';
import {uploadMediaButton} from '../../component/Common';
import UploadMedia from '../../component/UploadMedia';
import {loadMedia} from '../../component/MediaComponent';

const PhotosMedia = (props) => {
  const uploadRef = useRef();
  const {profileData} = props;

  const [isLoading, setIsLoading] = useState(false);
  const [mediaData, setMediaData] = useState([]);

  useEffect(() => {
    let cloneData = JSON.parse(JSON.stringify(profileData.photos));
    cloneData = cloneData.reverse();
    setMediaData(cloneData);
    return () => {};
  }, [profileData]);

  const removeMedia = (index) => {
    if (index > mediaData.length) {
      return;
    }
    let oldData = mediaData;
    oldData.splice(index, 1);
    setMediaData([...oldData]);
  };

  const renderMediaItem = () => {
    let componentArray = [];

    mediaData.map((item, index) => {
      const component = loadMedia(item, index, () => {
        removeMedia(index);
      });
      componentArray.push(component);
    });
    return componentArray;
  };

  /**
   *
   * API Section start
   *
   */
  const updateProfileDetails = () => {
    if (global.isConnected) {
      let cloneData = JSON.parse(JSON.stringify(mediaData));
      cloneData = cloneData.reverse();
      let requestData = {
        photos: cloneData,
      };

      setIsLoading(true);
      updateUserProfile(
        requestData,
        (response) => {
          setIsLoading(false);

          if (response && response !== null) {
            if (
              response.data &&
              response.data !== undefined &&
              response.response !== null
            ) {
              let data = response.data;
              if (data.status) {
                props.updateData(data.data);
                setTimeout(() => {
                  props.onSaveTab();
                }, 500);
              }
            }
          }
        },
        (error, message) => {
          setIsLoading(false);
        },
      );
    }
  };

  /**
   *
   * API Section end
   *
   */

  return (
    <View style={GlobalInclude.AppStyle.fill}>
      <View style={GlobalInclude.AppStyle.fill}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={g.pt20}>
            <View style={g.mb15}>
              {uploadMediaButton(() => {
                if (uploadRef.current !== null) {
                  uploadRef.current.open();
                }
              })}
            </View>

            {/* media data */}
            {mediaData.length > 0 && (
              <View style={g.mb15}>
                <Text style={[g.colorBlack, g.fs14, g.FHNB, g.pl10, g.mb10]}>
                  Delete
                </Text>
                <View style={[grid.rowdir, grid.flexwrap, grid.alignItems]}>
                  {renderMediaItem()}
                </View>
              </View>
            )}
            {/* media data */}
          </View>
        </ScrollView>
      </View>
      <NextPreviousButton
        isLoading={isLoading}
        onPreviuosTab={() => {
          props.onPreviuosTab();
        }}
        onSaveTab={() => {
          updateProfileDetails();
          //props.onSaveTab();
        }}
      />

      <UploadMedia
        refRBSheet={uploadRef}
        media={{image: false, video: false, document: false, audio: true}}
        onPickMedia={(media) => {
          uploadRef.current.close();
          if (media !== undefined && media !== null) {
            let oldData = mediaData;
            oldData.splice(0, 0, media);
            setMediaData([...oldData]);
          }
        }}
      />
    </View>
  );
};

export default PhotosMedia;
