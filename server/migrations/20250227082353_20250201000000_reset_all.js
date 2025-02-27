export const up = async (knex) => {
    return knex.schema
      .dropTableIfExists('note_tags')
      .dropTableIfExists('task_tags')
      .dropTableIfExists('notes')
      .dropTableIfExists('tasks')
      .dropTableIfExists('tags')
      .then(() => {
        return knex.schema
          .createTable('tags', table => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('color');
            table.timestamps(true, true);
          })
          
          .createTable('tasks', table => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.text('description');
            table.string('status').defaultTo('open');
            table.date('due_date');
            table.timestamps(true, true);
          })
          
          .createTable('notes', table => {
            table.increments('id').primary();
            table.integer('task_id').unsigned()
              .references('id').inTable('tasks')
              .onDelete('SET NULL');
            table.string('title').notNullable();
            table.text('content');
            table.timestamps(true, true);
          })
          
          .createTable('task_tags', table => {
            table.increments('id').primary();
            table.integer('task_id').unsigned()
              .references('id').inTable('tasks')
              .onDelete('CASCADE').notNullable();
            table.integer('tag_id').unsigned()
              .references('id').inTable('tags')
              .onDelete('CASCADE').notNullable();
            table.unique(['task_id', 'tag_id']);
          })
          
          .createTable('note_tags', table => {
            table.increments('id').primary();
            table.integer('note_id').unsigned()
              .references('id').inTable('notes')
              .onDelete('CASCADE').notNullable();
            table.integer('tag_id').unsigned()
              .references('id').inTable('tags')
              .onDelete('CASCADE').notNullable();
            table.unique(['note_id', 'tag_id']);
          });
      });
  };
  
  export const down = async (knex) => {
    return knex.schema
      .dropTableIfExists('note_tags')
      .dropTableIfExists('task_tags')
      .dropTableIfExists('notes')
      .dropTableIfExists('tasks')
      .dropTableIfExists('tags');
  };