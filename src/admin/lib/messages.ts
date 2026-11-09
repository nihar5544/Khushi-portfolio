import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

export type ContactMessage = Database["public"]["Tables"]["messages"]["Row"];
export type MessageFilter = "all" | "unread" | "read";

/** How many messages are shown on a single page. */
export const MESSAGES_PAGE_SIZE = 5;

export type MessagesPage = {
  /** Messages for the current page, newest first. */
  rows: ContactMessage[];
  /** Number of messages matching the current filter + search. */
  total: number;
  /** Number of unread messages in the whole inbox. */
  unread: number;
  /** Number of messages in the whole inbox. */
  all: number;
};

type FetchMessagesArgs = {
  page: number;
  pageSize?: number;
  filter?: MessageFilter;
  search?: string;
};

/**
 * PostgREST `or=(...)` uses commas, parentheses and `*` as syntax, so strip
 * those from the search term before building the filter.
 */
function sanitizeSearch(value: string) {
  return value
    .trim()
    .replace(/[,()*%\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchMessages({
  page,
  pageSize = MESSAGES_PAGE_SIZE,
  filter = "all",
  search = "",
}: FetchMessagesArgs): Promise<MessagesPage> {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("messages")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filter === "unread") query = query.eq("read_status", false);
  if (filter === "read") query = query.eq("read_status", true);

  const term = sanitizeSearch(search);
  if (term) {
    const pattern = `*${term}*`;
    query = query.or(
      [
        `name.ilike.${pattern}`,
        `email.ilike.${pattern}`,
        `subject.ilike.${pattern}`,
        `message.ilike.${pattern}`,
      ].join(","),
    );
  }

  const [listRes, unreadRes, allRes] = await Promise.all([
    query,
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("read_status", false),
    supabase.from("messages").select("id", { count: "exact", head: true }),
  ]);

  if (listRes.error) throw new Error(listRes.error.message);
  if (unreadRes.error) throw new Error(unreadRes.error.message);
  if (allRes.error) throw new Error(allRes.error.message);

  return {
    rows: listRes.data ?? [],
    total: listRes.count ?? 0,
    unread: unreadRes.count ?? 0,
    all: allRes.count ?? 0,
  };
}

/**
 * Supabase reports a blocked write (row-level security) as a successful request
 * with zero affected rows, so callers need an explicit signal for that case.
 */
export class MessageWriteBlockedError extends Error {
  constructor(action: "update" | "delete") {
    super(
      action === "delete"
        ? "Supabase blocked the delete. Run fix_rls.sql in the Supabase SQL editor to allow message deletes for the anon role."
        : "Supabase blocked the update. Run fix_rls.sql in the Supabase SQL editor to allow read-status updates for the anon role.",
    );
    this.name = "MessageWriteBlockedError";
  }
}

export async function setMessageReadStatus(id: string, read: boolean): Promise<void> {
  const { data, error } = await supabase
    .from("messages")
    .update({ read_status: read })
    .eq("id", id)
    .select("id");

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new MessageWriteBlockedError("update");
}

export async function deleteMessage(id: string): Promise<void> {
  const { data, error } = await supabase.from("messages").delete().eq("id", id).select("id");

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new MessageWriteBlockedError("delete");
}
