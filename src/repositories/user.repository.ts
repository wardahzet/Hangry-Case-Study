import connection from "../db";
import { User} from "../models/user.model";
import { OkPacket } from "mysql2";

interface IUserRepository {
  create(user: User): Promise<User>;
  get(searchParams: {id: number, name: string}): Promise<User[]>;
  find(id: number): Promise<User | undefined>;
  update(id: number, user: User): Promise<User>;
  delete(id: number): Promise<number>;
}

class UserRepository implements IUserRepository {
  get(): Promise<User[]> {
    let query: string = "SELECT * FROM users"; 
    return new Promise((resolve, reject) => {
      connection.query<User[]>(query, (err: any, res: User[] | PromiseLike<User[]>) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  find(tutorialId: number): Promise<User> { 
    return new Promise((resolve, reject) => {
      connection.query<User[]>(
        "SELECT * FROM users WHERE id = ?",
        [tutorialId],
        (err: any, res: (User | PromiseLike<User>)[]) => {
          if (err) reject(err);
          else resolve(res?.[0]);
        }
      );
    });
  }

  create(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      connection.query<OkPacket>(
        "INSERT INTO Users (name, email, date_of_birth) VALUES(?,?,?)",
        [user.name, user.email, user.date_of_birth ? user.date_of_birth : false],
        (err: any, res: { insertId: number; }) => {
          if (err) reject(err);
          else
            this.find(res.insertId)
              .then((user) => resolve(user!))
              .catch(reject);
        }
      );
    });
  }

  update(id: number, user: User): Promise<User> { 
    return new Promise((resolve, reject) => {
      let updateData: string = "";

      if (user.name) updateData += `name = '${user.name}',`;
      if (user.email) updateData += `email = '${user.email}',`
      if (user.date_of_birth) updateData += `date_of_birth = '${user.date_of_birth}',`;
      if (updateData.length) {
        updateData = updateData.substring(0, updateData.length-1);
        const query = `UPDATE users SET ${updateData} WHERE id = ${id}`;
        connection.query<OkPacket>(
          query, (err: any, res: { insertId: number; }) => {
            if (err) reject(err);
            else
              this.find(id)
                .then((user) => resolve(user!))
                .catch(reject);
          }
        );
      } else reject("no data updated"); 
    });
  }

  delete(id: number): Promise<number> { 
    return new Promise((resolve, reject) => {
      connection.query<OkPacket>(
          "DELETE FROM users WHERE id = ?",
          [id],
          (err: any, res: { affectedRows: number | PromiseLike<number>; }) => {
            if (err) reject(err);
            else resolve(res.affectedRows);
          }
      );
    });
  }
}

export default new UserRepository();