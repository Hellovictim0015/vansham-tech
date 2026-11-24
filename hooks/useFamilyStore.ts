import { create } from "zustand";
import {
  Person,
  Relationship,
  LayoutNode,
  LayoutEdge,
} from "@/types/family-v2";
import { fetchFamilyTree } from "@/services/family";
import { calculateLayout } from "@/lib/family-layout";
import {
  addEdge,
  Connection,
  EdgeChange,
  NodeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";

interface FamilyState {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  people: Record<string, Person>;
  relationships: Relationship[];
  selectedMemberId: string | null;
  isLoading: boolean;

  // Actions
  loadTree: () => Promise<void>;
  selectMember: (id: string | null) => void;
  updateMember: (id: string, updates: Partial<Person>) => void;
  addMember: (
    person: Person,
    relativeId?: string,
    relationType?: Relationship["type"],
  ) => void;
  deleteMember: (id: string) => void;

  // React Flow Actions
  onNodesChange: (changes: NodeChange<LayoutNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<LayoutEdge>[]) => void;
  onConnect: (connection: Connection) => void;
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  nodes: [],
  edges: [],
  people: {},
  relationships: [],
  selectedMemberId: null,
  isLoading: false,

  loadTree: async () => {
    set({ isLoading: true });
    try {
      const { nodes: peopleMap, edges: rels } = await fetchFamilyTree();
      const { nodes, edges } = calculateLayout(peopleMap, rels);

      set({
        people: peopleMap,
        relationships: rels,
        nodes,
        edges,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load family tree", error);
      set({ isLoading: false });
    }
  },

  selectMember: (id) => set({ selectedMemberId: id }),

  updateMember: (id, updates) => {
    const people = { ...get().people };
    if (!people[id]) return;

    people[id] = { ...people[id], ...updates };

    // Recalculate layout if name or something affecting UI changed (though usually only relationships affect it)
    const { nodes, edges } = calculateLayout(people, get().relationships);
    set({ people, nodes, edges });
  },

  addMember: (person, relativeId, relationType) => {
    const newId = `v3-${Date.now()}`;
    const newPerson = { ...person, id: newId };
    const people = { ...get().people, [newId]: newPerson };

    const relationships = [...get().relationships];

    if (relativeId && relationType) {
      const newRel: Relationship = {
        id: `r-v3-${Date.now()}`,
        fromId: relationType === "child" ? relativeId : newId,
        toId: relationType === "child" ? newId : relativeId,
        type:
          relationType === "father" || relationType === "mother"
            ? "parent"
            : relationType,
      };

      if (relationType === "spouse") {
        newRel.fromId = relativeId;
        newRel.toId = newId;
      }

      relationships.push(newRel);
    }

    const { nodes, edges } = calculateLayout(people, relationships);
    set({ people, relationships, nodes, edges, selectedMemberId: newId });
  },

  deleteMember: (id) => {
    const people = { ...get().people };
    delete people[id];

    const relationships = get().relationships.filter(
      (rel) => rel.fromId !== id && rel.toId !== id,
    );

    const { nodes, edges } = calculateLayout(people, relationships);
    set({
      people,
      relationships,
      nodes,
      edges,
      selectedMemberId:
        get().selectedMemberId === id ? null : get().selectedMemberId,
    });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
}));
