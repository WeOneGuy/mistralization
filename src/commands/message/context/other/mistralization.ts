import {
    ApplicationCommandType,
    type MessageContextMenuCommandInteraction,
  } from "discord.js";
  import type { Command } from "../../../../structures/command.js";
  
  export default {
    data: {
      name: "mistralization",
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
  
      await interaction.deferReply();
  
      await interaction.editReply({
        content: message.content.toLowerCase().replaceAll('m', "<:Mistr:1287695946716676198>").replaceAll('м', "<:Mistr:1287695946716676198>")
      });
    },
  } satisfies Command;
  