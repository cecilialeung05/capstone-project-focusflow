// migrations/20250401_create_prompts_table.js
exports.up = function(knex) {
    return knex.schema.createTable('prompts', (table) => {
      table.increments('id').primary();
      table.text('message').notNullable();
      table.string('context').defaultTo('general'); // e.g., 'morning', 'afternoon', 'evening', 'deep work', 'creative'
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('prompts');
  };
  