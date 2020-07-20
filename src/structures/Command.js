module.exports = class Command {

    /**
     * @description Create a new command
     * @param {string} name The name of the command
     * @param {object} options The options for this command
     * @param {Array<string>} [options.aliases] Aliases of this command
     */
    constructor(name, options = {}) {
        if (typeof name !== 'string') throw new TypeError('Name must be a string');

        this.name = name;

        if (options.aliases) {
            if (!Array.isArray(options.aliases)) throw new TypeError('Aliases must be an array');
            options.aliases.forEach(alias => {
                if (typeof alias !== 'string') throw new Error('Aliases array contain strings only');
            });

            this.aliases = options.aliases;
        }

    }

    /**
     * @description Method that runs when the command is executed
     */
    execute(ctx, args, logger) {
        throw new Error(`Command '${this.name}' is missing execute method`);
    }

}