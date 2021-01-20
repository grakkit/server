import { type } from './type';
import { events } from './overloads';
import { manager, plugin } from './platform';

const EventPriority = type('org.bukkit.event.EventPriority');
const Listener = Java.extend(type('org.bukkit.event.Listener'), {});

const storage: Map<keyof events, Set<(event: any) => void>> = new Map();
const instance = new Listener();

export function event<X extends keyof events> (name: X, ...listeners: ((event: events[X]) => void)[]) {
   storage.has(name) || storage.set(name, new Set());
   const list = storage.get(name);
   if (list.size === 0) {
      const emitter = type(name);
      manager.registerEvent(
         emitter.class,
         instance,
         EventPriority.HIGHEST,
         //@ts-expect-error
         (_: any, signal: any) => {
            //@ts-expect-error
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
