import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import RoundedText from '../../common/components/texts/RoundedText';
import { halfPadding } from '../../common/styles';
import { t } from '../../strings';

type Props = {
  image: ImageSourcePropType;
  cuisine: string;
};

export default function ({ image, cuisine }: Props) {
  return (
    <TouchableOpacity onPress={() => null}>
      <View style={{ height: 96, width: 96, borderRadius: 8, marginRight: halfPadding }}>
        <Image source={image} />
        <View style={{ position: 'absolute', left: 4, bottom: 4 }}>
          <RoundedText>{t(cuisine)}</RoundedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}