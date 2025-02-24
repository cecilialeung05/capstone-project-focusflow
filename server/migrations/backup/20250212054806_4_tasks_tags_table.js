/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('task_tags', (table) => {
      table.increments('id').primary();
      table.integer('task_id').unsigned().references('id').inTable('tasks').onDelete('CASCADE');
      table.integer('tag_id').unsigned().references('id').inTable('tags').onDelete('CASCADE');
      table.unique(['task_id', 'tag_id']);
    });
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export function down(knex) {
    return knex.schema.dropTable('task_tags');
  }