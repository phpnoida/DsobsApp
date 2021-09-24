import React from 'react';
import socketio from 'socket.io-client';
import {SERVER_PATH} from '../../../config';

export const socket = socketio.connect(SERVER_PATH);
export const SocketContext = React.createContext();
