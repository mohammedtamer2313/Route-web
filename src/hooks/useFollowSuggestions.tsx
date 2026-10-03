import { useEffect, useState } from "react";
import { getSuggestions, toggleFollow } from "../api/userService";
import { getCount, getIsFollowing } from "../utils/postHelpers";
import type { User } from "../types";

export function getSuggestionId(u: User): string {
  return (u?._id || u?.id || "") as string;
}

function followerCount(u: User): number {
  return getCount(u?.followersCount ?? u?.followers);
}

export function useFollowSuggestions(limit: number) {
  const [people, setPeople] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followingIds, setFollowingIds] = useState<Set<string>>(() => new Set());
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getSuggestions(limit)
      .then(({ data }) => {
        if (cancelled) return;
        const candidates = [
          data?.suggestions,
          data?.users,
          data?.data?.suggestions,
          data?.data?.users,
          data?.data,
          data?.results,
          data,
        ];
        const list: User[] = candidates.find((c) => Array.isArray(c)) ?? [];

        if (list.length === 0 && data) {
          console.warn(
            "useFollowSuggestions: request succeeded but no user array was found in this response shape — check the keys below:",
            data
          );
        }

        const sorted = [...list].sort((a, b) => followerCount(b) - followerCount(a));
        setPeople(sorted);
        setFollowingIds(
          new Set(
            sorted
              .filter(getIsFollowing)
              .map((p) => getSuggestionId(p))
              .filter(Boolean)
          )
        );
      })
      .catch(() => !cancelled && setError("Couldn't load suggestions."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [limit]);

  const toggleFollowFor = async (userId: string) => {
    setPendingIds((prev) => new Set(prev).add(userId));
    try {
      await toggleFollow(userId);
      setFollowingIds((prev) => {
        const next = new Set(prev);
        next.has(userId) ? next.delete(userId) : next.add(userId);
        return next;
      });
    } catch {
      // silently ignore — the button just stays in its previous state
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  return { people, loading, error, followingIds, pendingIds, toggleFollowFor };
}