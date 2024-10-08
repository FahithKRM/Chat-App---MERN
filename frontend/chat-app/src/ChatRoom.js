import React, { useEffect, useState } from 'react';

const ChatRoom = () => {
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    
    const fetchMessages = async () => {
        try{
            const res = await fetch('http://localhost:5000/messages');
            const data = await res.json();
            setMessages(data);
        }catch(error){
            console.error('Error fetching messages : ', error);
        }
    };

    const sendMessage = async() => {
        try{
            await fetch('http://localhost:5000/messages', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({user, message}),
            });

            setUser('');
            setMessage('');
            fetchMessages();

        }catch(error){
            console.error('Error sending message : ', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        
        const interval = setInterval(() => {
            fetchMessages();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

  return (
    <div>
        <h1>Chat SphereX</h1>
        <hr />
        <ul>
            {messages.map((message) => (
            <span>
                <li key={message._id}>
                    <strong>{message.user} - </strong> {message.message} 
                </li>
            </span>
        ))}
        </ul>
        <div>
            <input
                type="text"
                placeholder='Your Name : '
                value={user}
                onChange={(e) => setUser(e.target.value)}
            />
            <input
                type="text"
                placeholder='Type your message...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage} >Send</button>
        </div>
    </div>
  );
};

export default ChatRoom;