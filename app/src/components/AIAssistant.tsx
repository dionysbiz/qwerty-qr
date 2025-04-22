import { useEffect, useRef } from "react";
//import { useStore } from "@tanstack/react-store";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

import { Send, X } from "lucide-react-native";
import { View, TextInput, ScrollView, Text, SafeAreaView } from 'react-native';


import { generateAPIUrl } from "../utils/ai"
import { useChat } from "@ai-sdk/react"
import { fetch as expoFetch } from 'expo/fetch';

//import { genAIResponse } from "../utils/ai";

//import { showAIAssistant } from "../store/assistant";

//import GuitarRecommendation from "./GuitarRecommendation";

import type { UIMessage } from "ai";

import { z } from 'zod';
import ChatRoom from "./GiftedChat"

const SYSTEM_PROMPT = `You are an AI for a music store.

There are products available for purchase. You can recommend a product to the user.
You can get a list of products by using the getProducts tool.

You also have access to a fulfillment server that can be used to purchase products.
You can get a list of products by using the getInventory tool.
You can purchase a product by using the purchase tool.

After purchasing a product tell the customer they've made a great choice and their order will be processed soon and they will be playing their new guitar in no time.
`;

export default function AIAssistant() {

  return (
    <>
    <View
            style={{
            height: '70%',
            display: 'flex',
            flexDirection: 'column',
            paddingHorizontal: 8,
            }}
        >
    <ChatRoom />
    </View>
    </>
    
    
  );
}