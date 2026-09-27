import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Heart, Loader2, LockKeyhole, ShieldCheck, Sparkles, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

const logo = "/manus-storage/karaoke-do-vale-logo_9223093e.png";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const session = trpc.admin.session.useQuery();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = trpc.admin.login.useMutation({ onSuccess: () => navigate("/admin") });

  useEffect(() => {
    if (session.data?.authenticated) navigate("/admin");
  }, [session.data?.authenticated]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (username.trim() && password) login.mutate({ username, password });
  };

  return <main className="min-h-screen bg-[#080611] px-5 py-8 text-white sm:grid sm:place-items-center"><div className="pointer-events-none fixed inset-0 opacity-70 [background:radial-gradient(circle_at_15%_5%,rgba(142,83,255,.30),transparent_30%),radial-gradient(circle_at_90%_85%,rgba(236,50,195,.18),transparent_32%)]" /><div className="relative mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center"><section className="hidden lg:block"><img src={logo} alt="Karaokê do Vale" className="h-44 w-[360px] object-contain object-left drop-shadow-[0_0_35px_rgba(196,75,255,.35)]" /><div className="mt-5 max-w-lg"><div className="text-xs font-black uppercase tracking-[.24em] text-violet-200">A festa fica melhor quando todo mundo participa</div><h1 className="mt-3 text-5xl font-black leading-[.98] tracking-[-.06em]">Vote. Reaja.<br /><span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">Descubra quem canta melhor.</span></h1><p className="mt-5 text-base leading-7 text-white/50">Cada pessoa pode avaliar as apresentações, mandar reações e acompanhar o ranking ao vivo da sala.</p><div className="mt-7 grid gap-3 sm:grid-cols-3"><Feature icon={<Trophy />} title="Ranking" text="Notas por cantor" /><Feature icon={<Heart />} title="Reações" text="Aplausos ao vivo" /><Feature icon={<Users />} title="Galera" text="Votação entre amigos" /></div></div></section><section className="rounded-[32px] border border-white/10 bg-[#121022]/95 p-7 shadow-2xl shadow-violet-950/30 sm:p-9"><div className="mb-8 text-center lg:text-left"><img src={logo} alt="Karaokê do Vale" className="mx-auto h-28 w-64 object-contain lg:hidden" /><div className="mx-auto mt-2 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_35px_rgba(215,90,255,.35)] lg:mx-0"><LockKeyhole className="h-6 w-6" /></div><div className="mt-5 text-xs font-black uppercase tracking-[.25em] text-violet-200">central protegida</div><h2 className="mt-2 text-3xl font-black tracking-[-.05em]">Login administrativo</h2><p className="mt-2 text-sm leading-6 text-white/45">Gerencie usuários, salas, planos VIP e a futura cobrança PIX.</p></div><form onSubmit={submit} className="space-y-4"><div><label className="mb-2 block text-xs font-bold uppercase tracking-[.16em] text-white/50">Usuário</label><Input autoFocus value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" placeholder="Seu usuário admin" className="h-13 rounded-2xl border-white/10 bg-white/[.05] text-white placeholder:text-white/25" /></div><div><label className="mb-2 block text-xs font-bold uppercase tracking-[.16em] text-white/50">Senha</label><Input value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" type="password" placeholder="Sua senha" className="h-13 rounded-2xl border-white/10 bg-white/[.05] text-white placeholder:text-white/25" /></div><Button type="submit" disabled={!username.trim() || !password || login.isPending} className="h-13 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 font-black uppercase tracking-[.08em]">{login.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Entrar no painel"}</Button>{login.error && <div className="rounded-xl border border-rose-300/15 bg-rose-300/10 p-3 text-sm text-rose-100">{login.error.message}</div>}</form><div className="mt-7 flex items-start gap-2 text-xs leading-5 text-white/35"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300/70" />Credenciais protegidas no servidor. A cobrança está desligada e a plataforma continua gratuita.</div><div className="mt-5 flex items-center gap-2 text-xs text-white/30"><Sparkles className="h-3.5 w-3.5 text-fuchsia-300" /> Sistema de votação e ranking já preparado para a sua comunidade.</div></section></div></main>;
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[.04] p-3"><div className="flex items-center gap-2 text-sm font-black">{icon}<span>{title}</span></div><div className="mt-1 text-xs text-white/40">{text}</div></div>; }
