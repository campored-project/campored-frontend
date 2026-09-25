import { useNavigate } from 'react-router-dom'

import NavBar from '../components/NavBar'
import { MUNICIPIOS } from '../constants/enums'

const PASOS = [
  {
    n: '01',
    titulo: 'El productor publica',
    desc: 'Sube su cosecha disponible, cantidad y precio por unidad, directamente desde su finca.',
  },
  {
    n: '02',
    titulo: 'El comprador pide',
    desc: 'Restaurantes, tiendas y mayoristas arman su pedido según lo que hay disponible cada semana.',
  },
  {
    n: '03',
    titulo: 'Entrega acordada',
    desc: 'Se coordina la entrega directamente entre las partes, sin bodegas ni reventa de por medio.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div>
      <NavBar />

      {/* Hero — paisaje rural de fondo con velo sage */}
      <div className="hero-fondo">
        <div className="max-w-[1180px] mx-auto px-6">
          <section className="py-16 pb-12 border-b border-line">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent-dark mb-[18px] m-0 animate-fade-up">
              venta directa entre productores y compradores locales
            </p>
            <h2
              className="font-display font-medium text-[52px] leading-[1.06] tracking-[-0.015em] max-w-[760px] mt-0 mb-[22px] max-md:text-[36px] animate-fade-up"
              style={{ animationDelay: '80ms' }}
            >
              Del cultivo a tu negocio, sin pasar por seis manos.
            </h2>
            <p
              className="text-[16.5px] leading-relaxed text-ink-soft max-w-[520px] mt-0 mb-8 animate-fade-up"
              style={{ animationDelay: '180ms' }}
            >
              Conectamos pequeños productores del Oriente Antioqueño con restaurantes, tiendas y
              mayoristas. Un solo paso entre la cosecha y tu pedido.
            </p>

            <div
              className="flex gap-3 flex-wrap mb-14 animate-fade-up"
              style={{ animationDelay: '280ms' }}
            >
              <button
                type="button"
                onClick={() => navigate('/registro?rol=COMPRADOR')}
                className="bg-ink text-paper border border-ink rounded-[4px] px-5 py-3 font-mono text-[13px] cursor-pointer hover:bg-accent-dark hover:border-accent-dark"
              >
                Soy comprador
              </button>
              <button
                type="button"
                onClick={() => navigate('/registro?rol=PRODUCTOR')}
                className="bg-transparent text-ink border border-line-strong rounded-[4px] px-5 py-3 font-mono text-[13px] cursor-pointer hover:border-ink hover:bg-ink hover:text-paper"
              >
                Soy productor
              </button>
            </div>

            {/* Cadena de valor */}
            <div
              className="border border-line bg-card rounded-[6px] p-6 px-7 animate-fade-in"
              style={{ animationDelay: '430ms' }}
            >
              <div className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-ink-faint mb-4">
                la cadena de venta, antes y con CampoRed
              </div>
              <div className="flex items-center flex-wrap mb-[18px]">
                {['Productor', 'Acopiador', 'Mayorista', 'Tienda', 'Comprador'].map((n, i, arr) => (
                  <span key={n} className="flex items-center">
                    <span
                      className={`font-mono text-[13px] px-3 py-[7px] border rounded-full whitespace-nowrap ${i === arr.length - 1 ? 'border-ink text-ink bg-paper' : 'border-line-strong text-ink-soft bg-paper'}`}
                    >
                      {n}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="font-mono text-ink-faint px-2 text-[13px]">→</span>
                    )}
                  </span>
                ))}
              </div>
              <div className="flex items-center flex-wrap">
                {['Productor', 'Comprador'].map((n, i, arr) => (
                  <span key={n} className="flex items-center">
                    <span
                      className={`font-mono text-[13px] px-3 py-[7px] border rounded-full whitespace-nowrap ${i === arr.length - 1 ? 'bg-ink text-paper border-ink' : 'border-line-strong text-ink-soft bg-paper'}`}
                    >
                      {n}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="font-mono text-accent-dark px-2 text-[13px]">→</span>
                    )}
                  </span>
                ))}
              </div>
              <p className="font-mono text-[12.5px] text-ink-faint mt-4 mb-0">
                Menos manos en el camino, mejor precio en los dos extremos.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Resto de la página — fondo paper */}
      <div className="max-w-[1180px] mx-auto px-6">

        {/* Cómo funciona */}
        <section className="py-14 border-b border-line">
          <h2 className="font-display text-[24px] font-medium mt-0 mb-[34px]">Cómo funciona</h2>
          <div className="grid grid-cols-3 gap-7 max-md:grid-cols-1 max-md:gap-[22px]">
            {PASOS.map(({ n, titulo, desc }) => (
              <div
                key={n}
                className="border-t border-line-strong pt-4 transition-colors duration-200 hover:border-accent-dark"
              >
                <div className="font-mono text-[12px] text-accent-dark mb-[10px]">{n}</div>
                <h3 className="font-display text-[18px] font-medium mt-0 mb-2">{titulo}</h3>
                <p className="text-[13.5px] text-ink-soft leading-relaxed m-0">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Municipios */}
        <section className="py-14 border-b border-line">
          <h2 className="font-display text-[24px] font-medium mt-0 mb-[34px]">
            Municipios del Oriente Antioqueño
          </h2>
          <div className="flex flex-wrap gap-2">
            {MUNICIPIOS.map(({ valor, label }) => (
              <span
                key={valor}
                className="font-mono text-[11.5px] text-ink-soft border border-line rounded-full px-3 py-[5px] transition-colors duration-150 hover:border-ink-soft hover:text-ink hover:bg-line"
              >
                {label}
              </span>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-11 pb-16 flex justify-between items-end flex-wrap gap-6">
          <div>
            <div className="font-display text-[19px] text-ink">CampoRed</div>
            <div className="font-mono text-[11.5px] text-ink-faint mt-1 max-w-[420px] leading-[1.8]">
              Oriente Antioqueño — productor a comprador, sin intermediarios.
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/registro')}
            className="bg-ink text-paper border border-ink rounded-[4px] px-5 py-3 font-mono text-[13px] cursor-pointer hover:bg-accent-dark hover:border-accent-dark"
          >
            Crear cuenta
          </button>
        </footer>
      </div>
    </div>
  )
}
