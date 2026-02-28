import { useState } from "react";
import { useCustomEventListener } from "../../services/Event";
import { Alert, Box } from "@mui/material";

function Message(props) {
    const name = props.name || '*';
    const [messages, setMessages] = useState([]);

    useCustomEventListener('message.update.' + name, (messageContainer) => {
        let messages = messageContainer.getMessages();
        if (messages.length > 0) {
            setMessages(messages);
            setTimeout(function () {
            setMessages([]);
            }, 3000);
        }
    });

    return (
        <Box className="page messages">
            {messages.map((msg, index) => {
                return <Alert variant="filled" severity={msg.type} key={index} sx={{mb: 2.5, color: "#fff"}}>{msg.message}</Alert>
            })}
        </Box>
    );
}

export default Message;
