import React, {Component} from 'react';
import {View, TextInput, Text, Image, StyleSheet} from 'react-native';
import {scale} from '../theme/Scalling.js';
import Color from '../theme/Colors';
import AppStyle from '../theme/ApplicationStyle';

class TextInputBox extends Component {
  constructor(props) {
    super(props);
    this.state = {isvisible: true};
  }

  getInnerRef = () => this.ref;
  SelectPasssword() {
    if (this.props.defaultValue !== '') {
      if (this.state.isvisible) {
        this.setState({isvisible: false});
      } else {
        this.setState({isvisible: true});
      }
    }
  }
  render() {
    return (
      <View
        style={{
          minHeight: scale(45),
        }}>
        <View style={[styles.inputContainerStyle, this.props.viewStyle]}>
          <TextInput
            {...this.props}
            autoCorrect={false}
            textColor={
              this.props.textColor
                ? this.props.textColor
                : Color.PrimaryFontColor
            }
            label={this.props.label}
            autoCapitalize={'none'}
            editable={this.props.editable}
            labelFontSize={scale(100)}
            multiline={this.props.multiline ? true : false}
            textAlignVertical="center"
            underlineColorAndroid="transparent"
            importantForAutofill={'noExcludeDescendants'}
            autoCompleteType={'off'}
            defaultValue={this.props.defaultValue}
            secureTextEntry={this.props.secureTextEntry}
            value={this.props.value}
            returnKeyType={
              this.props.returnKeyType ? this.props.returnKeyType : 'default'
            }
            keyboardType={
              this.props.keyboardType ? this.props.keyboardType : 'default'
            }
            inputStyle={styles.inputStyle}
            labelTextStyle={{
              fontFamily: 'Lato-Regular',
              color: Color.PlaceholderColor,
              fontSize: scale(15),
            }}
            tintColor={Color.PlaceholderColor}
            onChangeText={this.props.onChangeText}
            placeholder={this.props.placeholder}
            placeholderTextColor={
              this.props.placeholderTextColor
                ? this.props.placeholderTextColor
                : Color.ColorWhite
            }
            autoFocus={this.props.autoFocus}
            ref={(r) => (this.ref = r)}
            style={AppStyle.fill}
            maxLength={this.props.maxLength ? this.props.maxLength : 50}
          />
          {this.props.icon && (
            <View style={styles.iconview}>
              <Image
                style={styles.iconstyle}
                source={this.props.icon}
                resizeMethod={'auto'}
                resizeMode={'contain'}
              />
            </View>
          )}
        </View>
        {this.props.errortext !== '' ? (
          <Text style={styles.errorTitle}>{this.props.errortext}</Text>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    fontSize: scale(11),
  },
  iconview: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(15),
    marginEnd: scale(15),
    marginStart: scale(10),
  },
  iconcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconstyle: {
    width: scale(20),
    height: scale(20),
  },
  inputContainerStyle: {
    width: '100%',
    alignSelf: 'center',
    height: scale(45),
    borderBottomColor: Color.InputBorder,
    borderBottomWidth: 1.8,
    flexDirection: 'row',
    marginStart: scale(5),
    marginEnd: scale(5),
    paddingStart: scale(10),
    paddingEnd: scale(10),
  },
  inputStyle: {
    fontFamily: 'Lato-Regular',
    paddingStart: scale(10),
    paddingEnd: scale(10),
    fontSize: scale(16),
    textAlign: 'center',
    height: scale(40),
    width: '100%',
  },
  errorTitle: {
    textAlign: 'left',
    color: Color.GradientEnd,
    fontFamily: 'Lato-Regular',
    fontSize: scale(16),
  },
});

export default TextInputBox;
