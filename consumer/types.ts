import { NestedNavigatorParams } from '../common/types';
import { HistoryParamList } from './history/types';
import { HomeNavigatorParamList } from './home/types';
import { ProfileParamList } from './profile/types';

export type LoggedParamList = {
  HomeNavigator: NestedNavigatorParams<HomeNavigatorParamList>;
  HistoryNavigator: NestedNavigatorParams<HistoryParamList>;
  ProfileNavigator: NestedNavigatorParams<ProfileParamList>;
  Home: HomeNavigatorParamList; //for testing the new bottom tab navigator
  OrderHistory: HistoryParamList; //for testing the new bottom tab navigator
  Profile: ProfileParamList; //for testing the new bottom tab navigator
};
