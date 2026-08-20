import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout, Container, Breadcrumbs } from "@/components/site-layout";
import { apiGetNotifications, apiMarkNotificationRead } from "@/lib/api";
import { useShop } from "@/context/shop";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Jain Desi and Pure" },
      { name: "description", content: "Read order and account updates from Jain Desi and Pure." },
      { property: "og:title", content: "Notifications — Jain Desi and Pure" },
    ],
  }),
  component: NotificationsPage,
});

type NotificationItem = {
  id: number | string;
  title?: string;
  body?: string;
  message?: string;
  type?: string;
  read_at?: string | null;
  created_at?: string;
  recipient_type?: string;
};

function NotificationsPage() {
  const { user } = useShop();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const data = await apiGetNotifications("customer", String(user.id));
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load notifications", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id]);

  const markRead = async (notificationId: number | string) => {
    try {
      setMarkingRead(String(notificationId));
      await apiMarkNotificationRead(notificationId);
      setItems((current) =>
        current.map((item) =>
          String(item.id) === String(notificationId) ? { ...item, read_at: new Date().toISOString() } : item,
        ),
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    } finally {
      setMarkingRead(null);
    }
  };

  return (
    <SiteLayout>
      <Container>
        <Breadcrumbs items={[{ label: "My Account" }, { label: "Notifications" }]} />
        <h1 className="text-2xl font-bold sm:text-3xl">Notifications</h1>

        {!user ? (
          <div className="mt-8 rounded-2xl border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">Please log in to view notifications.</p>
            <Link to="/login" className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Login
            </Link>
          </div>
        ) : loading ? (
          <div className="mt-8 rounded-2xl border bg-card p-6 text-sm text-muted-foreground">Loading notifications...</div>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-2xl border bg-card p-6 text-sm text-muted-foreground">No notifications yet.</div>
        ) : (
          <div className="mt-6 space-y-3">
            {items.map((item) => {
              const body = item.body ?? item.message ?? item.title ?? "New update";
              const isRead = Boolean(item.read_at);

              return (
                <article key={String(item.id)} className={`rounded-2xl border p-4 ${isRead ? "bg-card" : "bg-primary-soft/40 border-primary/30"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{item.title ?? item.type ?? "Update"}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                      <p className="mt-2 text-[11px] text-muted-foreground">{item.created_at ? new Date(item.created_at).toLocaleString("en-IN") : "Just now"}</p>
                    </div>
                    {!isRead && (
                      <button
                        type="button"
                        onClick={() => markRead(item.id)}
                        disabled={markingRead === String(item.id)}
                        className="rounded-full border border-primary px-3 py-1 text-[10px] font-semibold uppercase text-primary disabled:opacity-60"
                      >
                        {markingRead === String(item.id) ? "Saving..." : "Mark read"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Container>
    </SiteLayout>
  );
}
