import React, { useState } from 'react';
import { 
  X, 
  Wifi, 
  Radio, 
  Lock, 
  Eye, 
  EyeOff, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  RefreshCw,
  Armchair
} from 'lucide-react';
import { provisionSmartSofaBle } from '../lib/bleProvisioning';

export default function WifiConfigModal({ isOpen, onClose, deviceStatus }) {
  const [ssid, setSsid] = useState(deviceStatus?.wifiSsid || "Home_WiFi_5G");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ssidError, setSsidError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [bleState, setBleState] = useState(null); // { status, message }
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleStartProvisioning = async () => {
    setSsidError("");
    setPasswordError("");

    if (!ssid.trim()) {
      setSsidError("Wi-Fi SSID is required");
      return;
    }
    if (!password.trim()) {
      setPasswordError("Wi-Fi Password is required");
      return;
    }

    const result = await provisionSmartSofaBle(ssid, password, (state) => {
      setBleState(state);
    });

    if (result.success) {
      setIsSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-3xl border border-slate-800 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Radio className="w-5 h-5 animate-pulse text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">BLE Wi-Fi Provisioning Center</h3>
              <p className="text-xs text-slate-400">Configure ESP32 Wi-Fi credentials securely over Bluetooth</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl glass-card hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Current Status Card */}
          <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                deviceStatus?.wifiConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Current Wi-Fi Network</span>
                <strong className="text-sm font-bold text-white">
                  {deviceStatus?.wifiConnected ? deviceStatus.wifiSsid : "Not Connected"}
                </strong>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              deviceStatus?.wifiConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}>
              {deviceStatus?.wifiConnected ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Form Credentials */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Network Credentials</h4>
            
            {/* SSID Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Wi-Fi SSID (Name)</label>
              <div className="relative">
                <Wifi className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Home_WiFi_5G"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  className="w-full glass-input rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium"
                />
              </div>
              {ssidError && <span className="text-[11px] text-rose-400 font-semibold">{ssidError}</span>}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Wi-Fi WPA2 Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Wi-Fi Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input rounded-xl pl-9 pr-10 py-2.5 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && <span className="text-[11px] text-rose-400 font-semibold">{passwordError}</span>}
            </div>
          </div>

          {/* Connect / Provision Button */}
          <button
            onClick={handleStartProvisioning}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Send className="w-4 h-4" />
            Scan & Connect Smart Sofa via BLE
          </button>

        </div>

        {/* Provisioning Progress Overlay */}
        {bleState && !isSuccess && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 animate-spin">
              <Loader2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-extrabold text-white">BLE Provisioning Active</h4>
            <p className="text-xs text-slate-300 max-w-xs">{bleState.message}</p>
            {bleState.status === 'Error' && (
              <button
                onClick={() => setBleState(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold"
              >
                Dismiss
              </button>
            )}
          </div>
        )}

        {/* Success Overlay */}
        {isSuccess && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-extrabold text-white">Smart Sofa Provisioned!</h4>
            <p className="text-xs text-slate-300 max-w-sm">Wi-Fi credentials saved to ESP32 flash memory. Controller is now connecting online.</p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setBleState(null);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/30"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
