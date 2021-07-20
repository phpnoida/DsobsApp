import React, {useState, useEffect} from 'react';
import {Text, View, Image, Dimensions, ScrollView} from 'react-native';
import FitImage from './component/FitImage';
import ResponsiveImage from './component/ResponsiveImage';
import ProgressImage from './component/ProgresImage';
let {height, width} = Dimensions.get('window');

let square =
  'https://instagram.famd7-1.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/190658644_1132556400489551_7458105248398740167_n.jpg?tp=1&_nc_ht=instagram.famd7-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=7GwrOH7NIocAX-RRiXw&edm=AABBvjUBAAAA&ccb=7-4&oh=ec74ed4cf705ddb43349c6140ff01f1d&oe=60BACBCA&_nc_sid=83d603'; //square

let portrait =
  'https://instagram.famd7-1.fna.fbcdn.net/v/t51.2885-15/e35/193436329_2938589256423000_2802493749723499063_n.jpg?tp=1&_nc_ht=instagram.famd7-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=OCTP-o8U5q0AX_He78C&edm=AABBvjUBAAAA&ccb=7-4&oh=c4285d231b9b8624c1e8c2aa3116ddc9&oe=60BC349B&_nc_sid=83d603'; //portrait

let imageUrl = 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7101.jpg'; //portrait

let landscape =
  'https://instagram.famd7-1.fna.fbcdn.net/v/t51.2885-15/e35/s1080x1080/190262916_192580859385109_8395686380619369910_n.jpg?tp=1&_nc_ht=instagram.famd7-1.fna.fbcdn.net&_nc_cat=101&_nc_ohc=oKRCx3NarlAAX8_B7ey&edm=AAeKFY8BAAAA&ccb=7-4&oh=8db197db1db93e7f51bc8c00eca406e4&oe=60BBFA51&_nc_sid=c982ba'; //landscape

const arrays = [
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_6921.jpg',
    width: 392,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_6922.jpg',
    width: 393,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_6923.jpg',
    width: 392,
  },
  {
    height: 523,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7101.jpg',
    width: 392,
  },
  {
    height: 523,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7102.jpg',
    width: 392,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7103.jpg',
    width: 392,
  },
  {
    height: 523,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7104.jpg',
    width: 392,
  },
  {
    height: 524,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7105.jpg',
    width: 392,
  },
  {
    height: 524,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7106.jpg',
    width: 392,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7107.jpg',
    width: 392,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7108.jpg',
    width: 392,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7109.jpg',
    width: 392,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7110.jpg',
    width: 392,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7111.jpg',
    width: 392,
  },
  {
    height: 523,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7112.jpg',
    width: 392,
  },
  {
    height: 524,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7113.jpg',
    width: 392,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7114.jpg',
    width: 392,
  },
  {
    height: 523,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7115.jpg',
    width: 392,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7116.jpg',
    width: 393,
  },
  {
    height: 524,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7117.jpg',
    width: 392,
  },
  {
    height: 257,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7118.jpg',
    width: 393,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7119.jpg',
    width: 392,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7120.jpg',
    width: 392,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7121.jpg',
    width: 392,
  },
  {
    height: 523,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7122.jpg',
    width: 392,
  },
  {
    height: 523,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7123.jpg',
    width: 392,
  },
  {
    height: 523,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7124.jpg',
    width: 392,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7125.jpg',
    width: 392,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7126.jpg',
    width: 392,
  },
  {
    height: 221,
    image: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_7127.jpg',
    width: 393,
  },
];

const ImageDemo = ({params}) => {
  const demo = () => {
    let component = [];

    for (let index = 0; index < arrays.length; index++) {
      let item = arrays[index];
      const element = (
        // <ResponsiveImage
        //   source={{
        //     //uri: 'https://dsobs-new.s3.ap-south-1.amazonaws.com/IMG_6921.jpg',
        //     uri: arrays[index],
        //   }}
        // />
        <ProgressImage
          source={{uri: item.image}}
          containerStyle={{width: item.width, height: item.height}}
          imageStyle={{width: item.width, height: item.height}}
          mode={'contain'}
        />
      );
      component.push(element);
    }
    return component;
  };

  return (
    <View>
      <ScrollView>{demo()}</ScrollView>
    </View>
  );
};

export default ImageDemo;
