export function up(knex) {
  return knex.schema.table('tags', (table) => {
    table.string('color').defaultTo('#666666');  // Default gray color
  });
}

export function down(knex) {
  return knex.schema.table('tags', (table) => {
    table.dropColumn('color');
  });
} 