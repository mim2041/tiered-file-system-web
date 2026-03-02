const codeMap: Record<string, string> = {
  SUBSCRIPTION_REQUIRED: "An active subscription is required for this action.",
  MAX_NESTING_LEVEL_EXCEEDED: "Maximum folder nesting level reached for your plan.",
  MAX_FOLDERS_REACHED: "Maximum folder count reached for your plan.",
  MIME_TYPE_NOT_ALLOWED: "This file type is not allowed by your plan.",
  FILE_TOO_LARGE_FOR_PACKAGE: "File exceeds the size limit of your plan.",
  FOLDER_FILE_LIMIT_REACHED: "This folder has reached its file limit.",
  TOTAL_FILE_LIMIT_REACHED: "Account total file limit reached for your plan.",
  FOLDER_HAS_CHILDREN: "Cannot delete a folder that contains subfolders.",
};

export const apiCodeMessages = codeMap;

export function getApiErrorMessage(error: unknown): string {
  const e = error as {
    response?: { data?: { code?: string; message?: string } };
    message?: string;
  };
  const code = e?.response?.data?.code;
  if (code && codeMap[code]) return codeMap[code];
  return e?.response?.data?.message || e?.message || "Something went wrong.";
}
