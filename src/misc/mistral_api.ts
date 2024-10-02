import process from 'node:process';
import { Mistral } from "@mistralai/mistralai";

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY
});

export async function complete(prompt: string, system_prompt: string, model: string = "mistral-large-latest", temperature: number = 0.7) {
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
    temperature
  });

  if (!result.choices || !result) {
    return;
  }

  return result.choices[0].message.content;
}

export async function pixtral_complete(prompt: string, system_prompt: string, image_url: string, temperature: number = 0.7) {
  const result = await mistral.chat.complete({
    model: "pixtral-12b-2409",
    messages: [
      {
        role: "system",
        content: system_prompt,
      },
      {
        role: "user",
        content: [
          {
            "type": "text",
            "text": prompt
          },
          {
            "type": "image_url",
            "imageUrl": image_url
          }
        ]

      }
    ],
    temperature
  });

  if (!result.choices || !result) {
    return;
  }

  return result.choices[0].message.content;
}