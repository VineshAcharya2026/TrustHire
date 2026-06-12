import React, { useState } from "react";
import { UserProfile, UserRole } from "../types";
import { Bell, Briefcase, SwitchCamera, ShieldCheck, User, Sparkles, CheckCircle } from "lucide-react";
import { NotificationItem } from "../types";

interface HeaderProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSwitchUser: (userId: string) => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
}

export default function Header({
  currentUser,
  allUsers,
  onSwitchUser,
  notifications,
  onMarkAllRead,
  onClearNotifications
}: HeaderProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);
  const currentRoleColor = 
    currentUser.role === UserRole.Admin ? "bg-rose-100 text-rose-800 border-rose-200" :
    currentUser.role === UserRole.Employer ? "bg-amber-100 text-amber-800 border-amber-200" :
    currentUser.role === UserRole.Referrer ? "bg-violet-100 text-violet-800 border-violet-200" :
    "bg-sky-100 text-sky-800 border-sky-200";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs" id="app-header">
      {/* Simulation System Control Header */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-mono font-medium tracking-wide">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SYSTEM CONTROLLER: INTERACTIVE MVP RUNTIME</span>
        </div>
        <div className="flex items-center gap-4">
          <span>TIME: 2026-06-12 (SIMULATED UTC)</span>
          <div className="hidden md:flex items-center gap-1 text-slate-400">
            <SwitchCamera className="w-3.5 h-3.5" />
            <span>Select active persona to test end-to-end workflows</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo - Geometric Balance Theme */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-100 relative shrink-0">
            {/* Geometric Balance rotating square layout */}
            <div className="w-5.5 h-5.5 border-2 border-white/90 rotate-45 flex items-center justify-center">
              <Briefcase className="w-3 h-3 text-white -rotate-45" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-slate-900 flex items-center gap-1">
              Ref<span className="text-indigo-600 font-extrabold italic">Bounty</span> Pro
              <span className="text-[9px] bg-slate-100 text-slate-600 font-mono font-bold px-1.5 py-0.5 rounded border border-slate-205">v14.2</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-mono tracking-wider uppercase font-medium">Bounty Governance & Reward Security</p>
          </div>
        </div>

        {/* Desktop Persona Quick Switcher */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 px-2.5 uppercase tracking-wider font-display">Testing Role:</span>
          {allUsers.slice(0, 5).map((user) => (
            <button
              key={user.id}
              onClick={() => onSwitchUser(user.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                user.id === currentUser.id
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50 font-bold scale-102"
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {user.role === UserRole.Admin && "🛡️ Admin"}
              {user.role === UserRole.Employer && `🏢 ${user.companyId === 'company_acme' ? 'Acme' : 'Stellar'}`}
              {user.role === UserRole.Referrer && `🤝 ${user.name.split(" ")[0]}`}
              {user.role === UserRole.Candidate && "👤 Candidate"}
            </button>
          ))}
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="p-1 px-2.5 rounded-lg text-xs hover:bg-slate-200 text-indigo-600 font-bold font-mono border border-dashed border-indigo-200 cursor-pointer"
          >
            All ({allUsers.length})
          </button>
        </div>

        {/* Right side controls (Dropdowns/Bell/Status) */}
        <div className="flex items-center gap-5">
          {/* Platform Status - Geometric theme */}
          <div className="hidden md:block text-right">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Platform Status</p>
            <p className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </p>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
          {/* Bell Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationDropdown(!showNotificationDropdown);
                setShowUserDropdown(false);
              }}
              className="p-2.5 hover:bg-slate-100 rounded-xl relative text-slate-600 cursor-pointer focus:outline-hidden"
              title="Activity Notification Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotificationDropdown && (
              <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 overflow-hidden text-sm divide-y divide-slate-100 z-50">
                <div className="px-4 py-2 bg-slate-50 flex items-center justify-between">
                  <span className="font-semibold text-slate-800 font-display flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500 fill-amber-100" />
                    Simulated Alerts
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onMarkAllRead();
                      }}
                      className="text-[11px] text-indigo-600 font-medium hover:underline cursor-pointer"
                    >
                      Mark read
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={() => {
                        onClearNotifications();
                      }}
                      className="text-[11px] text-slate-500 font-medium hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      <p className="text-xs">No active notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3.5 hover:bg-slate-50/80 transition-colors ${
                          !notif.read ? "bg-indigo-50/30" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="font-semibold font-display text-xs text-slate-800 flex items-center gap-1">
                            {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mb-1.5 leading-relaxed">{notif.message}</p>
                        
                        {/* Simulation Badge */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md text-slate-500 bg-slate-100">
                            IN-APP
                          </span>
                          {notif.channel === "All" && (
                            <>
                              <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md text-sky-600 bg-sky-50 uppercase">
                                ✉️ Email Sent
                              </span>
                              <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md text-emerald-600 bg-emerald-50 uppercase">
                                💬 WhatsApp Sent
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 py-2 text-center bg-slate-50">
                  <p className="text-[11px] text-slate-500 font-mono">
                    Target Channel Simulated: Nodemailer & Twilio
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Active User Section */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotificationDropdown(false);
              }}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{currentUser.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${currentRoleColor}`}>
                    {currentUser.role}
                  </span>
                  {currentUser.verified && (
                    <CheckCircle className="w-3 h-3 text-emerald-500 fill-emerald-50" />
                  )}
                </div>
              </div>
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2.5 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs text-slate-400 font-mono">REPRESENTING ACTIVE USER</p>
                  <p className="font-bold font-display text-slate-800 text-sm mt-0.5">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{currentUser.email}</p>
                </div>

                <div className="max-h-72 overflow-y-auto py-1">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user.id);
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-slate-50 text-xs text-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{user.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{user.role} • {user.email}</span>
                      </div>
                      {user.id === currentUser.id && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-2 px-4 text-[10px] text-slate-400 leading-relaxed font-mono">
                  Quality Score: {currentUser.qualityScore}% {currentUser.role === UserRole.Referrer && "(Admin View Lock)"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
