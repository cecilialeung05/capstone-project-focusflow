/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('note_tags', (table) => {
      table.increments('id').primary();
      table.integer('note_id').unsigned().references('id').inTable('notes').onDelete('CASCADE');
      table.integer('tag_id').unsigned().references('id').inTable('tags').onDelete('CASCADE');
      table.unique(['note_id', 'tag_id']);
    });
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export async function down(knex) {
    return knex.schema.dropTable('note_tags');
  }