/// <reference path="./env" />

import { types } from './types';
import { events } from './events';
import { obcCommandSender, obpPlugin } from '@grakkit/server-classes';

import * as base from '@grakkit/core';

export {
   array,
   chain,
   data,
   dev,
   fetch,
   file,
   format,
   future,
   record,
   reload,
   response,
   root,
   simplify,
   sync,
   task,
   transfer,
   unzip
} from '@grakkit/core';

/** A set of listeners attached to an event. */
export type cascade = Set<(event: any) => void>;

/** The main class of this plugin. */
export interface main extends obpPlugin {
   register(
      namespace: string,
      name: string,
      aliases: string[],
      permission: string,
      message: string,
      executor: (sender: obcCommandSender, name: string, args: string[]) => any,
      tabCompleter: (sender: obcCommandSender, name: string, args: string[]) => string[]
   ): void;
}

/** A session container for this module. */
export const session: {
   data: typeof base.session.data;
   event: Map<keyof events, cascade>;
   poly: typeof base.session.poly;
   task: typeof base.session.task;
   type: Map<keyof types, any>;
} = Object.assign({}, base.session, {
   event: new Map()
});

/** Imports the specified type from java. */
export function type<X extends keyof types> (name: X): types[X] {
   if (session.type.has(name)) {
      return session.type.get(name);
   } else {
      const value = Java.type(name);
      session.type.set(name, value);
      return value;
   }
}

const Bukkit = type('org.bukkit.Bukkit');
const EventPriority = type('org.bukkit.event.EventPriority');
const HandlerList = type('org.bukkit.event.HandlerList');
const Listener = Java.extend(type('org.bukkit.event.Listener'), {});

/** Registers a custom command to the server. */
export function command (options: {
   name: string;
   message?: string;
   aliases?: string[];
   execute?: (sender: obcCommandSender, ...args: string[]) => void;
   namespace?: string;
   permission?: string;
   tabComplete?: (sender: obcCommandSender, ...args: string[]) => string[];
}) {
   plugin.register(
      options.namespace || plugin.getName(),
      options.name,
      options.aliases || [],
      options.permission || '',
      options.message || '',
      (sender, label, args) => {
         try {
            if (!options.permission || sender.hasPermission(options.permission)) {
               options.execute && options.execute(sender, ...args);
            } else {
               sender.sendMessage(options.message || '');
            }
         } catch (error) {
            console.error(`An error occured while attempting to execute the "${label}" command!`);
            console.error(error.stack || error.message || error);
         }
      },
      (sender, alias, args) => {
         try {
            return (options.tabComplete && options.tabComplete(sender, ...args)) || [];
         } catch (error) {
            console.error(`An error occured while attempting to tab-complete the "${alias}" command!`);
            console.error(error.stack || error.message || error);
            return [];
         }
      }
   );
}

/** Attaches one or more listeners to a server event. */
export function event<X extends keyof events> (name: X, ...listeners: ((event: InstanceType<events[X]>) => void)[]) {
   let list: cascade;
   if (session.event.has(name)) {
      list = session.event.get(name);
   } else {
      list = new Set();
      session.event.set(name, list);
   }
   if (list.size === 0) {
      const emitter = type(name);
      manager.registerEvent(
         // @ts-expect-error
         emitter.class,
         instance,
         EventPriority.HIGHEST,
         // @ts-expect-error
         (x: any, signal: any) => {
            if (signal instanceof emitter) {
               try {
                  for (const listener of list) listener(signal);
               } catch (error) {
                  console.error(`An error occured while attempting to handle the "${name}" event!`);
                  console.error(error.stack || error.message || error);
               }
            }
         },
         plugin
      );
   }
   for (const listener of listeners) list.has(listener) || list.add(listener);
}

/** The plugin manager instance. */
export const manager = Bukkit.getPluginManager();

/** This plugin's instance. */
// @ts-expect-error
export const plugin: main = manager.getPlugin('grakkit');

/** The server instance. */
export const server = Bukkit.getServer();

/** @deprecated */
export const core = Object.assign({}, base.core, {
   command,
   event,
   manager,
   plugin,
   server,
   type
});

command({
   name: 'js',
   permission: `${plugin.getName()}.command.js`,
   message: `\xa7cYou do not have the required permission to run this command!`,
   execute (sender, ...args) {
      sender.sendMessage(base.dev.execute(sender, ...args));
   },
   tabComplete (sender, ...args) {
      return base.dev.complete(sender, ...args);
   }
});

Core.hook(() => {
   HandlerList.unregisterAll(plugin);
});

const instance = new Listener();

Object.assign(globalThis, {
   // @ts-expect-error
   core,
   manager,
   plugin,
   server
});
