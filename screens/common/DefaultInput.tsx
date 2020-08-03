import React, { ReactNode } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

import { borders, texts, colors } from './styles';

export interface Props extends TextInputProps {
  title: string;
  children?: ReactNode;
}

export default ({ title, children, style: externalStyle, ...props }: Props) => (
  <View style={[style.container, externalStyle]}>
    <View>
      <Text style={style.label}>{title}</Text>
      <TextInput style={style.input} {...props} />
    </View>
    {children}
  </View>
);

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    ...borders.default,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  label: {
    ...texts.small,
    color: colors.darkGreen,
    paddingVertical: 2,
  },
  input: {
    ...texts.medium,
    color: colors.darkGrey,
  },
});
