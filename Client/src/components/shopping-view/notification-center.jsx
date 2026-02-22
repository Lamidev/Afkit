import { Bell, Package, X, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead, removeNotification } from "@/store/common-slice/notification-slice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

function NotificationCenter() {
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications(user.id));
      const interval = setInterval(() => dispatch(fetchNotifications(user.id)), 120000);
      return () => clearInterval(interval);
    }
  }, [dispatch, user?.id]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Prevent body scroll when open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id) => dispatch(markAsRead(id));
  const handleRemove = (id) => dispatch(removeNotification(id));

  return (
    <>
      {/* ── Bell Trigger ── */}
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        className="p-2 hover:bg-slate-100 rounded-full transition-colors relative"
        aria-label="Notifications"
      >
        <Bell
          className={`h-5 w-5 stroke-[2.5px] ${unreadCount > 0 ? "text-orange-500" : "text-primary"}`}
        />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-orange-500 border-2 border-white">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
          </span>
        )}
      </button>

      {/* ── Mobile backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Notification Panel ──
           Mobile  : fixed, centered, bottom-sheet style
           Desktop : absolute, anchored top-right of trigger           */}
      {open && (
        <div
          ref={panelRef}
          className={`
            z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col
            /* Mobile */
            fixed left-1/2 -translate-x-1/2
            top-1/2 -translate-y-1/2
            w-[92vw] max-w-sm
            /* Desktop override */
            sm:fixed sm:translate-x-0 sm:translate-y-0 sm:top-auto sm:left-auto
            sm:right-4 sm:top-16
            sm:w-96
            sm:max-h-[80vh]
          `}
          style={{ maxHeight: "80dvh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100 shrink-0">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Notifications
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {unreadCount} Unread
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-8 w-8 rounded-full hover:bg-slate-200"
            >
              <X className="h-4 w-4 text-slate-500" />
            </Button>
          </div>

          {/* Body */}
          <ScrollArea className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <Bell className="h-6 w-6 text-slate-200" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
                  Your feed is empty.<br />Stay tuned for updates!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 transition-colors relative group ${
                      !notification.isRead ? "bg-orange-50/40" : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div
                        className={`mt-0.5 h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                          !notification.isRead
                            ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Package className="h-4 w-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-xs font-black uppercase tracking-tight leading-snug ${
                              !notification.isRead ? "text-slate-900" : "text-slate-600"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            {!notification.isRead && (
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            )}
                            {/* X always visible on touch devices, hover on desktop */}
                            <button
                              onClick={() => handleRemove(notification._id)}
                              className="p-1 hover:bg-red-50 hover:text-red-500 rounded-md transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                              title="Clear"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed mt-0.5">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" /> Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 shrink-0">
            <button
              onClick={() => setOpen(false)}
              className="w-full text-[10px] font-black text-primary uppercase tracking-widest py-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default NotificationCenter;
