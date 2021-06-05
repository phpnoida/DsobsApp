import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {scale} from '../../../theme/Scalling';
import g from '../../../theme/global';
import grid from '../../../theme/grid';
import GlobalInclude from '../../../globalInclude/Globalinclude';
import {IconType} from '../../../helper/Constants';
let itemArray = [
  {selected: false, text: 'Need a Connect', key: 1},
  {selected: false, text: 'My Thoughts Today', key: 2},
  {selected: false, text: 'About School', key: 3},
  {selected: false, text: 'A Good Article', key: 4},
  {selected: false, text: 'A Video to Watch', key: 5},
  {selected: false, text: 'A Quote ', key: 6},
  {selected: false, text: 'Jokes', key: 7},
  {selected: false, text: 'Photos/PDFs/GIFs ', key: 8},
  {selected: false, text: 'Facebook/Twitter/WhatsApp Repost', key: 9},
];

const ViewPost = ({params}) => {
  const [categrories, setCategrories] = useState(itemArray);

  const selectItem = (index) => {
    let oldData = categrories;
    oldData[index].selected = !oldData[index].selected;
    setCategrories([...oldData]);
  };

  return (
    <View style={[grid.flex1, g.pl10, g.pr10]}>
      {categrories.map((v, i) => {
        return (
          <TouchableOpacity
            onPress={() => {
              selectItem(i);
            }}
            key={i.toString()}
            activeOpacity={1}>
            <View style={[g.tagStyle, grid.rowdir, grid.alignItems]}>
              <GlobalInclude.BaseIcon
                containerStyle={{
                  height: scale(28),
                  width: scale(28),
                  justifyContent: 'center',
                  marginEnd: scale(5),
                }}
                iconColor={GlobalInclude.Color.ColorPrimary}
                iconName={
                  v.selected
                    ? 'checkbox-marked-outline'
                    : 'checkbox-blank-outline'
                }
                iconSize={scale(22)}
                iconType={IconType[1]}
              />
              <Text
                style={[
                  g.tagTxtStyle,
                  v.selected ? g.colorBlue : g.colorBlack,
                  v.selected ? g.FHNB : g.FHNR,
                ]}>
                {v.text}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ViewPost;
