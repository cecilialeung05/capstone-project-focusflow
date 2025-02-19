/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('notes', (table) => {
      table.increments('id').primary().unsigned();  
      table
        .integer('task_id')
        .unsigned()
        .references('tasks.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE'); 
      table.string('title').notNullable();
      table.text('content').notNullable(); 
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export function down(knex) {
    return knex.schema.dropTable('notes');
  };
