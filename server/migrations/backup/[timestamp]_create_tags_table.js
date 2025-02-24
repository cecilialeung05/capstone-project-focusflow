export function up(knex) {
  return knex.schema.createTable('tags', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('color').defaultTo('#666666');
    // ... any other columns
  });
}

export function down(knex) {
  return knex.schema.dropTable('tags');
} 