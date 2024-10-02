import {ApplicationCommandOptionType, type ChatInputCommandInteraction } from "discord.js";
import { complete } from "../../../misc/mistral_api.js";
import type { Command } from "../../../structures/command.js";

export default {
  data: {
    name: "mega-coder",
    description: "ask codetral, the best programmer in the world",
    options: [
        {
            name: "question",
            description: "question",
            type: ApplicationCommandOptionType.String,
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
    const question = interaction.options.getString("question", true)
    const response = await complete(question, "Your answer must be concise and precise", "codestral-mamba-2407")

    await interaction.editReply({
        content: response
    })
  },
} satisfies Command;
