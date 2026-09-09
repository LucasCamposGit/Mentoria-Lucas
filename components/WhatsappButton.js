import { track } from '../lib/track'

const DEFAULT_MESSAGE = 'Ol%C3%A1%2C%20quero%20conhecer%20mais%20sobre%20a%20mentoria'

function getWhatsAppUrl(phone, message = DEFAULT_MESSAGE) {
  return `https://wa.me/${phone}?text=${message}`
}

export default function WhatsappButton({ buttonName, page, phone, position, variant, children }) {
  async function handleClick(event) {
    event.preventDefault()

    const metadata = {
      button_name: buttonName,
      page,
      phone,
      position,
      variant,
    }

    const url = getWhatsAppUrl(phone)
    const trackPromise = track('whatsapp_click', metadata)

    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }

    await trackPromise
  }

  return (
    <a
      href={getWhatsAppUrl(phone)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-glow-purple-light via-glow-purple to-glow-purple-dark text-white font-bold px-10 py-4 rounded-xl transition transform hover:scale-105 glow-purple"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="text-white w-6 h-6" fill="currentColor">
        <path d="M16 .4C7.4.4.4 7.4.4 16c0 2.8.7 5.5 2.1 7.9L.3 31.7l8-2.1c2.3 1.3 4.9 2 7.7 2 8.6 0 15.6-7 15.6-15.6S24.6.4 16 .4zm0 28.6c-2.4 0-4.7-.6-6.8-1.8l-.5-.3-4.8 1.3 1.3-4.7-.3-.5C3.7 20.8 3 18.5 3 16 3 8.8 8.8 3 16 3s13 5.8 13 13-5.8 13-13 13zm7.3-9.5c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.2-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.3-2.1-2.7-.2-.4 0-.6.1-.8.1-.1.4-.4.5-.6.2-.2.2-.4.3-.6.1-.2 0-.5 0-.6 0-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 3 0 1.8 1.3 3.5 1.5 3.8.2.3 2.6 4 6.3 5.6.9.4 1.6.6 2.2.8.9.3 1.7.2 2.4.1.7-.1 2.2-.9 2.5-1.7.3-.8.3-1.6.2-1.7-.1-.1-.3-.2-.7-.4z"/>
      </svg>
      {children}
    </a>
  )
}
