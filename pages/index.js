import { useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import { track } from '../lib/track'
import WhatsappButton from '../components/WhatsappButton'

let hasTrackedPageView = false

function getVariantFromCookie(cookieHeader) {
  const cookies = (cookieHeader || '').split(';')
  const variantCookie = cookies.find((cookie) => cookie.trim().startsWith('ab_variant='))
  const variant = variantCookie?.split('=')[1]

  return variant === 'B' ? 'B' : variant === 'A' ? 'A' : null
}

export function getServerSideProps({ req, res, query }) {
  const requestedVariant = query.ab_variant === 'B' || query.ab_variant === 'A'
    ? query.ab_variant
    : null
  const variant = requestedVariant || getVariantFromCookie(req.headers.cookie) || (Math.random() < 0.5 ? 'A' : 'B')

  res.setHeader('Set-Cookie', `ab_variant=${variant}; Max-Age=2592000; Path=/; SameSite=Lax${req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : ''}`)

  return { props: { variant } }
}

export default function Home({ variant }) {
  useEffect(() => {
    if (hasTrackedPageView) {
      return
    }

    hasTrackedPageView = true

    track('page_view', {
      variant,
      pathname: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenWidth: window.screen?.width,
      screenHeight: window.screen?.height,
    })
  }, [variant])

  const isVariantB = variant === 'B'

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mentoria de Inglês</title>
      </Head>

      <Script src="/_vercel/insights/script.js" strategy="lazyOnload" />

      <main className="bg-background text-foreground overflow-x-hidden">
        <section className="relative py-24 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial-purple opacity-40" />

          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {isVariantB
                ? 'Aprenda a entender o inglês falado sem precisar ler legendas ou travar na hora de responder.'
                : 'Mais aulas só te afundam em informação solta. Direção é o que te faz andar.'}
            </h2>

            <p className="text-gray-400 max-w-2xl mx-auto mb-12">
              Sem promessas milagrosas. Mas com um mapa tão claro que você nunca mais vai precisar de outro "curso genérico". Assista até o final.
            </p>

            <div className="relative max-w-3xl mx-auto rounded-[24px] border-gradient-purple bg-card p-4 shadow-xl mb-10">
              <div className="relative rounded-2xl overflow-hidden border border-border aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/cwvlOa53DsQ?rel=0&modestbranding=1"
                  title="Mentoria de Inglês"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

              <WhatsappButton
              buttonName="Fale comigo agora"
              page="home"
              phone="5515981298236"
              position="hero"
                variant={variant}
            >
              Fale comigo agora
            </WhatsappButton>
          </div>
        </section>

        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-radial-purple opacity-20" />

          <div className="relative z-10 max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">O que eu faço</h2>

            <div className="space-y-10 text-lg text-gray-300 leading-relaxed">
              <p className="text-xl md:text-2xl font-semibold text-white">Eu ajudo pessoas a saírem do zero — ou de onde estiverem travadas — até a fluência no inglês.</p>

              <p>Com naturalidade. Com leveza.  Sem depender de gramática complicada.  Sem métodos mirabolantes.</p>

              <p className="font-semibold text-white">É isso. E não é teoria.</p>

              <p>
                Já ajudei dezenas de alunos a compreender, falar e manter conversas reais em inglês usando um sistema enxuto e previsível.
              </p>

              <p>
                O foco é simples: construção sólida de pronúncia e compreensão desde o primeiro dia — para que o estudo finalmente se converta em segurança real.
              </p>

              <p className="text-xl font-semibold text-glow-purple">Aqui eu não ensino você a estudar mais.</p>

              <p className="text-xl font-semibold text-white">Eu ensino você a estruturar o aprendizado da forma correta.</p>

              <p>Para que ele finalmente se transforme em clareza, confiança e fluência real.</p>
            </div>
          </div>
        </section>

        <section className="py-32 bg-card/40">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Para quem isso funciona de verdade?</h2>

            <div className="max-w-2xl mx-auto text-center text-gray-300 text-lg space-y-12">
              <div className="space-y-5">
                <p className="font-semibold text-white">Funciona para quem:</p>
                <p>• Já estudou inglês por meses (ou anos)</p>
                <p>• Já investiu em cursos, aplicativos ou métodos tradicionais</p>
                <p>• Já tentou fazer “do jeito certo”</p>
                <p>• Percebeu que estudar não está se convertendo em segurança para falar</p>
              </div>

              <div className="space-y-5">
                <p className="font-semibold text-white">Aqui entram pessoas que:</p>
                <p>• Entendem bastante coisa, mas travam ao falar</p>
                <p>• Sentem que sempre estão começando do zero</p>
                <p>• Estudam sem clareza de progresso real</p>
                <p>• Querem sair da sobrevivência e ganhar confiança</p>
              </div>
            </div>

            <div className="mt-20 text-center max-w-2xl mx-auto">
              <p className="text-xl text-gray-400">O ponto em comum não é o nível de inglês.</p>

              <p className="text-2xl font-semibold text-glow-purple mt-6">É maturidade no aprendizado.</p>
            </div>
          </div>
        </section>

        <section className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-radial-purple opacity-30" />

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-16">Não avance se você:</h2>

            <div className="space-y-8 text-lg text-gray-300">
              <p>1. Quer aprender inglês apenas por curiosidade, sem compromisso real.</p>
              <p>2. Busca um atalho milagroso para falar fluente em poucas semanas.</p>
              <p>3. Acredita que fluência vem apenas decorando regras gramaticais.</p>
              <p>4. Não está disposto a seguir um processo estruturado e progressivo.</p>
            </div>

            <div className="mt-20 space-y-6">
              <p className="text-xl text-white font-semibold">Existe um pequeno grupo de pessoas que parou de acumular conteúdo e começou a construir habilidade de verdade.</p>

              <p className="text-gray-400">Pessoas que não estudam mais horas.<br/>Estudam com estrutura.</p>

              <p className="text-2xl font-semibold text-glow-purple">E é por isso que evoluem.</p>
            </div>
          </div>
        </section>

        <section className="py-28 bg-card/40 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight"><span className="text-glow-purple glow-purple-text">vamos construir sua fluência juntos.</span></h2>

            <p className="text-gray-400 mb-10">Com estrutura. Com clareza. E com leveza.</p>

            <WhatsappButton
              buttonName="Falar comigo no WhatsApp"
              page="home"
              phone="5515981298236"
              position="footer"
              variant={variant}
            >
              Falar comigo no WhatsApp
            </WhatsappButton>

            <p className="text-sm text-gray-500 mt-6">Resposta direta. Sem enrolação.</p>
          </div>
        </section>

        <footer className="py-8 border-t border-border/50 text-center text-sm text-gray-500">© 2026 Mentoria de Inglês. Todos os direitos reservados.</footer>
      </main>
    </>
  )
}
