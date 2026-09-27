import { ArrowRight, Check, Music2, QrCode, Smartphone, Sparkles, Tv2 } from "lucide-react";
import { Link } from "wouter";

const highlights = [
  "Sala criada automaticamente na TV",
  "QR Code para entrar sem instalar app",
  "Fila compartilhada em tempo real",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080611] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_12%_12%,rgba(129,76,255,.25),transparent_32%),radial-gradient(circle_at_88%_14%,rgba(255,73,190,.18),transparent_28%),linear-gradient(140deg,#080611_0%,#100c25_48%,#080611_100%)]" />
      <div className="pointer-events-none absolute -left-24 top-48 h-72 w-72 rounded-full bg-[#6b4dff]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#f436c5]/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#b67cff] to-[#ec3bbd] shadow-[0_0_26px_rgba(214,89,255,.35)]">
              <Music2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-black tracking-[.24em] text-white">KARAOKÊ</div>
              <div className="-mt-1 text-lg font-black tracking-[.12em] text-[#d7beff]">DO VALE</div>
            </div>
          </Link>
          <div className="hidden rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-xs font-semibold text-white/60 sm:block">
            100% web • sem instalação
          </div>
        </header>

        <section className="grid flex-1 items-center gap-14 pb-10 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:pt-10">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d781ff]/20 bg-[#ac69ff]/10 px-3 py-2 text-xs font-bold uppercase tracking-[.18em] text-[#d8b8ff]">
              <Sparkles className="h-3.5 w-3.5 text-[#ff73d6]" /> A festa começa aqui
            </div>
            <h1 className="max-w-2xl text-5xl font-black leading-[.98] tracking-[-.06em] text-white sm:text-7xl">
              Sua voz.
              <br /> Sua galera.
              <br /><span className="bg-gradient-to-r from-[#d2a9ff] via-[#ff74d5] to-[#8ca9ff] bg-clip-text text-transparent">Seu palco.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/58 sm:text-xl">
              O karaokê da sua festa, direto no navegador. A TV vira o palco e cada celular vira um controle remoto.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/tv" className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#8e5cff] to-[#e83cc1] px-6 text-sm font-black uppercase tracking-[.08em] shadow-[0_14px_40px_rgba(190,73,255,.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(190,73,255,.38)] active:scale-[.98]">
                <Tv2 className="h-5 w-5" /> Abrir na TV <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link href="/tv" className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[.05] px-6 text-sm font-black uppercase tracking-[.08em] text-white/80 transition hover:border-white/25 hover:bg-white/[.09] active:scale-[.98]">
                <Smartphone className="h-5 w-5 text-[#cfb3ff]" /> Ver como funciona
              </Link>
            </div>
            <div className="mt-9 grid gap-3 text-sm text-white/60 sm:grid-cols-3">
              {highlights.map((highlight) => <div key={highlight} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#cf83ff]" />{highlight}</div>)}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="absolute -inset-10 rounded-[40px] bg-gradient-to-r from-[#8457ff]/25 via-[#f234c4]/15 to-[#49a9ff]/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-[#131025]/90 p-3 shadow-2xl shadow-[#25105b]/50">
              <div className="rounded-[25px] border border-white/10 bg-[#0b0915] p-5 sm:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#9d6dff] to-[#ef45c0]"><Music2 className="h-5 w-5" /></div><div><div className="text-[10px] font-black tracking-[.25em] text-white/45">KARAOKÊ</div><div className="text-sm font-black tracking-[.14em]">DO VALE</div></div></div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-bold text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7]" /> AO VIVO</div>
                </div>
                <div className="grid gap-6 py-8 sm:grid-cols-[1fr_150px] sm:items-center">
                  <div><div className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#bf9cff]">Sala da noite</div><div className="text-5xl font-black tracking-[.18em] text-white">K7P92</div><div className="mt-4 text-sm leading-6 text-white/50">Aponte a câmera do celular para entrar e escolher sua música.</div></div>
                  <div className="mx-auto grid aspect-square w-36 place-items-center rounded-2xl bg-white p-3 shadow-[0_0_35px_rgba(217,152,255,.32)]"><QrCode className="h-full w-full text-[#120b25]" /></div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-white/40">Tocando agora</span><span className="text-[10px] font-bold text-[#a9ffdd]">03:42</span></div><div className="flex items-center gap-3"><div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#e48fce] to-[#7065d8]" /><div><div className="text-sm font-bold">Evidências</div><div className="text-xs text-white/45">Chitãozinho & Xororó</div></div></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[#9f6dff] to-[#f049c5]" /></div></div>
              </div>
            </div>
            <div className="absolute -bottom-7 -left-6 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#1a1330]/95 px-4 py-3 shadow-xl sm:flex"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#8b64ff]/15 text-[#c5a6ff]"><Smartphone className="h-4 w-4" /></div><div><div className="text-xs font-bold">4 celulares conectados</div><div className="text-[10px] text-white/40">a pista é de todo mundo</div></div></div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Karaokê do Vale</span><span>Feito para cantar junto.</span></footer>
      </div>
    </main>
  );
}
