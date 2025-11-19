import { RowDataPacket } from "mysql2";

export interface INotification {
  uuid: string;
  source_table: string;
  source_action: string;
  created_at?: string;
  updated_at?: string;
  source_ref: string;
}

export interface SQLNotification extends INotification, RowDataPacket { }

