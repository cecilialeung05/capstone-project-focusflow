// migrations/20250401_create_sessions_table.js
exports.up = function(knex) {
    return knex.schema.createTable('sessions', (table) => {
      table.increments('id').primary();
      // References the user who is in the session
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
      // Optionally, references the task associated with the session
      table.integer('task_id').unsigned().nullable()
        .references('id').inTable('tasks').onDelete('SET NULL');
      // Start time of the session
      table.timestamp('started_at').defaultTo(knex.fn.now()).notNullable();
      // End time of the session (nullable until the session is complete)
      table.timestamp('ended_at').nullable();
      // Duration in seconds; can be calculated or set via the application
      table.integer('duration').nullable();
      // Optional metrics to gauge user state during the session
      table.integer('mood').nullable().comment('Scale 1-10, where 10 is very positive');
      table.integer('energy').nullable().comment('Scale 1-10, where 10 is high energy');
      table.integer('motivation').nullable().comment('Scale 1-10, where 10 is high motivation');
      table.integer('concentration').nullable().comment('Scale 1-10, where 10 is fully focused');
      table.integer('distraction').nullable().comment('Scale 1-10, where 10 is very distracted');
      // Timestamps for when the record was created/updated
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('sessions');
  };
  