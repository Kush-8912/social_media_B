import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import socket from "../socket";


const SocketManager = () => {

    const { user } = useAuth();


    useEffect(() => {

        // If there is no logged-in user,
        // we don't need an authenticated socket connection.
        if (!user?._id) {
            return;
        }


        // Runs once Socket.IO successfully connects
        const handleConnect = () => {

            console.log(
                "Socket connected:",
                socket.id
            );


            // Tell server:
            // "this socket belongs to this user"
            socket.emit(
                "register-user",
                user._id
            );

        };


        const handleConnectError = (error) => {

            console.log(
                "Socket connection error:",
                error.message
            );

        };


        const handleDisconnect = (reason) => {

            console.log(
                "Socket disconnected:",
                reason
            );

        };


        // Register socket listeners
        socket.on(
            "connect",
            handleConnect
        );

        socket.on(
            "connect_error",
            handleConnectError
        );

        socket.on(
            "disconnect",
            handleDisconnect
        );


        // Start the socket connection
        socket.connect();


        // If socket was somehow already connected,
        // register this user immediately.
        if (socket.connected) {

            socket.emit(
                "register-user",
                user._id
            );

        }


        // Cleanup when component unmounts
        // or logged-in user changes
        return () => {

            socket.off(
                "connect",
                handleConnect
            );

            socket.off(
                "connect_error",
                handleConnectError
            );

            socket.off(
                "disconnect",
                handleDisconnect
            );


            socket.disconnect();

        };

    }, [user?._id]);


    // This component has no UI.
    return null;
};


export default SocketManager;