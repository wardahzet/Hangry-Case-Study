import { RowDataPacket } from "mysql2"

export interface User extends RowDataPacket {
  id?: number
  name?: string
  email?: string
  date_of_birth?: string
}

export function validateUser(userData: User, callback: (error: string | null) => void) {
  if (!userData.name) {
    callback('Name cannot be empty');
  } else if (!userData.email) {
    callback('Email cannot be empty');
  } else {
    callback(null);
  }
}