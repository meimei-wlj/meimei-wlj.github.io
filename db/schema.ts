import {sqliteTable,text,integer} from "drizzle-orm/sqlite-core";
export const works=sqliteTable("works",{id:text("id").primaryKey(),category:text("category").notNull(),title:text("title").notNull(),description:text("description").notNull().default(""),body:text("body").notNull().default(""),url:text("url").notNull().default(""),year:text("year").notNull().default(""),assets:text("assets").notNull().default("[]"),created:integer("created").notNull()});
export const settings=sqliteTable("settings",{id:text("id").primaryKey(),data:text("data").notNull()});
export const files=sqliteTable("files",{id:text("id").primaryKey(),name:text("name").notNull(),mime:text("mime").notNull(),size:integer("size").notNull()});
