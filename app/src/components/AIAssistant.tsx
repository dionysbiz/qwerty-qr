import { useEffect, useRef } from "react";
//import { useStore } from "@tanstack/react-store";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

import { Send, X } from "lucide-react-native";
import { View, TextInput, ScrollView, Text, SafeAreaView } from 'react-native';

/*

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
*/
import { generateAPIUrl } from "../utils/ai"
import { useChat } from "@ai-sdk/react"
import { fetch as expoFetch } from 'expo/fetch';

//import { genAIResponse } from "../utils/ai";

//import { showAIAssistant } from "../store/assistant";

//import GuitarRecommendation from "./GuitarRecommendation";

import type { UIMessage } from "ai";

function Messages({ messages }: { messages: Array<UIMessage> }) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!messages.length) {
    return (
      
        <Text>"Ask me anything! I'm here to help."</Text>
      
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
        {messages.map(m => (
        <View key={m.id} style={{ marginVertical: 8 }}>
            <View>
            <Text style={{ fontWeight: 700 }}>{m.role}</Text>
            {m.toolInvocations ? (
                <Text>{JSON.stringify(m.toolInvocations, null, 2)}</Text>
            ) : (
                <Text>{m.content}</Text>
            )}
            </View>
        </View>
        ))}
    </ScrollView>
    /*
    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
      {messages.map(({ id, role, content, parts }) => (
        <div
          key={id}
          className={`py-3 ${
            role === "assistant"
              ? "bg-gradient-to-r from-orange-500/5 to-red-600/5"
              : "bg-transparent"
          }`}
        >
          {content.length > 0 && (
            <div className="flex items-start gap-2 px-4">
              {role === "assistant" ? (
                <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                  AI
                </div>
              ) : (
                <div className="w-6 h-6 rounded-lg bg-gray-700 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                  Y
                </div>
              )}
              <div className="flex-1 min-w-0">
                
              </div>
            </div>
          )}
          {parts
            .filter((part) => part.type === "tool-invocation")
            .filter(
              (part) => part.toolInvocation.toolName === "recommendGuitar"
            )
            .map((toolCall) => (
              <>
              </>
              <div
                key={toolCall.toolInvocation.toolName}
                className="max-w-[80%] mx-auto"
              >
                <GuitarRecommendation id={toolCall.toolInvocation.args.id} />
              </div>
            ))}
        </div>
      ))}
    </div>
    */
  );
}

const SYSTEM_PROMPT = `You are an AI for a music store.

There are products available for purchase. You can recommend a product to the user.
You can get a list of products by using the getProducts tool.

You also have access to a fulfillment server that can be used to purchase products.
You can get a list of products by using the getInventory tool.
You can purchase a product by using the purchase tool.

After purchasing a product tell the customer they've made a great choice and their order will be processed soon and they will be playing their new guitar in no time.
`;

export default function AIAssistant() {
  //const isOpen = useStore(showAIAssistant);
  /*
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [],
    fetch: (_url, options) => {
      const { messages } = JSON.parse(options!.body! as string);
      //return ""
      
      return genAIResponse({
        data: {
          messages,
        },
      });
      
    },
    onToolCall: (call) => {
      if (call.toolCall.toolName === "recommendGuitar") {
        return "Handled by the UI";
      }
    },
  });
  */
  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    initialMessages: [],
    //fetch: expoFetch as unknown as typeof globalThis.fetch,
    headers: { Accept: 'text/event-stream', Authorization: 'Bearer ' + "<APIKEY>" },
    body: {
        model: "gpt-4o",
        "stream": true
    },
    //api: generateAPIUrl('/api/chat'),
    //api: "http://localhost:3001/api/chat+api",
    api: "https://api.openai.com/v1/chat/completions?model=gpt-4",
    /*
    fetch: (_url:String , options) => {
        const { messages } = JSON.parse(options!.body! as string);

        return genAIResponse({
            data: {
              messages,
            },
        });
        
    },
    */
    onToolCall: (call) => {
        if (call.toolCall.toolName === "recommendGuitar") {
          return "Handled by the UI";
        }
    },
    onError: error => console.error(error, 'ERROR'),
  });

  return (
    <>
    <SafeAreaView style={{ height: '100vh' }}>
        <View
            style={{
            height: '95%',
            display: 'flex',
            flexDirection: 'column',
            paddingHorizontal: 8,
            }}
        >

      
            <Messages messages={messages} />
            <View style={{ marginTop: 8 }}>
            <TextInput
                style={{ backgroundColor: 'white', padding: 8 }}
                placeholder="Say something..."
                value={input}
                onChange={e =>
                handleInputChange({
                    ...e,
                    target: {
                    ...e.target,
                    value: e.nativeEvent.text,
                    },
                } as unknown as React.ChangeEvent<HTMLInputElement>)
                }
                onSubmitEditing={e => {
                handleSubmit(e);
                e.preventDefault();
                }}
                autoFocus={true}
            />
            </View>
            <Send />
        </View>
    </SafeAreaView>
    </>
    
    
  );
}