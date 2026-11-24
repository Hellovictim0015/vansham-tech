import { apiClient } from "@/lib/api/client";
import {
  CreateTreeRequest,
  CreateTreeResponse,
  GetTreesResponse,
  FamilyTreeData,
  AddRootMemberRequest,
  AddRootMemberResponse,
  AddChildRequest,
  AddChildResponse,
  AddSpouseRequest,
  AddSpouseResponse,
} from "@/types/familyTreeV2";

export const familyTreeService = {
  // Create a new family tree
  createTree: async (data: CreateTreeRequest): Promise<CreateTreeResponse> => {
    const response = await apiClient.post<CreateTreeResponse>(
      "/family/treee",
      data,
    );
    return response.data;
  },

  // Get all trees for the authenticated user
  getTrees: async (): Promise<GetTreesResponse> => {
    const response = await apiClient.get<GetTreesResponse>("/family/trees");
    return response.data;
  },

  // Get members and spouses of the user's tree
  getTreeMembers: async (): Promise<FamilyTreeData> => {
    const response = await apiClient.get<FamilyTreeData>("/family/tree");
    return response.data;
  },

  // Add root member to a tree
  addRootMember: async (
    data: AddRootMemberRequest,
  ): Promise<AddRootMemberResponse> => {
    const response = await apiClient.post<AddRootMemberResponse>(
      "/family/member/root",
      data,
    );
    return response.data;
  },

  // Add a child to a parent member
  addChild: async (data: AddChildRequest): Promise<AddChildResponse> => {
    const response = await apiClient.post<AddChildResponse>(
      "/family/member/child",
      data,
    );
    return response.data;
  },

  // Add a spouse to a member
  addSpouse: async (data: AddSpouseRequest): Promise<AddSpouseResponse> => {
    const response = await apiClient.post<AddSpouseResponse>(
      "/family/member/spouse",
      data,
    );
    return response.data;
  },
};
