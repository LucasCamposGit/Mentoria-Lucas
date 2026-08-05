export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { event, metadata, timestamp } = req.body || {}

  if (!event || typeof event !== 'string') {
    return res.status(400).json({ error: 'Invalid event name' })
  }

  // Aqui você pode encaminhar o evento para um serviço de tracking,
  // gravar em um banco de dados, ou processar de outra forma.
  // Essa rota API não grava diretamente no Supabase.

  console.log('Tracking event:', { event, metadata, timestamp })

  return res.status(200).json({ status: 'ok' })
}
