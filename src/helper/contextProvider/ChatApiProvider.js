import React, {createContext, useContext} from 'react';
import {useSocket} from './SocketProvider';

export const ChatContext = createContext();

export const ChatProvider = ({children}) => {
  const socket = useSocket();

  const onUserConnected = fn => {
    socket.on('chat-user-connected', event => fn(event));
    return () => socket.off('chat-user-connected', fn);
  };

  const onChatUserConnected = fn => {
    socket.on('user-connected', event => fn(event));
    return () => socket.off('user-connected', fn);
  };

  const onUserSubscribe = fn => {
    socket.on('chat-user-subscribe', event => fn(event));
    return () => socket.off('chat-user-subscribe', fn);
  };

  const onBlockUser = fn => {
    socket.on('chat-blocked-user', event => {
      if (event && event !== null && event !== undefined) {
        fn(event.status);
      }
    });
    return () => socket.off('chat-blocked-user', fn);
  };

  const onUnBlockUser = fn => {
    socket.on('chat-unblocked-user', event => {
      if (event && event !== null && event !== undefined) {
        fn(event.status);
      }
    });
    return () => socket.off('chat-unblocked-user', fn);
  };

  const onChatStatus = fn => {
    socket.on('chat-status-ack', event => {
      if (event && event !== undefined && event !== null) {
        fn(event.chatStatus);
      }
    });
    return () => socket.off('chat-status-ack', fn);
  };

  const onNewChatCreated = fn => {
    socket.on('chat-created-list', event => {
      if (event && event !== null && event !== undefined) {
        if (event.status) {
          let chat = event.chat;
          fn(chat);
        }
      }
    });
    return () => socket.off('chat-created-list', fn);
  };

  const onGetNewChatMessage = fn => {
    socket.on('chat-get-message', event => {
      if (event && event !== null && event !== undefined) {
        let message = event.message;
        fn(message);
      }
    });
    return () => socket.off('chat-get-message', fn);
  };

  const emitEvent = (event, payload, fn) => {
    socket.emit(event, payload, fn);
  };

  const disconnectAll = () => {
    return new Promise((resolve, reject) => {
      socket.off('user-connected');
      socket.off('chat-user-connected');
      socket.off('chat-user-subscribe');
      socket.off('chat-blocked-user');
      socket.off('chat-unblocked-user');
      socket.off('chat-status-ack');
      socket.off('chat-created-list');
      socket.off('chat-get-message');
      resolve(true);
    });
  };

  const removeChatListeners = () => {
    return new Promise((resolve, reject) => {
      socket.off('chat-user-subscribe');
      socket.off('chat-blocked-user');
      socket.off('chat-unblocked-user');
      socket.off('chat-status-ack');
      socket.off('chat-created-list');
      socket.off('chat-get-message');
      resolve(true);
    });
  };

  return (
    <ChatContext.Provider
      value={{
        onUserSubscribe,
        onUserConnected,
        onChatUserConnected,
        emitEvent,
        onBlockUser,
        onChatStatus,
        onUnBlockUser,
        onNewChatCreated,
        onGetNewChatMessage,
        disconnectAll,
        removeChatListeners,
      }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
