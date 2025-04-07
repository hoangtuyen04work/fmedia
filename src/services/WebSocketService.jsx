// websocketService.js
import { Client } from "@stomp/stompjs";

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
  }

  connect(token, userId, onConnectCallback, onErrorCallback) {
    if (this.stompClient && this.connected) {
      return;
    }

    this.stompClient = new Client({
      brokerURL: `ws://localhost:8888/media/ws?token=${token}`,
      reconnectDelay: 5000, // Tự động kết nối lại sau 5 giây nếu mất kết nối
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = () => {
      this.connected = true;
      if (onConnectCallback) onConnectCallback();
    };

    this.stompClient.onStompError = (error) => {
      this.connected = false;
      if (onErrorCallback) onErrorCallback(error);
    };

    this.stompClient.onWebSocketClose = () => {
      this.connected = false;
    };

    this.stompClient.activate();
  }

  subscribe(conversationId, userId, callback) {
    if (!this.stompClient || !this.connected) {
      return;
    }

    const destination = `/user/${userId}/queue/conversation/messages/${conversationId}`;
    const subscription = this.stompClient.subscribe(destination, (message) => {
      const parsedMessage = JSON.parse(message.body);
      callback(parsedMessage);
    });

    this.subscriptions.set(conversationId, subscription);
  }

  unsubscribe(conversationId) {
    const subscription = this.subscriptions.get(conversationId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(conversationId);
    }
  }

  sendMessage(destination, message) {
    if (!this.stompClient || !this.connected) {
      return;
    }
    this.stompClient.publish({
      destination,
      body: JSON.stringify(message),
    });
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.subscriptions.clear();
      this.stompClient.deactivate();
      this.connected = false;
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new WebSocketService(); // Export singleton instance