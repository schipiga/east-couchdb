"use strict";

const path = require("path");

const nano = require("nano");

function Adapter(params) {
    this.params = params || {};
    this.params.couchdb = this.params.couchdb || {};
    this.params.couchdb.url = this.params.couchdb.url || process.env.COUCHDB_URL;
    this.params.couchdb.username = this.params.couchdb.username || process.env.COUCHDB_USER;
    this.params.couchdb.password = this.params.couchdb.password || process.env.COUCHDB_PASSWORD;
    this.params.couchdb.host = this.params.couchdb.host || process.env.COUCHDB_HOST;
    this.params.couchdb.port = this.params.couchdb.port || process.env.COUCHDB_PORT;

    if (this.params.template) {
        this._templatePath = path.resolve(path.normalize(this.params.template))
    } else {
        this._templatePath = path.join(__dirname, "template.js");
    }

    this._conn = null;
    this._dbName = this.params.database || "migrations_";
};

Adapter.prototype.connect = function () {

    if (this.params.couchdb.url) {
        this._conn = nano(this.params.couchdb.url);
        return this._conn;
    }

    let url = "http://";

    if (this.params.couchdb.username) {
        url += this.params.couchdb.username;

        if (this.params.couchdb.password) {
            url += ":" + this.params.couchdb.password;
        }
        url += "@";
    }

    url += this.params.couchdb.host;
    if (this.params.couchdb.port) {
        url += ":" + this.params.couchdb.port;
    }

    this._conn = nano(url);
    return this._conn;
};

Adapter.prototype.disconnect = function () {
    this._conn = null;
};

Adapter.prototype.getTemplatePath = function () {
    return this._templatePath;
};

Adapter.prototype.getExecutedMigrationNames = async function () {
    if (!(await this._conn.db.list()).includes(this._dbName)) {
        await this._conn.db.create(this._dbName);
    }
    const q = await this._conn.use(this._dbName).find({ selector: {} });
    return q.docs.map(doc => doc._id);
};

Adapter.prototype.markExecuted = async function (name) {
    await this._conn.use(this._dbName).insert({}, name);
};

Adapter.prototype.unmarkExecuted = async function (name) {
    const q = await this._conn.use(this._dbName).find({ selector: { _id: name } });
    await this._conn.use(this._dbName).destroy(name, q.docs[0]._rev);
};

module.exports = Adapter;
