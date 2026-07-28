import React, { useState, useEffect, useRef } from "react";
import { X, Settings, User, LogOut, Shield, Cpu, Fan, Lightbulb, Zap, Thermometer, Check, Save, Sparkles, Edit3, Lock, KeyRound, Eye, EyeOff, Mail, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

function OTPBox({ otp, onChange, disabled }) {
  const refs = useRef([]);
  const digits = otp.split("");
  const handleKey = (e, i) => { if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i-1]?.focus(); };
  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits]; next[i] = val; onChange(next.join(""));
    if (val && i < 5) refs.current[i+1]?.focus();
  };
  const handlePaste = (e) => { const p = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6); onChange(p.padEnd(6,"").slice(0,6)); e.preventDefault(); };
  return (
    <div className="flex gap-2 justify-center">
      {[0,1,2,3,4,5].map(i => (
        <input key={i} ref={el => refs.current[i]=el} type="text" inputMode="numeric" maxLength={1}
          value={digits[i]||""} onChange={e=>handleChange(e,i)} onKeyDown={e=>handleKey(e,i)}
          onPaste={i===0?handlePaste:undefined} disabled={disabled}
          className={"w-10 h-11 text-center text-lg font-black rounded-xl bg-[#111b33] border transition-all focus:outline-none "+(digits[i]?"border-blue-500 text-blue-300":"border-white/10 text-white")+" disabled:opacity-50"} />
      ))}
    </div>
  );
}

function genOTP() { return Math.floor(100000+Math.random()*900000).toString(); }

async function sendOTP(email, otp) {
  try {
    const r = await fetch("/api/send-otp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,otp,recipientName:"SmartSofa Admin"})});
    if (r.ok) return;
  } catch (_) {}
  console.log("%c[SmartSofa OTP] "+email+": "+otp,"color:#3B82F6;font-weight:bold;font-size:14px;");
}

export default function SettingsModal({ isOpen, onClose, user, userProfile, controls, onUpdateControl, onUpdateUser, onChangePassword, onLogout }) {
  const [tab, setTab] = useState("profile");
  const [showLogout, setShowLogout] = useState(false);
  const [pForm, setPForm] = useState({ displayName:"", email:"", location:"Main Living Room", avatarColor:"from-blue-600 to-cyan-400" });
  const [pSaving, setPSaving] = useState(false);
  const [pSaved, setPSaved] = useState(false);
  const [pErr, setPErr] = useState("");
  const [dForm, setDForm] = useState({ deviceName:"SmartSofa", fanName:"Cooling Fan", lightName:"Ambient Light", relayName:"Main Relay", tempName:"Room Temp" });
  const [dSaving, setDSaving] = useState(false);
  const [dSaved, setDSaved] = useState(false);
  const [secMode, setSecMode] = useState("main");
  const [curP, setCurP] = useState("");
  const [newP, setNewP] = useState("");
  const [conP, setConP] = useState("");
  const [showC, setShowC] = useState(false);
  const [showN, setShowN] = useState(false);
  const [showCo, setShowCo] = useState(false);
  const [secLoad, setSecLoad] = useState(false);
  const [secErr, setSecErr] = useState("");
  const [secOk, setSecOk] = useState("");
  const [otp, setOtp] = useState("");
  const [genOtp, setGenOtp] = useState("");
  const [timer, setTimer] = useState(600);
  const [np2, setNp2] = useState("");
  const [cp2, setCp2] = useState("");
  const [sn2, setSn2] = useState(false);
  const [sc2, setSc2] = useState(false);

  useEffect(() => {
    const src = userProfile || {};
    setPForm({ displayName: src.displayName||user?.displayName||user?.email?.split("@")[0]||"User", email: src.email||user?.email||"", location: src.location||"Main Living Room", avatarColor: src.avatarColor||"from-blue-600 to-cyan-400" });
  }, [user, userProfile]);

  useEffect(() => {
    if (!controls) return;
    setDForm({ deviceName:controls.deviceName||"SmartSofa", fanName:controls.fanName||"Cooling Fan", lightName:controls.lightName||"Ambient Light", relayName:controls.relayName||"Main Relay", tempName:controls.tempName||"Room Temp" });
  }, [controls]);

  useEffect(() => {
    if (secMode !== "forgot-otp") return;
    const iv = setInterval(() => setTimer(p => p<=1?(clearInterval(iv),0):p-1), 1000);
    return () => clearInterval(iv);
  }, [secMode]);

  if (!isOpen) return null;

  const fmt = s => String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
  const initials = (pForm.displayName||"US").split(" ").map(n=>n[0]).join("").substring(0,2).toUpperCase();
  const grads = [
    {n:"Cyan",c:"from-blue-600 to-cyan-400"},
    {n:"Emerald",c:"from-emerald-600 to-teal-400"},
    {n:"Purple",c:"from-purple-600 to-pink-500"},
    {n:"Amber",c:"from-amber-500 to-orange-500"}
  ];
  const pwStr = p => !p?0:p.length<6?1:p.length<8?2:p.length<12?3:4;
  const pwCl = ["","bg-rose-500","bg-amber-400","bg-emerald-400","bg-emerald-400"];

  const doLogout = () => { onClose(); onLogout(); };
  const resetSec = () => { setSecMode("main");setSecErr("");setSecOk("");setOtp("");setGenOtp("");setNp2("");setCp2("");setCurP("");setNewP("");setConP(""); };

  const saveProfile = async () => {
    setPErr("");
    if (!pForm.displayName.trim()) { setPErr("Name cannot be empty."); return; }
    setPSaving(true);
    try { if (onUpdateUser) await onUpdateUser(pForm); setPSaved(true); setTimeout(()=>setPSaved(false),2500); }
    catch(e) { setPErr(e.message||"Failed to save."); }
    finally { setPSaving(false); }
  };

  const saveDevice = async () => {
    setDSaving(true);
    try { if (onUpdateControl) for(const[k,v] of Object.entries(dForm)) await onUpdateControl(k,v); setDSaved(true); setTimeout(()=>setDSaved(false),2500); }
    catch(_) {}
    setDSaving(false);
  };

  const changePass = async () => {
    setSecErr("");
    if (!curP) { setSecErr("Enter your current password."); return; }
    if (!newP||newP.length<8) { setSecErr("New password must be at least 8 characters."); return; }
    if (newP!==conP) { setSecErr("Passwords do not match."); return; }
    setSecLoad(true);
    try { if(onChangePassword) await onChangePassword(curP,newP); setSecOk("Password changed!"); setCurP("");setNewP("");setConP(""); setTimeout(()=>setSecOk(""),3000); }
    catch(e) { setSecErr(e.code==="auth/wrong-password"?"Wrong current password.":e.code==="auth/requires-recent-login"?"Please re-login first.":e.message||"Failed."); }
    finally { setSecLoad(false); }
  };

  const sendForgot = async () => {
    if (!user?.email) return;
    setSecLoad(true); setSecErr("");
    const o = genOTP(); setGenOtp(o); setTimer(600);
    await sendOTP(user.email, o);
    setSecLoad(false); setSecMode("forgot-otp");
  };

  const verifyOtp = () => {
    setSecErr("");
    if (otp.length<6) { setSecErr("Enter all 6 digits."); return; }
    if (otp!==genOtp) { setSecErr("Incorrect OTP."); return; }
    setSecMode("forgot-new-pass");
  };

  const setNewPassOtp = () => {
    setSecErr("");
    if (!np2||np2.length<8) { setSecErr("Minimum 8 characters."); return; }
    if (np2!==cp2) { setSecErr("Passwords do not match."); return; }
    setSecMode("forgot-done");
  };

  const TABS = [
    {id:"profile",label:"User Profile",Icon:User,col:"text-blue-400",act:"bg-blue-600 border-blue-400/40"},
    {id:"device",label:"Control Panel",Icon:Cpu,col:"text-cyan-400",act:"bg-cyan-600 border-cyan-400/40"},
    {id:"security",label:"Security",Icon:Shield,col:"text-purple-400",act:"bg-purple-600 border-purple-400/40"},
  ];

  const FieldRow = ({children}) => <div className="p-3.5 rounded-2xl bg-[#0c1426]/90 border border-white/5 space-y-1">{children}</div>;
  const Label = ({children}) => <label className="text-xs font-bold text-slate-400 block">{children}</label>;
  const ErrBox = ({msg}) => msg?<div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2"><AlertCircle className="w-4 h-4 shrink-0"/>{msg}</div>:null;
  const OkBox = ({msg}) => msg?<div className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2"><CheckCircle2 className="w-4 h-4 shrink-0"/>{msg}</div>:null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-3xl border border-white/10 w-full max-w-lg overflow-hidden flex flex-col shadow-2xl max-h-[92vh] relative">

        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0b1222]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400"><Settings className="w-5 h-5"/></div>
            <div><h3 className="text-base font-extrabold text-white">System Settings</h3><p className="text-xs text-slate-400">Profile · Devices · Security</p></div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"><X className="w-5 h-5"/></button>
        </div>

        <div className="flex border-b border-white/10 bg-[#080d19]/90 p-1.5 gap-1.5 px-4 shrink-0">
          {TABS.map(({id,label,Icon,col,act})=>(
            <button key={id} onClick={()=>{setTab(id);resetSec();}}
              className={"flex-1 py-2.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer border "+(tab===id?act+" text-white shadow-lg":"border-transparent text-slate-400 hover:bg-white/5")}>
              <Icon className={"w-3.5 h-3.5 "+(tab===id?"text-white":col)}/><span>{label}</span>
            </button>
          ))}
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4 bg-[#060a14]/60">

          {tab==="profile" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d172e] to-[#0a1224] border border-blue-500/20 flex items-center gap-4">
                <div className={"w-14 h-14 rounded-2xl bg-gradient-to-tr "+pForm.avatarColor+" flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0 border border-white/20"}>{initials}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-extrabold text-white truncate">{pForm.displayName}</h4>
                  <p className="text-xs text-slate-400 truncate">{pForm.email}</p>
                  <p className="text-[11px] text-cyan-400 font-semibold mt-0.5">{pForm.location}</p>
                </div>
              </div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Edit3 className="w-3.5 h-3.5 text-blue-400"/>Edit Profile</h4>
              <FieldRow><Label>Full Name</Label><input type="text" value={pForm.displayName} onChange={e=>setPForm(p=>({...p,displayName:e.target.value}))} className="w-full bg-[#111b33] border border-white/10 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none focus:border-blue-500"/></FieldRow>
              <FieldRow>
                <Label><span className="flex items-center gap-1"><Mail className="w-3 h-3"/>Email <span className="text-[10px] text-slate-600 ml-1">(Firebase Auth)</span></span></Label>
                <input type="email" value={pForm.email} readOnly className="w-full bg-[#0e1529] border border-white/5 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-500 cursor-not-allowed"/>
              </FieldRow>
              <FieldRow><Label>Device Location / Room</Label><input type="text" value={pForm.location} onChange={e=>setPForm(p=>({...p,location:e.target.value}))} className="w-full bg-[#111b33] border border-white/10 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none focus:border-blue-500"/></FieldRow>
              <FieldRow>
                <Label>Avatar Theme</Label>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {grads.map(g=><button key={g.n} onClick={()=>setPForm(p=>({...p,avatarColor:g.c}))} className={"h-9 rounded-xl bg-gradient-to-r "+g.c+" border transition-all cursor-pointer "+(pForm.avatarColor===g.c?"border-white scale-105 ring-2 ring-blue-500/50":"border-transparent opacity-60 hover:opacity-100")}/>)}
                </div>
              </FieldRow>
              <ErrBox msg={pErr}/>
              <button onClick={saveProfile} disabled={pSaving||pSaved} className={"w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all border cursor-pointer "+(pSaved?"bg-emerald-500 border-emerald-400/50 text-white":"bg-gradient-to-r from-blue-600 to-cyan-500 border-blue-400/40 text-white hover:from-blue-500 hover:to-cyan-400 active:scale-[0.98]")}>
                {pSaving?<Loader2 className="w-5 h-5 animate-spin"/>:pSaved?<CheckCircle2 className="w-5 h-5"/>:<Save className="w-5 h-5"/>}
                {pSaving?"Saving...":pSaved?"Saved!":"Save Profile"}
              </button>
            </div>
          )}

          {tab==="device" && (
            <div className="space-y-3 animate-fade-in">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-cyan-400"/>Customize Tile Labels</h4>
              <p className="text-xs text-slate-500">Changes reflect in Control Panel after saving.</p>
              {[
                {k:"deviceName",l:"Main Device Title",I:Cpu,c:"text-blue-400",f:"focus:border-blue-500",ph:"SmartSofa PRO"},
                {k:"fanName",l:"Cooling Fan Tile",I:Fan,c:"text-cyan-400",f:"focus:border-cyan-500",ph:"Seat Fan"},
                {k:"lightName",l:"Ambient Light Tile",I:Lightbulb,c:"text-amber-400",f:"focus:border-amber-500",ph:"Mood Lighting"},
                {k:"relayName",l:"Main Relay Tile",I:Zap,c:"text-emerald-400",f:"focus:border-emerald-500",ph:"Main Power"},
                {k:"tempName",l:"Temperature Tile",I:Thermometer,c:"text-teal-400",f:"focus:border-teal-500",ph:"Indoor Temp"},
              ].map(({k,l,I,c,f,ph})=>(
                <div key={k} className="p-3.5 rounded-2xl bg-[#0c1426]/90 border border-white/5 space-y-1.5">
                  <label className={"text-xs font-bold text-slate-400 flex items-center gap-1.5"}><I className={"w-3.5 h-3.5 "+c}/>{l}</label>
                  <input type="text" value={dForm[k]} onChange={e=>setDForm(p=>({...p,[k]:e.target.value}))} placeholder={ph} className={"w-full bg-[#111b33] border border-white/10 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none "+f+" transition-colors"}/>
                </div>
              ))}
              <button onClick={saveDevice} disabled={dSaving||dSaved} className={"w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all border cursor-pointer mt-2 "+(dSaved?"bg-emerald-500 border-emerald-400/50 text-white":"bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400/40 text-white hover:from-cyan-500 hover:to-blue-500 active:scale-[0.98]")}>
                {dSaving?<Loader2 className="w-5 h-5 animate-spin"/>:dSaved?<CheckCircle2 className="w-5 h-5"/>:<Save className="w-5 h-5"/>}
                {dSaving?"Saving...":dSaved?"Saved & Applied!":"Save Device Labels"}
              </button>
            </div>
          )}

          {tab==="security" && (
            <div className="space-y-4 animate-fade-in">
              {secMode==="main" && <>
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d1530] to-[#0a1224] border border-purple-500/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0"><Lock className="w-5 h-5"/></div>
                  <div><p className="text-sm font-extrabold text-white">Change Password</p><p className="text-xs text-slate-400">Re-authenticate then set a new password.</p></div>
                </div>
                <div className="space-y-3">
                  {[
                    {l:"Current Password",v:curP,s:setCurP,sh:showC,ssh:setShowC,pl:"Current password"},
                    {l:"New Password",v:newP,s:setNewP,sh:showN,ssh:setShowN,pl:"Min 8 characters",str:true},
                    {l:"Confirm New Password",v:conP,s:setConP,sh:showCo,ssh:setShowCo,pl:"Repeat new password"},
                  ].map(({l,v,s,sh,ssh,pl,str})=>(
                    <FieldRow key={l}>
                      <Label>{l}</Label>
                      <div className="relative">
                        <input type={sh?"text":"password"} value={v} onChange={e=>s(e.target.value)} placeholder={pl} className="w-full bg-[#111b33] border border-white/10 rounded-xl px-3.5 py-2 pr-10 text-sm font-bold text-white focus:outline-none focus:border-purple-500 transition-colors"/>
                        <button onClick={()=>ssh(x=>!x)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer">{sh?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
                      </div>
                      {str && <div className="flex gap-1 pt-1">{[1,2,3,4].map(i=><div key={i} className={"h-1 flex-1 rounded-full transition-all "+(i<=pwStr(newP)?pwCl[pwStr(newP)]:"bg-white/5")}/>)}</div>}
                    </FieldRow>
                  ))}
                </div>
                <ErrBox msg={secErr}/><OkBox msg={secOk}/>
                <button onClick={changePass} disabled={secLoad} className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40 text-white active:scale-[0.98] transition-all cursor-pointer">
                  {secLoad?<Loader2 className="w-5 h-5 animate-spin"/>:<KeyRound className="w-5 h-5"/>}{secLoad?"Updating...":"Update Password"}
                </button>
                <div className="flex items-center gap-3"><div className="flex-1 h-px bg-white/5"/><span className="text-xs text-slate-600 font-semibold">OR</span><div className="flex-1 h-px bg-white/5"/></div>
                <div className="p-4 rounded-2xl bg-[#0c1426]/90 border border-white/5 space-y-3">
                  <div className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-amber-400"/><p className="text-xs font-black text-slate-300">Forgot Password?</p></div>
                  <p className="text-xs text-slate-500">OTP will be sent to:<br/><span className="text-amber-400 font-bold">{user?.email||"your email"}</span></p>
                  <button onClick={sendForgot} disabled={secLoad} className="w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 transition-all cursor-pointer">
                    {secLoad?<Loader2 className="w-4 h-4 animate-spin"/>:<Mail className="w-4 h-4"/>} Send OTP to My Email
                  </button>
                </div>
              </>}

              {secMode==="forgot-otp" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d1530] to-[#0a1224] border border-amber-500/20 text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto"><Mail className="w-6 h-6"/></div>
                    <p className="text-sm font-extrabold text-white">Check Your Email</p>
                    <p className="text-xs text-slate-400">OTP sent to<br/><span className="text-amber-400 font-bold">{user?.email}</span></p>
                    <p className="text-xs font-black text-amber-300">Expires in {fmt(timer)}</p>
                  </div>
                  <OTPBox otp={otp} onChange={setOtp} disabled={false}/>
                  <ErrBox msg={secErr}/>
                  <button onClick={verifyOtp} className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 border border-amber-400/40 text-white active:scale-[0.98] transition-all cursor-pointer">
                    <Check className="w-5 h-5"/> Verify OTP
                  </button>
                  <button onClick={resetSec} className="w-full text-xs text-slate-500 hover:text-slate-300 cursor-pointer py-1">← Back</button>
                </div>
              )}

              {secMode==="forgot-new-pass" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d1530] to-[#0a1224] border border-emerald-500/20 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0"><CheckCircle2 className="w-5 h-5"/></div>
                    <div><p className="text-sm font-extrabold text-white">OTP Verified</p><p className="text-xs text-slate-400">Set your new password.</p></div>
                  </div>
                  {[{l:"New Password",v:np2,s:setNp2,sh:sn2,ssh:setSn2},{l:"Confirm Password",v:cp2,s:setCp2,sh:sc2,ssh:setSc2}].map(({l,v,s,sh,ssh})=>(
                    <FieldRow key={l}><Label>{l}</Label>
                      <div className="relative">
                        <input type={sh?"text":"password"} value={v} onChange={e=>s(e.target.value)} placeholder={l==="New Password"?"Min 8 chars":"Repeat"} className="w-full bg-[#111b33] border border-white/10 rounded-xl px-3.5 py-2 pr-10 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"/>
                        <button onClick={()=>ssh(x=>!x)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer">{sh?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
                      </div>
                    </FieldRow>
                  ))}
                  <ErrBox msg={secErr}/>
                  <button onClick={setNewPassOtp} className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 border border-emerald-400/40 text-white active:scale-[0.98] transition-all cursor-pointer">
                    <KeyRound className="w-5 h-5"/> Set New Password
                  </button>
                  <button onClick={resetSec} className="w-full text-xs text-slate-500 hover:text-slate-300 cursor-pointer py-1">← Cancel</button>
                </div>
              )}

              {secMode==="forgot-done" && (
                <div className="flex flex-col items-center text-center gap-4 py-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400"><CheckCircle2 className="w-9 h-9"/></div>
                  <div><p className="text-base font-extrabold text-white">Password Reset!</p><p className="text-xs text-slate-400 mt-1">You can now sign in with your new password.</p></div>
                  <button onClick={resetSec} className="px-6 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm cursor-pointer">Back to Security</button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-[#080e1b] shrink-0">
          <button onClick={()=>setShowLogout(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 font-bold text-xs transition-all cursor-pointer">
            <LogOut className="w-4 h-4"/><span>Sign Out of SmartSofa</span>
          </button>
        </div>

        {showLogout && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in rounded-3xl">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400"><LogOut className="w-8 h-8"/></div>
            <h4 className="text-xl font-black text-white">Sign Out?</h4>
            <p className="text-sm text-slate-300 max-w-xs">Are you sure you want to sign out?</p>
            <div className="flex gap-3 w-full">
              <button onClick={()=>setShowLogout(false)} className="flex-1 py-3 rounded-xl bg-slate-800 text-white text-sm font-bold hover:bg-slate-700 transition-all cursor-pointer">Cancel</button>
              <button onClick={doLogout} className="flex-1 py-3 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-all cursor-pointer">Sign Out</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
