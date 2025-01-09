import { useState } from "react";
import { Check, ChevronDown, ChevronRight, X } from "lucide-react";

import type { ModuleCode, PreReqTree } from "@/types/primitives/module";
import type { StatusNode } from "@/utils/checkPrerequisites";
import { checkPrerequisite } from "@/utils/checkPrerequisites";

const StatusNodeItem = ({
  node,
  depth = 0,
}: {
  node: StatusNode;
  depth?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const renderContent = () => {
    switch (node.type) {
      case "module":
        return (
          <div className="flex items-center space-x-2">
            {node.fulfilled ? (
              <Check className="text-green-500" size={16} />
            ) : (
              <X className="text-red-500" size={16} />
            )}
            <span>{node.module}</span>
          </div>
        );
      case "and":
        return <span className="font-semibold">All of:</span>;
      case "or":
        return <span className="font-semibold">One of:</span>;
      case "nOf":
        return (
          <span className="font-semibold">
            {node.fulfilledCount} of {node.requiredCount} completed:
          </span>
        );
    }
  };

  return (
    <div
      style={{
        marginLeft: `${depth * 16}px`,
      }}
    >
      <div
        className="flex cursor-pointer items-center space-x-2"
        onClick={toggleOpen}
      >
        {node.children &&
          (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
        {renderContent()}
      </div>
      {isOpen && node.children && (
        <div className="mt-1">
          {node.children.map((child, index) => (
            <StatusNodeItem key={index} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const PrerequisiteStatusList = ({
  preReqTree,
  completedModules,
}: {
  preReqTree?: PreReqTree;
  completedModules: Set<ModuleCode>;
}) => {
  const { fulfilled, status } = checkPrerequisite(completedModules, preReqTree);

  return (
    <div className="rounded bg-white p-4 shadow">
      <h2 className="mb-4 text-xl font-bold">Prerequisite Status</h2>
      <div
        className={`mb-2 font-semibold ${fulfilled ? "text-green-600" : "text-red-600"}`}
      >
        {fulfilled ? "All prerequisites met" : "Some prerequisites not met"}
      </div>
      {status && <StatusNodeItem node={status} />}
    </div>
  );
};

export default PrerequisiteStatusList;
