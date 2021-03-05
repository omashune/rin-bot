const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const db = low(new FileSync('data.json'));

const { compare } = require('../Utils');

const servers = () => db.get('servers');
const users = () => db.get('users');

module.exports = class DataManager {

    // System

    /**
     * @description Reload the database
     */
    static reload() {
        db.read();
    }

    // Servers

    /**
     * @description Get server by server name
     * @param {String} name Server name
     */
    static getServer(name) {
        return servers().find(srv => compare(srv.name, name));
    }

    /**
     * @description Check if the command is blocked
     * @param {String} name The server name
     * @param {String} command The command that needs to be checked ¯\_(ツ)_/¯
     */
    static blocked(name, command) {
        return !!this.getServer(name).get('blocked')
            .find(cmd => compare(cmd, command.replace(/ .*/, '')))
            .value();
    }

    // Users

    static getUser(userId) {
        return users()
            .find({ userId });
    }

    /**
     * @description Add the user to database
     * @param {Number} userId The vkId of the user
     */
    static addUser(userId) {
        users()
            .push({
                userId,
                servers: [],
                permissions: []
            })
            .write();
    }

    /**
     * @description Remove the user from database
     * @param {Number} userId The vkId of the user
     */
    static removeUser(userId) {
        users()
            .remove({ userId })
            .write();
    }

    // Users.Servers

    static hasAccess(userId, server) {
        return !!this.getUser(userId).get('servers')
            .find(srv => compare(srv, server))
            .value();
    }

    static addServer(userId, server) {
        this.getUser(userId).get('servers')
            .push(server)
            .write();
    }

    static removeServer(userId, server) {
        this.getUser(userId).get('servers')
            .remove(srv => compare(srv, server))
            .write();
    }


    static serverList(userId) {
        const list = this.getUser(userId).get('servers')
            .value()
            .join(', ');

        return list || 'Нет доступных серверов';
    }

    // Users.permissions

    static hasPermission(userId, permission) {
        return !!this.getUser(userId).get('permissions')
            .find(perm => compare(perm, permission))
            .value();
    }

    static addPermission(userId, permission) {
        this.getUser(userId).get('permissions')
            .push(permission)
            .write();
    }

    static removePermission(userId, permission) {
        this.getUser(userId).get('permissions')
            .remove(perm => compare(perm, permission))
            .write();
    }

}
