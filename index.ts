/// <reference path="./library/globals.d.ts" />

import { type } from './library/type';
import { event } from './library/event';
import { reload } from './library/reload';
import { command } from './library/command';

//@ts-expect-error
import * as meta from '@grakkit/core';
import * as platform from './library/platform';

export const core: typeof meta.core &
   typeof platform & {
      command: typeof command;
      event: typeof event;
      reload: typeof reload;
      type: typeof type;
   } = Object.assign({}, meta.core, platform, { command, event, reload, type });

Object.assign(globalThis, platform, { core });

command({
   name: 'js',
   permission: `${core.plugin.getName()}.command.js`,
   message: `\xa7cYou do not have the required permission to run this command!`,
   execute (sender, ...args) {
      sender.sendMessage(core.console.execute(sender, ...args));
   },
   tabComplete (sender, ...args) {
      return core.console.complete(sender, ...args);
   }
});
