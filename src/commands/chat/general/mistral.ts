import {type ChatInputCommandInteraction } from "discord.js";
import type { Command } from "../../../structures/command.js";

export default {
  data: {
    name: "mistral",
    description: "Mistral Pong!",
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    category: "General",
    cooldown: 5,
  },
  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.reply({
      content: "Mistral AI is a company that originally trained a language model which was then open sourced and is now provided by together.ai as the model provider for DuckDuckGo's privacy-focused anonymous chat service. Mistral AI did not have any role in the development of the privacy-focused service and does not have access to any of the chats made through DuckDuckGo.",
      fetchReply: true,
    });
  },
} satisfies Command;
