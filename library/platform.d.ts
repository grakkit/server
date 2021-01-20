import { obcCommandSender, obpPlugin } from '@grakkit/server-classes';
export declare type executor = (sender: obcCommandSender, name: string, args: string[]) => any;
export declare type tabCompleter = (sender: obcCommandSender, name: string, args: string[]) => string[];
export interface Main extends obpPlugin {
    reload(): void;
    register(namespace: string, name: string, aliases: string[], permission: string, message: string, executor: executor, tabCompleter: tabCompleter): void;
}
export declare const server: import("@grakkit/server-classes").obServer;
export declare const manager: import("@grakkit/server-classes").obpPluginManager;
export declare const plugin: Main;
