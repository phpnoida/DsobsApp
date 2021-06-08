import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  Animated,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
  SwipeableFlatList,
  SwipeableQuickActionButton,
  SwipeableQuickActions,
} from 'react-native-swipe-list';

const mockDataList = [
  {
    id: '1',
    text: 'Swipe me left!',
  },
  {id: '2', text: 'Swipe me right!'},
  {id: '3', text: 'Try swiping in both directions'},
];

const SwipeDemo = ({params}) => {
  const Separator = () => <View style={styles.itemSeparator} />;

  const LeftActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <View
        style={{flex: 1, backgroundColor: 'blue', justifyContent: 'center'}}>
        <Animated.Text
          style={{
            color: 'white',
            paddingHorizontal: 10,
            fontWeight: '600',
            transform: [{scale}],
          }}>
          Left Action
        </Animated.Text>
      </View>
    );
  };

  const RightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.7, 0],
    });
    return (
      <>
        <TouchableOpacity onPress={() => alert('Delete button pressed')}>
          <View
            style={{flex: 1, backgroundColor: 'red', justifyContent: 'center'}}>
            <Animated.Text
              style={{
                color: 'white',
                paddingHorizontal: 10,
                fontWeight: '600',
                transform: [{scale}],
              }}>
              Delete
            </Animated.Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Archive button pressed')}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'green',
              justifyContent: 'center',
            }}>
            <Animated.Text
              style={{
                color: 'white',
                paddingHorizontal: 10,
                fontWeight: '600',
                transform: [{scale}],
              }}>
              Archive
            </Animated.Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const ListItem = ({text}) => (
    <View style={{paddingVertical: 20}}>
      <Text style={{fontSize: 24, paddingHorizontal: 10}}>{text}</Text>
    </View>
  );

  return (
    <View>
      <SwipeableFlatList
        data={mockDataList}
        renderItem={({item}) => <ListItem {...item} />}
        keyExtractor={(index) => index.id}
        renderLeftActions={({item}) => (
          <SwipeableQuickActions>
            <SwipeableQuickActionButton
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
              }}
              text="delete"
              textStyle={{fontWeight: 'bold', color: 'white'}}
            />
          </SwipeableQuickActions>
        )}
        renderRightActions={({item}) => (
          <SwipeableQuickActions>
            <SwipeableQuickActionButton onPress={() => {}} text="Other" />
            <SwipeableQuickActionButton onPress={() => {}} text="Flag" />
            <SwipeableQuickActionButton onPress={() => {}} text="Archive" />
          </SwipeableQuickActions>
        )}
      />

      {/* <FlatList
        data={mockDataList}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <ListItem {...item} />}
        ItemSeparatorComponent={() => <Separator />}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemSeparator: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
});

export default SwipeDemo;
