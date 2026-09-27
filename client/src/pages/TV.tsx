import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ChevronRight, CircleHelp, ListMusic, Loader2, Music2, Pause, Play, QrCode, SkipBack, SkipForward, Smartphone, Users, Volume2, VolumeX, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const APP_URL = typeof window !== "undefined" ? window.location.origin : "https://karaoke-do-vale.app";

function formatCreatedAt(timestamp?: number) {
  if (!timestamp) return "agora";
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(timestamp);
}

export default function TV() {
  const [code, setCode] = useState("");
  const createRoom = trpc.karaoke.createRoom.useMutation({ onSuccess: (room) => setCode(room.code) });
  const roomQuery = trpc.karaoke.getRoom.useQuery({ code }, { enabled: Boolean(code), refetchInterval: 1200, retry: false });
  const control = trpc.karaoke.control.useMutation({ onSuccess: () => roomQuery.refetch() });
  const room = roomQuery.data;
  const joinUrl = `${APP_URL}/join/${code}`;
  const qrUrl = code ? `https://quickchart.io/qr?text=${encodeURIComponent(joinUrl)}&size=240&margin=1&ecLevel=M` : "";

  useEffect(() => {
    if (!code && !createRoom.isPending) createRoom.mutate();
  }, [code]);

  const nextSong = room?.queue?.[0];
  const current = room?.nowPlaying as { videoId: string; title: string; channel: string; duration: string; addedBy: string } | null | undefined;
  const progress = useMemo(() => current ? 38 : 0, [current]);

  const sendControl = (action: "play" | "pause" | "next" | "previous") => {
    if (code) control.mutate({ code, action });
  };

  if (createRoom.isPending || !room) {
    return <div className="grid min-h-screen place-items-center bg-[#080611] text-white"><div className="flex flex-col items-center gap-4 text-center"><div className="grid h-16 w-16 animate-pulse place-items-center rounded-3xl bg-gradient-to-br from-[#9a6cff] to-[#e741c1] shadow-[0_0_40px_rgba(223,87,255,.45)]"><Music2 className="h-8 w-8" /></div><div className="text-xs font-black uppercase tracking-[.28em] text-[#d3bcff]">Karaokê do Vale</div><div className="flex items-center gap-2 text-sm text-white/45"><Loader2 className="h-4 w-4 animate-spin" /> preparando sua sala...</div></div></div>;
  }

  return (
    <main className="min-h-screen bg-[#080611] text-white selection:bg-[#b16eff]/40">
      <div className="fixed inset-0 pointer-events-none opacity-50 [background:radial-gradient(circle_at_8%_8%,rgba(118,72,255,.22),transparent_28%),radial-gradient(circle_at_94%_10%,rgba(248,55,197,.15),transparent_24%),radial-gradient(circle_at_54%_100%,rgba(42,80,220,.10),transparent_34%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col px-6 py-5 xl:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link href="/" className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#a071ff] to-[#ee43c2] shadow-[0_0_28px_rgba(210,83,255,.34)]"><Music2 className="h-5 w-5" /></div><div><div className="text-xs font-black tracking-[.25em] text-white/70">KARAOKÊ</div><div className="-mt-1 text-lg font-black tracking-[.13em]">DO VALE</div></div></Link>
          <div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-200 sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_9px_#6ee7b7]" /> TV conectada</div><div className="rounded-2xl border border-white/10 bg-white/[.04] px-4 py-2 text-right"><div className="text-[10px] font-bold uppercase tracking-[.18em] text-white/35">Sala</div><div className="text-xl font-black tracking-[.22em] text-[#e4cfff]">{room.code}</div></div></div>
        </header>

        <section className="grid flex-1 gap-6 py-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-h-[560px] flex-col gap-5">
            <div className="relative flex flex-1 flex-col justify-end overflow-hidden rounded-[30px] border border-white/10 bg-[#100c20] shadow-2xl shadow-[#24104e]/40">
              <div className="absolute inset-0 opacity-80 [background:radial-gradient(circle_at_50%_28%,rgba(161,88,255,.26),transparent_26%),linear-gradient(135deg,rgba(108,74,255,.13),transparent_42%),linear-gradient(315deg,rgba(242,51,190,.13),transparent_40%)]" />
              {current ? <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube.com/embed/${current.videoId}?autoplay=1&controls=1&rel=0`} title={current.title} allow="autoplay; encrypted-media; picture-in-picture" /> : <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center"><div className="mb-6 grid h-28 w-28 place-items-center rounded-[34px] border border-white/10 bg-white/[.06] shadow-[0_0_70px_rgba(167,99,255,.28)]"><Music2 className="h-14 w-14 text-[#d2adff]" /></div><div className="text-xs font-black uppercase tracking-[.35em] text-[#bc9aff]">sua festa começa aqui</div><div className="mt-4 max-w-xl text-4xl font-black tracking-[-.04em] sm:text-6xl">Escolha uma música no celular</div><div className="mt-3 text-base text-white/45">{room.participants.length === 0 ? "Escaneie o QR Code para entrar na sala" : "Escolha uma música no celular"}</div></div>}
              {(room.participants.length === 0 || current) && <div className="relative z-10 border-t border-white/10 bg-[#090712]/80 p-5 backdrop-blur-md sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-[.2em] text-[#bb9bff]">{current ? "Tocando agora" : "Fila em espera"}</div><div className="mt-2 text-2xl font-black sm:text-3xl">{current?.title ?? "A fila está vazia"}</div><div className="mt-1 text-sm text-white/45">{current ? `${current.channel} • adicionado por ${current.addedBy}` : "Escolha uma música para começar o show"}</div></div><div className="rounded-full border border-white/10 bg-white/[.05] px-3 py-1.5 text-xs text-white/55">{current ? current.duration : "ao vivo"}</div></div>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#8f63ff] via-[#db52e8] to-[#ff75bd] transition-all" style={{ width: `${progress}%` }} /></div>
                <div className="mt-4 flex items-center justify-between"><div className="flex items-center gap-2"><Button onClick={() => sendControl("previous")} variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-white/65 hover:bg-white/10 hover:text-white"><SkipBack className="h-5 w-5" /></Button><Button onClick={() => sendControl(room.isPlaying ? "pause" : "play")} size="icon" className="h-12 w-12 rounded-2xl bg-white text-[#160d29] shadow-lg shadow-white/10 hover:bg-[#eadcff]">{room.isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}</Button><Button onClick={() => sendControl("next")} variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-white/65 hover:bg-white/10 hover:text-white"><SkipForward className="h-5 w-5" /></Button></div><div className="flex items-center gap-2 text-xs text-white/40"><Volume2 className="h-4 w-4" /> {room.volume}%</div></div>
              </div>}
            </div>
          </div>

          {room.participants.length === 0 && <aside className="flex flex-col gap-5">
            {room.participants.length === 0 ? <div className="rounded-[28px] border border-white/10 bg-[#121022]/90 p-5 shadow-xl shadow-[#1e0b3f]/30"><div className="flex items-start justify-between"><div><div className="text-xs font-black uppercase tracking-[.22em] text-[#d6b4ff]">Entre na festa</div><div className="mt-2 text-2xl font-black">Aponte a câmera</div><div className="mt-1 text-sm leading-6 text-white/45">Use seu celular como controle remoto.</div></div><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#9e73ff]/15 text-[#d3b5ff]"><QrCode className="h-5 w-5" /></div></div><div className="mx-auto mt-5 grid w-full max-w-[220px] place-items-center rounded-[22px] bg-white p-4 shadow-[0_0_48px_rgba(211,141,255,.26)]"><img src={qrUrl} alt={`QR Code para entrar na sala ${room.code}`} className="aspect-square w-full" /></div><div className="mt-4 text-center text-xs text-white/40">Sala <span className="font-black tracking-[.18em] text-white">{room.code}</span></div></div> : <div className="rounded-[28px] border border-emerald-300/15 bg-gradient-to-br from-emerald-300/10 to-[#121022]/90 p-5 shadow-xl shadow-[#1e0b3f]/30"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-300/15 text-emerald-200"><Smartphone className="h-5 w-5" /></div><div><div className="text-xs font-black uppercase tracking-[.22em] text-emerald-200/80">Celular conectado</div><div className="mt-1 text-2xl font-black">Tudo pronto</div></div></div><div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm leading-6 text-white/55">Escolha uma música no celular. Quando alguém adicionar, o vídeo do YouTube aparece aqui na TV automaticamente.</div><div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7]" /> {room.participants.length} pessoa{room.participants.length === 1 ? "" : "s"} na sala</div></div>}
            <div className="rounded-[28px] border border-white/10 bg-[#121022]/90 p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-black"><Users className="h-4 w-4 text-[#c29aff]" /> Na sala</div><div className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-[10px] font-bold text-emerald-200">{room.participants.length} conectados</div></div><div className="mt-4 space-y-2">{room.participants.length ? room.participants.map((person) => <div key={person.id} className="flex items-center justify-between rounded-xl bg-white/[.035] px-3 py-2.5"><div className="flex items-center gap-2.5"><div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#8a65ff] to-[#d548c1] text-xs font-black">{person.name.charAt(0).toUpperCase()}</div><span className="text-sm font-semibold">{person.name}</span></div><span className="text-[10px] font-bold uppercase tracking-[.12em] text-white/35">{person.role === "admin" ? "admin" : "cantor"}</span></div>) : <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-white/35">Aguardando o primeiro cantor...</div>}</div></div>
            <div className="min-h-0 flex-1 rounded-[28px] border border-white/10 bg-[#121022]/90 p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-black"><ListMusic className="h-4 w-4 text-[#c29aff]" /> Próximas músicas</div><span className="text-xs text-white/35">{room.queue.length} na fila</span></div><div className="mt-4 space-y-2 overflow-auto">{room.queue.length ? room.queue.map((song, index) => <div key={song.id} className="flex items-center gap-3 rounded-xl bg-white/[.035] p-3"><div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[.08] text-xs font-black text-[#c9aaff]">{String(index + 1).padStart(2, "0")}</div><img src={song.thumbnail} alt="" className="h-10 w-14 rounded-lg object-cover" /><div className="min-w-0"><div className="truncate text-xs font-bold">{song.title}</div><div className="truncate text-[10px] text-white/35">{song.channel} • {song.addedBy}</div></div></div>) : <div className="py-8 text-center text-xs leading-5 text-white/35">A fila está vazia.<br />Escaneie o QR Code para escolher uma música.</div>}</div>{nextSong && <div className="mt-4 flex items-center gap-2 text-[10px] text-white/35"><ChevronRight className="h-3 w-3" /> Próxima: <span className="truncate text-white/60">{nextSong.title}</span></div>}</div>
          </aside>}
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-white/35"><div className="flex items-center gap-2"><Wifi className="h-3.5 w-3.5 text-emerald-300" /> Sala sincronizada em tempo real</div><div className="flex items-center gap-2"><Smartphone className="h-3.5 w-3.5" /> Use o celular para escolher e controlar</div><div className="hidden items-center gap-2 sm:flex"><CircleHelp className="h-3.5 w-3.5" /> karaokê do vale</div></footer>
      </div>
    </main>
  );
}
