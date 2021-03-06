import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, ReactElement, useEffect } from 'react';

import fonts from '../../assets/fonts';
import icons from '../../assets/icons';

export interface Props {
  children: () => ReactElement;
}

export default function ({ children }: Props) {
  const preloadAssets = async (): Promise<void> => {
    await Font.loadAsync(fonts);
    await Asset.loadAsync(icons);
  };
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await preloadAssets();
      setAssetsLoaded(true);
    })();
  }, []);

  if (!assetsLoaded) {
    return null;
  }

  return children();
}
