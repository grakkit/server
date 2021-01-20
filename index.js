"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.core = void 0;
const type_1 = require("./library/type");
const event_1 = require("./library/event");
const reload_1 = require("./library/reload");
const command_1 = require("./library/command");
const meta = require("@grakkit/core");
const platform = require("./library/platform");
exports.core = Object.assign({}, meta.core, platform, { command: command_1.command, event: event_1.event, reload: reload_1.reload, type: type_1.type });
Object.assign(globalThis, platform, { core: exports.core });
command_1.command({
    name: 'js',
    permission: `${exports.core.plugin.getName()}.command.js`,
    message: `\xa7cYou do not have the required permission to run this command!`,
    execute(sender, ...args) {
        sender.sendMessage(exports.core.console.execute(sender, ...args));
    },
    tabComplete(sender, ...args) {
        return exports.core.console.complete(sender, ...args);
    }
});
