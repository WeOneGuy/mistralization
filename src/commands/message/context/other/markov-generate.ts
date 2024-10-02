import { ApplicationCommandType, type MessageContextMenuCommandInteraction } from "discord.js";
import { MarkovChain } from "kurwov";
import type { Command } from "../../../../structures/command.js";

/**
 * Generates an array of random segments from a given message.
 *
 * @param {{ content: string }} message - The message to generate segments from.
 * @param {number} [segmentCount] - The number of segments to generate.
 * @returns {string[]} An array of random segments of the message.
 */
function getRandomSegments(message: { content: string }, segmentCount = 5) {
  const words = message.content.split(/\s+/);
  const segments: string[] = [];

  // Check if the message is empty
  if (words.length === 0) {
    return [];
  }

  // Check if segmentCount is a valid number
  if (typeof segmentCount !== "number" || segmentCount <= 0) {
    throw new Error("segmentCount should be a positive number");
  }

  // Generate random segments
  for (let index = 0; index < segmentCount; index++) {
    const start = Math.floor(Math.random() * words.length);
    const length = Math.floor(Math.random() * (words.length - start)) + 1; // Length of segment is at least 1
    const segment = words.slice(start, start + length).join(" ");
    segments.push(segment);
  }

  return segments;
}

export default {
  data: {
    name: "markov-generate",
    type: ApplicationCommandType.Message,
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    category: "Context",
    cooldown: 5,
  },
  async execute(interaction: MessageContextMenuCommandInteraction<"cached">) {
    const message = await interaction.targetMessage.fetch();

    await interaction.deferReply({
      fetchReply: true,
    });

    const sentences = getRandomSegments(message);
    if (!sentences) {
      throw new Error("Sentences is null");
    }

    console.log(sentences);

    const chain = new MarkovChain(sentences);
    try {
      if (!chain) {
        throw new Error("Markov Chain is null");
      }

      const response = chain.generate(25);
      if (!response) {
        throw new Error("Markov Chain response is null");
      }

      await interaction.editReply({
        content: response,
      });
    } catch (error) {
      await interaction.editReply({
        content: `An error occurred while generating a response: ${error.message}`,
      });
      console.error(error);
    }
  },
} satisfies Command;
