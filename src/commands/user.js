const { Command, DataManager } = require('../structures');

module.exports = class extends Command {

    constructor() {
        super('user', {
            aliases: ['u', 'юзер', 'пользователь']
        });
    }

    execute(ctx, args, logger) {
        const senderId = ctx.senderId;

        if (!DataManager.getUser(senderId).value()) return ctx.reply('У Вас нет доступа к боту!');
        if (!DataManager.hasPermission(senderId, 'users.use')) return ctx.reply('У Вас недостаточно прав!');

        if (args.length < 1) return ctx.reply(`Доступные подкоманды:
        
        add — добавить нового пользователя
        remove — удалить пользователя

        Пример:
        &#8195;!user add (пересланное сообщение)*
        &#8195;!user remove (пересланное сообщение)*
        
        * Для того, чтобы получить ид пользователя, необходимо переслать его сообщение
        * Ответить или переслать`);

        if (!ctx.hasForwards) return ctx.reply('Вы забыли переслать сообщение!');

        const userId = ctx.forwards[0].senderId;

        if (userId < 0) return ctx.reply('Сообщение должно быть от пользователя!');

        switch (args[0].toLowerCase()) {
            case 'add':
                if (!DataManager.hasPermission(senderId, 'users.add')) return ctx.reply('У Вас недостаточно прав!');
                if (DataManager.getUser(userId).value()) return ctx.reply(`Пользователь с ID '${userId}' уже существует!`);

                DataManager.addUser(userId);

                ctx.reply('Пользователь успешно добавлен!');
                logger.log(`Пользователь https://vk.com/id${senderId}, добавил нового пользователя https://vk.com/id${userId}`);
                break;
            case 'remove':
                if (!DataManager.hasPermission(senderId, 'users.remove')) return ctx.reply('У Вас недостаточно прав!');
                if (!DataManager.getUser(userId).value()) return ctx.reply(`Пользователь с ID '${userId}' не существует!`);

                DataManager.removeUser(userId);

                ctx.reply('Пользователь успешно удален!');
                logger.log(`Пользователь https://vk.com/id${senderId}, удалил пользователя https://vk.com/id${userId}`);
                break;
            default: ctx.reply('Неверная подкоманда!'); break;
        }
    }

}