import * as React from "react";
import { flatten, values } from "lodash";

import type { ModuleCode, PreReqTree } from "@/types/primitives/module";
import { cn } from "@/lib/utils";
import { notNull } from "@/types/utils";

import styles from "./ModuleTree.module.scss";

type Props = {
  moduleCode: ModuleCode;
  fulfillRequirements?: readonly ModuleCode[];
  prereqTree?: PreReqTree;
};

interface TreeDisplay {
  layer: number;
  node: PreReqTree;
  isPrereq?: boolean;
  rootNode: ModuleCode;
}

const GRADE_REQUIREMENT_SEPARATOR = ":";
const MODULE_NAME_WILDCARD = "%";
const PASSING_GRADE = "D";

const formatConditional = (node: PreReqTree) => {
  if (typeof node === "string") return node;
  if ("nOf" in node) {
    const requiredNum = node.nOf[0];
    return `at least ${requiredNum} of`;
  }
  if ("or" in node) {
    return "one of";
  }
  return "all of";
};

type NodeName = {
  prefix?: string;
  name: string;
};
const nodeName = (node: PreReqTree): NodeName => {
  if (typeof node !== "string") {
    return { name: Object.keys(node)[0]! };
  }
  const res: NodeName = { name: node };
  if (res.name.includes(GRADE_REQUIREMENT_SEPARATOR)) {
    const [moduleName, requiredGrade] = res.name.split(
      GRADE_REQUIREMENT_SEPARATOR,
    );
    if (requiredGrade !== PASSING_GRADE) {
      res.prefix = `Minimally ${requiredGrade} for`;
    }
    res.name = moduleName!;
  }
  if (res.name.includes(MODULE_NAME_WILDCARD)) {
    const [beforeWildcard, afterWildcard] =
      res.name.split(MODULE_NAME_WILDCARD);
    res.prefix = "Course starting with";
    res.name = `"${beforeWildcard}" ${afterWildcard}`;
  }
  res.prefix?.trim();
  res.name.trim();
  return res;
};

const unwrapLayer = (node: PreReqTree) => {
  if (typeof node === "string") {
    return [node];
  }
  if ("nOf" in node) {
    return node.nOf[1];
  }
  return flatten(values(node).filter(notNull));
};

const Branch: React.FC<{
  nodes: PreReqTree[];
  layer: number;
  rootNode: ModuleCode;
}> = (props) => (
  <ul className={styles.tree}>
    {props.nodes.map((child, idx) => (
      <li
        className={styles.branch}
        key={typeof child === "string" ? nodeName(child).name : idx}
      >
        <Tree node={child} layer={props.layer} rootNode={props.rootNode} />
      </li>
    ))}
  </ul>
);

const Tree: React.FC<TreeDisplay> = (props) => {
  const { layer, node, isPrereq } = props;

  const isConditional = typeof node !== "string";
  const { prefix, name } = nodeName(node);

  if (isConditional) {
    return (
      <>
        <div
          className={cn(
            styles.node,
            styles.conditional,
            isPrereq && styles.prereqNode,
          )}
        >
          {formatConditional(node)}
        </div>
        <Branch
          nodes={unwrapLayer(node)}
          layer={layer + 1}
          rootNode={props.rootNode}
        />
      </>
    );
  }

  return (
    <div
      className={cn(
        styles.node,
        styles.moduleNode,
        isPrereq && styles.prereqNode,
        name == props.rootNode && styles.rootNode,
      )}
    >
      {prefix && <span className={styles.prefix}>{prefix}</span>}
      <div className={styles.link}>{name}</div>
    </div>
  );
};

export const ModuleTreeComponent: React.FC<Props> = (props) => {
  const { fulfillRequirements, prereqTree, moduleCode } = props;
  if (!prereqTree || Object.keys(prereqTree).length === 0) {
    return <></>;
  }

  return (
    <>
      <h3 className="font-semibold">Prerequisites</h3>
      <div className={"flex items-center overflow-y-auto p-4"}>
        {fulfillRequirements && fulfillRequirements.length > 0 && (
          <>
            <ul className={styles.prereqTree}>
              {fulfillRequirements.map((fulfilledModule) => (
                <li
                  key={fulfilledModule}
                  className={cn(styles.branch, styles.prereqBranch)}
                >
                  <Tree
                    layer={0}
                    node={fulfilledModule}
                    isPrereq
                    rootNode={props.moduleCode}
                  />
                </li>
              ))}
            </ul>

            <div className={cn(styles.node, styles.conditional)}>needs</div>
          </>
        )}

        <ul className={styles.tree}>
          <li className={cn(styles.branch)}>
            <Tree layer={1} node={moduleCode} rootNode={props.moduleCode} />

            {prereqTree && (
              <Branch
                nodes={[prereqTree]}
                layer={2}
                rootNode={props.moduleCode}
              />
            )}
          </li>
        </ul>
      </div>
    </>
  );
};
