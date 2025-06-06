import { openai } from '@ai-sdk/openai';
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

import getTools from "./ai-tools";
import Constants from 'expo-constants';

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are an AI for a music store.

There are products available for purchase. You can recommend a product to the user.
You can get a list of products by using the getProducts tool.

You also have access to a fulfillment server that can be used to purchase products.
You can get a list of products by using the getInventory tool.
You can purchase a product by using the purchase tool.

After purchasing a product tell the customer they've made a great choice and their order will be processed soon and they will be playing their new guitar in no time.
`;


export const generateAPIUrl = (relativePath: string) => {
  //const origin = Constants.experienceUrl.replace('exp://', 'http://');
  const origin = Constants.experienceUrl
  console.log("origin",origin)
  console.log(process.env.NODE_ENV)
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  if (process.env.NODE_ENV === 'development') {
    return origin.concat(path);
  }

  return path;

  /*
  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL environment variable is not defined',
    );
  }
  

  return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
  */
};

/*
export const genAIResponse = createServerFn({ method: "POST", response: "raw" })
  .validator(
    (d: {
      messages: Array<Message>;
      systemPrompt?: { value: string; enabled: boolean };
    }) => d
  )
  .handler(async ({ data }) => {
    const messages = data.messages
      .filter(
        (msg) =>
          msg.content.trim() !== "" &&
          !msg.content.startsWith("Sorry, I encountered an error")
      )
      .map((msg) => ({
        role: msg.role,
        content: msg.content.trim(),
      }));

    const tools = await getTools();

    try {
      const result = streamText({
        model: anthropic("claude-3-5-sonnet-latest"),
        messages,
        system: SYSTEM_PROMPT,
        maxSteps: 20,
        tools,
      });

      return result.toDataStreamResponse();
    } catch (error) {
      console.error("Error in genAIResponse:", error);
      if (error instanceof Error && error.message.includes("rate limit")) {
        return { error: "Rate limit exceeded. Please try again in a moment." };
      }
      return {
        error:
          error instanceof Error ? error.message : "Failed to get AI response",
      };
    }
  });
*/