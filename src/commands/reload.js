const { Command, DataManager } = require('../structures');

module.exports = class extends Command {

    constructor() {
        super('reload', {
            aliases: ['перезагрузить']
        });
    }

    execute(ctx) {
        const userId = ctx.senderId;

        if (!DataManager.getUser(userId).value()) return ctx.reply('У Вас нет доступа к боту!');
        if (!DataManager.hasPermission(userId, 'system.reload')) return ctx.reply('У Вас недостаточно прав!');

        DataManager.reload();
        ctx.reply('Данные успешно перезагружены!');
    }

}