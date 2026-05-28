"use client";

import { useMemo } from "react";
import {
  Background,
  Controls,
  Edge,
  Node,
  ReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AssessmentResult, skillShortLabels, skillsOrder } from "@/lib/types";
import { formatScore } from "@/lib/utils";

function tone(score: number) {
  if (score < 4) return { bg: "#fee2e2", border: "#ef4444", color: "#991b1b" };
  if (score < 6) return { bg: "#ffedd5", border: "#f97316", color: "#9a3412" };
  if (score < 8) return { bg: "#dbeafe", border: "#3b82f6", color: "#1d4ed8" };
  return { bg: "#dcfce7", border: "#22c55e", color: "#166534" };
}

export function MindMap({ result }: { result: AssessmentResult }) {
  const { nodes, edges } = useMemo(() => {
    const radiusX = 360;
    const radiusY = 230;
    const centerX = 420;
    const centerY = 280;

    const centerNode: Node = {
      id: "center",
      position: { x: centerX, y: centerY },
      data: {
        label: (
          <div className="min-w-44 text-center">
            <div className="text-sm font-semibold">{result.student.name}</div>
            <div className="text-2xl font-bold">{formatScore(result.overallScore)}</div>
            <div className="text-xs">{result.overallLevel}</div>
          </div>
        )
      },
      style: {
        borderRadius: 8,
        border: "2px solid #0369a1",
        background: "#f0f9ff",
        color: "#0c4a6e",
        padding: 12,
        width: 190
      }
    };

    const skillNodes: Node[] = skillsOrder.map((skill, index) => {
      const angle = (2 * Math.PI * index) / skillsOrder.length - Math.PI / 2;
      const score = result.skills[skill].score;
      const colors = tone(score);

      return {
        id: skill,
        position: {
          x: centerX + Math.cos(angle) * radiusX,
          y: centerY + Math.sin(angle) * radiusY
        },
        data: {
          label: (
            <div className="min-w-32 text-center">
              <div className="text-xs font-semibold uppercase">{skillShortLabels[skill]}</div>
              <div className="text-xl font-bold">{formatScore(score)}</div>
              <div className="text-xs">{result.skills[skill].level}</div>
            </div>
          )
        },
        style: {
          borderRadius: 8,
          border: `2px solid ${colors.border}`,
          background: colors.bg,
          color: colors.color,
          padding: 10,
          width: 150
        }
      };
    });

    const mapEdges: Edge[] = skillsOrder.map((skill) => ({
      id: `center-${skill}`,
      source: "center",
      target: skill,
      animated: false,
      style: { stroke: "#94a3b8", strokeWidth: 2 }
    }));

    return {
      nodes: [centerNode, ...skillNodes],
      edges: mapEdges
    };
  }, [result]);

  return (
    <div className="h-[520px] w-full overflow-hidden rounded-lg border bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
