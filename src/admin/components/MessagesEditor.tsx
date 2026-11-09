import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Inbox,
  Mail,
  MailOpen,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  MESSAGES_PAGE_SIZE,
  deleteMessage,
  fetchMessages,
  setMessageReadStatus,
  type ContactMessage,
  type MessageFilter,
} from "@/admin/lib/messages";

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});
const FULL_DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return { label: "Unknown date", full: "Unknown date" };
  }

  const minutes = Math.floor((Date.now() - date.getTime()) / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let label: string;
  if (minutes < 1) label = "Just now";
  else if (minutes < 60) label = `${minutes}m ago`;
  else if (hours < 24) label = `${hours}h ago`;
  else if (days < 7) label = `${days}d ago`;
  else label = DATE_FORMAT.format(date);

  return { label, full: FULL_DATE_FORMAT.format(date) };
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase() || "?";
}

function pageItems(current: number, totalPages: number): Array<number | "gap"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | "gap"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  if (start > 2) items.push("gap");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < totalPages - 1) items.push("gap");
  items.push(totalPages);

  return items;
}

export function MessagesEditor() {
  const [rows, setRows] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [unread, setUnread] = useState(0);
  const [all, setAll] = useState(0);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<MessageFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  // Debounce search so typing does not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMessages({ page, filter, search })
      .then((result) => {
        if (cancelled) return;
        setRows(result.rows);
        setTotal(result.total);
        setUnread(result.unread);
        setAll(result.all);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load messages");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, filter, search, reloadKey]);

  const totalPages = Math.max(1, Math.ceil(total / MESSAGES_PAGE_SIZE));

  // A delete or filter change can leave the current page out of range.
  useEffect(() => {
    if (!loading && page > totalPages - 1) {
      setPage(totalPages - 1);
    }
  }, [loading, page, totalPages]);

  const afterMutation = (leavesCurrentFilter: boolean) => {
    if (leavesCurrentFilter && rows.length === 1 && page > 0) {
      setPage(page - 1);
      return;
    }
    refresh();
  };

  const handleToggleRead = async (message: ContactMessage) => {
    setBusyId(message.id);
    try {
      await setMessageReadStatus(message.id, !message.read_status);
      toast.success(message.read_status ? "Marked as unread" : "Marked as read");
      afterMutation(filter !== "all");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the message");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (message: ContactMessage) => {
    const sender = message.name || message.email;
    if (!window.confirm(`Delete the message from ${sender}? This cannot be undone.`)) return;

    setBusyId(message.id);
    try {
      await deleteMessage(message.id);
      toast.success("Message deleted");
      afterMutation(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the message");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Inbox className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">{plural(all, "message")}</p>
            <p className="text-xs text-muted-foreground">
              {unread > 0 ? `${unread} unread` : "All caught up"}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={filter}
          onValueChange={(value) => {
            setFilter(value as MessageFilter);
            setPage(0);
            setExpandedId(null);
          }}
        >
          <TabsList className="grid h-9 w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="all">
              All <span className="ml-1.5 text-xs opacity-60">{all}</span>
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread <span className="ml-1.5 text-xs opacity-60">{unread}</span>
            </TabsTrigger>
            <TabsTrigger value="read">
              Read <span className="ml-1.5 text-xs opacity-60">{Math.max(0, all - unread)}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search messages…"
            className="pl-9"
            aria-label="Search messages"
          />
        </div>
      </div>

      {error ? (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">Couldn&apos;t load messages</p>
            <p className="text-xs break-words opacity-80">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={refresh}>
            Retry
          </Button>
        </div>
      ) : loading && rows.length === 0 ? (
        <div className="space-y-3" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-12 text-center">
          <Inbox className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">
            {search
              ? "No messages match your search"
              : filter === "unread"
                ? "No unread messages"
                : filter === "read"
                  ? "No read messages yet"
                  : "No messages yet"}
          </p>
          <p className="max-w-xs text-xs text-muted-foreground">
            {search
              ? "Try a different name, email address or keyword."
              : "Messages sent through the contact form will appear here."}
          </p>
        </div>
      ) : (
        <div
          className={cn("space-y-3 transition-opacity", loading && "opacity-60")}
          aria-busy={loading}
        >
          {rows.map((message) => {
            const when = formatWhen(message.created_at);
            const expanded = expandedId === message.id;
            const busy = busyId === message.id;

            return (
              <article
                key={message.id}
                className={cn(
                  "rounded-lg border p-4 transition-colors",
                  message.read_status ? "bg-muted/40" : "border-primary/30 bg-primary/[0.03]",
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback
                      className={cn(
                        "text-xs font-semibold",
                        !message.read_status && "bg-primary/15 text-primary",
                      )}
                    >
                      {getInitials(message.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {!message.read_status && (
                            <span
                              className="h-2 w-2 shrink-0 rounded-full bg-primary"
                              aria-label="Unread"
                            />
                          )}
                          <span className="truncate text-sm font-semibold">
                            {message.name || "Unknown sender"}
                          </span>
                        </div>
                        <a
                          href={`mailto:${message.email}`}
                          className="block truncate text-xs text-muted-foreground hover:text-primary hover:underline"
                        >
                          {message.email}
                        </a>
                      </div>
                      <time
                        dateTime={message.created_at}
                        title={when.full}
                        className="shrink-0 text-xs text-muted-foreground"
                      >
                        {when.label}
                      </time>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="max-w-full truncate font-normal">
                        {message.subject || "No subject"}
                      </Badge>
                      <Badge
                        variant={message.read_status ? "secondary" : "default"}
                        className="font-normal"
                      >
                        {message.read_status ? "Read" : "Unread"}
                      </Badge>
                    </div>

                    <p
                      className={cn(
                        "text-sm break-words whitespace-pre-wrap",
                        expanded ? "text-foreground/90" : "line-clamp-2 text-muted-foreground",
                      )}
                    >
                      {message.message?.trim() || "(empty message)"}
                    </p>

                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => setExpandedId(expanded ? null : message.id)}
                      >
                        {expanded ? (
                          <>
                            <ChevronUp className="mr-1 h-3.5 w-3.5" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="mr-1 h-3.5 w-3.5" />
                            Read more
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        disabled={busy}
                        onClick={() => handleToggleRead(message)}
                      >
                        {message.read_status ? (
                          <>
                            <MailOpen className="mr-1 h-3.5 w-3.5" />
                            Mark unread
                          </>
                        ) : (
                          <>
                            <Mail className="mr-1 h-3.5 w-3.5" />
                            Mark read
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={busy}
                        onClick={() => handleDelete(message)}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!error && total > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t pt-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">{page * MESSAGES_PAGE_SIZE + 1}</span>
            {"–"}
            <span className="font-medium text-foreground">
              {Math.min(total, (page + 1) * MESSAGES_PAGE_SIZE)}
            </span>{" "}
            of <span className="font-medium text-foreground">{total}</span>
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0 || loading}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {pageItems(page + 1, totalPages).map((item, index) =>
              item === "gap" ? (
                <span key={`gap-${index}`} className="px-1 text-xs text-muted-foreground">
                  …
                </span>
              ) : (
                <Button
                  key={item}
                  variant={item === page + 1 ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setPage(item - 1)}
                  disabled={loading}
                  aria-label={`Page ${item}`}
                  aria-current={item === page + 1 ? "page" : undefined}
                >
                  {item}
                </Button>
              ),
            )}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1 || loading}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
