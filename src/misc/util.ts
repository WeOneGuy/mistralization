import type { PathLike } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  PermissionsBitField,
  type RESTPostAPIApplicationCommandsJSONBody,
  type APIEmbed,
  type Message,
  type PermissionResolvable,
  type PermissionsString,
} from "discord.js";

/**
 * This function gets the default export from a file.
 *
 * @param path - The path to the file
 */
export async function dynamicImport(path: string): Promise<any> {
  const module = await import(pathToFileURL(path).toString());
  return module?.default;
}

/**
 * Loads all the structures from the provided directory path.
 *
 * @param path - The directory path to load the structures from
 * @param props - The properties to check if the structure is valid
 */
export async function loadStructures(path: PathLike, props: [string, string]): Promise<any[]> {
  const fileData: any[] = [];

  async function searchFiles(currentPath: string) {
    const entries = await readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);

      if (entry.isDirectory()) {
        await searchFiles(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        const data = await dynamicImport(fullPath);

        if (props[0] in data && props[1] in data) {
          fileData.push(data);
        } else {
          console.warn(
            `\u001B[33m The file at ${fullPath} is missing a required ${props[0]} or ${props[1]} property.`
          );
        }
      }
    }
  }

  await searchFiles(path.toString());
  return fileData;
}


/**
 * Loads a single structure from the provided file path.
 *
 * @param filePath - The path to the file to load
 * @param props - The properties to check if the structure is valid
 * @returns The loaded structure or null if invalid
 */
export async function loadStructure(filePath: string, props: [string, string]): Promise<any[]> {
  const fileData: any[] = [];

  if (!filePath.endsWith('.js')) {
    console.warn(`\u001B[33m The file at ${filePath} is not a JavaScript file.`);
    return fileData;
  }

  const data = await dynamicImport(filePath);

  if (props[0] in data && props[1] in data) {
    fileData.push(data);
  } else {
    console.warn(
      `\u001B[33m The structure at ${filePath} is missing a required ${props[0]} or ${props[1]} property.`
    );
  }

  return fileData;
}

/**
 * Loads all commands from the provided directory and its subdirectories.
 *
 * @param dir - The directory path to load the commands from
 * @returns An array of loaded commands
 */

export async function loadCommands(dir: string): Promise<RESTPostAPIApplicationCommandsJSONBody[]> {
  const commandData: RESTPostAPIApplicationCommandsJSONBody[] = [];

  async function searchCommands(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await searchCommands(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        const command = await dynamicImport(fullPath);

        if ('data' in command && 'execute' in command) {
          commandData.push(command.data);
        } else {
          console.warn(
            `\u001B[33m The command at ${fullPath} is missing a required "data" or "execute" property.`
          );
        }
      }
    }
  }

  await searchCommands(dir);
  return commandData;
}


/**
 * Shows the missing permissions.
 *
 * @param memberPerms - The member's permissions
 * @param requiredPerms - The required permissions
 */
export function missingPerms(
  memberPerms: PermissionResolvable,
  requiredPerms: PermissionResolvable,
): PermissionsString[] {
  return new PermissionsBitField(memberPerms).missing(requiredPerms);
}

/**
 * This function shortens a string.
 *
 * @param text - The text to be shortened
 * @param total - The total length of the text
 */
export function ellipsis(text: string, total: number): string {
  if (text.length <= total) {
    return text;
  }

  const keep = total - 3;
  if (keep < 1) return text.slice(0, total);
  return `${text.slice(0, keep)}...`;
}

export function truncateEmbed(embed: APIEmbed): APIEmbed {
  return {
    ...embed,
    description: embed.description ? ellipsis(embed.description, 4_096) : undefined,
    title: embed.title ? ellipsis(embed.title, 256) : undefined,
    author: embed.author
      ? {
          ...embed.author,
          name: ellipsis(embed.author.name, 256),
        }
      : undefined,
    footer: embed.footer
      ? {
          ...embed.footer,
          text: ellipsis(embed.footer.text, 2_048),
        }
      : undefined,
    fields: embed.fields
      ? embed.fields
          .map(field => ({
            ...field,
            name: ellipsis(field.name, 256),
            value: ellipsis(field.value, 1_024),
          }))
          .slice(0, 25)
      : [],
  } as const;
}

export function formatMessageToEmbed(message: Message<true>) {
  const { author, attachments, content, createdAt } = message;

  let embed = truncateEmbed({
    author: {
      name: `${author.discriminator === "0" ? author.username : author.tag} (${author.id})`,
      icon_url: author.displayAvatarURL(),
    },
    description: content.length ? content : "<No message content>",
    timestamp: createdAt.toISOString(),
    color: 0x2f3136,
  });

  const attachment = attachments.first();
  const attachmentIsImage = ["image/jpeg", "image/png", "image/gif"].includes(attachment?.contentType ?? "");
  const attachmentIsImageNaive = [".jpg", ".png", ".gif"].some(ext => attachment?.name?.endsWith(ext));

  if (attachment && (attachmentIsImage || attachmentIsImageNaive)) {
    embed = {
      ...embed,
      image: {
        url: attachment.url,
      },
    };
  }

  return embed;
}
