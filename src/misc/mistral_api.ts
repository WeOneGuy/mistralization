import process from 'node:process';
import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY
});

export async function complete(prompt: string, system_prompt: string, model: string = "mistral-large-latest") {
  const result = await mistral.chat.complete({
    model,
    messages: [
      {
        content: system_prompt,
        role: "system",
      },
      {
        content: prompt,
        role: "user",
      }
    ],
  });

  if (!result.choices || !result) {
    return;
  }

  return result.choices[0].message.content;
}