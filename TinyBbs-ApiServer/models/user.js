const db = require('./db.js');
const userTable = db.userTable;
const bcrypt = require('bcrypt');

class User {
    constructor(obj) {
        for (const key in obj) {
            this[key] = obj[key];
        }
    }

    save(cb) {
        cb = cb || (() => { });
        if (this.id) {
            this.update(cb);
        } else {
            this.hashPassword((err) => {
                if (err) {
                    return cb(err);
                }
                db.connect()(userTable)
                    .insert(this).returning('id')
                    .then(idArray => {
                        if (idArray.length != 1) return cb(new Error('insert falied'));
                        this.id = idArray[0];
                        return cb(null, this);
                    }).catch(err => {
                        return cb(err);
                    });
            });
        }
    }

    update(cb) {
        cb = cb || (() => { });
        const id = this.id;
        const username = this.username; // username should not be changed?
        db.connect()(userTable)
            .where({ id: id, username: username })
            .update(this)
            .catch(err => {
                return cb(err);
            });
    }

    hashPassword(cb) {
        cb = cb || (() => { });
        if (!cb) return cb(new Error('empty password'));
        bcrypt.hash(this.password, 12, (err, hash) => {
            if (err) return cb(err);
            this.password = hash;
            cb();
        });
    }

    static getByUsername(username, cb) {
        cb = cb || (() => { });
        if (!username) return cb(new Error('username required'));
        db.connect()
            .select()
            .from(userTable)
            .where({ username: username }).then(value => {
                switch (value.length) {
                    case 0:
                        cb(null, null);// TODO: or throw an error?
                        break;
                    case 1:
                        cb(null, new User(value[0]));
                        break;
                    default:
                        throw new Error('data error to search user by name');
                        break;
                }
            }).catch(err => {
                cb(err);
            });
    }

    static getById(id, cb) {
        cb = cb || (() => { });
        if (!id) return cb(new Error('id required'));
        db.connect()
            .select()
            .from(userTable)
            .where({ id: id }).then(value => {
                switch (value.length) {
                    case 0:
                        cb(null, null);// TODO: or throw an error?
                        break;
                    case 1:
                        cb(null, new User(value[0]));
                        break;
                    default:
                        throw new Error('data error to search user by name');
                        break;
                }
            }).catch(err => {
                cb(err);
            });
    }

    static authenticate(username, password, cb) {
        cb = cb || (() => { });
        if (!username || !password) {
            return cb(new Error('needs username and password'));
        }
        User.getByUsername(username, (err, user) => {
            if (err) return cb(err);
            if (!user) return cb(new Error('no such username'));
            bcrypt.compare(password, user.password, (err, same) => {
                if (err) return cb(err);
                same ? cb(null, user) : cb(new Error('wrong username or password'));
            });
        });
    }

    static createNewData(username, password, cb) {
        cb = cb || (() => { });
        if (!username || !password) {
            return cb(new Error('username and password should not be empty'));
        }
        User.getByUsername(username, (err, user) => {
            if (err) return cb(err);
            if (user && user.id) return cb(new Error('Username already taken!'));
            user = new User({ username: username, password: password });
            user.save((err, savedUser) => {
                if (err) return cb(err);
                cb(null, savedUser);
            });
        });
    }

    // TODO method to clone object except some fields
    // 去掉敏感数据(比如password)
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            avatar: this.avatar,
            bio: this.bio,
        };
    }
}

module.exports = User;