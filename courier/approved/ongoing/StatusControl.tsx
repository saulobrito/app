import Slider from '@react-native-community/slider';
import React, { useCallback, useRef } from 'react';
import { View, Text, Image, ViewProps, Dimensions } from 'react-native';

import * as icons from '../../../assets/icons';
import { borders, colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

interface Props extends ViewProps {
  nextStepHandler: () => void;
  status: string;
}

export default function ({ nextStepHandler, status }: Props) {
  // refs
  const sliderRef = useRef<Slider>(null);
  // helpers
  const updateSliderValue = (value: number) => sliderRef.current?.setNativeProps({ value });
  // handlers
  const completeHandler = useCallback((value) => {
    if (value <= 10) {
      updateSliderValue(0);
    } else if (value >= 90) {
      updateSliderValue(100);
      nextStepHandler();
    } else {
      updateSliderValue(50);
    }
  }, []);

  // const { width } = Dimensions.get('window');

  return (
    <View style={{ height: 48, paddingHorizontal: padding, width: '100%' }}>
      {/* track */}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: 48,
          // flex: 1,
          flexDirection: 'row',
          // justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.lightGrey,
          // paddingHorizontal,
          ...borders.default,
          borderRadius: 64,
        }}
      >
        <View style={{ alignSelf: 'flex-end' }}>
          <Image source={icons.accept} />
          <Text style={[texts.default]}>{status}</Text>
        </View>
      </View>
      {/* slider */}
      <Slider
        ref={sliderRef}
        style={{ width: '100%', height: 48 }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        minimumTrackTintColor="#00000000"
        maximumTrackTintColor="#00000000"
        value={0}
        onSlidingComplete={completeHandler}
        thumbImage={icons.slideConfirm}
      />
    </View>
  );
}
