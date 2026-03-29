"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Star, Folder, Tag, Trash2, Search } from "lucide-react";

interface LibraryItem {
  id: string;
  title: string;
  folder: string;
  tags: string[];
  isFavorite: boolean;
  contentType: string | null;
  preview: string | null;
  createdAt: string;
  jobId: string | null;
  contentCount: number;
}

export function ContentLibrary() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [selectedFolder, showFavorites]);

  async function fetchItems() {
    try {
      const params = new URLSearchParams();
      if (selectedFolder !== "all") params.set("folder", selectedFolder);
      if (showFavorites) params.set("favorites", "true");

      const res = await fetch(`/api/library?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch library:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite(id: string, current: boolean) {
    try {
      const res = await fetch("/api/library", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFavorite: !current }),
      });
      if (res.ok) {
        setItems(items.map(item => 
          item.id === id ? { ...item, isFavorite: !current } : item
        ));
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`/api/library?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  }

  const folders = ["all", "default", "social", "newsletter", "video"];
  const allTags = Array.from(new Set(items.flatMap(item => item.tags)));

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

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
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by title or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {folders.map(folder => (
            <Button
              key={folder}
              variant={selectedFolder === folder ? "primary" : "secondary"}
              size="sm"
              onClick={() => setSelectedFolder(folder)}
            >
              <Folder className="w-4 h-4 mr-1" />
              {folder === "all" ? "All" : folder}
            </Button>
          ))}
          <Button
            variant={showFavorites ? "primary" : "secondary"}
            size="sm"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <Star className="w-4 h-4 mr-1" />
            Favorites
          </Button>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {allTags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Folder className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">No items in your library</p>
            <p className="text-sm text-slate-500">Save jobs or add custom content to build your library</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <Card key={item.id} className="relative group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{item.title}</h4>
                    <span className="text-xs text-amber-400">{item.folder}</span>
                  </div>
                  <button
                    onClick={() => toggleFavorite(item.id, item.isFavorite)}
                    className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <Star className={`w-5 h-5 ${item.isFavorite ? "fill-amber-400" : ""}`} />
                  </button>
                </div>
                
                {item.preview && (
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">{item.preview}</p>
                )}

                {item.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mb-3">
                    {item.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-dark-600 text-xs text-slate-300 rounded">
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-xs text-slate-500">+{item.tags.length - 3}</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-xs text-slate-500">
                    {item.contentCount} items · {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}