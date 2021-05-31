import React, {useState, useEffect} from 'react';
import {Text, View, Image, Dimensions, ScrollView} from 'react-native';
import FitImage from './component/FitImage';
import ResponsiveImage from './component/ResponsiveImage';
let {height, width} = Dimensions.get('window');

let square =
  'https://instagram.famd7-1.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/190658644_1132556400489551_7458105248398740167_n.jpg?tp=1&_nc_ht=instagram.famd7-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=7GwrOH7NIocAX-RRiXw&edm=AABBvjUBAAAA&ccb=7-4&oh=ec74ed4cf705ddb43349c6140ff01f1d&oe=60BACBCA&_nc_sid=83d603'; //square

let portrait =
  'https://instagram.famd7-1.fna.fbcdn.net/v/t51.2885-15/e35/193436329_2938589256423000_2802493749723499063_n.jpg?tp=1&_nc_ht=instagram.famd7-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=OCTP-o8U5q0AX_He78C&edm=AABBvjUBAAAA&ccb=7-4&oh=c4285d231b9b8624c1e8c2aa3116ddc9&oe=60BC349B&_nc_sid=83d603'; //portrait

let imageUrl = 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7101.jpg'; //portrait

let landscape =
  'https://instagram.famd7-1.fna.fbcdn.net/v/t51.2885-15/e35/s1080x1080/190262916_192580859385109_8395686380619369910_n.jpg?tp=1&_nc_ht=instagram.famd7-1.fna.fbcdn.net&_nc_cat=101&_nc_ohc=oKRCx3NarlAAX8_B7ey&edm=AAeKFY8BAAAA&ccb=7-4&oh=8db197db1db93e7f51bc8c00eca406e4&oe=60BBFA51&_nc_sid=c982ba'; //landscape

const ImageDemo = ({params}) => {
  const [imgHeight, setImgHeight] = useState(0);
  const [imgWidth, setImgWidth] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1 / 1);

  useEffect(() => {
    Image.getSize(imageUrl, (iw, ih) => {
      height = parseInt(height, 10);
      width = parseInt(width, 10);

      let ratio = Math.min(width / iw, height / ih);
      setImgWidth(Math.ceil(iw * ratio));
      setImgHeight(Math.ceil(ih * ratio));

      if (iw > ih) {
        //Landscape
        console.log('====================================');
        console.log('Landscape');
        console.log('====================================');
      } else if (iw < ih) {
        // portrait
        console.log('====================================');
        console.log('portrait');
        console.log('====================================');
      } else if (iw === ih) {
        // square
        console.log('====================================');
        console.log('square');
        console.log('====================================');
      }
    });
    return () => {};
  }, []);

  return (
    <ScrollView>
      <ResponsiveImage
        source={{
          uri: square,
        }}
      />
      <View style={{height: 100}} />
      <ResponsiveImage
        source={{
          uri: portrait,
        }}
      />
      <View style={{height: 100}} />
      <ResponsiveImage
        source={{
          uri: landscape,
        }}
      />
    </ScrollView>
  );
};

export default ImageDemo;
