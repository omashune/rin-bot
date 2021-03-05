const { Command, DataManager } = require('../structures');

module.exports = class extends Command {

    constructor() {
        super('server', {
            aliases: ['s', 'сервер']
        });
    }

    execute(ctx, args, logger) {
        const senderId = ctx.senderId;

        if (!DataManager.getUser(senderId).value()) return ctx.reply('У Вас нет доступа к боту!');
        if (!DataManager.hasPermission(senderId, 'servers.use')) return ctx.reply('У Вас недостаточно прав!');

        if (args.length < 1) return ctx.reply(`Доступные подкоманды:
        
        add — добавить сервер пользователю
        remove — удалить сервер у пользователя

        Пример:
        &#8195;!server add srv-1 (пересланное сообщение)*
        &#8195;!server remove srv-1 (пересланное сообщение)
        
        * Для того, чтобы получить ид пользователя, необходимо переслать его сообщение
        * Ответить или переслать`);

        if (args.length === 1) return ctx.reply('Вы забыли указть сервер!');

        const server = args[1];

        if (!ctx.hasForwards) return ctx.reply('Вы забыли переслать сообщение!');

        const userId = ctx.forwards[0].senderId;

        if (userId < 0) return ctx.reply('Сообщение должно быть от пользователя!');

        switch (args[0].toLowerCase()) {
            case 'add':
                if (!DataManager.hasPermission(senderId, 'servers.add')) return ctx.reply('У Вас недостаточно прав!');
                if (!DataManager.getUser(userId).value()) return ctx.reply(`Пользователь с ID '${userId}' не существует!`);
                if (DataManager.hasAccess(userId, server)) return ctx.reply(`У пользователя уже есть доступа к данному серверу!`);

                DataManager.addServer(userId, server);

                ctx.reply('Сервер успешно добавлен!');
                logger.log(`Пользователь https://vk.com/id${senderId}, добавил новый сервер '${server}' пользователю https://vk.com/id${userId}`);
                break;
            case 'remove':
                if (!DataManager.hasPermission(senderId, 'servers.remove')) return ctx.reply('У Вас недостаточно прав!');
                if (!DataManager.getUser(userId).value()) return ctx.reply(`Пользователь с ID '${userId}' не существует!`);
                if (!DataManager.hasAccess(userId, server)) return ctx.reply(`У пользователя нет доступа к данному серверу!`);

                DataManager.removeServer(userId, server);

                ctx.reply('Сервер успешно удален!');
                logger.log(`Пользователь https://vk.com/id${senderId}, удалил сервер '${server}' у пользователя https://vk.com/id${userId}`);
                break;
            default: ctx.reply('Неверная подкоманда!'); break;
        }
    }

}
