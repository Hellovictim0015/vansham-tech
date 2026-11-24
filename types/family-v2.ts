import { Node, Edge } from "@xyflow/react";

export type Gender = "male" | "female" | "other";

export type RelationType = "father" | "mother" | "spouse" | "child" | "parent";

// Specific Indian metadata
export interface IndianContext {
  gotra?: string;
  nativePlace?: string; // "Mool Niwas"
  caste?: string;
  subCaste?: string;
  isAlive: boolean;
  deathDate?: string;
}

export interface Person {
  id: string;
  name: string;
  gender: Gender;
  dob?: string;
  photoUrl?: string; // URL to avatar image
  metadata?: IndianContext;
}

export interface Relationship {
  id: string;
  fromId: string; // Source person ID
  toId: string; // Target person ID
  type: RelationType;
  metadata?: {
    isCurrent?: boolean; // For spouses (divorce/separation)
    order?: number; // For multiple spouses (1st wife, 2nd wife)
  };
}

export interface FamilyGraph {
  nodes: Record<string, Person>;
  edges: Relationship[];
}

// Layout specific types
export interface FamilyNodeData extends Person, Record<string, unknown> {
  generation: number; // Rank in the tree (0 = Root)
  spouseIds?: string[]; // Derived for layout
  childrenIds?: string[]; // Derived for layout
  siblingIds?: string[]; // Derived for layout
  width?: number;
  height?: number;
}

export type LayoutNode = Node<FamilyNodeData, string>;
export type LayoutEdge = Edge;
