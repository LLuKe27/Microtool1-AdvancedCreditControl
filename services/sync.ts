export interface SyncData {
  expenses: any[];
  lastUpdated: string;
}

const API_BASE = 'https://jsonblob.com/api/jsonBlob';

export const SyncService = {
  /**
   * Cria uma nova sessão de armazenamento na nuvem com os dados iniciais
   */
  async createSession(data: SyncData): Promise<string | null> {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
        referrerPolicy: 'no-referrer', 
        credentials: 'omit', // Fix for CORS in sandboxed environments
        mode: 'cors',
      });

      if (!response.ok) {
        console.warn(`Sync Create Status: ${response.status} ${response.statusText}`);
        return null;
      }

      // O ID vem no header 'Location' da resposta
      // Ex: https://jsonblob.com/api/jsonBlob/1111-2222-3333
      const location = response.headers.get('Location');
      if (!location) {
        console.warn("Sync Warning: No Location header in response");
        return null;
      }

      const id = location.split('/').pop();
      return id || null;
    } catch (error) {
      // Log as warning since offline mode is a valid fallback
      console.warn("Sync unavailable (Offline mode active):", error);
      return null;
    }
  },

  /**
   * Busca os dados da nuvem usando o ID
   */
  async loadSession(id: string): Promise<SyncData | null> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        referrerPolicy: 'no-referrer',
        credentials: 'omit',
        mode: 'cors',
      });
      
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.warn("Error loading session:", error);
      return null;
    }
  },

  /**
   * Atualiza os dados na nuvem
   */
  async updateSession(id: string, data: SyncData): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
        referrerPolicy: 'no-referrer',
        credentials: 'omit',
        mode: 'cors',
      });

      return response.ok;
    } catch (error) {
      console.warn("Error updating session:", error);
      return false;
    }
  }
};
