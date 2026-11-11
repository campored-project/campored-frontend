import { Link } from 'react-router-dom'
import { ClipboardList, MessageCircle, Sprout } from 'lucide-react'

import NavBar from '../components/NavBar'
import { useAuth } from '../context/AuthContext'
import { MUNICIPIOS, PRODUCTOS, ROL, imagenProducto } from '../constants/enums'

const PASOS = [
  {
    n: '01',
    titulo: 'Publica o explora',
    desc: 'Los productores registran sus cosechas disponibles o en crecimiento; los compradores filtran por producto, municipio y entrega.',
    Icono: Sprout,
    colorIcono: 'text-ok bg-ok-bg',
  },
  {
    n: '02',
    titulo: 'Formaliza el pedido',
    desc: 'El comprador define cantidad, dirección, fecha y jornada de entrega con cálculo transparente del total estimado.',
    Icono: ClipboardList,
    colorIcono: 'text-accent-dark bg-accent/10',
  },
  {
    n: '03',
    titulo: 'Coordina sin comisiones',
    desc: 'Contacto directo por WhatsApp o llamada telefónica con 0% de intermediación.',
    Icono: MessageCircle,
    colorIcono: 'text-ok bg-ok-bg',
  },
]

const PRODUCTOS_VITRINA = PRODUCTOS.filter((p) => p.valor !== 'OTRO')

export default function LandingPage() {
  const { usuario } = useAuth()
  const esProductor = usuario?.rol === ROL.PRODUCTOR

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      {/* Hero a ancho completo */}
      <section className="bg-[url('/img/fondos/hero.webp')] bg-cover bg-center relative border-b border-line">
        <div className="bg-ink/65 py-16 sm:py-24">
          <div className="max-w-[1180px] mx-auto px-6">
            <p className="font-mono uppercase tracking-wider text-xs text-paper/80 mb-4 m-0 animate-fade-up">
              Oriente Antioqueño · Comercio Agrícola Directo
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-paper max-w-[780px] mt-0 mb-5 leading-[1.08] animate-fade-up">
              Del cultivo a tu negocio, sin intermediarios.
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-paper/90 max-w-[580px] mt-0 mb-8 animate-fade-up">
              Conectamos productores agrícolas de Sonsón, San Carlos y el Oriente antioqueño con
              restaurantes, tiendas y mayoristas. Precios justos en origen y trato directo.
            </p>

            <div className="flex gap-3 flex-wrap animate-fade-up">
              {!usuario ? (
                <>
                  <Link
                    to="/registro"
                    className="bg-paper text-ink border border-paper rounded-[4px] px-5 py-3 font-mono text-xs sm:text-[13px] font-medium no-underline hover:bg-card transition-colors"
                  >
                    Crear cuenta gratis
                  </Link>
                  <Link
                    to="/catalogo"
                    className="bg-ink/40 text-paper border border-paper/40 rounded-[4px] px-5 py-3 font-mono text-xs sm:text-[13px] no-underline hover:bg-ink/70 hover:border-paper transition-colors"
                  >
                    Explorar cosechas
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/catalogo"
                    className="bg-paper text-ink border border-paper rounded-[4px] px-5 py-3 font-mono text-xs sm:text-[13px] font-medium no-underline hover:bg-card transition-colors"
                  >
                    Ver catálogo de cosechas
                  </Link>
                  <Link
                    to={esProductor ? '/mis-ofertas' : '/perfil'}
                    className="bg-ink/40 text-paper border border-paper/40 rounded-[4px] px-5 py-3 font-mono text-xs sm:text-[13px] no-underline hover:bg-ink/70 hover:border-paper transition-colors"
                  >
                    {esProductor ? 'Mis cosechas' : 'Mi perfil'}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <div className="max-w-[1180px] w-full mx-auto px-6 flex-1">
        {/* Cómo funciona */}
        <section className="py-14 border-b border-line">
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-wider text-accent-dark m-0 mb-1.5">
              Operación transparente
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink m-0">
              Cómo funciona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PASOS.map(({ n, titulo, desc, Icono, colorIcono }) => (
              <div
                key={n}
                className="bg-card border border-line rounded-[6px] p-6 flex flex-col justify-between hover:border-line-strong transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-ink-faint">{n}</span>
                    <span
                      className={`w-10 h-10 rounded-[6px] flex items-center justify-center ${colorIcono}`}
                    >
                      <Icono className="w-6 h-6" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink mt-0 mb-2">
                    {titulo}
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed m-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Productos de la región */}
        <section className="py-14 border-b border-line">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-accent-dark m-0 mb-1.5">
                Cosechas destacadas
              </p>
              <h2 className="font-display text-2xl font-bold text-ink m-0">
                Productos de la región
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="font-mono text-xs text-accent-dark hover:text-ink no-underline"
            >
              Ver todo el catálogo →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PRODUCTOS_VITRINA.map((producto) => (
              <Link
                key={producto.valor}
                to={`/catalogo?producto=${producto.valor}`}
                className="bg-card border border-line rounded-[6px] overflow-hidden no-underline hover:border-line-strong hover:shadow-xs transition-all group"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-ok-bg border-b border-line">
                  <img
                    src={imagenProducto(producto.valor)}
                    alt={producto.label}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5">
                  <p className="font-display font-medium text-sm text-ink m-0">
                    {producto.label}
                  </p>
                  <span className="font-mono text-[11px] text-ink-faint block mt-0.5">
                    Ver ofertas →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Cadena de valor y municipios */}
        <section className="py-14 border-b border-line">
          <div className="bg-card border border-line rounded-[6px] p-6 sm:p-8 mb-12">
            <p className="font-mono text-xs uppercase tracking-wider text-ink-faint m-0 mb-4">
              La cadena de venta, antes y con CampoRed
            </p>
            <div className="flex items-center flex-wrap gap-y-2 mb-4">
              {['Productor', 'Acopiador', 'Mayorista', 'Tienda', 'Comprador'].map((n, i, arr) => (
                <span key={n} className="flex items-center">
                  <span
                    className={`font-mono text-xs px-3 py-1.5 border rounded-[4px] whitespace-nowrap ${
                      i === arr.length - 1
                        ? 'border-ink text-ink bg-paper'
                        : 'border-line-strong text-ink-soft bg-paper'
                    }`}
                  >
                    {n}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="font-mono text-ink-faint px-2 text-xs">→</span>
                  )}
                </span>
              ))}
            </div>
            <div className="flex items-center flex-wrap gap-y-2">
              {['Productor', 'Comprador'].map((n, i, arr) => (
                <span key={n} className="flex items-center">
                  <span
                    className={`font-mono text-xs px-3 py-1.5 border rounded-[4px] whitespace-nowrap ${
                      i === arr.length - 1
                        ? 'bg-ink text-paper border-ink'
                        : 'border-line-strong text-ink-soft bg-paper'
                    }`}
                  >
                    {n}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="font-mono text-accent-dark px-2 text-xs">→</span>
                  )}
                </span>
              ))}
            </div>
            <p className="font-mono text-xs text-ink-faint mt-4 mb-0">
              Menos manos en el camino, mejor margen en la finca y mejor precio en tu negocio.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-ink mt-0 mb-4">
              Municipios del Oriente Antioqueño
            </h2>
            <p className="text-sm text-ink-soft mt-0 mb-6 max-w-[620px]">
              Cobertura activa en las zonas productoras y centros de consumo de la región.
            </p>
            <div className="flex flex-wrap gap-2">
              {MUNICIPIOS.map(({ valor, label }) => (
                <span
                  key={valor}
                  className="font-mono text-xs bg-card border border-line text-ink-soft px-3 py-1.5 rounded-[4px]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-12 flex items-center justify-between flex-wrap gap-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink m-0 mb-1.5">
              {usuario
                ? 'Explora las cosechas frescas disponibles hoy'
                : '¿Produces en el campo o compras para tu negocio?'}
            </h2>
            <p className="text-sm text-ink-soft m-0">
              {usuario
                ? 'Consulta precios por unidad, estado del cultivo y modalidad de entrega.'
                : 'Regístrate sin costo y conecta directamente con la red agrícola regional.'}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {!usuario ? (
              <>
                <Link
                  to="/registro"
                  className="bg-ink text-paper border border-ink rounded-[4px] px-5 py-3 font-mono text-xs no-underline hover:bg-accent-dark hover:border-accent-dark transition-colors"
                >
                  Crear cuenta gratis
                </Link>
                <Link
                  to="/catalogo"
                  className="bg-card text-ink border border-line-strong rounded-[4px] px-5 py-3 font-mono text-xs no-underline hover:border-ink transition-colors"
                >
                  Ver catálogo
                </Link>
              </>
            ) : (
              <Link
                to="/catalogo"
                className="bg-ink text-paper border border-ink rounded-[4px] px-5 py-3 font-mono text-xs no-underline hover:bg-accent-dark hover:border-accent-dark transition-colors"
              >
                Ir al catálogo
              </Link>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-line bg-paper py-8">
        <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-display font-semibold text-sm text-ink m-0">
              CampoRed · Proyecto Integrador II — Universidad de Antioquia
            </p>
            <p className="font-mono text-xs text-ink-faint m-0 mt-1">
              Comercialización agrícola directa en el Oriente Antioqueño · 0% comisión.
            </p>
          </div>
          <Link
            to="/catalogo"
            className="font-mono text-xs text-ink-soft hover:text-ink no-underline"
          >
            Catálogo de cosechas →
          </Link>
        </div>
      </footer>
    </div>
  )
}
