import { PathNode } from "@/components/path/path-node";
import { PathSectionMarker } from "@/components/path/path-section-marker";
import { useGameStore } from "@/lib/game/game-store";
import { getPathData } from "@/lib/game/path-data";
import type { PathNode as DomainPathNode, ReconstructedPathSection, PathUnitWithProgress, NodeStatus } from "@/types/domain";

export function PathMap({ onSelectNode }: { onSelectNode: (node: DomainPathNode) => void }) {
  const { progression } = useGameStore();
  const pathData = getPathData();

  if (!progression) {
    return <div>Loading...</div>;
  }

  // Reconstruct path with current progression state
  const path: { sections: ReconstructedPathSection[] } = {
    sections: pathData.sections.map(section => ({
      ...section,
      locked: !progression.unlockedSections.has(section.id),
      units: pathData.units
        .filter(unit => unit.sectionId === section.id)
        .map(unit => ({
          ...unit,
          locked: !progression.unlockedUnits.has(unit.id),
          completed: unit.nodes.every(nodeId => progression.completedNodes.has(nodeId)),
          nodes: pathData.nodes
            .filter(node => node.unitId === unit.id)
            .map(node => ({
              ...node,
              status: (progression.completedNodes.has(node.id)
                ? 'completed'
                : progression.unlockedUnits.has(node.unitId) &&
                  (node.prerequisites.length === 0 || node.prerequisites.every(prereq => progression.completedNodes.has(prereq)))
                ? 'available'
                : 'locked') as NodeStatus
            }))
        }))
    }))
  };

  const flat = path.sections.flatMap((section) =>
    section.units.flatMap((unit) =>
      unit.nodes.map((node) => ({
        section,
        unit,
        node
      }))
    )
  );

  const nextNodeId = flat.find((entry) => entry.node.status === "available")?.node.id;
  const flatIndexById = new Map(flat.map((entry, index) => [entry.node.id, index]));

  return (
    <section className="rounded-[36px] border border-zinc-200 bg-white px-4 py-10 sm:px-8 sm:py-14">
      <div className="relative mx-auto max-w-2xl">
        <div className="pointer-events-none absolute bottom-5 left-1/2 top-5 w-px -translate-x-1/2 bg-gradient-to-b from-zinc-200 via-zinc-100 to-transparent" />

        <div className="space-y-6">
          {path.sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <PathSectionMarker section={section} unit={section.units[0]} />

              {section.units.map((unit) => (
                <div key={unit.id} className="space-y-1">
                  {unit.order !== 1 ? (
                    <div className="pb-2 pt-6 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Unit {unit.order}</p>
                      <p className="text-sm font-semibold text-zinc-700">{unit.title}</p>
                    </div>
                  ) : null}

                  {unit.nodes.map((node, index) => {
                    const flatIndex = flatIndexById.get(node.id) ?? index;
                    return <PathNode key={node.id} node={node} index={flatIndex} isNext={node.id === nextNodeId} onSelect={onSelectNode} />;
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
