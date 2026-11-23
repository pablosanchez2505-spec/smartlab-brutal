import { FormEvent, useMemo, useState } from 'react';

type Priority = 'alta' | 'media' | 'baja';
type Status = 'pendiente' | 'resuelta';
type Filter = 'todas' | Status;

interface Incident {
  id: string;
  title: string;
  location: string;
  priority: Priority;
  status: Status;
}

const INITIAL: Incident[] = [
  { id: 'INC-101', title: 'Fallo de enlace en Switch Rack B', location: 'Aula 204 · Redes', priority: 'alta', status: 'pendiente' },
  { id: 'INC-102', title: 'Actualizar imágenes Docker', location: 'Laboratorio DAM 2', priority: 'media', status: 'pendiente' },
  { id: 'INC-103', title: 'Calibrar proyector láser', location: 'Aula Magna', priority: 'baja', status: 'resuelta' },
];

const PRIORITY_STYLE: Record<Priority, string> = {
  alta: 'bg-hot text-ink',
  media: 'bg-sun text-ink',
  baja: 'bg-acid text-ink',
};

const MARQUEE = 'SMARTLAB MONITOR ★ INCIDENCIAS ★ SIN ADORNOS ★ DAM 0488 ★ ';

export default function Home() {
  const [items, setItems] = useState<Incident[]>(INITIAL);
  const [filter, setFilter] = useState<Filter>('todas');
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<Priority>('media');
  const [menuOpen, setMenuOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      total: items.length,
      pending: items.filter((i) => i.status === 'pendiente').length,
      critical: items.filter((i) => i.status === 'pendiente' && i.priority === 'alta').length,
      done: items.filter((i) => i.status === 'resuelta').length,
    }),
    [items]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (i) =>
        (filter === 'todas' || i.status === filter) &&
        (q === '' || i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.location.toLowerCase().includes(q))
    );
  }, [items, filter, query]);

  const notify = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  };

  const toggle = (id: string) => {
    setItems((p) => p.map((i) => (i.id === id ? { ...i, status: i.status === 'pendiente' ? 'resuelta' : 'pendiente' } : i)));
    notify(`${id} ACTUALIZADA`);
  };

  const remove = (id: string) => {
    setItems((p) => p.filter((i) => i.id !== id));
    notify(`${id} ELIMINADA`);
  };

  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      notify('TÍTULO Y UBICACIÓN OBLIGATORIOS');
      return;
    }
    const id = `INC-${Math.floor(104 + Math.random() * 895)}`;
    setItems((p) => [{ id, title: title.trim(), location: location.trim(), priority, status: 'pendiente' }, ...p]);
    setTitle('');
    setLocation('');
    setPriority('media');
    notify(`${id} REGISTRADA`);
  };

  const navLinks = [
    { href: '#panel', label: 'Panel' },
    { href: '#lista', label: 'Lista' },
    { href: '#alta', label: 'Alta' },
  ];

  const btn =
    'border-4 border-ink font-bold uppercase transition-all duration-100 shadow-brut-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut active:translate-x-1 active:translate-y-1 active:shadow-none';

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-30 border-b-4 border-ink bg-acid">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#top" className="font-display text-xl uppercase tracking-tight sm:text-2xl">
            SmartLab<span className="bg-ink px-1 text-acid">/</span>
          </a>
          <nav className="hidden gap-3 md:flex" aria-label="Principal">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className={`${btn} bg-paper px-4 py-2 text-sm`}>
                {l.label}
              </a>
            ))}
          </nav>
          <button
            className={`${btn} min-h-11 min-w-11 bg-paper px-3 py-2 text-sm md:hidden`}
            aria-expanded={menuOpen}
            aria-label="Abrir menú"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? 'X' : 'MENÚ'}
          </button>
        </div>
        {menuOpen && (
          <nav className="grid border-t-4 border-ink md:hidden" aria-label="Móvil">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="border-b-4 border-ink bg-paper px-4 py-4 font-display text-lg uppercase last:border-b-0 hover:bg-sky hover:text-paper"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* HERO: 100vh menos cabecera */}
      <section id="top" className="relative flex min-h-[calc(100svh-4.25rem)] flex-col border-b-4 border-ink">
        <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="mb-4 inline-block border-4 border-ink bg-sun px-3 py-1 text-xs font-bold uppercase shadow-brut-sm sm:text-sm">
              Desarrollo de Interfaces · 0488
            </p>
            <h1 className="font-display text-[clamp(2.75rem,11vw,9rem)] uppercase leading-[0.9] tracking-tighter">
              Controla
              <br />
              <span className="inline-block -rotate-1 bg-ink px-2 text-acid transition-transform hover:rotate-1">el caos</span>
              <br />
              del lab.
            </h1>
            <p className="mt-6 max-w-xl border-l-8 border-hot pl-4 text-base font-bold sm:text-lg">
              Incidencias, prioridades y estados. Sin sombras suaves, sin gradientes, sin disculpas.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#alta" className={`${btn} bg-hot px-6 py-4 text-base`}>
                Nueva incidencia →
              </a>
              <a href="#lista" className={`${btn} bg-paper px-6 py-4 text-base`}>
                Ver lista
              </a>
            </div>
          </div>

          <aside className="hidden lg:col-span-4 lg:block" aria-label="Resumen rápido">
            <div className="rotate-2 border-4 border-ink bg-sky p-6 text-paper shadow-brut-lg transition-transform hover:rotate-0">
              <p className="text-xs font-bold uppercase">Pendientes ahora</p>
              <p className="font-display text-[8rem] leading-none">{stats.pending}</p>
              <p className="mt-2 border-t-4 border-paper pt-2 text-sm font-bold uppercase">{stats.critical} críticas sin resolver</p>
            </div>
          </aside>
        </div>

        <div className="overflow-hidden border-t-4 border-ink bg-ink py-2 text-acid" aria-hidden="true">
          <div className="flex w-max animate-marquee whitespace-nowrap font-display text-lg uppercase">
            <span>{MARQUEE.repeat(4)}</span>
            <span>{MARQUEE.repeat(4)}</span>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section id="panel" className="border-b-4 border-ink bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="mb-6 font-display text-3xl uppercase sm:text-5xl">Panel</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total', value: stats.total, color: 'bg-paper' },
              { label: 'Pendientes', value: stats.pending, color: 'bg-sun' },
              { label: 'Críticas', value: stats.critical, color: 'bg-hot' },
              { label: 'Resueltas', value: stats.done, color: 'bg-acid' },
            ].map((k) => (
              <div
                key={k.label}
                className={`${k.color} border-4 border-ink p-5 shadow-brut transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brut-lg`}
              >
                <p className="text-xs font-bold uppercase">{k.label}</p>
                <p className="font-display text-6xl leading-none sm:text-7xl">{k.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section id="lista" className="min-h-[70vh] border-b-4 border-ink bg-sky/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="mb-6 font-display text-3xl uppercase sm:text-5xl">Incidencias ({visible.length})</h2>

          <div className="mb-8 flex flex-col gap-4 lg:flex-row">
            <label className="flex-1">
              <span className="sr-only">Buscar incidencias</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="BUSCAR CÓDIGO, TÍTULO O AULA..."
                className="w-full border-4 border-ink bg-paper px-4 py-3 font-bold uppercase placeholder:text-ink/50 focus:bg-acid"
              />
            </label>
            <div className="grid grid-cols-3 gap-3" role="group" aria-label="Filtrar por estado">
              {(['todas', 'pendiente', 'resuelta'] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`${btn} min-h-11 px-3 py-3 text-xs sm:text-sm ${filter === f ? 'bg-ink text-acid' : 'bg-paper'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="border-4 border-dashed border-ink bg-paper p-10 text-center font-display text-2xl uppercase">Nada que mostrar.</div>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((i) => (
                <li
                  key={i.id}
                  className={`flex flex-col justify-between border-4 border-ink p-5 shadow-brut transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brut-lg ${
                    i.status === 'resuelta' ? 'bg-paper opacity-80' : 'bg-white'
                  }`}
                >
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="bg-ink px-2 py-1 text-xs font-bold text-acid">{i.id}</span>
                      <span className={`${PRIORITY_STYLE[i.priority]} border-2 border-ink px-2 py-1 text-xs font-bold uppercase`}>{i.priority}</span>
                    </div>
                    <h3 className={`font-display text-xl uppercase leading-tight ${i.status === 'resuelta' ? 'line-through' : ''}`}>{i.title}</h3>
                    <p className="mt-2 text-sm font-bold">📍 {i.location}</p>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button onClick={() => toggle(i.id)} className={`${btn} min-h-11 px-2 py-2 text-xs ${i.status === 'resuelta' ? 'bg-sun' : 'bg-acid'}`}>
                      {i.status === 'resuelta' ? 'Reabrir' : 'Resolver'}
                    </button>
                    <button onClick={() => remove(i.id)} className={`${btn} min-h-11 bg-hot px-2 py-2 text-xs`} aria-label={`Eliminar ${i.id}`}>
                      Borrar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ALTA: ocupa una pantalla completa en desktop */}
      <section id="alta" className="bg-hot lg:min-h-screen">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:min-h-screen lg:grid-cols-2 lg:items-center">
          <h2 className="font-display text-[clamp(2.5rem,8vw,6.5rem)] uppercase leading-[0.9] tracking-tighter">
            ¿Algo
            <br />
            roto?
            <br />
            <span className="bg-ink px-2 text-hot">Regístralo.</span>
          </h2>
          <form onSubmit={add} className="space-y-5 border-4 border-ink bg-paper p-5 shadow-brut-lg sm:p-8">
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase">Título *</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-4 border-ink bg-white px-3 py-3 font-bold focus:bg-acid"
                placeholder="Ej. Error de compilación"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase">Aula o ubicación *</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border-4 border-ink bg-white px-3 py-3 font-bold focus:bg-acid"
                placeholder="Ej. Laboratorio 102"
              />
            </label>
            <fieldset>
              <legend className="mb-1 text-xs font-bold uppercase">Prioridad</legend>
              <div className="grid grid-cols-3 gap-3">
                {(['alta', 'media', 'baja'] as Priority[]).map((p) => (
                  <button
                    type="button"
                    key={p}
                    aria-pressed={priority === p}
                    onClick={() => setPriority(p)}
                    className={`${btn} min-h-11 px-2 py-3 text-xs sm:text-sm ${priority === p ? 'bg-ink text-acid' : PRIORITY_STYLE[p]}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </fieldset>
            <button type="submit" className={`${btn} w-full bg-acid px-6 py-4 text-lg`}>
              Guardar incidencia →
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t-4 border-ink bg-ink px-4 py-6 text-center text-xs font-bold uppercase text-acid">
        © 2026 SmartLab Monitor · React + Tailwind · Brutalismo digital
      </footer>

      {/* Toast */}
      {flash && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 border-4 border-ink bg-sun px-5 py-3 text-sm font-bold uppercase shadow-brut"
        >
          {flash}
        </div>
      )}
    </div>
  );
}
