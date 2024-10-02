import { setTimeout } from "node:timers";
import {type ChatInputCommandInteraction } from "discord.js";
import type { Command } from "../../../structures/command.js";

export default {
  data: {
    name: "real-ping",
    description: "Pong!",
  },
  opt: {
    userPermissions: ["SendMessages"],
    botPermissions: ["SendMessages"],
    category: "General",
    cooldown: 5,
  },
  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    await interaction.reply({
        content: "🏓 Pinging...",
        fetchReply: true,
      });
    
    setTimeout(() => {}, 3_000);
    
    // edit the reply
    await interaction.editReply({
        content: `Pong 🏓! \nRoundtrip Latency is 3 ms. \nWebsocket Heartbeat is 2 ms`,
    });

  },
} satisfies Command;
