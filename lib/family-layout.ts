import {
  Person,
  Relationship,
  LayoutNode,
  LayoutEdge,
} from "@/types/family-v2";

/**
 * Family Tree Layout Engine
 * Optimized Recursive Subtree Positioning
 */

const NODE_WIDTH = 220;
const NODE_HEIGHT = 120;
const SIBLING_GAP = 60;
const SPOUSE_GAP = 20;
const GENERATION_GAP = 180;

interface ProcessedNode {
  id: string;
  width: number;
  x: number;
  y: number;
  spouses: string[];
  children: string[];
  parents: string[];
  generation: number;
}

export const calculateLayout = (
  people: Record<string, Person>,
  relationships: Relationship[],
): { nodes: LayoutNode[]; edges: LayoutEdge[] } => {
  const processedNodes: Record<string, ProcessedNode> = {};
  const rootCandidates = new Set(Object.keys(people));

  Object.keys(people).forEach((id) => {
    processedNodes[id] = {
      id,
      width: NODE_WIDTH,
      x: 0,
      y: 0,
      spouses: [],
      children: [],
      parents: [],
      generation: 0,
    };
  });

  relationships.forEach((rel) => {
    if (!processedNodes[rel.fromId] || !processedNodes[rel.toId]) return;

    const type = rel.type.toLowerCase();
    if (type === "parent" || type === "father" || type === "mother") {
      processedNodes[rel.fromId].children.push(rel.toId);
      processedNodes[rel.toId].parents.push(rel.fromId);
      rootCandidates.delete(rel.toId);
    } else if (type === "child") {
      // For "child" relation, fromId is Parent, toId is Child (based on our store logic)
      processedNodes[rel.fromId].children.push(rel.toId);
      processedNodes[rel.toId].parents.push(rel.fromId);
      rootCandidates.delete(rel.toId);
    } else if (type === "spouse") {
      processedNodes[rel.fromId].spouses.push(rel.toId);
      processedNodes[rel.toId].spouses.push(rel.fromId);
    }
  });

  // DFS to assign generations and avoid infinite loops
  const visitedGen = new Set<string>();
  const assignGenerationsRecursive = (id: string, gen: number) => {
    if (visitedGen.has(id)) return;
    visitedGen.add(id);

    processedNodes[id].generation = Math.max(
      processedNodes[id].generation,
      gen,
    );

    processedNodes[id].spouses.forEach((sId) => {
      processedNodes[sId].generation = processedNodes[id].generation;
      // Don't mark spouse as visited here, we want to trace children from both
    });

    processedNodes[id].children.forEach((cId) => {
      assignGenerationsRecursive(cId, gen + 1);
    });
  };

  // Sort roots by id for stable layout
  const roots = Array.from(rootCandidates).sort();
  roots.forEach((rId) => assignGenerationsRecursive(rId, 0));

  // Width calculation
  const visitedWidth = new Set<string>();
  const calculateWidth = (id: string): number => {
    if (visitedWidth.has(id)) return 0;
    visitedWidth.add(id);

    const node = processedNodes[id];
    let coupleWidth = NODE_WIDTH;
    node.spouses.forEach((sId) => {
      visitedWidth.add(sId);
      coupleWidth += SPOUSE_GAP + NODE_WIDTH;
    });

    const uniqueChildren = new Set<string>();
    [id, ...node.spouses].forEach((pId) => {
      processedNodes[pId].children.forEach((cId) => uniqueChildren.add(cId));
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
  roots.forEach((rId) => calculateWidth(rId));

  // Positioning
  const visitedPos = new Set<string>();
  const assignPositions = (id: string, startX: number, startY: number) => {
    if (visitedPos.has(id)) return;
    visitedPos.add(id);

    const node = processedNodes[id];
    const blockWidth = node.width;

    // Center node group in its block
    const coupleWidth =
      NODE_WIDTH + node.spouses.length * (NODE_WIDTH + SPOUSE_GAP);
    const nodeX = startX + (blockWidth - coupleWidth) / 2;

    node.x = nodeX;
    node.y = startY;

    let currentSpouseX = nodeX + NODE_WIDTH + SPOUSE_GAP;
    node.spouses.forEach((sId) => {
      visitedPos.add(sId);
      processedNodes[sId].x = currentSpouseX;
      processedNodes[sId].y = startY;
      currentSpouseX += NODE_WIDTH + SPOUSE_GAP;
    });

    const uniqueChildren = new Set<string>();
    [id, ...node.spouses].forEach((pId) => {
      processedNodes[pId].children.forEach((cId) => uniqueChildren.add(cId));
    });
    const children = Array.from(uniqueChildren);

    if (children.length > 0) {
      const totalChildrenWidth =
        children.reduce(
          (acc, cId) => acc + (processedNodes[cId].width || NODE_WIDTH),
          0,
        ) +
        (children.length - 1) * SIBLING_GAP;

      const parentCenter = nodeX + coupleWidth / 2;
      let currentChildStartX = parentCenter - totalChildrenWidth / 2;

      children.forEach((cId) => {
        const cWidth = processedNodes[cId].width || NODE_WIDTH;
        assignPositions(cId, currentChildStartX, startY + GENERATION_GAP);
        currentChildStartX += cWidth + SIBLING_GAP;
      });
    }
  };

  let rootX = 0;
  roots.forEach((rId) => {
    assignPositions(rId, rootX, 0);
    rootX += (processedNodes[rId].width || 0) + 200;
  });

  // Export
  const nodes: LayoutNode[] = Object.values(processedNodes).map((node) => ({
    id: node.id,
    type: "familyNode",
    position: { x: node.x, y: node.y },
    data: {
      ...people[node.id],
      generation: node.generation,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    },
  }));

  const edges: LayoutEdge[] = relationships.map((rel) => ({
    id: rel.id,
    source: rel.fromId,
    target: rel.toId,
    type: rel.type === "spouse" ? "straight" : "step",
    style: {
      stroke: rel.type === "spouse" ? "#f43f5e" : "#0ea5e9",
      strokeWidth: 3,
    },
    animated: rel.type !== "spouse",
  }));

  return { nodes, edges };
};
