"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reload = void 0;
const type_1 = require("./type");
const core_1 = require("@grakkit/core");
const platform_1 = require("./platform");
const HandlerList = type_1.type('org.bukkit.event.HandlerList');
function reload() {
    HandlerList.unregisterAll(platform_1.plugin);
    core_1.core.reload();
}
exports.reload = reload;
