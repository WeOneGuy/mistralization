import {ApplicationCommandOptionType, type ChatInputCommandInteraction } from "discord.js";
import { pixtral_complete } from "../../../misc/mistral_api.js";
import type { Command } from "../../../structures/command.js";

export default {
  data: {
    name: "image-mist",
    description: "ask pixtral, the best model in the world",
    options: [
        {
            name: "question",
            description: "question",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "image",
            description: "image",
            type: ApplicationCommandOptionType.Attachment,
            required: false
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
    const image = interaction.options.getAttachment("image", true)
    const response = await pixtral_complete(question, "Your answer must be concise and precise", image?.url)

    await interaction.editReply({
        content: image.proxyURL + "\n" + response
    })
  },
} satisfies Command;
