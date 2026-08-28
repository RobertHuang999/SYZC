import { GripVerticalIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ApprovalNode, ApproverObjectType } from "../domain/types"
import { PERSON_OPTIONS, ROLE_OPTIONS } from "../mock/reference-data.mock"
import { createEmptyApprovalNode } from "../lib/validation"

type ApprovalNodeEditorProps = {
  nodes: ApprovalNode[]
  onChange: (nodes: ApprovalNode[]) => void
}

export function ApprovalNodeEditor({ nodes, onChange }: ApprovalNodeEditorProps) {
  const updateNode = (id: string, patch: Partial<ApprovalNode>) => {
    onChange(
      nodes.map((node) => (node.id === id ? { ...node, ...patch } : node))
    )
  }

  const removeNode = (id: string) => {
    if (nodes.length <= 1) return
    const next = nodes
      .filter((node) => node.id !== id)
      .map((node, index) => ({ ...node, sequence: index + 1 }))
    onChange(next)
  }

  const addNode = () => {
    onChange([
      ...nodes,
      { ...createEmptyApprovalNode(), sequence: nodes.length + 1 },
    ])
  }

  const moveNode = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= nodes.length) return
    const next = [...nodes]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    onChange(next.map((node, nodeIndex) => ({ ...node, sequence: nodeIndex + 1 })))
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead className="w-20">节点序号</TableHead>
              <TableHead className="w-40">审批对象类型</TableHead>
              <TableHead>审批对象</TableHead>
              <TableHead className="w-20">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodes.map((node, index) => (
              <TableRow key={node.id}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="上移节点"
                      onClick={() => moveNode(index, -1)}
                      disabled={index === 0}
                    >
                      <GripVerticalIcon className="size-4" />
                    </button>
                  </div>
                </TableCell>
                <TableCell>{node.sequence}</TableCell>
                <TableCell>
                  <Select
                    value={node.objectType || "none"}
                    onValueChange={(value) => {
                      if (!value || value === "none") return
                      updateNode(node.id, {
                        objectType: value as ApproverObjectType,
                        objectLabel: "",
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" disabled>
                        请选择
                      </SelectItem>
                      <SelectItem value="指定人员">指定人员</SelectItem>
                      <SelectItem value="指定角色">指定角色</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={node.objectLabel || "none"}
                    onValueChange={(value) => {
                      if (!value || value === "none") return
                      updateNode(node.id, { objectLabel: value })
                    }}
                    disabled={!node.objectType}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          node.objectType ? "请选择" : "请先选择审批对象类型"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" disabled>
                        请选择
                      </SelectItem>
                      {(node.objectType === "指定人员"
                        ? PERSON_OPTIONS
                        : node.objectType === "指定角色"
                          ? ROLE_OPTIONS
                          : []
                      ).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={nodes.length <= 1}
                    onClick={() => removeNode(node.id)}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addNode}>
        <PlusIcon className="size-4" />
        添加审批节点
      </Button>
      <p className="text-xs text-muted-foreground">
        至少 1 个节点；同一节点不可混选人员与角色（R27）
      </p>
    </div>
  )
}
