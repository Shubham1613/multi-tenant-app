import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Typography, Box } from "@mui/material";

const Notifications = ({ username }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to WebSocket server with the username
    const ws = new WebSocket(`ws://localhost:8000/ws/notifications/${username}/`);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data.message]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close(); // Cleanup WebSocket connection when component unmounts
    };
  }, [username]);

  return (
    <Box sx={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <List>
        {notifications.map((notif, index) => (
          <ListItem key={index} divider>
            <ListItemText primary={notif} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Notifications;

