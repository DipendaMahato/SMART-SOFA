import React from 'react';
import { 
  X, 
  Bell, 
  Trash2, 
  CheckCheck, 
  User, 
  Wind, 
  Lightbulb, 
  AlertTriangle, 
  Cloud, 
  WifiOff 
} from 'lucide-react';

export default function NotificationsModal({ 
  isOpen, 
  onClose, 
  notifications = [], 
  onMarkRead, 
  onDelete, 
  onClearAll 
}) {
  if (!isOpen) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "person_sitting":
        return { icon: User, color: "text-emerald-400 bg-emerald-500/20" };
      case "fan_activated":
        return { icon: Wind, color: "text-cyan-400 bg-cyan-500/20" };
      case "light_activated":
        return { icon: Lightbulb, color: "text-amber-400 bg-amber-500/20" };
      case "esp32_offline":
      case "wifi_lost":
        return { icon: AlertTriangle, color: "text-rose-400 bg-rose-500/20" };
      case "firebase_connected":
        return { icon: Cloud, color: "text-blue-400 bg-blue-500/20" };
      default:
        return { icon: Bell, color: "text-slate-400 bg-slate-800" };
    }
  };

  const getRelativeTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-3xl border border-slate-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">System Notifications</h3>
              <p className="text-xs text-slate-400">{notifications.filter(n => !n.read).length} unread alerts</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-card hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Bell className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-sm font-bold text-slate-400">No notifications</p>
            </div>
          ) : (
            notifications.map((n) => {
              const { icon: IconComp, color } = getNotificationIcon(n.type);
              return (
                <div
                  key={n.id}
                  onClick={() => onMarkRead(n.id)}
                  className={`p-4 rounded-2xl glass-card border transition-all flex items-start space-x-3 cursor-pointer group ${
                    n.read ? 'border-slate-800/60 opacity-75' : 'border-blue-500/30 bg-blue-950/20'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <IconComp className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold ${n.read ? 'text-slate-300' : 'text-white'}`}>
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {getRelativeTime(n.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(n.id);
                    }}
                    className="p-1 rounded-lg text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
