import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'orbit_notes_app_data';

// In-memory fallback if localStorage is disabled or throws an error
let memoryStorage = [];

export const NoteService = {
  /**
   * Retrieve all notes from localStorage, sorted by updatedAt descending.
   * @returns {import('../types').Note[]}
   */
  getAllNotes() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
      }
      return [];
    } catch (error) {
      console.warn('localStorage read failed, falling back to memory storage:', error);
      return memoryStorage.sort((a, b) => b.updatedAt - a.updatedAt);
    }
  },

  /**
   * Save the entire notes array to localStorage.
   * @param {import('../types').Note[]} notes 
   */
  saveAllNotes(notes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.warn('localStorage write failed, saving to memory storage only:', error);
      memoryStorage = [...notes];
    }
  },

  /**
   * Create a new note.
   * @param {Object} param0 
   * @param {string} param0.title 
   * @param {string} param0.content 
   * @returns {import('../types').Note}
   */
  createNote({ title = '', content = '' } = {}) {
    const now = Date.now();
    const newNote = {
      id: uuidv4(),
      title: title.trim() || 'Untitled Note',
      content: content || '',
      createdAt: now,
      updatedAt: now,
    };

    const notes = this.getAllNotes();
    const updatedNotes = [newNote, ...notes];
    this.saveAllNotes(updatedNotes);
    return newNote;
  },

  /**
   * Update an existing note by ID.
   * @param {string} id 
   * @param {Object} param1 
   * @param {string} [param1.title] 
   * @param {string} [param1.content] 
   * @returns {import('../types').Note | null}
   */
  updateNote(id, { title, content }) {
    const notes = this.getAllNotes();
    let updatedNote = null;

    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        updatedNote = {
          ...note,
          title: title !== undefined ? title : note.title,
          content: content !== undefined ? content : note.content,
          updatedAt: Date.now(),
        };
        return updatedNote;
      }
      return note;
    });

    if (updatedNote) {
      this.saveAllNotes(updatedNotes);
    }

    return updatedNote;
  },

  /**
   * Delete a note by ID.
   * @param {string} id 
   * @returns {import('../types').Note[]} Updated notes list
   */
  deleteNote(id) {
    const notes = this.getAllNotes();
    const filteredNotes = notes.filter((note) => note.id !== id);
    this.saveAllNotes(filteredNotes);
    return filteredNotes;
  },

  /**
   * Seed initial notes if storage is completely empty (optional helper).
   */
  seedInitialNotes() {
    const notes = this.getAllNotes();
    if (notes.length === 0) {
      const now = Date.now();
      const sampleNotes = [
        {
          id: uuidv4(),
          title: 'Welcome to Orbit Notes 🚀',
          content: 'This is a simple, responsive notes app powered by React and Tailwind CSS.\n\n- Create new notes using the sidebar button\n- Edit titles and content in real-time\n- Changes are instantly saved to your browser localStorage\n- Search notes easily using the search bar above!',
          createdAt: now - 10000,
          updatedAt: now - 10000,
        },
        {
          id: uuidv4(),
          title: 'Project Ideas 💡',
          content: '1. Build a personal portfolio\n2. Learn advanced Tailwind animations\n3. Create a recipe book web app\n4. Contribute to open source',
          createdAt: now - 5000,
          updatedAt: now - 5000,
        },
      ];
      this.saveAllNotes(sampleNotes);
    }
  }
};