import { Peer } from 'peerjs';
import { useEffect, useState, useRef, useCallback } from 'react';

// Generate a random 6-digit string
const generateShortId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const usePeer = () => {
  const [peerId, setPeerId] = useState('');
  const [connections, setConnections] = useState([]); // Array of connections
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const peerRef = useRef(null);

  useEffect(() => {
    if (peerRef.current) return; 

    const id = generateShortId();
    console.log('Initializing Peer with ID:', id);

    const peer = new Peer(id, {
      debug: 2,
      config: {
        iceServers: [
          {
            urls: "stun:stun.relay.metered.ca:80",
          },
          {
            urls: "turn:global.relay.metered.ca:80",
            username: "48fe852c734bf56dbce20960",
            credential: "1wy+iDWHJkkrCAwu",
          },
          {
            urls: "turn:global.relay.metered.ca:80?transport=tcp",
            username: "48fe852c734bf56dbce20960",
            credential: "1wy+iDWHJkkrCAwu",
          },
          {
            urls: "turn:global.relay.metered.ca:443",
            username: "48fe852c734bf56dbce20960",
            credential: "1wy+iDWHJkkrCAwu",
          },
          {
            urls: "turns:global.relay.metered.ca:443?transport=tcp",
            username: "48fe852c734bf56dbce20960",
            credential: "1wy+iDWHJkkrCAwu",
          },
        ]
      }
    });

    peer.on('open', (myId) => {
      console.log('My Peer ID is open:', myId);
      setPeerId(myId);
    });

    peer.on('connection', (conn) => {
      console.log('Incoming connection from:', conn.peer);
      setupConnection(conn);
    });

    peer.on('error', (err) => {
      console.error('PeerJS Error:', err);
      setIsConnecting(false);
      
      let msg = 'エラーが発生しました';
      if (err.type === 'unavailable-id') {
        msg = 'ID生成エラー。リロードしてください。';
      } else if (err.type === 'peer-unavailable') {
        msg = 'そのIDの部屋は見つかりませんでした。IDを確認してください。';
      } else if (err.type === 'network') {
        msg = 'ネットワーク接続が切れました。';
      } else if (err.type === 'browser-incompatible') {
        msg = 'このブラウザは対応していません。';
      } else if (err.type === 'webrtc') {
        msg = '通信エラー(WebRTC)です。ファイアウォールでブロックされているか、対応していないネットワークの可能性があります。';
      } else {
        msg = `エラー: ${err.message || err.type}`;
      }
      setConnectionError(msg);
    });

    peerRef.current = peer;

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    };
  }, []);

  const connectToPeer = (remotePeerId) => {
    if (!peerRef.current) return;
    
    console.log('Connecting to:', remotePeerId);
    // Don't connect if already connected
    if (connections.find(c => c.peer === remotePeerId)) return;

    setIsConnecting(true);
    setConnectionError(null);

    const conn = peerRef.current.connect(remotePeerId, {
       reliable: true
    });
    
    setupConnection(conn);
  };

  const setupConnection = (conn) => {
    conn.on('open', () => {
      console.log('Connection established with:', conn.peer);
      setIsConnecting(false);
      setConnections(prev => {
          if (prev.find(c => c.peer === conn.peer)) return prev;
          return [...prev, conn];
      });
    });

    // Note: 'data' listeners should be attached by the component using the connections list
    // OR we provide a central listener mechanism. 
    // For simplicity, we let the component iterate connections or we could trigger a callback.
    // However, since we return the raw connections list, the component can attach listeners or we use a wrapper.
    // To make it easier for App.jsx, let's keep it simple: App observes `connections` and attaches listeners in useEffect.

    conn.on('close', () => {
      console.log('Connection closed:', conn.peer);
      setConnections(prev => prev.filter(c => c.peer !== conn.peer));
    });

    conn.on('error', (err) => {
      console.error('Connection level error:', err);
      setIsConnecting(false);
      setConnectionError('Connection failed: ' + err.message);
      setConnections(prev => prev.filter(c => c.peer !== conn.peer));
    });
  };

  const broadcast = useCallback((data) => {
    connections.forEach(conn => {
        if (conn.open) {
            conn.send(data);
        }
    });
  }, [connections]);

  const sendTo = useCallback((peerId, data) => {
      const conn = connections.find(c => c.peer === peerId);
      if (conn && conn.open) {
          conn.send(data);
      }
  }, [connections]);

  return { peerId, connectToPeer, connections, broadcast, sendTo, isConnecting, connectionError };
};