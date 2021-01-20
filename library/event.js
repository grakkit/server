"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const type_1 = require("./type");
const platform_1 = require("./platform");
const EventPriority = type_1.type('org.bukkit.event.EventPriority');
const Listener = Java.extend(type_1.type('org.bukkit.event.Listener'), {});
const storage = new Map();
const instance = new Listener();
function event(name, ...listeners) {
    storage.has(name) || storage.set(name, new Set());
    const list = storage.get(name);
    if (list.size === 0) {
        const emitter = type_1.type(name);
        platform_1.manager.registerEvent(emitter.class, instance, EventPriority.HIGHEST, (_, signal) => {
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
        }, platform_1.plugin);
    }
    for (const listener of listeners)
        list.has(listener) || list.add(listener);
}
exports.event = event;
