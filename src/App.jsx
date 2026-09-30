import React, { useState, useEffect } from 'react';
import { NoteService } from './services/NoteService';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { FileText } from 'lucide-react';

export function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load notes on mount
  useEffect(() => {
    const loadedNotes = NoteService.getAllNotes();
    setNotes(loadedNotes);
    if (loadedNotes.length > 0) {
      // Select the first note by default on desktop if desired, or keep null
      // Let's select the first one if on desktop-sized view
      if (window.innerWidth >= 768) {
        setSelectedNoteId(loadedNotes[0].id);
      }
    }
  }, []);

  const handleCreateNote = () => {
    const newNote = NoteService.createNote({
      title: 'Untitled Note',
      content: '',
    });
    setNotes(NoteService.getAllNotes());
    setSelectedNoteId(newNote.id);
    setMobileMenuOpen(false);
  };

  const handleUpdateNote = (updatedNoteData) => {
    const updated = NoteService.updateNote(updatedNoteData.id, {
      title: updatedNoteData.title,
      content: updatedNoteData.content,
    });
    if (updated) {
      setNotes(NoteService.getAllNotes());
    }
  };

  const handleDeleteNote = (id) => {
    NoteService.deleteNote(id);
    const remainingNotes = NoteService.getAllNotes();
    setNotes(remainingNotes);

    if (selectedNoteId === id) {
      setSelectedNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
    }
  };

  const handleSelectNote = (id) => {
    setSelectedNoteId(id);
    setMobileMenuOpen(false);
  };

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = (note.title || '').toLowerCase().includes(query);
    const contentMatch = (note.content || '').toLowerCase().includes(query);
    return titleMatch || contentMatch;
  });

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar for desktop / responsive overlay for mobile */}
      <Sidebar
        notes={filteredNotes}
        selectedNoteId={selectedNoteId}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Content / Editor */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        {selectedNote ? (
          <Editor
            note={selectedNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onBackToList={() => setMobileMenuOpen(true)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500 bg-gray-50/50">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-blue-100">
              <FileText className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No note selected</h2>
            <p className="text-sm text-gray-400 max-w-sm mb-6">
              Choose an existing note from the sidebar or create a brand new one to start writing.
            </p>
            <button
              onClick={handleCreateNote}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create New Note
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;