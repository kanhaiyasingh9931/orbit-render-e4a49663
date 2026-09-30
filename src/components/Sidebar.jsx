import React from 'react';
import { Plus, Search, Trash2, FileText, Menu, X } from 'lucide-react';

/**
 * @typedef {import('../types').Note} Note
 */

/**
 * Sidebar component for searching, creating, and listing notes.
 * 
 * @param {Object} props
 * @param {Note[]} props.notes - Filtered list of notes
 * @param {Note|null} props.selectedNote - Currently selected note
 * @param {(note: Note) => void} props.onSelectNote - Select note handler
 * @param {() => void} props.onCreateNote - Create note handler
 * @param {string} props.searchQuery - Current search query
 * @param {(query: string) => void} props.onSearchChange - Search query change handler
 * @param {boolean} props.isOpen - Whether sidebar is open on mobile
 * @param {() => void} props.onToggleMobile - Toggle mobile sidebar visibility
 * @param {(id: string, e: React.MouseEvent) => void} props.onDeleteNote - Delete note handler
 */
export const Sidebar = ({
  notes,
  selectedNote,
  onSelectNote,
  onCreateNote,
  searchQuery,
  onSearchChange,
  isOpen,
  onToggleMobile,
  onDeleteNote,
}) => {
  // Format date for list preview
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    // Otherwise show full date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onToggleMobile}
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-80 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
              O
            </div>
            <h1 className="font-bold text-lg tracking-tight text-white">Orbit Notes</h1>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={onCreateNote}
              title="New Note"
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center space-x-1 text-sm font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New</span>
            </button>
            
            <button
              onClick={onToggleMobile}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white md:hidden transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-800/60">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700/60 rounded-lg text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {notes.length === 0 ? (
            <div className="text-center py-12 px-4">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium text-slate-400">
                {searchQuery ? 'No matching notes found' : 'No notes yet'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {searchQuery ? 'Try a different search term' : 'Click "New" to create your first note'}
              </p>
            </div>
          ) : (
            notes.map((note) => {
              const isSelected = selectedNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    onSelectNote(note);
                    if (window.innerWidth < 768) {
                      onToggleMobile();
                    }
                  }}
                  className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/30 text-white shadow-sm'
                      : 'hover:bg-slate-800/60 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className={`font-semibold text-sm truncate pr-6 ${isSelected ? 'text-indigo-200' : 'text-slate-200'}`}>
                      {note.title.trim() || 'Untitled Note'}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                    {note.content.trim() || 'No additional content...'}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{formatDate(note.updatedAt)}</span>
                    
                    <button
                      onClick={(e) => onDeleteNote(note.id, e)}
                      title="Delete note"
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-all text-slate-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info / Note count */}
        <div className="p-3 border-t border-slate-800 text-xs text-slate-500 text-center">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'} stored securely
        </div>
      </aside>
    </>
  );
};