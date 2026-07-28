import React, { useState } from 'react';
import { 
  History, 
  Search, 
  User, 
  Wind, 
  Lightbulb, 
  Cpu, 
  Cloud, 
  Info, 
  Calendar,
  Filter
} from 'lucide-react';

const FILTER_CATEGORIES = ["All", "Person", "Fan", "Light", "ESP32", "Firebase"];

export default function ActivityHistory({ historyItems = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const getIconData = (type) => {
    switch (type) {
      case "person_sitting":
        return { icon: User, color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30", title: "Person Sitting" };
      case "person_left":
        return { icon: User, color: "text-slate-400 bg-slate-800 border-slate-700", title: "Seat Empty" };
      case "fan_on":
        return { icon: Wind, color: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30", title: "Fan Turned ON" };
      case "fan_off":
        return { icon: Wind, color: "text-slate-400 bg-slate-800 border-slate-700", title: "Fan Turned OFF" };
      case "light_on":
        return { icon: Lightbulb, color: "text-amber-400 bg-amber-500/20 border-amber-500/30", title: "Light Turned ON" };
      case "light_off":
        return { icon: Lightbulb, color: "text-slate-400 bg-slate-800 border-slate-700", title: "Light Turned OFF" };
      case "esp32_connected":
        return { icon: Cpu, color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30", title: "ESP32 Connected" };
      case "esp32_disconnected":
        return { icon: Cpu, color: "text-rose-400 bg-rose-500/20 border-rose-500/30", title: "ESP32 Disconnected" };
      case "firebase_connected":
        return { icon: Cloud, color: "text-blue-400 bg-blue-500/20 border-blue-500/30", title: "Cloud Synced" };
      default:
        return { icon: Info, color: "text-slate-400 bg-slate-800 border-slate-700", title: "Activity Event" };
    }
  };

  // Filter items
  const filtered = historyItems.filter((item) => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === "All") return true;
    if (selectedFilter === "Person") return item.type.includes("person");
    if (selectedFilter === "Fan") return item.type.includes("fan");
    if (selectedFilter === "Light") return item.type.includes("light");
    if (selectedFilter === "ESP32") return item.type.includes("esp32");
    if (selectedFilter === "Firebase") return item.type.includes("firebase");

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            Activity History & Logs
          </h2>
          <p className="text-xs text-slate-400 mt-1">Audit log of sofa interactions, sensor triggers, and system connections.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input rounded-xl pl-9 pr-4 py-2 text-xs"
          />
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-slate-500 shrink-0" />
        {FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
              selectedFilter === cat
                ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
                : 'glass-card text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 space-y-3">
          <History className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No activity history found</h3>
          <p className="text-xs text-slate-500">Try clearing search filters or trigger sofa controls above.</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {filtered.map((item) => {
            const iconData = getIconData(item.type);
            const IconComponent = iconData.icon;
            const dateStr = new Date(item.timestamp).toLocaleString([], { 
              month: 'short', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            });

            return (
              <div key={item.id} className="relative flex items-start space-x-4 group">
                
                {/* Timeline Dot Icon */}
                <div className={`absolute -left-[31px] top-1.5 w-7 h-7 rounded-full flex items-center justify-center border transition-all ${iconData.color}`}>
                  <IconComponent className="w-3.5 h-3.5" />
                </div>

                {/* Event Card */}
                <div className="flex-1 glass-card glass-card-hover rounded-2xl p-4 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {item.description}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
