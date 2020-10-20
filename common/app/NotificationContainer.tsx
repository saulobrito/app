import { PushMessage, PushMessageData } from 'appjusto-types';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect } from 'react';
import { useQueryCache } from 'react-query';

type Props = {
  children: React.ReactNode;
};

export default function ({ children }: Props) {
  // app state
  const queryCache = useQueryCache();

  // handlers
  // called whenever a notification is received while the app is running.
  const receivedHandler = useCallback(async (notification: Notifications.Notification) => {
    const { request } = notification;
    const id = request.identifier;
    const data = (request.content.data as unknown) as PushMessageData;
    // add message to queryCache
    queryCache.setQueryData(
      ['notifications', data.action],
      (notifications: PushMessage[] | undefined) => [...(notifications ?? []), { id, data }]
    );
  }, []);

  // called whenever a user interacts with a notification (eg. taps on it).
  const responseReceivedHandler = useCallback((response: Notifications.NotificationResponse) => {
    const { notification } = response;
    const { request } = notification;
    const data = (request.content.data as unknown) as PushMessageData;
    // update queryCache to indicate message was clicked
    queryCache.setQueryData(
      ['notifications', data.action],
      (notifications: PushMessage[] | undefined) =>
        (notifications ?? []).map((item) => ({ ...item, clicked: true }))
    );
    // dismiss all notifications of this type
    queryCache
      .getQueryData<PushMessage[]>(['notifications', data.action])
      ?.forEach((n) => {
        if (n.id !== request.identifier) {
          Notifications.dismissNotificationAsync(n.id);
        }
      });
  }, []);

  // effects
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(receivedHandler);
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      responseReceivedHandler
    );

    return () => {
      Notifications.removeNotificationSubscription(subscription);
      Notifications.removeNotificationSubscription(responseSubscription);
      // Notifications.removeAllNotificationListeners();
    };
  }, []);

  return children as JSX.Element;
}
