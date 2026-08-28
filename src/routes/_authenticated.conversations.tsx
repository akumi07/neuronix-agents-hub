import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Archive, MessagesSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { RowSkeletonList } from "@/components/shared/CardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { toUserMessage } from "@/lib/api/errors";
import { formatClockTime, formatRelativeTime } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { conversationService } from "@/services/conversationService";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/conversations")({
  head: () => ({
    meta: [
      { title: "Conversations — NeuronixAI" },
      {
        name: "description",
        content: "Revisit past NeuronixAI conversations and the agent reasoning behind each answer.",
      },
      { property: "og:title", content: "Conversations — NeuronixAI" },
      { property: "og:description", content: "Search and review your agent conversation history." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConversationsPage,
});

function ConversationsPage() {
  const queryClient = useQueryClient();
  const conversations = useQuery({
    queryKey: queryKeys.conversations,
    queryFn: conversationService.list,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const list = (conversations.data ?? []).filter((conversation) => !conversation.archived);
  const activeId = selectedId ?? list[0]?.id ?? null;
  const selected = list.find((conversation) => conversation.id === activeId) ?? null;

  const archive = useMutation({
    mutationFn: (id: string) => conversationService.archive(id),
    onSuccess: async () => {
      toast.success("Conversation archived");
      setSelectedId(null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
    onError: (error) => toast.error("Couldn't archive", { description: toUserMessage(error) }),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        eyebrow="History"
        title="Conversations"
        description="Each thread keeps the agents involved and the reasoning they shared with you."
      />

      {conversations.error ? (
        <ErrorState error={conversations.error} onRetry={() => void conversations.refetch()} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <section aria-label="Conversation list" className="panel p-4 lg:col-span-2">
            {conversations.isPending ? (
              <RowSkeletonList count={5} />
            ) : list.length === 0 ? (
              <EmptyState
                icon={MessagesSquare}
                title="No conversations"
                description="Threads appear here once you start working with agents."
              />
            ) : (
              <ul className="space-y-2">
                {list.map((conversation) => (
                  <li key={conversation.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(conversation.id)}
                      aria-current={conversation.id === activeId}
                      className={cn(
                        "w-full rounded-lg border px-3.5 py-3 text-left transition-colors",
                        conversation.id === activeId
                          ? "border-primary/45 bg-primary/8"
                          : "border-border bg-surface hover:border-border-strong",
                      )}
                    >
                      <span className="block truncate text-sm font-medium text-foreground">
                        {conversation.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {conversation.preview}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {conversation.messageCount} messages ·{" "}
                        {formatRelativeTime(conversation.updatedAt)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-label="Conversation detail" className="panel p-4 lg:col-span-3">
            {selected ? (
              <>
                <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold">{selected.title}</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {selected.agentNames.join(", ")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={archive.isPending}
                    onClick={() => archive.mutate(selected.id)}
                  >
                    <Archive className="size-4" aria-hidden="true" />
                    Archive
                  </Button>
                </div>
                <ol className="mt-4 space-y-3">
                  {selected.messages.map((message) => (
                    <li
                      key={message.id}
                      className={cn(
                        "max-w-[85%] rounded-lg border px-3.5 py-2.5 text-sm",
                        message.author === "user"
                          ? "ml-auto border-primary/35 bg-primary/10 text-foreground"
                          : "border-border bg-surface text-foreground/90",
                      )}
                    >
                      <p className="text-xs text-muted-foreground">
                        {message.author === "user" ? "You" : (message.agentName ?? "Agent")} ·{" "}
                        {formatClockTime(message.createdAt)}
                      </p>
                      <p className="mt-1 leading-relaxed">{message.content}</p>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <EmptyState
                icon={MessagesSquare}
                title="Select a conversation"
                description="Pick a thread to read the full exchange."
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
}
