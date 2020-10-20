import { ChatMessage, WithId } from 'appjusto-types';
import { normalize } from 'normalizr';
import { AnyAction } from 'redux';

import { ORDERS_UPDATED, ORDER_CHAT_UPDATED } from './actions';
import * as schema from './schema';
import { OrderState } from './types';

const initialState: OrderState = {
  orders: [],
  ordersById: {},
  chatByOrderId: {},
  lastChatMessageReadByOrderId: {},
};

export default function (state: OrderState = initialState, action: AnyAction): OrderState {
  const { type, payload } = action;
  switch (type) {
    case ORDERS_UPDATED: {
      const ordersById = normalize(payload, [schema.order]).entities.orders ?? {};
      return { ...state, orders: payload, ordersById };
    }
    case ORDER_CHAT_UPDATED: {
      const { orderId, messages }: { orderId: string; messages: WithId<ChatMessage>[] } = payload;
      const chatByOrderId = { ...state.chatByOrderId, [orderId]: messages };
      return { ...state, chatByOrderId };
    }
    default:
      return state;
  }
}
