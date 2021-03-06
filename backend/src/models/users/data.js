const DB = require("../../helpers/storage/postgres");
const validator = require("validator");
const { errorFormater } = require("../../helpers/format/error");
class UserLogin {
  constructor({ username, password }) {
    if (!validator.isAscii(username + "") || !validator.isAscii(password + ""))
      throw new Error("Bad user input!");
    this.user = { username, password };
  }
  async login() {
    const response = await this._query();

    return response;
  }

  async _query() {
    try {
      const text = `SELECT id,role,username,last_updated,date_created FROM ${process.env.PG_USER_TABLE} where username=$1 and password=$2 limit 1;`;
      const values = [this.user.username, this.user.password];
      // query
      const response = await DB.query(text, values);
      if (response.rowCount === 1) return response.rows[0];
      throw new Error("USER NOT FOUND!");
    } catch ({ message }) {
      return errorFormater(message);
    }
  }
}
class UserSignup {
  constructor({ username, password, role = 0 }) {
    if (!validator.isAscii(username + "") || !validator.isAscii(password + ""))
      throw new Error("bad signup!");

    this.text = `INSERT INTO ${process.env.PG_USER_TABLE} (
        username, password, role,date_created, last_updated )
        VALUES ($1 , $2, $3 , now() , now() ) returning id,username,role, date_created, last_updated;`;
    this.values = [username, password, role];
  }
  async signup() {
    return await this._query();
  }
  async _query() {
    try {
      const response = await DB.query(this.text, this.values);
      if (response.rowCount === 1) return response.rows[0];
      throw new Error("CANNOT SIGNUP!");
    } catch ({ message }) {
      return errorFormater(message);
    }
  }
}
class UserQuery {
  async getUserInformation({ user_id }) {
    try {
      const text = `SELECT id,username,last_updated,date_created FROM ${process.env.PG_USER_TABLE} where id=$1 limit 1;`;
      const values = [user_id];
      // query
      const response = await DB.query(text, values);
      if (response.rowCount === 1) return response.rows[0];
      throw new Error("USER NOT FOUND!");
    } catch (error) {
      console.log(error.message);
      throw new Error();
    }
  }
}

module.exports = { UserLogin, UserSignup ,UserQuery};
