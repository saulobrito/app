import polyline from '@mapbox/polyline';
import { Order } from 'appjusto-types';
import React from 'react';
import { LatLng, Marker, Polyline } from 'react-native-maps';

import * as icons from '../../../../assets/icons';
import DefaultMap from '../../../../common/components/views/DefaultMap';

type Props = {
  order: Order;
};

export default function ({ order }: Props) {
  const { courier, origin, destination, routePolyline } = order;

  const routeCoordinates = polyline.decode(routePolyline).map((pair) => {
    return { latitude: pair[0], longitude: pair[1] } as LatLng;
  });

  // const coordinates

  return (
    <DefaultMap
      style={{ width: '100%', height: '100%' }}
      coordinates={routeCoordinates}
      fitToElements
    >
      <Marker coordinate={origin.location} identifier="origin" />
      <Marker coordinate={destination.location} identifier="destination" />
      {courier?.location && <Marker coordinate={courier.location} />}
      <Polyline coordinates={routeCoordinates} />
    </DefaultMap>
  );
}
