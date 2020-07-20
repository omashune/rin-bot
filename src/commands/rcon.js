const { Keyboard } = require('vk-io');
const { Command, DataManager } = require('../structures');
const { Rcon } = require('rcon-ts');

module.exports = class extends Command {

    constructor() {
        super('rcon', {
            aliases: ['r', 'ркон']
        });
    }

    execute(ctx, args, logger) {
        const userId = ctx.senderId;

        // Check if the user exists
        if (!DataManager.getUser(userId).value()) return ctx.reply('У Вас нет доступа к боту!');

        // Check if the user has permission
        if (!DataManager.hasPermission(userId, 'servers.rcon')) return ctx.reply('У Вас недостаточно прав!');

        if (args.length < 1) return ctx.reply(`Правильное использование команды:
        &#8195;!rcon <сервер> <команда>

        Пример:
        &#8195;!rcon surv-1 list`);

        const server = args[0];

        // Check if the server exist
        if (!DataManager.getServer(server).value()) return ctx.reply(`Сервер '${args[0]}' не существует!`);
        // Check if the user has access to the server
        if (!DataManager.hasAccess(userId, server)) return ctx.reply(`У Вас нет доступа к данному серверу!
        
        Доступные Вам сервера:
        &#8195;${DataManager.serverList(userId)}`);

        if (args.length === 1) return ctx.reply('Вы забыли указать команду!');

        // Check if the command blocked on the server
        if (DataManager.blocked(args[0], args[1]) && !DataManager.hasPermission(userId, 'command.bypass')) return ctx.reply('Команда заблокирована!');

        // Getting the command that needs to be sended to the server
        const cmd = args.slice(1).join(' ');

        // Sending the command to the server
        new Rcon(DataManager.getServer(server).value()).session(session => session.send(cmd))
            .then(res => {
                ctx.reply(`Ответ от сервера:
                
                ${res === "" ? "Команда выполнена!" : res.replace(/§./g, "").slice(0, 4000)}`, {
                    keyboard: Keyboard.builder()
                        .inline(true)
                        .textButton({
                            label: 'Отправить команду еще раз',
                            payload: {
                                command: `!rcon ${server} ${cmd}`
                            }
                        })
                });

                logger.log(`Пользователь https://vk.com/id${userId}, выполнил команду '${cmd}' на сервере '${server}'`);
            })
            .catch(err => {
                ctx.reply(`Произошла ошибка при подключении: ${err}
            
                Возможно, сервер выключен`);

                logger.error(`Произошла ошибка при подключении к серверу '${server}': ${err}`);
            });
    }

}