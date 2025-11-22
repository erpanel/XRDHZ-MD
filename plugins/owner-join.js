const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})(?:\s+([0-9]{1,3}))?/i

const isNumber = x => {
  x = parseInt(x)
  return typeof x === 'number' &&!isNaN(x)
}

let handler = async (m, { conn, text, isOwner}) => {
  if (!text) throw '⚠️ Masukkan link undangan grup WhatsApp.\nContoh:.join https://chat.whatsapp.com/AbCdEfGhIjKlMnOpQrStUv 3'

  const match = text.match(linkRegex)
  if (!match) throw '❌ Link grup WhatsApp tidak valid.'

  const [, code, expiredRaw] = match

  try {
    const groupId = await conn.groupAcceptInvite(code)

    const expired = isOwner
? isNumber(expiredRaw)? Math.min(999, Math.max(1, parseInt(expiredRaw))): 0
: 3

    m.reply(`✅ Berhasil join grup ${groupId}${expired? ` selama ${expired} hari.\n\nJika grup menggunakan persetujuan admin, silakan ACC nomor ini.`: ''}`)

    const chats = global.db.data.chats[groupId] ||= {}
    if (expired) chats.expired = Date.now() + expired * 24 * 60 * 60 * 1000

} catch (error) {
    const msg = error?.message || ''
    if (msg.includes('not-authorized')) {
      return m.reply('❌ Tidak dapat bergabung karena sebelumnya pernah dikeluarkan. Silakan tunggu maksimal 7 hari.')
} else if (msg.includes('gone')) {
      return m.reply('❌ Link tidak valid atau sudah direset oleh admin grup.')
} else {
      throw error
}
}
}

handler.help = ['join <link grup>']
handler.tags = ['owner']
handler.command = /^join$/i
handler.owner = true

export default handler
