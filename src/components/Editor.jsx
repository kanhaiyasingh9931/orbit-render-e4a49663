import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, Clock, ArrowLeft, Check, AlertTriangle } from 'lucide-react';

export function Editor({ note, onUpdateNote, onDeleteNote, onBackToList }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  // Sync state when selected note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsSaved(true);
      setShowDeleteConfirm(false);
    }
  }, [note]);

  // Handle title change with auto-save trigger
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setIsSaved(false);
    if (note) {
      onUpdateNote({
        ...note,
        title: newTitle,
        updatedAt: Date.now()
      });
      setIsSaved(true);
    }
  };

  // Handle content change with auto-save trigger
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsSaved(false);
    if (note) {
      onUpdateNote({
        ...note,
        content: newContent,
        updatedAt: Date.now()
      });
      setIsSaved(true);
    }
  };

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 text-gray-500">
        <div className="max-w-md space-y-3">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">No Note Selected</h2>
          <p className="text-sm text-gray-500">
            Select an existing note from the sidebar or create a new one to start writing.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
        <div className="flex items-center space-x-3">
          {/* Mobile Back Button */}
          <button
            onClick={onBackToList}
            className="md:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title="Back to list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Last modified: {formatDate(note.updatedAt)}</span>
            {isSaved && (
              <span className="hidden sm:inline-flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-medium ml-2">
                <Check className="w-3 h-3 mr-1" /> Saved
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {showDeleteConfirm ? (
            <div className="flex items-center space-x-2 bg-red-50 p-1.5 rounded-lg border border-red-100 animate-fadeIn">
              <span className="text-xs font-medium text-red-700 px-2 hidden sm:inline">Delete note?</span>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors shadow-sm"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete note"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto px-6 py-6 md:px-12 md:py-8 max-w-4xl mx-auto w-full">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title..."
          className="w-full text-2xl md:text-3xl font-bold text-gray-900 placeholder:text-gray-300 border-none outline-none resize-none bg-transparent mb-4 tracking-tight"
        />

        {/* Content Textarea */}
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing your note here..."
          className="w-full flex-1 min-h-[350px] text-gray-700 placeholder:text-gray-300 border-none outline-none resize-none bg-transparent leading-relaxed text-base"
        />
      </div>
    </div>
  );
}