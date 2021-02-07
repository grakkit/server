"use strict";
/// <reference path="./env" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.core = exports.server = exports.plugin = exports.manager = exports.event = exports.command = exports.type = exports.session = exports.unzip = exports.transfer = exports.task = exports.sync = exports.simplify = exports.root = exports.reload = exports.format = exports.file = exports.fetch = exports.dev = exports.data = exports.chain = exports.array = void 0;
const base = require("@grakkit/core");
var core_1 = require("@grakkit/core");
Object.defineProperty(exports, "array", { enumerable: true, get: function () { return core_1.array; } });
Object.defineProperty(exports, "chain", { enumerable: true, get: function () { return core_1.chain; } });
Object.defineProperty(exports, "data", { enumerable: true, get: function () { return core_1.data; } });
Object.defineProperty(exports, "dev", { enumerable: true, get: function () { return core_1.dev; } });
Object.defineProperty(exports, "fetch", { enumerable: true, get: function () { return core_1.fetch; } });
Object.defineProperty(exports, "file", { enumerable: true, get: function () { return core_1.file; } });
Object.defineProperty(exports, "format", { enumerable: true, get: function () { return core_1.format; } });
Object.defineProperty(exports, "reload", { enumerable: true, get: function () { return core_1.reload; } });
Object.defineProperty(exports, "root", { enumerable: true, get: function () { return core_1.root; } });
Object.defineProperty(exports, "simplify", { enumerable: true, get: function () { return core_1.simplify; } });
Object.defineProperty(exports, "sync", { enumerable: true, get: function () { return core_1.sync; } });
Object.defineProperty(exports, "task", { enumerable: true, get: function () { return core_1.task; } });
Object.defineProperty(exports, "transfer", { enumerable: true, get: function () { return core_1.transfer; } });
Object.defineProperty(exports, "unzip", { enumerable: true, get: function () { return core_1.unzip; } });
/** A session container for this module. */
exports.session = Object.assign({}, base.session, {
    event: new Map()
});
/** Imports the specified type from java. */
function type(name) {
    if (exports.session.type.has(name)) {
        return exports.session.type.get(name);
    }
    else {
        const value = Java.type(name);
        exports.session.type.set(name, value);
        return value;
    }
}
exports.type = type;
const Bukkit = type('org.bukkit.Bukkit');
const EventPriority = type('org.bukkit.event.EventPriority');
const HandlerList = type('org.bukkit.event.HandlerList');
const Listener = Java.extend(type('org.bukkit.event.Listener'), {});
/** Registers a custom command to the server. */
function command(options) {
    exports.plugin.register(options.namespace || exports.plugin.getName(), options.name, options.aliases || [], options.permission || '', options.message || '', (sender, label, args) => {
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
            return [];
        }
    });
}
exports.command = command;
/** Attaches one or more listeners to a server event. */
function event(name, ...listeners) {
    let list;
    if (exports.session.event.has(name)) {
        list = exports.session.event.get(name);
    }
    else {
        list = new Set();
        exports.session.event.set(name, list);
    }
    if (list.size === 0) {
        const emitter = type(name);
        exports.manager.registerEvent(
        // @ts-expect-error
        emitter.class, instance, EventPriority.HIGHEST, 
        // @ts-expect-error
        (x, signal) => {
            if (signal instanceof emitter) {
                try {
                    for (const listener of list)
                        listener(signal);
                }
                catch (error) {
                    console.error(`An error occured while attempting to handle the "${name}" event!`);
                    console.error(error.stack || error.message || error);
                }
            }
        }, exports.plugin);
    }
    for (const listener of listeners)
        list.has(listener) || list.add(listener);
}
exports.event = event;
/** The plugin manager instance. */
exports.manager = Bukkit.getPluginManager();
/** This plugin's instance. */
// @ts-expect-error
exports.plugin = exports.manager.getPlugin('grakkit');
/** The server instance. */
exports.server = Bukkit.getServer();
/** @deprecated */
exports.core = Object.assign({}, base.core, {
    command,
    event,
    manager: exports.manager,
    plugin: exports.plugin,
    server: exports.server,
    type
});
command({
    name: 'js',
    permission: `${exports.plugin.getName()}.command.js`,
    message: `\xa7cYou do not have the required permission to run this command!`,
    execute(sender, ...args) {
        sender.sendMessage(base.dev.execute(sender, ...args));
    },
    tabComplete(sender, ...args) {
        return base.dev.complete(sender, ...args);
    }
});
Core.hook(() => {
    HandlerList.unregisterAll(exports.plugin);
});
const instance = new Listener();
Object.assign(globalThis, {
    core: exports.core,
    manager: exports.manager,
    plugin: exports.plugin,
    server: exports.server
});
