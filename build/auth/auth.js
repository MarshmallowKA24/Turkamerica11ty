const API_BASE = 'http://localhost:3000/api';

class AuthService {
  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login.html';
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}

// data/database.js - Updated with server sync
class DatabaseService {
  static getAuthHeaders() {
    const token = AuthService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Texts CRUD
  static async saveText(textData) {
    if (AuthService.isAuthenticated()) {
      try {
        const response = await fetch(`${API_BASE}/texts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders()
          },
          body: JSON.stringify(textData)
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.error('Server save failed, using local storage');
      }
    }
    
    // Fallback to localStorage
    const texts = this.getTextsLocal();
    const newText = { ...textData, id: Date.now() };
    texts.push(newText);
    localStorage.setItem('texts', JSON.stringify(texts));
    return newText;
  }

  static async getTexts() {
    if (AuthService.isAuthenticated()) {
      try {
        const response = await fetch(`${API_BASE}/texts`, {
          headers: this.getAuthHeaders()
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.error('Server fetch failed, using local storage');
      }
    }
    
    // Fallback to localStorage
    return this.getTextsLocal();
  }

  static getTextsLocal() {
    return JSON.parse(localStorage.getItem('texts') || '[]');
  }

  // Flashcards CRUD
  static async saveFlashcard(flashcardData) {
    if (AuthService.isAuthenticated()) {
      try {
        const response = await fetch(`${API_BASE}/flashcards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders()
          },
          body: JSON.stringify(flashcardData)
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.error('Server save failed, using local storage');
      }
    }
    
    // Fallback to localStorage
    const flashcards = this.getFlashcardsLocal();
    const newFlashcard = { ...flashcardData, id: Date.now() };
    flashcards.push(newFlashcard);
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    return newFlashcard;
  }

  static async getFlashcards() {
    if (AuthService.isAuthenticated()) {
      try {
        const response = await fetch(`${API_BASE}/flashcards`, {
          headers: this.getAuthHeaders()
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.error('Server fetch failed, using local storage');
      }
    }
    
    return this.getFlashcardsLocal();
  }

  static getFlashcardsLocal() {
    return JSON.parse(localStorage.getItem('flashcards') || '[]');
  }
}