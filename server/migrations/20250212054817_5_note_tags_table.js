/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('note_tags', (table) => {
      table.increments('id').primary().unsigned(); 
      table.integer('note_id').unsigned().notNullable()
        .references('notes.id').onDelete('CASCADE');
      table.integer('tag_id').unsigned().notNullable()
        .references('tags.id').onDelete('CASCADE');
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