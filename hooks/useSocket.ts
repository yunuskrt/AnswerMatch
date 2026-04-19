import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? 'http://localhost:3001';

let socketInstance: Socket | null = null;

function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(SERVER_URL, {
      autoConnect: false,
      transports: ['websocket'],
    });
  }
  return socketInstance;
}

export function useSocket(): Socket {
  const socketRef = useRef<Socket>(getSocket());
  return socketRef.current;
}
