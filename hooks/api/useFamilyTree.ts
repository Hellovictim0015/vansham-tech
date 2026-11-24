import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { familyTreeService } from "@/services/api/familyTree.service";
import {
  CreateTreeRequest,
  AddRootMemberRequest,
  AddChildRequest,
  AddSpouseRequest,
} from "@/types/familyTreeV2";
import { toast } from "sonner";

// Query: List all trees
export const useTrees = () => {
  return useQuery({
    queryKey: ["trees"],
    queryFn: () => familyTreeService.getTrees(),
    staleTime: 1000 * 60 * 5, // 5 min
  });
};

// Query: Get tree members + spouses
export const useTreeMembers = (enabled = true) => {
  return useQuery({
    queryKey: ["treeMembers"],
    queryFn: async () => {
      const data = await familyTreeService.getTreeMembers();
      console.log("Fetched tree members:", data);
      return data;
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2 min
  });
};

// Mutation: Create a new tree
export const useCreateTree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTreeRequest) => familyTreeService.createTree(data),
    onSuccess: (data) => {
      console.log("Tree creation successful:", data);
      queryClient.invalidateQueries({ queryKey: ["trees"] });
      toast.success(data.message || "Family tree created successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create tree.";
      toast.error(message);
    },
  });
};

// Mutation: Add root member
export const useAddRootMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddRootMemberRequest) =>
      familyTreeService.addRootMember(data),
    onSuccess: (data) => {
      console.log("Root member added successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["treeMembers"] });
      queryClient.invalidateQueries({ queryKey: ["trees"] });
      toast.success("Root member added successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add root member.";
      toast.error(message);
    },
  });
};

// Mutation: Add child
export const useAddChild = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddChildRequest) => familyTreeService.addChild(data),
    onSuccess: (data) => {
      console.log("Child added successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["treeMembers"] });
      toast.success("Child member added successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add child.";
      toast.error(message);
    },
  });
};

// Mutation: Add spouse
export const useAddSpouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddSpouseRequest) => familyTreeService.addSpouse(data),
    onSuccess: (data) => {
      console.log("Spouse added successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["treeMembers"] });
      toast.success("Spouse added successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add spouse.";
      toast.error(message);
    },
  });
};
