"use client";
import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import {
  Folder,
  FolderOpen,
  File,
  Upload,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  RefreshCw,
  X,
  Check,
  Home,
  AlertTriangle,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { getApiErrorMessage } from "@/lib/error-messages";
import {
  createFolder,
  deleteFolder,
  getFolders,
  renameFolder,
} from "@/services/folders";
import {
  deleteFile,
  getFiles,
  renameFile,
  uploadFile,
} from "@/services/files";
import { FileItem, FolderItem } from "@/types/api";
import { cn } from "@/lib/utils";

function FileIcon({ mime }: { mime?: string }) {
  if (!mime) return <File size={16} className="text-slate-400" />;
  if (mime.startsWith("image/")) return <FileImage size={16} className="text-blue-400" />;
  if (mime.startsWith("video/")) return <FileVideo size={16} className="text-violet-400" />;
  if (mime.startsWith("audio/")) return <FileAudio size={16} className="text-emerald-400" />;
  if (mime === "application/pdf") return <FileText size={16} className="text-red-400" />;
  return <File size={16} className="text-slate-400" />;
}

function fmtSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type BreadcrumbItem = { id: string; name: string };

export default function ExplorerPage() {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Breadcrumb stack
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const currentFolderId = breadcrumbs.at(-1)?.id;

  // Inline editing state
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [renamingFolder, setRenamingFolder] = useState<{ id: string; name: string } | null>(null);
  const [renamingFile, setRenamingFile] = useState<{ id: string; name: string } | null>(null);

  // Upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fl, fi] = await Promise.all([
        getFolders(currentFolderId),
        getFiles(currentFolderId),
      ]);
      setFolders(fl);
      setFiles(fi);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [currentFolderId]);

  useEffect(() => { loadData(); }, [loadData]);

  /* ----- Folder actions ----- */
  const handleCreateFolder = async (e: FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await createFolder({ name: newFolderName.trim(), parentId: currentFolderId });
      toast.success("Folder created");
      setNewFolderName("");
      setShowNewFolder(false);
      await loadData();
    } catch (err) { toast.error(getApiErrorMessage(err)); }
  };

  const handleRenameFolder = async (e: FormEvent) => {
    e.preventDefault();
    if (!renamingFolder) return;
    try {
      await renameFolder(renamingFolder.id, { name: renamingFolder.name });
      toast.success("Folder renamed");
      setRenamingFolder(null);
      await loadData();
    } catch (err) { toast.error(getApiErrorMessage(err)); }
  };

  const handleDeleteFolder = async (id: string, name: string) => {
    if (!confirm(`Delete folder "${name}"? This cannot be undone.`)) return;
    try { await deleteFolder(id); toast.success("Folder deleted"); await loadData(); }
    catch (err) { toast.error(getApiErrorMessage(err)); }
  };

  const navigateTo = (folder: FolderItem) => {
    setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
  };

  const navigateToIndex = (idx: number) => {
    setBreadcrumbs(prev => prev.slice(0, idx + 1));
  };

  const navigateRoot = () => setBreadcrumbs([]);

  /* ----- File actions ----- */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadFile({ file, folderId: currentFolderId });
      toast.success(`${file.name} uploaded`);
      await loadData();
    } catch (err) { toast.error(getApiErrorMessage(err)); }
    finally { if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const handleRenameFile = async (e: FormEvent) => {
    e.preventDefault();
    if (!renamingFile) return;
    try {
      await renameFile(renamingFile.id, { name: renamingFile.name });
      toast.success("File renamed");
      setRenamingFile(null);
      await loadData();
    } catch (err) { toast.error(getApiErrorMessage(err)); }
  };

  const handleDeleteFile = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await deleteFile(id); toast.success("File deleted"); await loadData(); }
    catch (err) { toast.error(getApiErrorMessage(err)); }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/10 to-slate-950 px-4 py-6 sm:p-8">
        <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white">File Explorer</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 truncate">Manage folders and files within your subscription limits</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button onClick={loadData} className="btn-secondary p-2 sm:px-3 sm:py-2" title="Refresh">
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="btn-secondary text-xs sm:text-sm px-2 sm:px-3 py-2 flex-1 sm:flex-none">
                <Upload size={15} />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
              <button onClick={() => setShowNewFolder(true)} className="btn-primary text-xs sm:text-sm px-2 sm:px-3 py-2 flex-1 sm:flex-none">
                <Plus size={15} />
                <span className="hidden sm:inline">New Folder</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-1 text-xs sm:text-sm overflow-x-auto pb-2">
            <button onClick={navigateRoot} className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition whitespace-nowrap">
              <Home size={13} /> Root
            </button>
            {breadcrumbs.map((bc, i) => (
              <span key={bc.id} className="flex items-center gap-1">
                <ChevronRight size={12} className="text-slate-600 flex-shrink-0" />
                <button
                  onClick={() => navigateToIndex(i)}
                  className={cn(
                    "transition truncate",
                    i === breadcrumbs.length - 1 ? "text-slate-200 font-medium" : "text-indigo-400 hover:text-indigo-300",
                  )}
                  title={bc.name}
                >
                  {bc.name}
                </button>
              </span>
            ))}
          </nav>

          {/* New folder form */}
          {showNewFolder && (
            <form onSubmit={handleCreateFolder} className="flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 sm:px-4 sm:py-3">
              <Folder size={16} className="text-indigo-400 shrink-0 hidden sm:block" />
              <input
                autoFocus
                className="input-field flex-1 py-2 sm:py-1.5 text-sm w-full sm:w-auto"
                placeholder="Folder name"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                required
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <button type="submit" className="btn-primary px-3 py-2 text-xs flex-1 sm:flex-none">
                  <Check size={14} /> <span className="hidden sm:inline">Create</span>
                </button>
                <button type="button" onClick={() => { setShowNewFolder(false); setNewFolderName(""); }} className="btn-secondary px-3 py-2 text-xs flex-1 sm:flex-none">
                  <X size={14} />
                </button>
              </div>
            </form>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Folders section */}
              {folders.length > 0 && (
                <section>
                  <p className="mb-2 sm:mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Folders ({folders.length})
                  </p>
                  <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {folders.map((folder) => (
                      <div key={folder.id} className="card glass-hover group flex items-center gap-2 sm:gap-3 p-2 sm:p-4 cursor-pointer" onClick={() => navigateTo(folder)}>
                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15">
                          <FolderOpen size={18} className="text-indigo-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          {renamingFolder?.id === folder.id ? (
                            <form
                              onSubmit={handleRenameFolder}
                              onClick={e => e.stopPropagation()}
                              className="flex items-center gap-1"
                            >
                              <input
                                autoFocus
                                className="input-field py-1 text-xs flex-1 min-w-0"
                                value={renamingFolder.name}
                                onChange={e => setRenamingFolder({ ...renamingFolder, name: e.target.value })}
                              />
                              <button type="submit" className="text-emerald-400 hover:text-emerald-300 flex-shrink-0"><Check size={14} /></button>
                              <button type="button" onClick={() => setRenamingFolder(null)} className="text-slate-500 hover:text-slate-300 flex-shrink-0"><X size={14} /></button>
                            </form>
                          ) : (
                            <>
                              <p className="truncate text-xs sm:text-sm font-medium text-slate-200">{folder.name}</p>
                              <p className="text-xs text-slate-600">Level {folder.nestingLevel ?? "—"}</p>
                            </>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                          <button onClick={() => setRenamingFolder({ id: folder.id, name: folder.name })} className="rounded p-1 text-slate-500 hover:bg-white/5 hover:text-slate-300 transition" title="Rename">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => handleDeleteFolder(folder.id, folder.name)} className="rounded p-1 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition" title="Delete">
                            <Trash2 size={12} />
                          </button>
                          <ChevronRight size={13} className="text-slate-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Files section */}
              {files.length > 0 && (
                <section>
                  <p className="mb-2 sm:mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Files ({files.length})
                  </p>
                  {/* Desktop table view */}
                  <div className="hidden sm:block rounded-2xl glass overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5 text-xs text-slate-500">
                          <th className="px-4 py-3 text-left font-medium">Name</th>
                          <th className="hidden px-4 py-3 text-left font-medium md:table-cell">Type</th>
                          <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">Size</th>
                          <th className="px-4 py-3 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {files.map((file) => (
                          <tr key={file.id} className="group hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <FileIcon mime={file.mimeType} />
                                {renamingFile?.id === file.id ? (
                                  <form onSubmit={handleRenameFile} className="flex items-center gap-1">
                                    <input
                                      autoFocus
                                      className="input-field py-1 text-xs w-40"
                                      value={renamingFile.name}
                                      onChange={e => setRenamingFile({ ...renamingFile, name: e.target.value })}
                                    />
                                    <button type="submit" className="text-emerald-400 hover:text-emerald-300"><Check size={14} /></button>
                                    <button type="button" onClick={() => setRenamingFile(null)} className="text-slate-500"><X size={14} /></button>
                                  </form>
                                ) : (
                                  <span className="truncate font-medium text-slate-200 max-w-[200px]">
                                    {file.name || file.originalName}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="hidden px-4 py-3 md:table-cell">
                              <span className="badge bg-slate-700/50 text-slate-400 text-[10px]">
                                {file.mimeType?.split("/")[1] ?? "—"}
                              </span>
                            </td>
                            <td className="hidden px-4 py-3 text-right text-xs text-slate-500 sm:table-cell">
                              {fmtSize(file.size)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setRenamingFile({ id: file.id, name: file.name || file.originalName || "" })} className="rounded p-1.5 text-slate-500 hover:bg-white/5 hover:text-slate-300 transition">
                                  <Pencil size={13} />
                                </button>
                                <button onClick={() => handleDeleteFile(file.id, file.name || file.originalName || file.id)} className="rounded p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile card view */}
                  <div className="sm:hidden space-y-2">
                    {files.map((file) => (
                      <div key={file.id} className="card glass-hover flex items-center gap-2 p-3">
                        <FileIcon mime={file.mimeType} />
                        <div className="min-w-0 flex-1">
                          {renamingFile?.id === file.id ? (
                            <form onSubmit={handleRenameFile} className="flex items-center gap-1">
                              <input
                                autoFocus
                                className="input-field py-1 text-xs flex-1 min-w-0"
                                value={renamingFile.name}
                                onChange={e => setRenamingFile({ ...renamingFile, name: e.target.value })}
                              />
                              <button type="submit" className="text-emerald-400 hover:text-emerald-300 flex-shrink-0"><Check size={14} /></button>
                              <button type="button" onClick={() => setRenamingFile(null)} className="text-slate-500 flex-shrink-0"><X size={14} /></button>
                            </form>
                          ) : (
                            <>
                              <p className="truncate font-medium text-slate-200 text-sm">{file.name || file.originalName}</p>
                              <div className="flex gap-2 text-xs text-slate-500 mt-1">
                                <span>{file.mimeType?.split("/")[1] ?? "—"}</span>
                                <span>•</span>
                                <span>{fmtSize(file.size)}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => setRenamingFile({ id: file.id, name: file.name || file.originalName || "" })} className="rounded p-1.5 text-slate-500 hover:bg-white/5 hover:text-slate-300 transition">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => handleDeleteFile(file.id, file.name || file.originalName || file.id)} className="rounded p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Empty state */}
              {!folders.length && !files.length && !loading && (
                <div className="card flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">
                  <FolderOpen size={40} className="mb-4 text-slate-700" />
                  <p className="font-semibold text-slate-400 text-sm sm:text-base">This folder is empty</p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">Create a subfolder or upload files to get started</p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button onClick={() => setShowNewFolder(true)} className="btn-primary text-xs sm:text-sm">
                      <Plus size={15} /> <span className="hidden sm:inline">New Folder</span>
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="btn-secondary text-xs sm:text-sm">
                      <Upload size={15} /> <span className="hidden sm:inline">Upload</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Back button */}
              {breadcrumbs.length > 0 && (
                <button
                  onClick={() => setBreadcrumbs(prev => prev.slice(0, -1))}
                  className="btn-secondary text-xs sm:text-sm w-full sm:w-auto"
                >
                  <ArrowLeft size={15} /> Back
                </button>
              )}
            </div>
          )}

          {/* Enforcement legend */}
          <details className="card cursor-pointer">
            <summary className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 list-none">
              <AlertTriangle size={15} className="text-amber-400 flex-shrink-0" />
              Plan Enforcement Codes
              <span className="ml-auto text-xs text-slate-600">click to expand</span>
            </summary>
            <div className="mt-4 grid gap-2 text-xs grid-cols-1 sm:grid-cols-2">
              {[
                ["SUBSCRIPTION_REQUIRED", "Active subscription required"],
                ["MAX_NESTING_LEVEL_EXCEEDED", "Folder nesting limit reached"],
                ["MAX_FOLDERS_REACHED", "Max folder count reached"],
                ["MIME_TYPE_NOT_ALLOWED", "File type not allowed by plan"],
                ["FILE_TOO_LARGE_FOR_PACKAGE", "File exceeds plan size limit"],
                ["FOLDER_FILE_LIMIT_REACHED", "Per-folder file limit reached"],
                ["TOTAL_FILE_LIMIT_REACHED", "Account file limit reached"],
                ["FOLDER_HAS_CHILDREN", "Cannot delete folder with subfolders"],
              ].map(([code, msg]) => (
                <div key={code} className="flex items-start gap-2 rounded-lg bg-white/5 px-2 sm:px-3 py-2">
                  <code className="shrink-0 text-amber-400/80 text-xs">{code}</code>
                  <span className="text-slate-500 text-xs">{msg}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </AuthGuard>
  );
}

