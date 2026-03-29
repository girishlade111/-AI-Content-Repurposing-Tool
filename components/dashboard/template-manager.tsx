"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Edit2, Star } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  systemPrompt: string;
  tone: string;
  isDefault: boolean;
  useCount: number;
  createdAt: string;
}

const TONES = ["professional", "casual", "humorous", "inspirational", "educational"];
const CATEGORIES = ["social", "newsletter", "video", "blog", "custom"];

export function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "custom",
    systemPrompt: "",
    tone: "professional",
    isDefault: false,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const res = await fetch("/api/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const url = editingId ? "/api/templates" : "/api/templates";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...formData, id: editingId } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchTemplates();
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save template:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this template?")) return;
    
    try {
      const res = await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchTemplates();
      }
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  }

  function editTemplate(template: Template) {
    setFormData({
      name: template.name,
      description: template.description || "",
      category: template.category,
      systemPrompt: template.systemPrompt,
      tone: template.tone,
      isDefault: template.isDefault,
    });
    setEditingId(template.id);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({ name: "", description: "", category: "custom", systemPrompt: "", tone: "professional", isDefault: false });
    setEditingId(null);
    setShowForm(false);
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Saved Templates</h3>
          <p className="text-sm text-slate-400">Create reusable AI prompt templates</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-white">{editingId ? "Edit Template" : "Create Template"}</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Template Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Custom Template"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-600 border border-white/10 rounded-xl text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Input
                label="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this template"
              />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tone</label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-600 border border-white/10 rounded-xl text-white"
                >
                  {TONES.map((tone) => (
                    <option key={tone} value={tone}>{tone}</option>
                  ))}
                </select>
              </div>

              <Textarea
                label="System Prompt"
                value={formData.systemPrompt}
                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                placeholder="You are a content expert. Generate engaging content that..."
                rows={6}
                required
              />

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 bg-dark-600 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-slate-300">Set as default template</span>
              </label>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary">
                  {editingId ? "Update Template" : "Save Template"}
                </Button>
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-400 mb-4">No templates saved yet</p>
            <Button onClick={() => setShowForm(true)}>Create Your First Template</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="relative">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      {template.name}
                      {template.isDefault && (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      )}
                    </h4>
                    <span className="text-xs text-amber-400 capitalize">{template.category}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => editTemplate(template)}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {template.description && (
                  <p className="text-sm text-slate-400 mb-3">{template.description}</p>
                )}
                <p className="text-xs text-slate-500 line-clamp-2">{template.systemPrompt}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-slate-500 capitalize">Tone: {template.tone}</span>
                  <span className="text-xs text-slate-500">Used {template.useCount} times</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}