/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('tasks', (table) => {
      table.increments('id').primary().unsigned(); // Primary Key
      table.string('title').notNullable();
      table.text('description'); // More space for detailed descriptions
      table.enu('status', ['open', 'in progress', 'completed', 'blocked']).defaultTo('open'); // Enum for task status
      table.date('due_date'); // Optional due date
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export function down(knex) {
    return knex.schema.dropTable('tasks');
  };