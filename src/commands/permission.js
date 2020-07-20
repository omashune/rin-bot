const { Command, DataManager } = require('../structures');

module.exports = class extends Command {

    constructor() {
        super('permission', {
            aliases: ['p', 'perm', 'права', 'пермишены']
        });
    }

    execute(ctx, args, logger) {
        const senderId = ctx.senderId;

        if (!DataManager.getUser(senderId).value()) return ctx.reply('У Вас нет доступа к боту!');
        if (!DataManager.hasPermission(senderId, 'permissions.use')) return ctx.reply('У Вас недостаточно прав!');

        if (args.length < 1) return ctx.reply(`Доступные подкоманды:
        
        add — добавить пермишен пользователю
        remove — удалить пермишен у пользователя

        Пример:
        &#8195;!permission add servers.use (пересланное сообщение)*
        &#8195;!permission remove servers.use (пересланное сообщение)
        
        * Для того, чтобы получить ид пользователя, необходимо переслать его сообщение
        * Ответить или переслать`);

        if (args.length === 1) return ctx.reply('Вы забыли указть пермишен!');

        const permission = args[1];

        if (!ctx.hasForwards) return ctx.reply('Вы забыли переслать сообщение!');

        const userId = ctx.forwards[0].senderId;

        if (userId < 0) return ctx.reply('Сообщение должно быть от пользователя!');

        switch (args[0].toLowerCase()) {
            case 'add':
                if (!DataManager.hasPermission(senderId, 'permissions.add')) return ctx.reply('У Вас недостаточно прав!');
                if (!DataManager.getUser(userId).value()) return ctx.reply(`Пользователь с ID '${userId}' не существует!`);
                if (DataManager.hasPermission(userId, permission)) return ctx.reply(`У пользователя уже есть данный пермишен!`);

                DataManager.addPermission(userId, permission);

                ctx.reply('Пермишен успешно добавлен!');
                logger.log(`Пользователь https://vk.com/id${senderId}, добавил новый пермишен '${permission}' пользователю https://vk.com/id${userId}`);
                break;
            case 'remove':
                if (!DataManager.hasPermission(senderId, 'permissions.remove')) return ctx.reply('У Вас недостаточно прав!');
                if (!DataManager.getUser(userId).value()) return ctx.reply(`Пользователь с ID '${userId}' не существует!`);
                if (!DataManager.hasPermission(userId, permission)) return ctx.reply(`У пользователя нет данного пермишена!`);

                DataManager.removePermission(userId, permission);

                ctx.reply('Пермишен успешно удален!');
                logger.log(`Пользователь https://vk.com/id${senderId}, удалил пермишен '${permission}' у пользователя https://vk.com/id${userId}`);
                break;
            default: ctx.reply('Неверная подкоманда!'); break;
        }
    }

}