import React, {useRef} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import colors from '../utils/colors';

const TextInputBlock = ({
  placeholder,
  value,
  setValue,
  editable = true,
  children,
  containerStyles,
  inputStyles,
  keyboardType = 'default',
}) => {
  const inputEl = useRef(null);

  return (
    <View>
      <View style={[styles.textInputRow, containerStyles]}>
        {!children && editable && (
          <TextInput
            ref={inputEl}
            editable={editable}
            style={[styles.textInput, inputStyles]}
            value={value}
            placeholder={placeholder}
            onChange={(event) => {
              setValue(event.nativeEvent.text);
            }}
            underlineColorAndroid="transparent"
            keyboardType={keyboardType}
          />
        )}
        {!editable && (
          <Text style={[styles.textInput, inputStyles]}>{value}</Text>
        )}
        {children && children}
      </View>
    </View>
  );
};

export default TextInputBlock;

const styles = StyleSheet.create({
  textInputRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomColor: colors.light,
    borderBottomWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  textInput: {
    fontSize: 18,
    padding: 0,
    height: 20,
    width: '100%',
  },
});
