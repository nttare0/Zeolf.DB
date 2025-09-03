import { User, Website } from '../types';

// Simple hash function for password storage (for demo purposes)
const simpleHash = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

class DatabaseService {
  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    // Initialize with default data if not exists
    if (!localStorage.getItem('users')) {
      this.seedData();
    }
  }

  private async seedData() {
    const adminPassword = await simpleHash('admin123');
    const userPassword = await simpleHash('user123');

    const defaultUsers: User[] = [
      {
        id: 'admin-1',
        username: 'admin',
        password: adminPassword,
        role: 'admin',
        permissions: ['github', 'stackoverflow', 'google', 'youtube'],
        createdAt: new Date().toISOString(),
        lastLogin: undefined
      },
      {
        id: 'user-1',
        username: 'user',
        password: userPassword,
        role: 'user',
        permissions: ['github', 'stackoverflow'],
        createdAt: new Date().toISOString(),
        lastLogin: undefined
      }
    ];

    const defaultWebsites: Website[] = [
      {
        id: 'github',
        name: 'GitHub',
        url: 'https://github.com',
        logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        description: 'Development platform for code collaboration'
      },
      {
        id: 'stackoverflow',
        name: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        logo: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png',
        description: 'Programming Q&A community'
      },
      {
        id: 'google',
        name: 'Google',
        url: 'https://google.com',
        logo: 'https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png',
        description: 'Search engine and web services'
      },
      {
        id: 'youtube',
        name: 'YouTube',
        url: 'https://youtube.com',
        logo: 'https://www.youtube.com/s/desktop/f506bd45/img/favicon_32x32.png',
        description: 'Video sharing platform'
      }
    ];

    localStorage.setItem('users', JSON.stringify(defaultUsers));
    localStorage.setItem('websites', JSON.stringify(defaultWebsites));
    localStorage.setItem('loginSessions', JSON.stringify([]));
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const users = this.getAllUsers();
    const hashedPassword = await simpleHash(password);
    
    const user = users.find(u => u.username === username && u.password === hashedPassword);
    
    if (user) {
      // Update last login
      user.lastLogin = new Date().toISOString();
      this.updateUser(user);

      // Record login session
      const sessions = this.getLoginSessions();
      sessions.push({
        id: `session-${Date.now()}`,
        userId: user.id,
        username: user.username,
        loginTime: new Date().toISOString(),
        userAgent: navigator.userAgent || 'Unknown'
      });
      localStorage.setItem('loginSessions', JSON.stringify(sessions));

      return { ...user, password: '' }; // Don't return password
    }

    return null;
  }

  getAllUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  async createUser(username: string, password: string, role: 'user' | 'admin', permissions: string[]): Promise<User> {
    const hashedPassword = await simpleHash(password);
    const users = this.getAllUsers();
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      password: hashedPassword,
      role,
      permissions,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return { ...newUser, password: '' };
  }

  deleteUser(userId: string): boolean {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    
    if (filteredUsers.length !== users.length) {
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      return true;
    }
    return false;
  }

  updateUser(updatedUser: User): boolean {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
    return false;
  }

  updateUserPermissions(userId: string, permissions: string[]): boolean {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
      user.permissions = permissions;
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
    return false;
  }

  getWebsites(): Website[] {
    const websites = localStorage.getItem('websites');
    return websites ? JSON.parse(websites) : [];
  }

  getLoginSessions() {
    const sessions = localStorage.getItem('loginSessions');
    return sessions ? JSON.parse(sessions) : [];
  }

  getAnalytics() {
    const users = this.getAllUsers();
    const sessions = this.getLoginSessions();
    
    return {
      totalVisitors: users.length,
      loggedInUsers: users.filter(u => u.lastLogin).length,
      loginSessions: sessions
    };
  }
}

export const db = new DatabaseService();