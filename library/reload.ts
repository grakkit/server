import { type } from './type';
//@ts-expect-error
import { core } from '@grakkit/core';
import { plugin } from './platform';

const HandlerList = type('org.bukkit.event.HandlerList');

export function reload () {
   HandlerList.unregisterAll(plugin);
   core.reload();
}
