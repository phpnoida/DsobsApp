import React, {useRef} from 'react';
import {View, ScrollView} from 'react-native';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import NextPreviousButton from '../../../component/NextPreviousButton';
import UploadMedia from '../../../component/UploadMedia';
import {loadMedia} from '../../../component/MediaComponent';
import {uploadMediaButton} from '../../../component/Common';

const VentureMedia = ({
  onSaveTab,
  onPreviousTab,
  mediaData,
  removeMedia,
  inEditMode,
  onMediaPick,
  loader,
}) => {
  const uploadRef = useRef();

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

  return (
    <View style={[GlobalInclude.AppStyle.fill, g.pl15, g.pr15, g.pt20]}>
      <View style={GlobalInclude.AppStyle.fill}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View>
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
        isLoading={loader}
        nextTitle={inEditMode ? 'Update & Next' : 'Finish'}
        onPreviuosTab={() => {
          onPreviousTab();
        }}
        onSaveTab={() => {
          onSaveTab();
        }}
      />
      <UploadMedia
        refRBSheet={uploadRef}
        media={{image: false, video: false, document: false, audio: false}}
        onPickMedia={(media) => {
          uploadRef.current.close();
          if (media !== undefined && media !== null) {
            console.log('media', media);
            onMediaPick(media);
          }
        }}
      />
    </View>
  );
};

export default VentureMedia;
