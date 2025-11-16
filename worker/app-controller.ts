import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo } from './types';
import type { Env } from './core-utils';
import { cortexContent, graphData } from '../src/lib/mock-data'; // Using mock data as seeder
interface KnowledgeGraph {
  nodes: any[];
  links: any[];
}
export class AppController extends DurableObject<Env> {
  private sessions = new Map<string, SessionInfo>();
  private knowledgeGraph: KnowledgeGraph | null = null;
  private loaded = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const [storedSessions, storedGraph] = await Promise.all([
        this.ctx.storage.get<Record<string, SessionInfo>>('sessions') || {},
        this.ctx.storage.get<KnowledgeGraph>('knowledgeGraph')
      ]);
      this.sessions = new Map(Object.entries(storedSessions));
      this.knowledgeGraph = storedGraph || null;
      if (!this.knowledgeGraph) {
        await this.seedInitialData();
      }
      this.loaded = true;
    }
  }
  private async persistSessions(): Promise<void> {
    await this.ctx.storage.put('sessions', Object.fromEntries(this.sessions));
  }
  private async persistGraph(): Promise<void> {
    if (this.knowledgeGraph) {
      await this.ctx.storage.put('knowledgeGraph', this.knowledgeGraph);
    }
  }
  async seedInitialData(): Promise<KnowledgeGraph> {
    console.log("Seeding initial knowledge graph data...");
    const allNodes = [...cortexContent];
    const cortexNodeIds = new Set(cortexContent.map(n => n.id));
    graphData.nodes.forEach(graphNode => {
      if (!cortexNodeIds.has(graphNode.id)) {
        allNodes.push({
          ...graphNode,
          name: graphNode.id,
          type: 'topic',
          status: 'published',
          createdAt: new Date().toISOString(),
          keywords: [String(graphNode.group)],
        });
      }
    });
    this.knowledgeGraph = {
      nodes: allNodes,
      links: graphData.links,
    };
    await this.persistGraph();
    return this.knowledgeGraph;
  }
  // --- Knowledge Graph Methods ---
  async getGraph(): Promise<KnowledgeGraph | null> {
    await this.ensureLoaded();
    return this.knowledgeGraph;
  }
  async updateGraph(graph: KnowledgeGraph): Promise<void> {
    await this.ensureLoaded();
    this.knowledgeGraph = graph;
    await this.persistGraph();
  }
  async resetGraph(): Promise<KnowledgeGraph> {
    await this.ensureLoaded();
    return this.seedInitialData();
  }
  // --- Session Methods ---
  async addSession(sessionId: string, title?: string): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();
    this.sessions.set(sessionId, {
      id: sessionId,
      title: title || `Chat ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now
    });
    await this.persistSessions();
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persistSessions();
    return deleted;
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = Date.now();
      await this.persistSessions();
    }
  }
  async updateSessionTitle(sessionId: string, title: string): Promise<boolean> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.title = title;
      await this.persistSessions();
      return true;
    }
    return false;
  }
  async listSessions(): Promise<SessionInfo[]> {
    await this.ensureLoaded();
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
  }
  async getSessionCount(): Promise<number> {
    await this.ensureLoaded();
    return this.sessions.size;
  }
  async getSession(sessionId: string): Promise<SessionInfo | null> {
    await this.ensureLoaded();
    return this.sessions.get(sessionId) || null;
  }
  async clearAllSessions(): Promise<number> {
    await this.ensureLoaded();
    const count = this.sessions.size;
    this.sessions.clear();
    await this.persistSessions();
    return count;
  }
}