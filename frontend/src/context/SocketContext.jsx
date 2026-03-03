import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log("Initializing Global Socket Connection...");

        const socketInstance = io(BACKEND_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            // Prevent auto-connect if you want to control it manually, but for now auto is fine
        });

        socketRef.current = socketInstance;
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('✅ Global Socket Connected:', socketInstance.id);
            setIsConnected(true);
            setError(null);
        });

        socketInstance.on('disconnect', (reason) => {
            console.log('🔌 Global Socket Disconnected:', reason);
            setIsConnected(false);
        });

        socketInstance.on('connect_error', (err) => {
            console.error('Global Socket Connection Error:', err);
            setIsConnected(false);
            setError(err.message);
        });

        return () => {
            console.log("Cleaning up Global Socket");
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected, error }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
