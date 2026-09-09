// Links de teste UTM local

// Link simples com parâmetros UTM básicos
const utmTestLink = 'http://localhost:3000?utm_source=test&utm_medium=local&utm_campaign=development'

// Link com mais parâmetros
const utmFullLink = 'http://localhost:3000?utm_source=google&utm_medium=cpc&utm_campaign=test_local&utm_content=ad_v1&utm_term=test'

// Link com parâmetro de vídeo
const utmVideoLink = 'http://localhost:3000?utm_source=youtube&utm_medium=video&utm_campaign=test&video=abc123'

console.log('🔗 Links UTM de Teste Local:')
console.log('Básico:', utmTestLink)
console.log('Completo:', utmFullLink)
console.log('Com vídeo:', utmVideoLink)

export { utmTestLink, utmFullLink, utmVideoLink }
