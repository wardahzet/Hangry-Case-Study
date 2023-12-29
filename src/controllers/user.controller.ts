import userRepository from '../repositories/user.repository';
import { User, validateUser } from '../models/user.model';

export default class userController{
  static async get(callback: (error: string | null, result?: User[]) => void) {
    userRepository.get()
      .then((users) => {
        if (users.length !== 0) callback(null, users)
        else callback('No user found')
      })
      .catch((err) => {
        callback(err);
      });
  }

  static async find(id: number, callback: (error: string | null, result?: User) => void) {
    userRepository.find(id)
      .then((user) => {
        if (user) callback(null, user)
        else callback('No user found')
      })
      .catch((err) => {
        callback(err);
      });
  }

  static async store(userData: User, callback: (error: string | null, result?: User) => void) {
    validateUser(userData, (validate) => {
      if (validate) {
        callback(validate);
      } else {
        userRepository.create(userData)
          .then((createdUser) => {
            callback(null, createdUser);
          })
          .catch((error) => {
            callback(error);
          });
      }
    });
  }

  static async edit(id: number, newData: User, callback: (error: string | null, result?: User) => void) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (newData.date_of_birth !== undefined && !regex.test(newData.date_of_birth)) {
      callback("invalid date format, expecting YYYY-MM-DD");
    } else {
      userRepository.update(id,newData)
        .then((createdUser) => {    
          if (createdUser) callback(null, createdUser);
          else callback('data update failed')
        })
        .catch((error) => {
          callback(error);
        });
    }
  }

  static async destroy(id: number, callback: (error: string | null, result?: string) => void) {
    userRepository.delete(id)
    .then((user) => {
      callback(null, 'user deleted successfully')
    })
    .catch((err) => {
      callback(err);
    });
  }
}

