import React, { useState, useEffect } from "react";

const Chat = () => {
  const [username, setUsername] = useState("");
  const [tempUsername, setTempUsername] = useState(""); // Temporary input for username
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [ws, setWs] = useState(null);

  // Establish WebSocket connection once the username is confirmed
  useEffect(() => {
    if (username) {
      const socket = new WebSocket(`ws://localhost:8000/ws/chat/${username}/`);

      socket.onopen = () => {
        console.log("WebSocket connected");
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setNotifications((prev) => [...prev, data.message]);
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      setWs(socket);

      return () => {
        socket.close();
      };
    }
  }, [username]);

  const handleSendMessage = () => {
    if (ws && recipient && message) {
      ws.send(JSON.stringify({ recipient, message }));
      setMessage(""); // Clear the message input
    }
  };

  const handleUsernameSubmit = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      {!username ? (
        <div>
          <h2>Enter Your Username</h2>
          <input
            type="text"
            placeholder="Your username"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button
            onClick={handleUsernameSubmit}
            style={{ padding: "10px 20px", marginTop: "10px" }}
          >
            Submit
          </button>
        </div>
      ) : (
        <div>
          <h2>Chat</h2>
          <input
            type="text"
            placeholder="Recipient username"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <textarea
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button onClick={handleSendMessage} style={{ padding: "10px 20px" }}>
            Send Message
          </button>

          <h3>Notifications</h3>
          <ul>
            {notifications.map((notif, index) => (
              <li key={index}>{notif}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Chat;

