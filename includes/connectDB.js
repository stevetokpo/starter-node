const mysql = require('mysql2');

class DB {
    constructor() {
        this._connectDB = this.connectionDB();
    }

    connectionDB() {
        const db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'bs__feuer'
        });

        db.connect(err => {
            if (err) {
                console.error('Erreur de connexion à la base de données :', err);
                throw err;
            }
            console.log('Connecté à la base de données MySQL');
        });

        return db;
    }

    execReq(req, exec) {
        return new Promise((resolve, reject) => {
            this._connectDB.query(req, exec, (err, results) => {
                if (err) {
                    console.error('Erreur lors de la récupération des données :', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    async get(table, where, whereArr, orderBy, asc, limit, offset) {
        try {
            let query = `SELECT * FROM \`${table}\``;

            if (where) {
                query += ` WHERE ${where}`;
            }

            if (orderBy) {
                query += ` ORDER BY \`${orderBy}\` ${asc ? 'ASC' : 'DESC'}`;
            }

            if (limit) {
                query += ' LIMIT ?';
                if (offset) {
                    query += ' OFFSET ?';
                    whereArr.push(limit, offset);
                } else {
                    whereArr.push(limit);
                }
            }

            const results = await this.execReq(query, whereArr);
            return results;
        } catch (err) {
            throw err;
        }
    }

    async drop(table, column, value) {
        const query = `DELETE FROM \`${table}\` WHERE \`${column}\` = ?`;
        const params = [value];

        try {
            await this.execReq(query, params);
            return true;
        }
        catch (error) {
            return false;
        }
    }

    async update(table, columnId, value, newValueArr) {
        try {
            for (const [key, val] of Object.entries(newValueArr)) {
                const query = `UPDATE \`${table}\` SET \`${key}\` = ? WHERE \`${columnId}\` = ?`;
                const params = [val, value];
                await this.execReq(query, params);
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    async put(table, col) {
        try {
            const colNames = Object.keys(col).map(colName => `\`${colName}\``);
            const placeholders = Object.keys(col).map(() => '?').join(', ');

            const query = `INSERT INTO \`${table}\` (${colNames.join(', ')}) VALUES (${placeholders})`;
            const params = [...Object.values(col)];

            const result = await this.execReq(query, params);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DB;