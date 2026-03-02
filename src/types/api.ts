export type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  isVerified?: boolean;
};

export type PackagePlan = {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  maxFolders?: number;
  maxNestingLevel?: number;
  maxFileSizeMb?: number;
  totalFileLimit?: number;
  filesPerFolderLimit?: number;
  allowedFileTypes?: string[];
  createdAt?: string;
  [key: string]: unknown;
};

export type Subscription = {
  id: string;
  packageId?: string;
  packageName?: string;
  package?: PackagePlan;
  status?: string;
  startedAt?: string;
  endedAt?: string | null;
  createdAt?: string;
  [key: string]: unknown;
};

export type FolderItem = {
  id: string;
  name: string;
  parentId?: string | null;
  nestingLevel?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export type FileItem = {
  id: string;
  name: string;
  originalName?: string;
  folderId?: string | null;
  mimeType?: string;
  size?: number;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export type AuthMeResponse = {
  user: User;
  activeSubscription: Subscription | null;
};
