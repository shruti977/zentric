"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpenCheck,
  Brain,
  BriefcaseBusiness,
  Clock3,
  FileText,
  FolderKanban,
  Hash,
  Inbox,
  Loader2,
  Microscope,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatRelativeTime } from "@/lib/utils";

type CategoryId = "second_brain" | "learning" | "interview" | "project" | "research";
type FilterId = "all" | CategoryId;

interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string | null;
  category: CategoryId;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  {
    id: "second_brain",
    name: "Second Brain",
    shortName: "Inbox",
    description: "Ideas, references, and anything worth remembering.",
    icon: Brain,
    color: "text-purple-300",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    placeholder: "Capture an idea, insight, reference, or thought...",
    template: "",
  },
  {
    id: "learning",
    name: "Learning Notes",
    shortName: "Learning",
    description: "Concepts, courses, DSA patterns, and study summaries.",
    icon: BookOpenCheck,
    color: "text-blue-300",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    placeholder: "Explain what you learned in your own words...",
    template: `## What I learned


## Key ideas

- Add a key idea

## Example


## Questions to revisit

- Add a question`,
  },
  {
    id: "interview",
    name: "Interview Notes",
    shortName: "Interview",
    description: "Questions, STAR stories, feedback, and company preparation.",
    icon: BriefcaseBusiness,
    color: "text-orange-300",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    placeholder: "Save interview questions, answers, and feedback...",
    template: `## Role and company


## Questions

- Add an interview question

## My answer


## Feedback and improvements

- Add feedback

## Follow-up

- Add a follow-up`,
  },
  {
    id: "project",
    name: "Project Notes",
    shortName: "Projects",
    description: "Decisions, architecture, bugs, milestones, and next actions.",
    icon: FolderKanban,
    color: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    placeholder: "Document a project decision, bug, or milestone...",
    template: `## Goal


## Current status


## Decisions

- Add a decision

## Blockers

- Add a blocker

## Next actions

- Add a next action`,
  },
  {
    id: "research",
    name: "Research Notes",
    shortName: "Research",
    description: "Sources, comparisons, findings, and open questions.",
    icon: Microscope,
    color: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    placeholder: "Synthesize findings and record useful sources...",
    template: `## Research question


## Findings

- Add a finding

## Sources

- Add a source

## Comparison


## Conclusion

`,
  },
] as const;

function getCategory(categoryId: CategoryId) {
  return categories.find((category) => category.id === categoryId) ?? categories[0];
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    tags: "",
    category: "second_brain" as CategoryId,
  });

  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch("/api/notes");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load your notes.");
      setNotes(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load your notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/notes")
      .then((response) => response.json().then((data) => ({ response, data })))
      .then(({ response, data }) => {
        if (cancelled) return;
        if (!response.ok) throw new Error(data.error || "Unable to load your notes.");
        setNotes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Unable to load your notes.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [
          category.id,
          notes.filter((note) => note.category === category.id).length,
        ]),
      ) as Record<CategoryId, number>,
    [notes],
  );

  const visibleNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notes.filter((note) => {
      const matchesCategory = activeFilter === "all" || note.category === activeFilter;
      const matchesSearch =
        !query ||
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, notes, search]);

  const openNote = (note: Note) => {
    setSelectedNote(note);
    setIsCreating(false);
    setError("");
    setEditForm({
      title: note.title,
      content: note.content,
      tags: note.tags || "",
      category: note.category || "second_brain",
    });
  };

  const startCreate = (categoryId?: CategoryId) => {
    const category =
      categoryId ?? (activeFilter === "all" ? "second_brain" : activeFilter);
    const categoryConfig = getCategory(category);
    setSelectedNote(null);
    setIsCreating(true);
    setError("");
    setEditForm({
      title: "",
      content: categoryConfig.template,
      tags: "",
      category,
    });
  };

  const saveNote = async () => {
    if (!editForm.title.trim()) return;
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        isCreating ? "/api/notes" : `/api/notes/${selectedNote?.id}`,
        {
          method: isCreating ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        },
      );
      const savedNote = await response.json();
      if (!response.ok) throw new Error(savedNote.error || "Unable to save this note.");

      setIsCreating(false);
      setSelectedNote(savedNote);
      setEditForm({
        title: savedNote.title,
        content: savedNote.content,
        tags: savedNote.tags || "",
        category: savedNote.category,
      });
      await fetchNotes();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save this note.");
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id: string) => {
    setError("");
    const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Unable to delete this note.");
      return;
    }
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setIsCreating(false);
    }
    await fetchNotes();
  };

  const selectedCategory = getCategory(editForm.category);

  return (
    <main className="flex min-h-full flex-col bg-gray-950">
      <header className="border-b border-white/8 px-5 py-5 lg:px-7">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20">
                <Brain className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Second Brain</h1>
                <p className="text-sm text-gray-400">
                  Turn scattered thoughts into organized knowledge you can reuse.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-600" />
              <Input
                aria-label="Search second brain"
                placeholder="Search your second brain..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-10 pl-9"
              />
            </div>
            <Button
              onClick={() => startCreate()}
              className="border-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            >
              <Plus className="mr-2 size-4" />
              New note
            </Button>
          </div>
        </div>
      </header>

      {error && (
        <div className="mx-5 mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300 lg:mx-7">
          {error}
        </div>
      )}

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 xl:grid-cols-[230px_330px_minmax(0,1fr)]">
        <aside className="border-b border-white/8 p-4 xl:border-b-0 xl:border-r">
          <button
            onClick={() => setActiveFilter("all")}
            className={`mb-3 flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
              activeFilter === "all"
                ? "border-white/20 bg-white/10"
                : "border-transparent hover:bg-white/5"
            }`}
          >
            <Inbox className="size-4 text-gray-300" />
            <span className="flex-1 text-sm font-medium text-gray-200">All notes</span>
            <span className="text-xs text-gray-600">{notes.length}</span>
          </button>

          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-600">
            Knowledge spaces
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeFilter === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`rounded-xl border p-3 text-left transition ${
                    isActive
                      ? `${category.border} ${category.bg}`
                      : "border-transparent hover:border-white/8 hover:bg-white/[0.035]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex size-8 items-center justify-center rounded-lg ${category.bg}`}>
                      <Icon className={`size-4 ${category.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-200">
                        {category.shortName}
                      </p>
                      <p className="text-[11px] text-gray-600">{counts[category.id]} notes</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="min-h-[320px] border-b border-white/8 p-3 xl:border-b-0 xl:border-r">
          <div className="mb-3 flex items-center justify-between px-2">
            <div>
              <h2 className="text-sm font-semibold text-white">
                {activeFilter === "all" ? "All notes" : getCategory(activeFilter).name}
              </h2>
              <p className="text-xs text-gray-600">{visibleNotes.length} results</p>
            </div>
            {activeFilter !== "all" && (
              <button
                onClick={() => startCreate(activeFilter)}
                className="flex size-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white"
                aria-label={`Create ${getCategory(activeFilter).name}`}
              >
                <Plus className="size-4" />
              </button>
            )}
          </div>

          <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1 xl:max-h-[calc(100vh-190px)]">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="size-5 animate-spin text-purple-400" />
              </div>
            ) : visibleNotes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 px-5 py-10 text-center">
                <FileText className="mx-auto mb-3 size-8 text-gray-700" />
                <p className="text-sm text-gray-500">Nothing here yet</p>
                <button
                  onClick={() => startCreate()}
                  className="mt-2 text-xs font-medium text-purple-400 hover:text-purple-300"
                >
                  Capture your first note
                </button>
              </div>
            ) : (
              visibleNotes.map((note) => {
                const category = getCategory(note.category || "second_brain");
                const Icon = category.icon;
                return (
                  <article
                    key={note.id}
                    className={`group rounded-xl border p-3 transition ${
                      selectedNote?.id === note.id
                        ? `${category.border} ${category.bg}`
                        : "border-white/7 bg-white/[0.025] hover:border-white/12 hover:bg-white/[0.045]"
                    }`}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => openNote(note)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") openNote(note);
                      }}
                      className="w-full cursor-pointer text-left"
                    >
                      <div className="mb-2 flex items-start gap-2">
                        <Icon className={`mt-0.5 size-3.5 shrink-0 ${category.color}`} />
                        <p className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                          {note.title}
                        </p>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteNote(note.id);
                          }}
                          aria-label={`Delete ${note.title}`}
                          className="opacity-0 text-gray-600 transition hover:text-red-400 group-hover:opacity-100"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <p className="line-clamp-3 text-xs leading-5 text-gray-500">
                        {note.content || "Empty note"}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`text-[10px] font-medium ${category.color}`}>
                          {category.shortName}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-700">
                          <Clock3 className="size-2.5" />
                          {formatRelativeTime(note.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <section className="min-h-[520px]">
          {isCreating || selectedNote ? (
            <div className="flex h-full min-h-[520px] flex-col">
              <div className="flex flex-col gap-3 border-b border-white/8 px-5 py-4 sm:flex-row sm:items-center">
                <Input
                  aria-label="Note title"
                  value={editForm.title}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="Give this note a clear title..."
                  className="h-10 flex-1 border-0 bg-transparent px-0 text-lg font-semibold text-white focus-visible:ring-0"
                />
                <div className="flex items-center gap-2">
                  <Select
                    value={editForm.category}
                    onValueChange={(value) =>
                      setEditForm((current) => ({
                        ...current,
                        category: value as CategoryId,
                      }))
                    }
                  >
                    <SelectTrigger
                      aria-label="Note category"
                      className={`h-9 min-w-[150px] border ${selectedCategory.border} ${selectedCategory.bg} ${selectedCategory.color}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={saveNote}
                    disabled={saving || !editForm.title.trim()}
                    className="h-9 border-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  >
                    {saving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="mr-2 size-4" />
                        {isCreating ? "Create" : "Save"}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 border-b border-white/5 px-5 py-2">
                <Hash className="size-3.5 text-gray-600" />
                <Input
                  aria-label="Note tags"
                  value={editForm.tags}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, tags: event.target.value }))
                  }
                  placeholder="Tags separated by commas"
                  className="h-8 border-0 bg-transparent px-0 text-xs text-gray-400 focus-visible:ring-0"
                />
              </div>

              <div className="flex-1 p-5">
                <Textarea
                  aria-label="Note content"
                  value={editForm.content}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, content: event.target.value }))
                  }
                  placeholder={selectedCategory.placeholder}
                  className="min-h-[420px] resize-none border-0 bg-transparent p-0 text-sm leading-7 text-gray-300 focus-visible:ring-0 xl:h-full"
                />
              </div>
            </div>
          ) : (
            <div className="flex min-h-[520px] items-center justify-center p-6">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
                  <Sparkles className="size-7 text-purple-300" />
                </div>
                <h2 className="text-xl font-semibold text-white">Build your second brain</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Capture what matters, connect it with tags, and keep every kind of knowledge in
                  the right space.
                </p>
                <Button
                  onClick={() => startCreate()}
                  className="mt-5 border-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                >
                  <Plus className="mr-2 size-4" />
                  Capture a note
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
