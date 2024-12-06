import React, { useState, useEffect } from 'react';
import './Chatbot.css'; // Import your custom styles for the chatbot

const Chatbot = ({ token }) => {
    const [userMessage, setUserMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [loading, setLoading] = useState(false); // To handle loading state
    const [chatHistory, setChatHistory] = useState([]); // Variable to track chat

    // Function to send the content of chatbot.txt to the server
    const sendFileToServer = async (fileContent) => {
        try {
            const response = await fetch('http://localhost:3001/chatbot-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Pass the token for authorization
                },
                body: JSON.stringify({ fileContent }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('File sent successfully:', data);
            } else {
                console.error('Failed to send file:', data);
            }
        } catch (error) {
            console.error('Error while sending file:', error);
        }
    };

    // Function to read chatbot.txt and send its content
    const handleReadFile = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt';

        fileInput.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const fileContent = e.target.result;
                    await sendFileToServer(fileContent);
                };
                reader.readAsText(file);
            }
        };

        fileInput.click();
    };

    // Effect to handle when chat history is empty
    useEffect(() => {
        if (chatHistory.length === 0) {
            console.log('Chat history is empty. Reading chatbot.txt...');
            handleReadFile(); // Trigger file reading
        }
    }, [chatHistory]);

    // Function to handle user input and call chatbot API
    const handleSendMessage = async () => {
        if (userMessage.trim()) {
            // Add user message
            setChatMessages((prevMessages) => [
                ...prevMessages,
                { text: userMessage, sender: 'user' },
            ]);
            setLoading(true);

            try {
                // Make API call to get the chatbot's response
                const response = await fetch('http://localhost:3001/chatbot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Pass the token for authorization
                    },
                    body: JSON.stringify({ message: userMessage }),
                });

                const data = await response.json();
                if (response.ok) {
                    // Add bot's response to the chat
                    setChatMessages((prevMessages) => [
                        ...prevMessages,
                        { text: data.reply || 'I am here to help you!', sender: 'bot' },
                    ]);
                } else {
                    // Add error message if API call fails
                    setChatMessages((prevMessages) => [
                        ...prevMessages,
                        { text: 'Sorry, I could not understand that.', sender: 'bot' },
                    ]);
                }
            } catch (error) {
                console.error('Error:', error);
                setChatMessages((prevMessages) => [
                    ...prevMessages,
                    { text: 'Sorry, something went wrong. Please try again.', sender: 'bot' },
                ]);
            } finally {
                setLoading(false);
            }
        }

        // Clear user message input
        setUserMessage('');
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h3>Chatbot</h3>
            </div>
            <div className="chatbot-messages">
                {chatMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chatbot-message ${msg.sender}`}
                    >
                        <p>{msg.text}</p>
                    </div>
                ))}
                {loading && (
                    <div className="chatbot-message bot">
                        <p>Loading...</p>
                    </div>
                )}
            </div>
            <div className="chatbot-input">
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage} disabled={loading}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
