import type { Comment } from "../types";

/**
 * Same defensive approach as postResponse.tsx's extractPosts — the exact
 * response shape isn't confirmed yet, so this tries every common wrapper
 * and logs the raw response if none of them match.
 */
export function extractComments(data: any): Comment[] {
  const candidates = [
    data?.comments,
    data?.replies,
    data?.data?.comments,
    data?.data?.replies,
    data?.data,
    data?.results,
    data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  if (data) {
    console.warn(
      "extractComments: request succeeded but no comment array was found in this response shape:",
      data
    );
  }
  return [];
}

export function extractComment(data: any): Comment | null {
  const candidates = [data?.comment, data?.reply, data?.data?.comment, data?.data, data];
  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      return candidate as Comment;
    }
  }
  return null;
}
