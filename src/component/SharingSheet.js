import React, {useState, useEffect} from 'react';
import {Alert, View, Platform} from 'react-native';
import Share, {ShareSheet, Button} from 'react-native-share';
import GlobalInclude from '../globalInclude/Globalinclude';
import Clipboard from '@react-native-clipboard/clipboard';

const SharingSheet = ({shareContent, setVisible}) => (
  <ShareSheet visible={true} onCancel={setVisible}>
    <Button
      iconSrc={GlobalInclude.Assets.ShareTwitter}
      onPress={() => {
        setVisible();
        setTimeout(() => {
          Share.shareSingle(
            Object.assign(shareContent, {
              social: 'twitter',
            }),
          );
        }, 300);
      }}>
      Twitter
    </Button>
    <Button
      iconSrc={GlobalInclude.Assets.ShareFacebook}
      onPress={() => {
        setVisible();
        setTimeout(() => {
          Share.shareSingle(
            Object.assign(shareContent, {
              social: 'facebook',
            }),
          );
        }, 300);
      }}>
      Facebook
    </Button>
    <Button
      iconSrc={GlobalInclude.Assets.ShareWhatsApp}
      onPress={() => {
        setVisible();
        setTimeout(() => {
          Share.shareSingle(
            Object.assign(shareContent, {
              social: 'whatsapp',
            }),
          );
        }, 300);
      }}>
      Whatsapp
    </Button>
    <Button
      iconSrc={GlobalInclude.Assets.ShareEmail}
      onPress={() => {
        setVisible();
        setTimeout(() => {
          Share.shareSingle(
            Object.assign(shareContent, {
              social: 'email',
            }),
          );
        }, 300);
      }}>
      Email
    </Button>
    <Button
      iconSrc={GlobalInclude.Assets.ShareClipboard}
      onPress={() => {
        setVisible();
        setTimeout(() => {
          if (typeof shareContent.attachment !== undefined) {
            Clipboard.setString(shareContent.attachment);
            Alert.alert('Link Copied');
          }
        }, 300);
      }}>
      Copy Link
    </Button>
    <Button
      iconSrc={GlobalInclude.Assets.ShareMore}
      onPress={() => {
        setVisible();
        setTimeout(() => {
          Share.open(shareContent);
        }, 300);
      }}>
      More
    </Button>
  </ShareSheet>
);

export default SharingSheet;
