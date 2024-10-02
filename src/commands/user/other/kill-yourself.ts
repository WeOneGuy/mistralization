import { ApplicationCommandType, type UserContextMenuCommandInteraction } from "discord.js";
import type { Command } from "../../../structures/command.js";


export default {
  data: {
    name: "kill-yourself",
    type: ApplicationCommandType.User,
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    category: "Context",
    cooldown: 5,
  },
  async execute(interaction: UserContextMenuCommandInteraction<'cached'>) {
    const user = await interaction.targetUser.fetch();

    await interaction.reply({
      content: `Убей себя <@${user.id}>`,
    });
  }
} satisfies Command;