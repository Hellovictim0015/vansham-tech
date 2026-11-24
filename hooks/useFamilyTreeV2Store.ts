import { create } from "zustand";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";
import { TreeMember, SpouseRelation } from "@/types/familyTreeV2";
import {
  V2LayoutNode,
  V2LayoutEdge,
  calculateV2Layout,
} from "@/lib/family-tree-v2-layout";

interface FamilyTreeV2State {
  nodes: V2LayoutNode[];
  edges: V2LayoutEdge[];
  selectedMemberId: number | null;

  // Actions
  setTreeData: (members: TreeMember[], spouses: SpouseRelation[]) => void;
  selectMember: (id: number | null) => void;

  // ReactFlow handlers
  onNodesChange: (changes: NodeChange<V2LayoutNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<V2LayoutEdge>[]) => void;
  onConnect: (connection: Connection) => void;
}

export const useFamilyTreeV2Store = create<FamilyTreeV2State>((set, get) => ({
  nodes: [],
  edges: [],
  selectedMemberId: null,

  setTreeData: (members, spouses) => {
    const { nodes, edges } = calculateV2Layout(members, spouses);
    set({ nodes, edges });
  },

  selectMember: (id) => set({ selectedMemberId: id }),

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    set({ edges: addEdge(connection, get().edges) });
  },
}));
