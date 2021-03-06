import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ArrowBox from '../../common/components/views/ArrowBox';
import Chat from '../../common/screens/Chat';
import FleetDetail from '../../common/screens/fleet/FleetDetail';
import { t } from '../../strings';
import ProfileEdit from '../profile/ProfileEdit';
import ProfileAddCard from '../profile/payment/ProfileAddCard';
import ProfilePaymentMethods from '../profile/payment/ProfilePaymentMethods';
import Home from './Home';
import AddressComplete from './orders/AddressComplete';
import CourierDetail from './orders/CourierDetail';
import OngoingOrder from './orders/OngoingOrder';
import OrderConfirmedFeedback from './orders/OrderConfirmedFeedback';
import OrderDeliveredFeedback from './orders/OrderDeliveredFeedback';
import CreateOrderP2P from './orders/p2p-order/CreateOrderP2P';
import { HomeNavigatorParamList } from './types';

const Stack = createStackNavigator<HomeNavigatorParamList>();
export default function () {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerBackImage: () => <ArrowBox flipped />,
        headerBackTitleVisible: false,
      })}
    >
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
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
        name="OrderConfirmedFeedback"
        component={OrderConfirmedFeedback}
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
        options={{ title: t('Sobre o entregador') }}
      />
      <Stack.Screen name="Chat" component={Chat} options={{ title: t('Chat') }} />
      <Stack.Screen
        name="OrderDeliveredFeedback"
        component={OrderDeliveredFeedback}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
