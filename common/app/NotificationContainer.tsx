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

  const add = useCallback((id: string, data: PushMessageData, clicked: boolean) => {
    queryCache.setQueryData(
      ['notifications', data.action],
      (notifications: PushMessage[] | undefined) => [
        ...(notifications ?? []),
        { id, data, clicked },
      ]
    );
  }, []);

  // handlers
  // called whenever a notification is received while the app is running.
  const receivedHandler = useCallback(async (notification: Notifications.Notification) => {
    const { request } = notification;
    const id = request.identifier;
    const data = (request.content.data as unknown) as PushMessageData;
    // add message to queryCache
    add(id, data, false);
    // dismiss notification if the app in running
    // Notifications.dismissNotificationAsync(id);
  }, []);

  // called whenever a user interacts with a notification (eg. taps on it).
  const responseReceivedHandler = useCallback((response: Notifications.NotificationResponse) => {
    const { notification } = response;
    const { request } = notification;
    const id = request.identifier;
    const data = (request.content.data as unknown) as PushMessageData;
    // check if message was already added to the cache (it could happen if the app is in foreground and user clicks on the notification)
    const alreadyAdded =
      queryCache
        .getQueryData<PushMessage[]>(['notifications', data.action])
        ?.some((m) => m.id === id) ?? false;

    if (!alreadyAdded) {
      add(id, data, true);
    } else {
      // if was already added, change clicked to true
      queryCache.setQueryData(
        ['notifications', data.action],
        (notifications: PushMessage[] | undefined) =>
          (notifications ?? []).map((n) => ({ ...n, clicked: true }))
      );
    }
    // dismiss all other notifications of this type
    queryCache
      .getQueryData<PushMessage[]>(['notifications', data.action])
      ?.forEach((n) => {
        if (n.id !== id) {
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
    };
  }, []);

  return children as JSX.Element;
}
