import { logger } from './logger.js';

export interface Session {
  id: string;
  workingDirectory?: string;
  createdAt: Date;
  lastUsedAt: Date;
}

export class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private defaultSessionId = 'default';
  
  constructor() {
    // Create default session
    this.createSession(this.defaultSessionId);
  }
  
  createSession(id: string = this.generateSessionId()): Session {
    const session: Session = {
      id,
      createdAt: new Date(),
      lastUsedAt: new Date(),
    };
    
    this.sessions.set(id, session);
    logger.debug(`Created session: ${id}`);
    
    return session;
  }
  
  getSession(id?: string): Session {
    const sessionId = id || this.defaultSessionId;
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return this.createSession(sessionId);
    }
    
    session.lastUsedAt = new Date();
    return session;
  }
  
  setWorkingDirectory(directory: string, sessionId?: string): void {
    const session = this.getSession(sessionId);
    session.workingDirectory = directory;
    logger.debug(`Set working directory for session ${session.id}: ${directory}`);
  }
  
  clearWorkingDirectory(sessionId?: string): void {
    const session = this.getSession(sessionId);
    delete session.workingDirectory;
    logger.debug(`Cleared working directory for session ${session.id}`);
  }
  
  getWorkingDirectory(sessionId?: string): string | undefined {
    const session = this.getSession(sessionId);
    return session.workingDirectory;
  }
  
  deleteSession(id: string): boolean {
    if (id === this.defaultSessionId) {
      logger.warn('Cannot delete default session');
      return false;
    }
    
    const result = this.sessions.delete(id);
    if (result) {
      logger.debug(`Deleted session: ${id}`);
    }
    
    return result;
  }
  
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
