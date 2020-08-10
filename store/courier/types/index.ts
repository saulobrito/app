import { Coordinates } from '../../types';
import { ProfileInfo, UserProfile } from '../../user/types';
import Courier from './Courier';

export enum CourierStatus {
  Unavailable = 'unavailable',
  Available = 'available',
  Dispatching = 'dispatching',
}

export interface CourierInfo extends ProfileInfo {}

export interface CourierProfile extends UserProfile {
  info?: CourierInfo;
  status?: CourierStatus;
}

export interface CourierState {
  courier?: Courier;
  order?: object;
  location?: Coordinates;
}