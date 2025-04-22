import React, { useState, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
//import axios from 'axios';

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);

  const onSend = useCallback(async (newMessages = []) => {
    const input = newMessages[0].text;
    const userMessage = {
      _id: Math.random().toString(),
      text: input,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'User',
      },
    };

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [userMessage])
    );

    try {

      const response = await fetch("https://adkagentapi-dev.dionys.xyz/run", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          app_name: 'ollama_agent',
          user_id: 'u_123',
          session_id: 's_123',
          new_message: {
            role: 'user',
            parts: [{ text: input }],
          },
          streaming: false,
        })
      }
      ).then((response2FromBraintreeServer) => response2FromBraintreeServer.json()
      ).then((json) => {
        console.log("Response of createTransaction")
        console.log(json[0]?.content?.parts[0]);

        const replyText = json[0]?.content?.parts[0]?.text || 'No response';

        const botMessage = {
          _id: Math.random().toString(),
          text: replyText,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Bot',
          },
        };

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [botMessage])
        );
      })

    } catch (error) {
      const errorMessage = {
        _id: Math.random().toString(),
        text: 'Error: Could not get response.' + error,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bot',
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [errorMessage])
      );
    }
  }, []);

  return <GiftedChat messages={messages} onSend={(msgs) => onSend(msgs)} user={{ _id: 1 }} />;
};