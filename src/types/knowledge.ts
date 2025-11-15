export type NodeType = 'article' | 'guide' | 'template' | 'code' | 'collection' | 'topic';
export type NodeStatus = 'published' | 'draft' | 'in_progress' | 'idea' | 'backlog' | 'done';
export interface KnowledgeNode {
  id: string;
  name: string;
  type: NodeType;
  status: NodeStatus;
  createdAt: string; // ISO string
  keywords: string[];
  content?: string;
  val: number; // for graph visualization size
}
export interface KnowledgeLink {
  source: string;
  target:string;
}
export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
}