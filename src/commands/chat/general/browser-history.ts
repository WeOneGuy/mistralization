import {ApplicationCommandOptionType, type ChatInputCommandInteraction } from "discord.js";
import { complete } from "../../../misc/mistral_api.js";
import type { Command } from "../../../structures/command.js";

export default {
  data: {
    name: "browser-history",
    description: "See user's browser history",
    options: [
      {
        name: "user",
        description: "User",
        type: ApplicationCommandOptionType.User,
        required: true
      },
      {
        name: "additional-info",
        description: "Additional information",
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ],
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
    const additionalInfo = interaction.options.getString("additional-info", true)

    let prompt: string

    if (additionalInfo) {
      prompt = `target: ${user.username}\nAdditional information: ${additionalInfo}`
    } else {
      prompt = `target: ${user.username}`
    }

    const response = await complete(prompt, "Act as a browser and return the user's browser history. It must be based on additional information provided by the user. Return only the urls with headers. Without any notes and explainations. Response in Russian")

    await interaction.editReply({
        content: response
    });

  },} satisfies Command;
