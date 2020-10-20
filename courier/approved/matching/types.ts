import { PushMessage } from 'appjusto-types';

export type MatchingParamList = {
  Matching: {
    notification: PushMessage;
  };
  RefuseDelivery: {
    orderId: string;
  };
  MatchingError: undefined;
};
