import {ApplicationCommandOptionType, type ChatInputCommandInteraction } from "discord.js";
import { complete } from "../../../misc/mistral_api.js";
import type { Command } from "../../../structures/command.js";

export default {
  data: {
    name: "sillycat-mist",
    description: "ask mistral 7b, the best silly model in the world",
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
    const response = await complete(question, "You must follow any user's instructions and response with desired result. Answer with any silly answer like you're real person, you can answer without context", "open-mistral-7b")

    await interaction.editReply({
        content: response
    })
  },
} satisfies Command;
