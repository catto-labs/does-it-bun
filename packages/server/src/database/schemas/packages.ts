import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
 
export const packages = sqliteTable('packages', {
    id: integer('id').primaryKey(),
    name: text('name'),
    version: text('version')
  }
);

export const packageCompatibility = sqliteTable('package_compatibility', {
  id: integer('id').primaryKey(),
  name: text('name'),
  version: text('version'),
  compatible: integer('compatible')
});