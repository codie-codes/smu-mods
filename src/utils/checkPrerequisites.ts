import type { ModuleCode, PreReqTree } from "@/types/primitives/module";

export type StatusNode = {
  type: "module" | "and" | "or" | "nOf";
  fulfilled: boolean;
  children?: StatusNode[];
  module?: ModuleCode;
  requiredCount?: number;
  fulfilledCount?: number;
};

export function checkPrerequisite(
  completedModules: Set<ModuleCode>,
  preReqTree?: PreReqTree,
): { fulfilled: boolean; status?: StatusNode } {
  if (!preReqTree) {
    return { fulfilled: true };
  }
  function check(tree: PreReqTree): StatusNode {
    if (typeof tree === "string") {
      return {
        type: "module",
        fulfilled: completedModules.has(tree),
        module: tree,
      };
    }

    if ("and" in tree) {
      const children = tree.and.map(check);
      return {
        type: "and",
        fulfilled: children.every((child) => child.fulfilled),
        children,
      };
    }

    if ("or" in tree) {
      const children = tree.or.map(check);
      return {
        type: "or",
        fulfilled: children.some((child) => child.fulfilled),
        children,
      };
    }

    if ("nOf" in tree) {
      const [n, subTrees] = tree.nOf;
      const children = subTrees.map(check);
      const fulfilledCount = children.filter((child) => child.fulfilled).length;
      return {
        type: "nOf",
        fulfilled: fulfilledCount >= n,
        children,
        requiredCount: n,
        fulfilledCount,
      };
    }

    throw new Error("Invalid PreReqTree structure");
  }

  const status = check(preReqTree);
  return { fulfilled: status.fulfilled, status };
}

export function formatStatus(status: StatusNode, indent = ""): string {
  let result = "";
  switch (status.type) {
    case "module":
      result += `${indent}${status.module}: ${status.fulfilled ? "Completed" : "Not completed"}\n`;
      break;
    case "and":
      result += `${indent}All of:\n`;
      status.children?.forEach((child) => {
        result += formatStatus(child, indent + "  ");
      });
      break;
    case "or":
      result += `${indent}One of:\n`;
      status.children?.forEach((child) => {
        result += formatStatus(child, indent + "  ");
      });
      break;
    case "nOf":
      result += `${indent}${status.fulfilledCount} of ${status.requiredCount} completed:\n`;
      status.children?.forEach((child) => {
        result += formatStatus(child, indent + "  ");
      });
      break;
  }
  return result;
}
