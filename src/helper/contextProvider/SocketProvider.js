import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from 'react';
import {SERVER_PATH} from '../../../config';
import io from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({children, store}) => {
  const [isConnected, setConnected] = useState(false);

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(SERVER_PATH, {
      transports: ['websocket'],
      reconnectionAttempts: 2,
    });

    socket.current.on('connect', () => {
      console.info(`Successfully connected to socket at ${SERVER_PATH}`);
    });

    socket.current.on('disconnect', () => {
      console.info('Successfully disconnected');
    });

    socket.current.on('error', err => {
      console.log('Socket Error:', err.message);
    });

    return () => {
      if (socket.current && socket.current.connected) {
        socket.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
