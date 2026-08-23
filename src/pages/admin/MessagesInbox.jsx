import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getContactMessages, markMessageRead } from "../../services/contact";
import { useToast } from "../../components/admin/Toast";
import { Mail, MailOpen, Clock } from "lucide-react";

const MessagesInbox = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["contactMessages"],
    queryFn: getContactMessages,
  });

  const markReadMutation = useMutation({
    mutationFn: markMessageRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
    },
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-space-700 rounded animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-space-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-gray-500 text-sm mt-1">
          Contact form submissions • {unreadCount} unread
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Mail className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No messages yet</h3>
          <p className="text-gray-400 text-sm">
            Messages from the contact form will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-2xl border transition ${
                msg.read
                  ? "bg-space-800/30 border-[#2a2a2a]/50"
                  : "bg-space-800 border-accent/20 shadow-lg shadow-accent/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${msg.read ? "bg-space-700" : "bg-accent/20"}`}>
                    {msg.read ? (
                      <MailOpen className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Mail className="w-4 h-4 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-semibold text-sm ${msg.read ? "text-gray-400" : "text-white"}`}>
                        {msg.firstName} {msg.lastName}
                      </p>
                      {!msg.read && (
                        <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">{msg.email}</p>
                    <p className={`text-sm mt-2 leading-relaxed ${msg.read ? "text-gray-500" : "text-gray-300"}`}>
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 text-gray-600 text-xs">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  {!msg.read && (
                    <button
                      onClick={() => markReadMutation.mutate(msg.id)}
                      className="text-xs text-gray-400 hover:text-accent transition"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesInbox;
