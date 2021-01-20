import { type } from './type';
import { obcCommandSender, obpPlugin } from '@grakkit/server-classes';

export type executor = (sender: obcCommandSender, name: string, args: string[]) => any;
export type tabCompleter = (sender: obcCommandSender, name: string, args: string[]) => string[];

export interface Main extends obpPlugin {
   reload(): void;
   register(
      namespace: string,
      name: string,
      aliases: string[],
      permission: string,
      message: string,
      executor: executor,
      tabCompleter: tabCompleter
   ): void;
}

const Bukkit = type('org.bukkit.Bukkit');

export const server = Bukkit.getServer();
export const manager = server.getPluginManager();
//@ts-expect-error
export const plugin: Main = manager.getPlugin('grakkit');
