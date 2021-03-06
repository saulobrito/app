import React from 'react';
import { View, Text, TouchableOpacity, Image, ViewProps } from 'react-native';

import { checkboxActive, checkboxInactive } from '../../../assets/icons';
import { texts } from '../../styles';

interface Props extends ViewProps {
  onPress: () => void;
  text: string;
  checked?: boolean;
}

export default ({ onPress, text, style: externalStyle, checked = false }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            height: 24,
          },
          externalStyle,
        ]}
      >
        <Image
          source={checked ? checkboxActive : checkboxInactive}
          style={{ height: 24, width: 24 }}
        />
        <Text style={{ ...texts.small, marginLeft: 8 }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};
