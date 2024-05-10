'use client'
import React, { useState, useEffect } from 'react';
import {socket} from '../lib/socket'
import { CLIENT_URL } from '../lib/server.consts';


export default function SocketHandler() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  console.log({isConnected});
  
  useEffect(() => {

    function onConnect() {
      console.log('socket connected');
      
      setIsConnected(true);
    }
    
    function onDisconnect() {
      console.log('socket disconnected');
      setIsConnected(false);
    }

    console.log('init');
    
    // function onFooEvent(value) {
    //   setFooEvents(previous => [...previous, value]);
    // }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    // socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    //   socket.off('foo', onFooEvent);
    };
  }, []);

  return (
    <div className="App">
        connected: {isConnected}
      {/* <ConnectionState isConnected={ isConnected } />
      <Events events={ fooEvents } />
      <ConnectionManager />
      <MyForm /> */}
    </div>
  );
}