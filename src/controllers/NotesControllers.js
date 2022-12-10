const knex = require("../database/knex");

class NotesController {
  async create(request, response) {
    const {movie_title, movie_description, rate, tags} = request.body;
    const { user_id } = request.params;

    const note_id = await knex("movie_notes").insert({
      movie_title,
      movie_description,
      rate,
      user_id
    });

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        user_id,
        name
      }
    })

    await knex("tags").insert(tagsInsert);

    response.json();

  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("movie_notes").where({id}).first();
    const tags = await knex("tags").where({note_id: id}).orderBy("name");
    console.log(note);
    console.log(tags);

    return response.json({
      ...note,
      tags
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movie_notes").where({ id }).delete();


    return response.json();
  }

  async index(request, response) {
    const {movie_title, user_id, tags} = request.query;
    
    let notes;

    if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim());  
      
      notes = await knex("tags")
      .select([
        "movie_notes.id",
        "movie_notes.movie_title",
        "movie_notes.user_id",
      ])
      .where("movie_notes.user_id", user_id)
      .whereLike("movie_notes.movie_title", `%${movie_title}%`)
      .whereIn("name", filterTags)
      .innerJoin("movie_notes", "movie_notes.id", "tags.note_id")
      .orderBy("movie_notes.movie_title")
    
    }
    

    else {
      notes = await knex("movie_notes")
      .where({user_id})
      .whereLike("movie_title",`%${movie_title}%`)
      .orderBy("movie_title");
    }

    const userTags = await knex("tags").where({user_id});
    console.log(userTags)
    console.log(notes);
    const notesWithTags = notes.map(note=>{
      const noteTags = userTags.filter(tag=> tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags
      }
    })


    return response.json(notesWithTags);
  }
}

module.exports = NotesController;