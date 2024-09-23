import { ApplicationCommandType, type MessageContextMenuCommandInteraction } from "discord.js";
import { complete } from "../../../../misc/mistral_api.js";
import type { Command } from "../../../../structures/command.js";


export default {
  data: {
    name: "mistral-hack",
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

    const response = await complete( message.author.username + ": " + message.content, "You must write some text like you're hacking the user. It must contain fake data about the user. Return only the result.");

    if (!response) {
      await interaction.editReply({
        content: "An error occurred while generating a response",
      });
      return;
    }

    try {
      await interaction.editReply({
        content: `> ${message.content}\n${response}`,
      });
    } catch (error) {
      await interaction.editReply({
        content: `An error occurred while generating a response: ${error.message}`,
      });
      console.error(error);
    }
  }
} satisfies Command;