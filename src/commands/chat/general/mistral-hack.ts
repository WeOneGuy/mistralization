import {ApplicationCommandOptionType, type ChatInputCommandInteraction } from "discord.js";
import { complete } from "../../../misc/mistral_api.js";
import type { Command } from "../../../structures/command.js";

export default {
  data: {
    name: "mistral-hack",
    description: "Hacks the provided user",
    options: [
        {
            name: "user",
            description: "user",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ]
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    category: "General",
    cooldown: 5,
  },
  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.deferReply()
    const user = interaction.options.getUser("user", true)
    await interaction.deferReply({
        fetchReply: true,
      });
  
      const response = await complete(user.username, "You must write some text like you're hacking the user.  Return only the result.");
  
      if (!response) {
        await interaction.editReply({
          content: "An error occurred while generating a response",
        });
        return;
      }
  
      try {
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
