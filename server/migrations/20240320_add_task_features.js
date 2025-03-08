export const up = async (knex) => {
  return knex.schema.alterTable('tasks', (table) => {
    // Add priority column with check constraint
    table.enu('priority', ['low', 'medium', 'high'])
      .defaultTo('medium');

    // Add recurring task columns
    table.enu('recurring_type', ['none', 'daily', 'weekly', 'monthly', 'custom'])
      .defaultTo('none');
    table.integer('recurring_interval')
      .nullable();
    table.string('recurring_unit', 10)
      .nullable();

    // Add dependency relationship
    table.integer('parent_task_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('tasks')
      .onDelete('SET NULL');
  });
};

export const down = async (knex) => {
  return knex.schema.alterTable('tasks', (table) => {
    table.dropColumn('priority');
    table.dropColumn('recurring_type');
    table.dropColumn('recurring_interval');
    table.dropColumn('recurring_unit');
    table.dropColumn('parent_task_id');
  });
}; 