import { plugin } from './platform';
import { obcCommandSender } from '@grakkit/server-classes';

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
         }
      }
   );
}
