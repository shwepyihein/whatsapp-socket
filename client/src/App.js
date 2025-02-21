import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import io from 'socket.io-client';
import './App.css';
const socket = io.connect('http://localhost:3001', {});
function App() {
  const [session, setSession] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [oldSessionId, setOldSessionId] = useState('');
  const createSessionForWhatsapp = () => {
    socket.emit('createSession', {
      id: session,
    });
  };
  const [id, setId] = useState('');

  useEffect(() => {
    socket.emit('connected', 'Hello from client');
    socket.on('qr', (data) => {
      const { qr } = data;
      console.log('QR RECEIVED', qr);
      setQrCode(qr);
    });

    socket.on('ready', (data) => {
      console.log(data);
      const { id } = data;
      setId(id);
    });

    socket.on('allChats', (data) => {
      console.log('allChats', data);
    });
  }, []);

  const getOldSession = () => {
    socket.emit('getSession', { id: oldSessionId });
  };
  const getAllChats = () => {
    socket.emit('getAllChats', { id });
  };
  return (
    <div className='App'>
      <div
        style={{
          marginBottom: '40px',
        }}
      >
        <input
          type='text'
          value={oldSessionId}
          onChange={(e) => {
            setOldSessionId(e.target.value);
          }}
        />
        <button onClick={getOldSession}>Get old session</button>
      </div>
      <div
        style={{
          marginBottom: '40px',
        }}
      >
        <input
          type='text'
          value={session}
          onChange={(e) => {
            setSession(e.target.value);
          }}
        />
        <button onClick={createSessionForWhatsapp}>Create session</button>
      </div>

      <div
        style={{
          marginBottom: '24px',
        }}
      >
        {id !== '' && <button onClick={getAllChats}>Get all chats</button>}
      </div>
      {qrCode && <QRCode value={qrCode} />}
    </div>
  );
}

export default App;
