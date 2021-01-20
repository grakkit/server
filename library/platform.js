"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.manager = exports.server = void 0;
const type_1 = require("./type");
const Bukkit = type_1.type('org.bukkit.Bukkit');
exports.server = Bukkit.getServer();
exports.manager = exports.server.getPluginManager();
exports.plugin = exports.manager.getPlugin('grakkit');
