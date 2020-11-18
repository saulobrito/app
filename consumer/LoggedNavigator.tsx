import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useContext } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../assets/icons';
import { AppDispatch, ApiContext } from '../common/app/context';
import useObserveOrders from '../common/hooks/useObserveOrders';
import Chat from '../common/screens/Chat';
import FleetDetail from '../common/screens/fleet/FleetDetail';
import PermissionDeniedFeedback from '../common/screens/PermissionDeniedFeedback';
import { getFlavor } from '../common/store/config/selectors';
import { getConsumer } from '../common/store/consumer/selectors';
import { observeProfile } from '../common/store/user/actions';
import { getUser } from '../common/store/user/selectors';
import { colors, screens } from '../common/styles';
import { t } from '../strings';
import ConsumerBottomTabNavigator from './ConsumerBottomTabNavigator';
import HistoryNavigator from './history/HistoryNavigator';
import OrderSummary from './history/OrderSummary';
import HomeNavigator from './home/HomeNavigator';
import AddressComplete from './home/orders/AddressComplete';
import CancelOrder from './home/orders/CancelOrder';
import ConfirmCancelOrder from './home/orders/ConfirmCancelOrder';
import CourierDetail from './home/orders/CourierDetail';
import OngoingOrder from './home/orders/OngoingOrder';
import OrderComplaint from './home/orders/OrderComplaint';
import OrderDeliveredFeedback from './home/orders/OrderDeliveredFeedback';
import OrderMatching from './home/orders/OrderMatching';
import OrderUnmatched from './home/orders/OrderUnmatched';
import CreateOrderP2P from './home/orders/p2p-order/CreateOrderP2P';
import TransportableItems from './home/orders/p2p-order/TransportableItems';
import ReviewCourier from './home/orders/ReviewCourier';
import ProfileAddCard from './profile/payment/ProfileAddCard';
import ProfilePaymentMethods from './profile/payment/ProfilePaymentMethods';
import ProfileEdit from './profile/ProfileEdit';
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
        options={{
          // title: t('Início'),
          // tabBarIcon: () => <Image source={icons.home} />,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateOrderP2P"
        component={CreateOrderP2P}
        options={{ title: t('Novo pedido') }}
      />
      <Stack.Screen
        name="AddressComplete"
        component={AddressComplete}
        options={{ title: t('Selecione o endereço') }}
      />
      <Stack.Screen
        name="TransportableItems"
        component={TransportableItems}
        options={{ title: t('Informações Gerais') }}
      />
      <Stack.Screen
        name="FleetDetail"
        component={FleetDetail}
        options={{ title: t('Detalhes da frota') }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{ title: t('Seus dados') }}
      />
      <Stack.Screen
        name="ProfileAddCard"
        component={ProfileAddCard}
        options={{ title: t('Adicionar cartão') }}
      />
      <Stack.Screen
        name="ProfilePaymentMethods"
        component={ProfilePaymentMethods}
        options={{ title: t('Formas de pagamento') }}
      />
      <Stack.Screen
        name="PermissionDeniedFeedback"
        component={PermissionDeniedFeedback}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderMatching"
        component={OrderMatching}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderUnmatched"
        component={OrderUnmatched}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OngoingOrder"
        component={OngoingOrder}
        options={{ title: t('Pedido em andamento') }}
      />
      <Stack.Screen
        name="CourierDetail"
        component={CourierDetail}
        options={{ title: t('Mais informações') }}
      />
      <Stack.Screen name="Chat" component={Chat} options={{ title: t('Chat') }} />
      <Stack.Screen
        name="ConfirmCancelOrder"
        component={ConfirmCancelOrder}
        options={{ title: t('Cancelar pedido') }}
      />
      <Stack.Screen
        name="CancelOrder"
        component={CancelOrder}
        options={{ title: t('Sua opinião') }}
      />
      <Stack.Screen
        name="OrderDeliveredFeedback"
        component={OrderDeliveredFeedback}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="HistoryNavigator"
        component={HistoryNavigator}
        options={{ title: t('Seus pedidos') }}
      /> */}
      <Stack.Screen
        name="OrderSummary"
        component={OrderSummary}
        options={{ title: t('Corrida finalizada') }}
      />
      {/* <Stack.Screen
        name="OrderMatching"
        component={OrderMatching}
        options={{ title: t('Pedido em andamento') }}
      /> */}
      <Stack.Screen
        name="ReviewCourier"
        component={ReviewCourier}
        options={{ title: t('Avaliar entregador') }}
      />
      <Stack.Screen
        name="OrderComplaint"
        component={OrderComplaint}
        options={{ title: t('Relatar um problema') }}
      />
      {/* the ProfileNavigator stack can be used as a stack screen.
      we just need to correctly handle all navigation actions and params passing */}
      <Stack.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{ title: t('Sua conta') }}
      />
    </Stack.Navigator>
  );
}
