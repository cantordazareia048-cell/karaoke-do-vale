import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { LockKeyhole, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const session = trpc.admin.session.useQuery();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = trpc.admin.login.useMutation({ onSuccess: () => navigate("/admin") });
  useEffect(() => { if (session.data?.authenticated) navigate("/admin"); }, [session.data?.authenticated]);
  const submit = (event: FormEvent) => { event.preventDefault(); if (username.trim() && password) login.mutate({ username, password }); };

  return <main className="grid min-h-screen place-items-center bg-[#080611] px-5 text-white"><div className="pointer-events-none fixed inset-0 opacity-70 [background:radial-gradient(circle_at_20%_0%,rgba(142,83,255,.25),transparent_28%),radial-gradient(circle_at_95%_82%,rgba(236,50,195,.14),transparent_30%)]" /><section className="relative w-full max-w-md rounded-[30px] border border-white/10 bg-[#121022]/95 p-7 shadow-2xl shadow-violet-950/30 sm:p-9"><div className="mb-8 text-center"><img src="/manus-storage/karaoke-do-vale-logo_9223093e.png" alt="Karaokê do Vale" className="mx-auto h-24 w-56 object-contain" /><div className="mx-auto mt-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500"><LockKeyhole className="h-5 w-5" /></div><div className="mt-4 text-[10px] font-black uppercase tracking-[.25em] text-violet-200">painel administrativo</div><h1 className="mt-2 text-3xl font-black tracking-[-.05em]">Entrar</h1><p className="mt-2 text-sm text-white/45">Use suas credenciais para abrir o painel admin.</p></div><form onSubmit={submit} className="space-y-4"><div><label className="mb-2 block text-xs font-bold uppercase tracking-[.16em] text-white/50">Usuário</label><Input autoFocus value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" placeholder="Usuário admin" className="h-13 rounded-2xl border-white/10 bg-white/[.05] text-white placeholder:text-white/25" /></div><div><label className="mb-2 block text-xs font-bold uppercase tracking-[.16em] text-white/50">Senha</label><Input value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" type="password" placeholder="Senha" className="h-13 rounded-2xl border-white/10 bg-white/[.05] text-white placeholder:text-white/25" /></div><Button type="submit" disabled={!username.trim() || !password || login.isPending} className="h-13 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 font-black uppercase tracking-[.08em]">{login.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Entrar no painel"}</Button>{login.error && <div className="rounded-xl border border-rose-300/15 bg-rose-300/10 p-3 text-sm text-rose-100">{login.error.message}</div>}</form><div className="mt-7 flex items-start gap-2 text-xs leading-5 text-white/35"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300/70" />Login protegido no servidor. A cobrança continua desligada.</div></section></main>;
}
