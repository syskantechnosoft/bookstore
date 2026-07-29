import React, { useState, useEffect } from 'react';
import { bookService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookModal } from './BookModal';
import { Search, Filter, Plus, Edit, Trash2, BookOpen, Layers, ChevronLeft, ChevronRight, Lock } from 'lucide-react';

export const BookList = () => {
  const { user, isWriteAllowed, hasRole } = useAuth();
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const genres = ['Fiction', 'Technology', 'Science', 'History', 'Philosophy', 'Business', 'Fantasy', 'Sci-Fi', 'Self-Help', 'Biography'];

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookService.getBooks({
        query: searchQuery || undefined,
        genre: selectedGenre || undefined,
        page,
        size: 10,
      });
      setBooks(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch books. Please check login state.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, selectedGenre]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchBooks();
  };

  const handleSaveBook = async (bookData) => {
    try {
      if (editingBook) {
        await bookService.updateBook(editingBook.id, bookData);
      } else {
        await bookService.createBook(bookData);
      }
      setIsModalOpen(false);
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.errors?.isbn || 'Error saving book');
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book record?')) {
      try {
        await bookService.deleteBook(id);
        fetchBooks();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  return (
    <div style={{ padding: '0 24px 40px 24px' }}>
      {/* Search & Filter Header Bar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px 10px 38px', borderRadius: '8px' }}
            />
          </div>
          <button type="submit" style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#0f172a', fontWeight: 700, padding: '0 18px', borderRadius: '8px' }}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>
            <Filter size={16} /> Filter Genre:
          </div>
          <select
            value={selectedGenre}
            onChange={(e) => { setSelectedGenre(e.target.value); setPage(0); }}
            style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px' }}
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {isWriteAllowed() ? (
            <button
              onClick={() => { setEditingBook(null); setIsModalOpen(true); }}
              style={{ background: 'linear-gradient(135deg, #34d399, #059669)', color: '#0f172a', fontWeight: 700, padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={18} /> Add Book
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.05)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '0.8rem' }}>
              <Lock size={14} color="#fbbf24" /> Read-Only Mode (User)
            </div>
          )}
        </div>
      </div>

      {/* Catalog Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
            Book Inventory <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 400 }}>({totalElements} Total Records)</span>
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>Page {page + 1} of {totalPages || 1}</span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading book records from database...</div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#f43f5e' }}>{error}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                  <th style={{ padding: '14px 20px' }}>Title & Author</th>
                  <th style={{ padding: '14px 20px' }}>ISBN</th>
                  <th style={{ padding: '14px 20px' }}>Genre</th>
                  <th style={{ padding: '14px 20px' }}>Price</th>
                  <th style={{ padding: '14px 20px' }}>Year</th>
                  <th style={{ padding: '14px 20px' }}>Stock</th>
                  {isWriteAllowed() && <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#f8fafc' }}>{book.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>by {book.author}</div>
                    </td>
                    <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#38bdf8' }}>{book.isbn}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className="badge badge-genre">{book.genre}</span>
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#34d399' }}>${book.price?.toFixed(2)}</td>
                    <td style={{ padding: '14px 20px', color: '#94a3b8' }}>{book.publishedYear}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ color: book.stock > 10 ? '#34d399' : '#fbbf24', fontWeight: 600 }}>{book.stock} units</span>
                    </td>
                    {isWriteAllowed() && (
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => { setEditingBook(book); setIsModalOpen(true); }}
                            style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '6px 10px', borderRadius: '6px' }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', padding: '6px 10px', borderRadius: '6px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            style={{ background: 'rgba(255, 255, 255, 0.05)', color: page === 0 ? '#64748b' : '#fff', padding: '8px 16px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Showing page {page + 1} of {totalPages || 1}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            style={{ background: 'rgba(255, 255, 255, 0.05)', color: page >= totalPages - 1 ? '#64748b' : '#fff', padding: '8px 16px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <BookModal
          book={editingBook}
          onClose={() => { setIsModalOpen(false); setEditingBook(null); }}
          onSave={handleSaveBook}
        />
      )}
    </div>
  );
};
