// V2 Family Tree API Types

export type MemberRole = "ROOT" | "CHILD" | "SPOUSE";

export interface TreeMember {
  id: number;
  tree_id: number;
  parent_id: number | null;
  level: number;
  full_name: string;
  gender: string;
  created_at: string;
  role: MemberRole;
}

export interface SpouseRelation {
  id: number;
  member_id: number;
  spouse_id: number;
}

export interface FamilyTreeData {
  tree_id: number;
  members: TreeMember[];
  spouses: SpouseRelation[];
}

export interface FamilyTree {
  id: number;
  user_id: number;
  tree_name: string;
  created_at: string;
}

// API Request types
export interface CreateTreeRequest {
  tree_name: string;
}

export interface AddRootMemberRequest {
  full_name: string;
  gender: string;
}

export interface AddChildRequest {
  parent_id: number;
  full_name: string;
  gender: string;
}

export interface AddSpouseRequest {
  member_id: number;
  full_name: string;
  gender: string;
}

// API Response types
export interface CreateTreeResponse {
  success: boolean;
  message: string;
  data: {
    tree_id: number;
    tree_name: string;
  };
}

export interface AddRootMemberResponse {
  message: string;
  member_id: number;
  tree_id: number;
}

export interface AddChildResponse {
  message: string;
  member_id: number;
  tree_id: number;
}

export interface AddSpouseResponse {
  message: string;
  spouse_id: number;
  tree_id: number;
}

export interface GetTreesResponse {
  data: FamilyTree[];
}
