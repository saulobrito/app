import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChatPushMessageData, OrderMatchPushMessageData, PushMessage } from 'appjusto-types';
import React, { useEffect } from 'react';
import { Image } from 'react-native';
import { useQuery, useQueryCache } from 'react-query';
import { useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import useObserveOrders from '../../../common/hooks/useObserveOrders';
import { getCourier, getCourierStatus } from '../../../common/store/courier/selectors';
import { colors } from '../../../common/styles';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import DeliveriesNavigator from './history/DeliveriesNavigator';
import HomeNavigator from './home/HomeNavigator';
import ProfileNavigator from './profile/ProfileNavigator';
import { MainParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<ApprovedParamList, 'MainNavigator'>;

type Props = {
  navigation: ScreenNavigationProp;
};

const Tab = createBottomTabNavigator<MainParamList>();
export default function ({ navigation }: Props) {
  // context
  const queryCache = useQueryCache();
  const matchingQuery = useQuery<PushMessage[]>(['notifications', 'matching']);
  const chatQuery = useQuery<PushMessage[]>(['notifications', 'order-chat']);

  // app state
  const courier = useSelector(getCourier)!;

  // effects
  useObserveOrders({ deliveredBy: courier.id });
  // matching notifications
  useEffect(() => {
    if (!matchingQuery.data || matchingQuery.data.length === 0) return;
    const [notification] = matchingQuery.data;
    if (notification) {
      navigation.navigate('MatchingNavigator', {
        screen: 'Matching',
        params: {
          notification,
        },
      });
      // remove from cache
      queryCache.setQueryData(
        ['notifications', 'matching'],
        (notifications: PushMessage[] | undefined) =>
          (notifications ?? []).filter((item) => item.id !== notification.id)
      );
    }
  }, [matchingQuery.data]);
  // order chat notifications
  useEffect(() => {
    if (!chatQuery.data || chatQuery.data.length === 0) return;
    const [notification] = chatQuery.data;
    if (notification.clicked) {
      const data = notification.data as ChatPushMessageData;
      navigation.navigate('OngoingNavigator', {
        screen: 'OngoingDelivery',
        params: {
          orderId: data.orderId,
          newMessage: true,
        },
      });
    }
  }, [chatQuery.data]);

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.black,
        inactiveTintColor: colors.black,
        activeBackgroundColor: colors.green,
        inactiveBackgroundColor: colors.white,
      }}
    >
      <Tab.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{ title: t('Início'), tabBarIcon: () => <Image source={icons.home} /> }}
      />
      <Tab.Screen
        name="DeliveriesNavigator"
        component={DeliveriesNavigator}
        options={{ title: t('Suas corridas'), tabBarIcon: () => <Image source={icons.orders} /> }}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{ title: t('Sua conta'), tabBarIcon: () => <Image source={icons.user} /> }}
      />
    </Tab.Navigator>
  );
}
