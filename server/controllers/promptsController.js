import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

export const getPrompts = async (req, res) => {
  try {
    // Optionally, filter by context (e.g., morning, deep work)
    const { context } = req.query;
    let query = knex('prompts').select('*');
    if (context) query = query.where({ context });
    const prompts = await query;
    res.json(prompts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
};

export const createPrompt = async (req, res) => {
  try {
    const { message, context } = req.body;
    const [id] = await knex('prompts').insert({ message, context });
    const newPrompt = await knex('prompts').where({ id }).first();
    res.status(201).json(newPrompt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create prompt' });
  }
};


// You can add update and delete endpoints similarly...
