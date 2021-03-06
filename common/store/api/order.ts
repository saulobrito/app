import { Place, Order, WithId, ChatMessage, Fare } from 'appjusto-types';
import firebase from 'firebase';

export type ObserveOrdersOptions = {
  createdBy?: string;
  deliveredBy?: string;
};

export default class OrderApi {
  constructor(
    private firestore: firebase.firestore.Firestore,
    private functions: firebase.functions.Functions
  ) {}

  // consumer
  // callables
  async createOrder(origin: Partial<Place>, destination: Partial<Place>) {
    return (await this.functions.httpsCallable('createOrder')({ origin, destination })).data;
  }

  async getOrderQuotes(orderId: string) {
    return (await this.functions.httpsCallable('getOrderQuotes')({ orderId })).data as Fare[];
  }

  async confirmOrder(
    orderId: string,
    origin: Partial<Place>,
    destination: Partial<Place>,
    paymentMethodId: string,
    fleetId: string,
    platformFee: number
  ) {
    const result = await this.functions.httpsCallable('confirmOrder')({
      orderId,
      origin,
      destination,
      paymentMethodId,
      fleetId,
      platformFee,
    });
    return result.data;
  }

  async tipCourier(orderId: string, tip: number) {
    return (await this.functions.httpsCallable('tipCourier')({ orderId, tip })).data;
  }

  async cancelOrder(orderId: string) {
    return (await this.functions.httpsCallable('cancelOrder')({ orderId })).data;
  }

  async deleteOrder(orderId: string) {
    return this.firestore.collection('orders').doc(orderId).delete();
  }

  // courier
  async matchOrder(orderId: string) {
    return (await this.functions.httpsCallable('matchOrder')({ orderId })).data;
  }

  async nextDispatchingState(orderId: string) {
    return (await this.functions.httpsCallable('nextDispatchingState')({ orderId })).data;
  }

  async completeDelivery(orderId: string) {
    return (await this.functions.httpsCallable('completeDelivery')({ orderId })).data;
  }

  // both courier & customers
  // observe orders
  observeOrders(
    options: ObserveOrdersOptions,
    resultHandler: (orders: WithId<Order>[]) => void
  ): firebase.Unsubscribe {
    const { createdBy, deliveredBy } = options;
    let query = this.firestore
      .collection('orders')
      .orderBy('createdOn', 'desc')
      .where('status', 'in', ['quote', 'matching', 'dispatching', 'delivered', 'canceled']);
    if (createdBy) query = query.where('consumer.id', '==', createdBy);
    if (deliveredBy) query = query.where('courier.id', '==', deliveredBy);

    const unsubscribe = query.onSnapshot(
      (querySnapshot) => {
        const docs: WithId<Order>[] = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...(doc.data() as Order), id: doc.id });
        });
        resultHandler(docs);
      },
      (error) => {
        console.error(error);
      }
    );
    // returns the unsubscribe function
    return unsubscribe;
  }
  // observe order's chat
  observeOrderChat(
    orderId: string,
    resultHandler: (orders: WithId<ChatMessage>[]) => void
  ): firebase.Unsubscribe {
    const unsubscribe = this.firestore
      .collection('orders')
      .doc(orderId)
      .collection('chat')
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        (querySnapshot) => {
          const docs: WithId<ChatMessage>[] = [];
          querySnapshot.forEach((doc) => {
            docs.push({ ...(doc.data() as ChatMessage), id: doc.id });
          });
          resultHandler(docs);
        },
        (error) => {
          console.error(error);
        }
      );
    // returns the unsubscribe function
    return unsubscribe;
  }

  async sendMessage(orderId: string, message: Partial<ChatMessage>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.firestore
      .collection('orders')
      .doc(orderId)
      .collection('chat')
      .add({
        ...message,
        timestamp,
      });
  }
}
