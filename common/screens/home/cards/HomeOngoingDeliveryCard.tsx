import { Order, PushMessage, WithId } from 'appjusto-types';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useQuery } from 'react-query';

import * as icons from '../../../../assets/icons';
import { t } from '../../../../strings';
import PaddedView from '../../../components/containers/PaddedView';
import ShowIf from '../../../components/views/ShowIf';
import { borders, colors, halfPadding, padding, texts } from '../../../styles';

type Props = {
  order: WithId<Order>;
  onSelect: (order: WithId<Order>, openChat: boolean) => void;
};

export default function ({ order, onSelect }: Props) {
  // app state
  const orderChatNotificationQuery = useQuery<PushMessage[]>(['notifications', 'order-chat']);
  const unreadCount = orderChatNotificationQuery.data?.length ?? 0;

  // UI
  let detail = '';
  if (order.dispatchingState === 'going-pickup') {
    detail = `${t('À caminho de')} ${order.origin.address.main}`;
  } else if (order.dispatchingState === 'arrived-pickup') {
    detail = order.origin.intructions ?? 'Aguardando retirada';
  } else if (order.dispatchingState === 'going-destination') {
    detail = `${t('À caminho de')} ${order.destination.address.main}`;
  } else if (order.dispatchingState === 'arrived-destination') {
    detail = order.destination.intructions ?? 'Aguardando entrega';
  }
  return (
    <TouchableOpacity onPress={() => onSelect(order, false)}>
      <View style={{ ...borders.default }}>
        <View>
          <ShowIf test={unreadCount > 0}>
            {() => (
              <TouchableOpacity onPress={() => onSelect(order, true)}>
                <View
                  style={{
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.darkGrey,
                    backgroundColor: colors.white,
                  }}
                >
                  <PaddedView style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={icons.chat} />
                    <Text style={{ ...texts.small, marginLeft: halfPadding }}>
                      {t('Você tem')} {unreadCount} {t('novas mensagens.')}
                    </Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{ ...texts.small, ...texts.bold, color: colors.darkGreen }}>
                      {t('Abrir chat')}
                    </Text>
                  </PaddedView>
                </View>
              </TouchableOpacity>
            )}
          </ShowIf>
          <PaddedView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.yellow,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
            half
          >
            <Image source={icons.requests} />
            <View style={{ marginLeft: padding }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text style={{ ...texts.default }}>{t('Corrida em andamento')}</Text>
                  <Text
                    style={{
                      ...texts.small,
                      color: colors.darkGrey,
                      flexWrap: 'wrap',
                      maxWidth: '85%',
                    }}
                    numberOfLines={2}
                  >
                    {detail}
                  </Text>
                </View>
              </View>
            </View>
          </PaddedView>
        </View>
      </View>
    </TouchableOpacity>
  );
}
