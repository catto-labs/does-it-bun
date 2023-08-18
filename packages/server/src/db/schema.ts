import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
 
export const packages = sqliteTable('packages', {
    id: integer('id').primaryKey(),
    name: text('name'),
    version: text('version')
  }
);