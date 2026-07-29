import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

export const BookModal = ({ book, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    publishedYear: new Date().getFullYear(),
    genre: 'Fiction',
    stock: 10,
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        price: book.price !== undefined ? book.price : '',
        publishedYear: book.publishedYear || new Date().getFullYear(),
        genre: book.genre || 'Fiction',
        stock: book.stock !== undefined ? book.stock : 10,
        description: book.description || '',
      });
    }
  }, [book]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';

    const isbnPattern = /^(97(8|9))?\d{9}(\d|X)$/;
    const cleanIsbn = formData.isbn.replace(/-/g, '');
    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    } else if (!isbnPattern.test(cleanIsbn) && cleanIsbn.length < 10) {
      newErrors.isbn = 'Invalid ISBN format (must be valid ISBN-10 or ISBN-13)';
    }

    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (!formData.publishedYear || isNaN(formData.publishedYear) || Number(formData.publishedYear) < 1000 || Number(formData.publishedYear) > 2100) {
      newErrors.publishedYear = 'Year must be between 1000 and 2100';
    }

    if (formData.stock === '' || isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = 'Stock quantity cannot be negative';
    }

    if (!formData.genre.trim()) newErrors.genre = 'Genre is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      price: parseFloat(formData.price),
      publishedYear: parseInt(formData.publishedYear, 10),
      stock: parseInt(formData.stock, 10),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '540px', padding: '32px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', color: '#94a3b8', padding: '4px' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px', color: '#f8fafc' }}>
          {book ? 'Edit Book Record' : 'Add New Book'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Book Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Clean Code"
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: errors.title ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px' }}
            />
            {errors.title && <span style={{ color: '#f43f5e', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.title}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="e.g. Robert C. Martin"
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: errors.author ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px' }}
              />
              {errors.author && <span style={{ color: '#f43f5e', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.author}</span>}
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>ISBN *</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="978-0132350884"
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: errors.isbn ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px' }}
              />
              {errors.isbn && <span style={{ color: '#f43f5e', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.isbn}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="29.99"
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: errors.price ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px' }}
              />
              {errors.price && <span style={{ color: '#f43f5e', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.price}</span>}
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Year *</label>
              <input
                type="number"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: errors.publishedYear ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px' }}
              />
              {errors.publishedYear && <span style={{ color: '#f43f5e', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.publishedYear}</span>}
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: errors.stock ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px' }}
              />
              {errors.stock && <span style={{ color: '#f43f5e', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.stock}</span>}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Genre *</label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px' }}
            >
              <option value="Fiction">Fiction</option>
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Philosophy">Philosophy</option>
              <option value="Business">Business</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Self-Help">Self-Help</option>
              <option value="Biography">Biography</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief summary..."
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'transparent', color: '#94a3b8', padding: '10px 18px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#0f172a', fontWeight: 700, padding: '10px 24px', borderRadius: '8px' }}
            >
              {book ? 'Update Book' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
