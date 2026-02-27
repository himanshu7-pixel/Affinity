import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  useCopingTools,
  useCreateCopingTool,
  useUpdateCopingTool,
  useDeleteCopingTool,
} from "../../hooks/useQueries";
import type { CopingTool } from "../../backend.d";
import { toast } from "sonner";

const EMPTY_TOOL: CopingTool = {
  title: "",
  category: "breathing",
  content: "",
  duration: BigInt(5),
};

export function AdminToolsTab() {
  const { data: tools, isLoading } = useCopingTools();
  const createTool = useCreateCopingTool();
  const updateTool = useUpdateCopingTool();
  const deleteTool = useDeleteCopingTool();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<CopingTool>(EMPTY_TOOL);

  function openCreate() {
    setForm(EMPTY_TOOL);
    setEditingIndex(null);
    setDialogOpen(true);
  }

  function openEdit(tool: CopingTool, index: number) {
    setForm(tool);
    setEditingIndex(index);
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      if (editingIndex !== null) {
        await updateTool.mutateAsync({ toolId: BigInt(editingIndex), updatedTool: form });
        toast.success("Tool updated");
      } else {
        await createTool.mutateAsync(form);
        toast.success("Tool created");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Could not save tool");
    }
  }

  async function handleDelete(index: number) {
    try {
      await deleteTool.mutateAsync(BigInt(index));
      toast.success("Tool deleted");
    } catch {
      toast.error("Could not delete tool");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {tools?.length ?? 0} coping tools
        </p>
        <Button size="sm" onClick={openCreate} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Tool
        </Button>
      </div>

      {isLoading ? (
        ["t1","t2","t3"].map((k) => <Skeleton key={k} className="h-20 rounded-2xl" />)
      ) : !tools || tools.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-3xl mb-3">📚</p>
          <p className="text-sm">No coping tools yet. Create the first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tools.map((tool, i) => (
            <motion.div
              key={`${tool.title}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="shadow-card">
                <CardContent className="p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{tool.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[9px] capitalize">
                        {tool.category}
                      </Badge>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {Number(tool.duration)} min
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tool.content}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => openEdit(tool, i)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => void handleDelete(i)}
                      disabled={deleteTool.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Edit Tool" : "Create Coping Tool"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., 4-7-8 Breathing"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breathing">Breathing</SelectItem>
                    <SelectItem value="grounding">Grounding</SelectItem>
                    <SelectItem value="gratitude">Gratitude</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={Number(form.duration)}
                  onChange={(e) => setForm({ ...form, duration: BigInt(e.target.value || 5) })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Instructions</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Detailed step-by-step instructions..."
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleSave}
                disabled={createTool.isPending || updateTool.isPending}
              >
                {(createTool.isPending || updateTool.isPending) ? "Saving..." : "Save Tool"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
