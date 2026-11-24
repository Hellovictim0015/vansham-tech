import { Node, Edge } from "@xyflow/react";
import { TreeMember, SpouseRelation } from "@/types/familyTreeV2";

/**
 * V2 Family Tree Layout Engine
 * Converts API members[] + spouses[] into ReactFlow nodes and edges.
 */

const NODE_WIDTH = 220;
const NODE_HEIGHT = 120;
const SIBLING_GAP = 60;
const SPOUSE_GAP = 20;
const GENERATION_GAP = 200;

export interface V2NodeData extends Record<string, unknown> {
  memberId: number;
  full_name: string;
  gender: string;
  level: number;
  role: string;
  parent_id: number | null;
  spouseIds: number[];
  childrenIds: number[];
}

export type V2LayoutNode = Node<V2NodeData, string>;
export type V2LayoutEdge = Edge;

interface InternalNode {
  id: number;
  width: number;
  x: number;
  y: number;
  spouses: number[];
  children: number[];
  generation: number;
  member: TreeMember;
}

export const calculateV2Layout = (
  members: TreeMember[],
  spouses: SpouseRelation[],
): { nodes: V2LayoutNode[]; edges: V2LayoutEdge[] } => {
  if (!members || members.length === 0) {
    return { nodes: [], edges: [] };
  }

  // Build internal nodes map
  const nodeMap: Record<number, InternalNode> = {};
  members.forEach((m) => {
    nodeMap[m.id] = {
      id: m.id,
      width: NODE_WIDTH,
      x: 0,
      y: 0,
      spouses: [],
      children: [],
      generation: m.level,
      member: m,
    };
  });

  // Build a de-duplicated spouse map (each pair only once)
  const spousePairs = new Set<string>();
  spouses.forEach((s) => {
    const key = [
      Math.min(s.member_id, s.spouse_id),
      Math.max(s.member_id, s.spouse_id),
    ].join("-");
    if (!spousePairs.has(key) && nodeMap[s.member_id] && nodeMap[s.spouse_id]) {
      spousePairs.add(key);
      nodeMap[s.member_id].spouses.push(s.spouse_id);
      nodeMap[s.spouse_id].spouses.push(s.member_id);
    }
  });

  // Build parent→children links
  members.forEach((m) => {
    if (m.parent_id !== null && nodeMap[m.parent_id] && m.role !== "SPOUSE") {
      nodeMap[m.parent_id].children.push(m.id);
    }
  });

  // Identify root nodes: members that have no parent (or parent is missing)
  const potentialRoots = members.filter(
    (m) => m.parent_id === null || !nodeMap[m.parent_id],
  );

  const roots: number[] = [];
  const handledRoots = new Set<number>();

  // First pass: prefer non-SPOUSE members as primary roots
  potentialRoots.forEach((m) => {
    if (m.role !== "SPOUSE" && !handledRoots.has(m.id)) {
      roots.push(m.id);
      handledRoots.add(m.id);
      // Mark spouses as handled so we don't plot them as independent roots
      if (nodeMap[m.id]) {
        nodeMap[m.id].spouses.forEach((sId) => handledRoots.add(sId));
      }
    }
  });

  // Second pass: pick up any remaining nodes (e.g., marked SPOUSE but with no non-SPOUSE partner yet)
  potentialRoots.forEach((m) => {
    if (!handledRoots.has(m.id)) {
      roots.push(m.id);
      handledRoots.add(m.id);
      if (nodeMap[m.id]) {
        nodeMap[m.id].spouses.forEach((sId) => handledRoots.add(sId));
      }
    }
  });

  roots.sort((a, b) => a - b);

  // Width calculation (recursive, tracks visited to avoid cycles)
  const visitedWidth = new Set<number>();
  const calculateWidth = (id: number): number => {
    if (visitedWidth.has(id)) return 0;
    visitedWidth.add(id);

    const node = nodeMap[id];
    if (!node) return 0;

    // Width of the couple (main node + its spouses)
    let coupleWidth = NODE_WIDTH;
    node.spouses.forEach((sId) => {
      if (!visitedWidth.has(sId)) {
        visitedWidth.add(sId);
        coupleWidth += SPOUSE_GAP + NODE_WIDTH;
      }
    });

    // Gather all unique children (from node and its spouses)
    const uniqueChildren = new Set<number>();
    [id, ...node.spouses].forEach((pId) => {
      if (nodeMap[pId]) {
        nodeMap[pId].children.forEach((cId) => uniqueChildren.add(cId));
      }
    });
    const children = Array.from(uniqueChildren);

    let childrenWidth = 0;
    children.forEach((cId, idx) => {
      childrenWidth += calculateWidth(cId);
      if (idx < children.length - 1) childrenWidth += SIBLING_GAP;
    });

    node.width = Math.max(coupleWidth, childrenWidth);
    return node.width;
  };

  // Reset visited for width calc
  roots.forEach((rId) => {
    visitedWidth.clear();
    calculateWidth(rId);
  });

  // But we need a global pass — let's redo properly
  visitedWidth.clear();
  roots.forEach((rId) => calculateWidth(rId));

  // Position assignment
  const visitedPos = new Set<number>();
  const assignPositions = (id: number, startX: number, startY: number) => {
    if (visitedPos.has(id)) return;
    visitedPos.add(id);

    const node = nodeMap[id];
    if (!node) return;

    const blockWidth = node.width;

    // Figure out couple width for this node
    const spousesNotVisited = node.spouses.filter(
      (sId) => !visitedPos.has(sId),
    );
    const coupleWidth =
      NODE_WIDTH + spousesNotVisited.length * (NODE_WIDTH + SPOUSE_GAP);

    const nodeX = startX + (blockWidth - coupleWidth) / 2;
    node.x = nodeX;
    node.y = startY;

    let currentSpouseX = nodeX + NODE_WIDTH + SPOUSE_GAP;
    spousesNotVisited.forEach((sId) => {
      visitedPos.add(sId);
      if (nodeMap[sId]) {
        nodeMap[sId].x = currentSpouseX;
        nodeMap[sId].y = startY;
        currentSpouseX += NODE_WIDTH + SPOUSE_GAP;
      }
    });

    // Gather all unique children
    const uniqueChildren = new Set<number>();
    [id, ...node.spouses].forEach((pId) => {
      if (nodeMap[pId]) {
        nodeMap[pId].children.forEach((cId) => uniqueChildren.add(cId));
      }
    });
    const children = Array.from(uniqueChildren);

    if (children.length > 0) {
      const totalChildrenWidth =
        children.reduce(
          (acc, cId) => acc + (nodeMap[cId]?.width || NODE_WIDTH),
          0,
        ) +
        (children.length - 1) * SIBLING_GAP;

      const parentCenter = nodeX + coupleWidth / 2;
      let currentChildStartX = parentCenter - totalChildrenWidth / 2;

      children.forEach((cId) => {
        const cWidth = nodeMap[cId]?.width || NODE_WIDTH;
        assignPositions(cId, currentChildStartX, startY + GENERATION_GAP);
        currentChildStartX += cWidth + SIBLING_GAP;
      });
    }
  };

  let rootX = 0;
  roots.forEach((rId) => {
    assignPositions(rId, rootX, 0);
    rootX += (nodeMap[rId]?.width || 0) + 200;
  });

  // Build ReactFlow nodes
  const nodes: V2LayoutNode[] = Object.values(nodeMap).map((node) => ({
    id: String(node.id),
    type: "familyNodeV2",
    position: { x: node.x, y: node.y },
    data: {
      memberId: node.id,
      full_name: node.member.full_name,
      gender: node.member.gender,
      level: node.member.level,
      role: node.member.role,
      parent_id: node.member.parent_id,
      spouseIds: node.spouses,
      childrenIds: node.children,
    },
  }));

  // Build ReactFlow edges
  const edges: V2LayoutEdge[] = [];

  // Parent → Child edges
  members.forEach((m) => {
    if (m.parent_id !== null && m.role !== "SPOUSE" && nodeMap[m.parent_id]) {
      edges.push({
        id: `parent-${m.parent_id}-child-${m.id}`,
        source: String(m.parent_id),
        target: String(m.id),
        type: "step",
        style: { stroke: "#0ea5e9", strokeWidth: 3 },
        animated: true,
      });
    }
  });

  // Spouse edges (de-duplicated)
  const addedSpouseEdges = new Set<string>();
  spouses.forEach((s) => {
    const key = [
      Math.min(s.member_id, s.spouse_id),
      Math.max(s.member_id, s.spouse_id),
    ].join("-");
    if (
      !addedSpouseEdges.has(key) &&
      nodeMap[s.member_id] &&
      nodeMap[s.spouse_id]
    ) {
      addedSpouseEdges.add(key);
      edges.push({
        id: `spouse-${key}`,
        source: String(s.member_id),
        target: String(s.spouse_id),
        type: "straight",
        style: { stroke: "#f43f5e", strokeWidth: 3 },
        animated: false,
        label: "💑",
      });
    }
  });

  return { nodes, edges };
};
