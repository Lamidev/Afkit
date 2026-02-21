import { Bell, Package, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchNotifications, markAsRead, removeNotification } from "@/store/common-slice/notification-slice";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function NotificationCenter() {
  const { user } = useSelector((state) => state.auth);
  const { notifications, isLoading } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications(user.id));
      
      // Auto-refresh every 2 minutes
      const interval = setInterval(() => {
        dispatch(fetchNotifications(user.id));
      }, 120000);
      return () => clearInterval(interval);
    }
  }, [dispatch, user?.id]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id)).then(() => {
      dispatch(fetchNotifications(user.id));
    });
  };

  const handleRemove = (id) => {
    dispatch(removeNotification(id)).then(() => {
      dispatch(fetchNotifications(user.id));
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative group">
          <Bell className={`h-5 w-5 stroke-[2.5px] ${unreadCount > 0 ? "text-orange-500 animate-ring" : "text-primary"}`} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-orange-500 border-2 border-white">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-0 rounded-2xl shadow-xl border-slate-100 overflow-hidden" align="end">
        <div className="p-4 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Notifications</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              {unreadCount} Unread Alerts
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
        <Separator />
        <ScrollArea className="h-[350px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <Bell className="h-6 w-6 text-slate-200" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
                Your activity feed is empty. <br/> Stay tuned for alert updates!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50 bg-white">
              {notifications.map((notification) => {
                return (
                  <div 
                    key={notification._id} 
                    className={`p-4 transition-colors relative group ${!notification.isRead ? "bg-orange-50/30" : "bg-white hover:bg-slate-50"}`}
                  >
                    <div className="flex gap-4 lowercase">
                      <div className={`mt-1 h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                        !notification.isRead ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-slate-100 text-slate-400"
                      }`}>
                        <Package className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <p className={`text-xs font-black uppercase tracking-tight ${!notification.isRead ? "text-slate-900" : "text-slate-600"}`}>
                            {notification.title}
                          </p>
                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            )}
                            <button 
                              onClick={() => handleRemove(notification._id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-500 rounded-md transition-all"
                              title="Clear notification"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-black text-slate-300 uppercase letter-spacing-wider">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                          </div>
                          {!notification.isRead ? (
                            <button 
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" /> Mark Read
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleRemove(notification._id)}
                              className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 flex items-center gap-1"
                            >
                              <X className="h-3 w-3" /> Clear
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
        <div className="p-3 bg-slate-50 border-t border-slate-100">
           <button 
             onClick={() => setOpen(false)}
             className="w-full text-[10px] font-black text-primary uppercase tracking-widest py-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
           >
             Close Feed
           </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationCenter;
