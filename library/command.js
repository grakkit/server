"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const platform_1 = require("./platform");
function command(options) {
    platform_1.plugin.register(options.namespace || platform_1.plugin.getName(), options.name, options.aliases || [], options.permission || '', options.message || '', (sender, label, args) => {
        try {
            if (!options.permission || sender.hasPermission(options.permission)) {
                options.execute && options.execute(sender, ...args);
            }
            else {
                sender.sendMessage(options.message || '');
            }
        }
        catch (error) {
            console.error(`An error occured while attempting to execute the "${label}" command!`);
            console.error(error.stack || error.message || error);
        }
    }, (sender, alias, args) => {
        try {
            return (options.tabComplete && options.tabComplete(sender, ...args)) || [];
        }
        catch (error) {
            console.error(`An error occured while attempting to tab-complete the "${alias}" command!`);
            console.error(error.stack || error.message || error);
        }
    });
}
exports.command = command;
