"use client";

import React, { useEffect, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useFamilyTreeV2Store } from "@/hooks/useFamilyTreeV2Store";
import { useTrees, useTreeMembers } from "@/hooks/api/useFamilyTree";
import FamilyNodeV2 from "@/components/family-tree-v2/FamilyNodeV2";
import { EditorPanelV2 } from "@/components/family-tree-v2/EditorPanelV2";
import { CreateTreeDialog } from "@/components/family-tree-v2/CreateTreeDialog";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  TreeDeciduous,
  ShieldCheck,
  HelpCircle,
  Plus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const nodeTypes: NodeTypes = {
  familyNodeV2: FamilyNodeV2,
};

const FamilyTreeContent = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectedMemberId,
    selectMember,
    setTreeData,
  } = useFamilyTreeV2Store();

  const { data: treesData, isLoading: treesLoading } = useTrees();

  const {
    data: treeData,
    isLoading: membersLoading,
    refetch: refetchMembers,
  } = useTreeMembers(!!treesData?.data && treesData.data.length > 0);

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "root">("create");

  const hasTrees = !!treesData?.data && treesData.data.length > 0;
  const hasMembers = !!treeData?.members && treeData.members.length > 0;

  // Sync API data → Zustand store → ReactFlow
  useEffect(() => {
    if (treeData?.members) {
      setTreeData(treeData.members, treeData.spouses || []);
    }
  }, [treeData, setTreeData]);

  const isLoading = treesLoading || membersLoading;
  const isEditorOpen = !!selectedMemberId;

  // No tree exists — show creation prompt
  if (!treesLoading && !hasTrees) {
    return (
      <div className="flex h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] w-full items-center justify-center bg-slate-50 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-200">
            <TreeDeciduous className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Start Your Family Tree
          </h1>
          <p className="text-slate-500">
            Create your first heritage tree and begin mapping your family
            legacy. It only takes a moment.
          </p>
          <Button
            onClick={() => {
              setDialogMode("create");
              setShowDialog(true);
            }}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold h-14 px-8 rounded-2xl shadow-xl shadow-orange-200 text-base"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Family Tree
          </Button>

          <CreateTreeDialog
            isOpen={showDialog}
            onClose={() => setShowDialog(false)}
            hasTree={false}
          />
        </motion.div>
      </div>
    );
  }

  // Tree exists but no members — prompt for root
  if (!membersLoading && hasTrees && !hasMembers) {
    return (
      <div className="flex h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] w-full items-center justify-center bg-slate-50 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-sky-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-sky-200">
            <Plus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Add Your First Ancestor
          </h1>
          <p className="text-slate-500">
            Your tree{" "}
            <span className="font-bold">
              &quot;{treesData?.data[0]?.tree_name}&quot;
            </span>{" "}
            is ready. Add the root ancestor to begin building your lineage.
          </p>
          <Button
            onClick={() => {
              setDialogMode("root");
              setShowDialog(true);
            }}
            className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold h-14 px-8 rounded-2xl shadow-xl shadow-sky-200 text-base"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Root Member
          </Button>

          <CreateTreeDialog
            isOpen={showDialog}
            onClose={() => setShowDialog(false)}
            hasTree={true}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] w-full bg-slate-50 overflow-hidden font-sans">
      {/* Main Canvas Area */}
      <div
        className={cn(
          "relative transition-all duration-500 w-full h-full min-h-[400px]",
          isEditorOpen ? "md:w-[70%]" : "w-full",
        )}
      >
        {/* Header Bar */}
        <div className="absolute top-3 left-3 right-3 md:top-6 md:left-6 md:right-6 z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pointer-events-none">
          <div className="flex gap-3 pointer-events-auto">
            <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
              <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
                <TreeDeciduous className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-black text-sm tracking-tighter uppercase leading-none">
                  Family Tree
                </h1>
                <p className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  API-Backed • {treesData?.data[0]?.tree_name}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchMembers()}
              className="bg-white/80 backdrop-blur-md shadow-lg border-white h-12 w-12 rounded-2xl hover:bg-white"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 text-slate-600 animate-spin" />
              ) : (
                <RefreshCw className="h-5 w-5 text-slate-600" />
              )}
            </Button>
          </div>

          <div className="pointer-events-auto bg-white/80 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-2xl shadow-lg border border-white flex items-center gap-2 md:gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Members
              </span>
              <span className="text-sm font-bold text-slate-900">
                {treeData?.members?.length || 0}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Relations
              </span>
              <span className="text-sm font-bold text-slate-900">
                {treeData?.spouses?.length
                  ? Math.floor(treeData.spouses.length / 2)
                  : 0}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-slate-900"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onPaneClick={() => selectMember(null)}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          minZoom={0.05}
          maxZoom={2}
          className="bg-slate-50"
          defaultEdgeOptions={{
            style: { strokeWidth: 3 },
          }}
        >
          <Background color="#cbd5e1" gap={24} size={1} />
          <Controls
            position="bottom-left"
            className="!bg-white !border-white !shadow-xl !rounded-xl overflow-hidden scale-110 ml-4 mb-4"
          />
          <MiniMap
            position="bottom-right"
            className="!bg-white !border-white !shadow-2xl !rounded-2xl !w-36 !h-24 md:!w-48 md:!h-32 mb-4 mr-4 hidden sm:block"
            maskColor="rgba(241, 245, 249, 0.7)"
            nodeColor={(node) =>
              (node.data as any).gender?.toLowerCase() === "male"
                ? "#0ea5e9"
                : "#f43f5e"
            }
          />
        </ReactFlow>
      </div>

      {/* Editor Sidebar — full-width overlay on mobile, side panel on desktop */}
      {isEditorOpen && (
        <div
          className={cn(
            "transition-all duration-500 shadow-2xl z-20",
            "fixed inset-0 md:static md:inset-auto",
            "w-full md:w-[30%]",
          )}
        >
          <EditorPanelV2 members={treeData?.members || []} />
        </div>
      )}
    </div>
  );
};

export default function FamilyTreePage() {
  return (
    <ReactFlowProvider>
      <FamilyTreeContent />
    </ReactFlowProvider>
  );
}
