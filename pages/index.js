import { useEffect, useState } from 'react'
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
  const [shouldAutoplayVideo, setShouldAutoplayVideo] = useState(false)

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldAutoplayVideo(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const isVariantB = variant === 'B'

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mentoria de Inglês</title>
        <meta name="description" content="Mentoria de inglês para quem quer clareza, confiança e fluência real." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <Script src="/_vercel/insights/script.js" strategy="lazyOnload" />

      <main className="page-shell">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">Mentoria de inglês</span>

            <h1 className="hero-title">
              {isVariantB
                ? (
                    <>
                      Aprenda a entender o inglês falado{' '}
                      <span className="accent-text">sem precisar ler legendas</span>{' '}
                      ou{' '}
                      <span className="accent-text">travar na hora de responder</span>.
                    </>
                  )
                : 'Mais aulas só te afundam em informação solta. Direção é o que te faz andar.'}
            </h1>

            <p className="hero-subtitle">
              Sem promessas milagrosas. Mas com um mapa tão claro que você nunca mais vai precisar de outro "curso genérico". Assista até o final.
            </p>

            <div className="hero-actions">
              <WhatsappButton
                buttonName="Fale comigo agora"
                page="home"
                phone="5515981298236"
                position="hero"
                variant={variant}
                className="primary-button"
              >
                Fale comigo agora
              </WhatsappButton>
            </div>

            <p className="hero-note">Acesso imediato · Garantia de 7 dias</p>
          </div>

          <div className="hero-visual">
            <div className="video-card">
              <div className="video-frame">
                <iframe
                  className="youtube-embed"
                  src={shouldAutoplayVideo
                    ? 'https://www.youtube.com/embed/cwvlOa53DsQ?rel=0&modestbranding=1&autoplay=1&mute=1&playsinline=1'
                    : 'https://www.youtube.com/embed/cwvlOa53DsQ?rel=0&modestbranding=1'}
                  title="Mentoria de Inglês"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="section-head">
            <span className="section-kicker">O que eu faço</span>
            <h2>O que eu faço</h2>
          </div>

          <div className="story-grid">
            <p className="story-intro">
              Eu ajudo pessoas a saírem do zero — ou de onde estiverem travadas — até a fluência no inglês.
            </p>

            <div className="story-stack">
              <p>Com naturalidade. Com leveza. Sem depender de gramática complicada. Sem métodos mirabolantes.</p>

              <p className="emphasis">É isso. E não é teoria.</p>

              <p>
                Já ajudei dezenas de alunos a compreender, falar e manter conversas reais em inglês usando um sistema enxuto e previsível.
              </p>

              <p>
                O foco é simples: construção sólida de pronúncia e compreensão desde o primeiro dia — para que o estudo finalmente se converta em segurança real.
              </p>

              <p className="highlight-line">Aqui eu não ensino você a estudar mais.</p>

              <p className="lead-line">Eu ensino você a estruturar o aprendizado da forma correta.</p>

              <p>Para que ele finalmente se transforme em clareza, confiança e fluência real.</p>
            </div>
          </div>
        </section>

        <section className="content-section alt-section">
          <div className="section-head">
            <span className="section-kicker">Para quem?</span>
            <h2>Para quem isso funciona de verdade?</h2>
          </div>

          <div className="audience-grid">
            <div className="info-card">
              <p className="info-title">Funciona para quem:</p>
              <ul>
                <li>Já estudou inglês por meses (ou anos)</li>
                <li>Já investiu em cursos, aplicativos ou métodos tradicionais</li>
                <li>Já tentou fazer “do jeito certo”</li>
                <li>Percebeu que estudar não está se convertendo em segurança para falar</li>
              </ul>
            </div>

            <div className="info-card">
              <p className="info-title">Aqui entram pessoas que:</p>
              <ul>
                <li>Entendem bastante coisa, mas travam ao falar</li>
                <li>Sentem que sempre estão começando do zero</li>
                <li>Estudam sem clareza de progresso real</li>
                <li>Querem sair da sobrevivência e ganhar confiança</li>
              </ul>
            </div>
          </div>

          <div className="quote-panel">
            <p className="quote-panel-label">O ponto em comum não é o nível de inglês.</p>
            <p className="quote-panel-value">É maturidade no aprendizado.</p>
          </div>
        </section>

        <section className="content-section">
          <div className="section-head">
            <span className="section-kicker">Cuidado</span>
            <h2>Não avance se você:</h2>
          </div>

          <div className="warning-list">
            <p>1. Quer aprender inglês apenas por curiosidade, sem compromisso real.</p>
            <p>2. Busca um atalho milagroso para falar fluente em poucas semanas.</p>
            <p>3. Acredita que fluência vem apenas decorando regras gramaticais.</p>
            <p>4. Não está disposto a seguir um processo estruturado e progressivo.</p>
          </div>

          <div className="highlight-panel">
            <p className="highlight-leading">
              Existe um pequeno grupo de pessoas que parou de acumular conteúdo e começou a construir habilidade de verdade.
            </p>

            <p className="highlight-subtext">
              Pessoas que não estudam mais horas.<br />
              Estudam com estrutura.
            </p>

            <p className="highlight-accent">E é por isso que evoluem.</p>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-inner">
            <span className="section-kicker">Vamos juntos</span>
            <h2 className="cta-title">
              <span className="accent-text">vamos construir sua fluência juntos.</span>
            </h2>

            <p className="cta-subtitle">Com estrutura. Com clareza. E com leveza.</p>

            <WhatsappButton
              buttonName="Falar comigo no WhatsApp"
              page="home"
              phone="5515981298236"
              position="footer"
              variant={variant}
              className="primary-button primary-button-large"
            >
              Falar comigo no WhatsApp
            </WhatsappButton>

            <p className="cta-note">Resposta direta. Sem enrolação.</p>
          </div>
        </section>

        <footer className="page-footer">© 2026 Mentoria de Inglês. Todos os direitos reservados.</footer>
      </main>
    </>
  )
}
