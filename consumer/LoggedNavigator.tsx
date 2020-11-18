import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useContext } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../assets/icons';
import { AppDispatch, ApiContext } from '../common/app/context';
import useObserveOrders from '../common/hooks/useObserveOrders';
import { getFlavor } from '../common/store/config/selectors';
import { getConsumer } from '../common/store/consumer/selectors';
import { observeProfile } from '../common/store/user/actions';
import { getUser } from '../common/store/user/selectors';
import { colors, screens } from '../common/styles';
import { t } from '../strings';
import ConsumerBottomTabNavigator from './ConsumerBottomTabNavigator';
import HistoryNavigator from './history/HistoryNavigator';
import HomeNavigator from './home/HomeNavigator';
import ProfileNavigator from './profile/ProfileNavigator';
import { LoggedParamList } from './types';

// const Tab = createBottomTabNavigator<LoggedParamList>();
const Stack = createStackNavigator();
export default function () {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = useContext(ApiContext);
  // app state
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser);
  const consumer = useSelector(getConsumer);

  // side effects
  // subscribe for profile changes
  useEffect(() => {
    return dispatch(observeProfile(api)(flavor, user!.uid));
  }, []);
  // subscribe for order changes
  useObserveOrders({ createdBy: user?.uid });

  // UI
  if (consumer?.situation !== 'approved') {
    // showing the indicator until the profile is loaded
    // the first time should take longer as the profile is created with situation === 'pending' and than
    // updated by a trigger after automatic validation
    // TODO: handle other situation cases in the future
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  return (
    <Stack.Navigator
      screenOptions={() => ({
        // headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
      // screenOptions={() => ({
      //   headerBackImage: () => <ArrowBox flipped />,
      //   headerBackTitleVisible: false,
      // })}
    >
      <Stack.Screen
        name="ConsumerBottomTabNavigator"
        component={ConsumerBottomTabNavigator}
        options={
          {
            // title: t('Início'),
            // tabBarIcon: () => <Image source={icons.home} />,
          }
        }
      />
      <Stack.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{ title: t('Início') }}
      />
      <Stack.Screen
        name="HistoryNavigator"
        component={HistoryNavigator}
        options={{ title: t('Seus pedidos') }}
      />
      <Stack.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{ title: t('Sua conta') }}
      />
    </Stack.Navigator>
  );
}
