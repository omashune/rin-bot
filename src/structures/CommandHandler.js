// recoded version of https://github.com/The-SourceCode/Open-SourceBot/blob/master/src/handler/Handler.js

const { VK } = require('vk-io');
const fs = require('fs');
const logger = require('logplease').create('Rin', { filename: 'logs.txt' });

const Command = require('./Command');

module.exports = class CommandHandler {

    /**
     * @description Create a new instance of CommandHandler
     * @param {VK} vk The VK instance
     */
    constructor(vk) {
        this.vk = vk;

        this.commands = new Map();
        this.aliases = new Map();
    }

    load() {
        fs.readdirSync('./src/commands/')
            .filter(file => file.endsWith('.js'))
            .map(commandFile => require(`../commands/${commandFile}`))
            .forEach(commandFile => {
                if (!(commandFile.prototype instanceof Command)) return;

                this._loadCommand(new commandFile());
            });

        this._register();
    }

    /**
     * @description Load a command
     * @param {Command} cmd The command that needs to be loaded
     */
    _loadCommand(cmd) {
        if (this.commands.has(cmd.name) || this.aliases.has(cmd.name)) {
            throw new Error(
                `Can't load command, the name '${cmd.name}' is already used as a command name or alias`,
            );
        }

        this.commands.set(cmd.name, cmd);

        if (cmd.aliases != null) {
            for (const alias of cmd.aliases) {
                if (this.commands.has(alias) || this.aliases.has(alias)) {
                    throw new Error(
                        `Can't load command, the alias '${alias}' is already used as a command name or alias`,
                    );
                }

                this.aliases.set(alias, cmd);
            }
        }

    }

    _register() {
        const { updates } = this.vk;

        updates.use((ctx, next) => {
            if (ctx.isGroup) return;
            
            if (ctx.messagePayload) {
                ctx.text = ctx.messagePayload.command;
            }

            return next();
        });

        updates.on('message', async ctx => {
            const [command, ...args] = ctx.text
                .slice(1)
                .split(' ');

            const cmd = this.commands.get(command.toLowerCase()) ||
                this.aliases.get(command.toLowerCase());

            if (!cmd) return;

            try {
                cmd.execute(ctx, args, logger);
            } catch (err) {
                console.error(err);
            }
        });
    }

}