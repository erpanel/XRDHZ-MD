import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command}) => {
  if (!text) return m.reply(`Kirim link Instagram!\n\nContoh:\n${usedPrefix + command} https://www.instagram.com/reel/xxxxx`)

  try {
    let api = `https://api.yupra.my.id/api/downloader/Instagram?url=${encodeURIComponent(text)}`
    let res = await fetch(api)
    let json = await res.json()

    if (json.status!== 200 ||!json.result) return m.reply('Gagal mengambil data dari API.')

    let medias = json.result.medias || []
    if (!medias.length) return m.reply('Tidak ada media yang ditemukan.')

    for (let media of medias) {
      if (media.type === 'video') {
        await conn.sendMessage(m.chat, { video: { url: media.url}, caption: '🎬 Video dari Instagram'}, { quoted: m})
} else if (media.type === 'image') {
        await conn.sendMessage(m.chat, { image: { url: media.url}, caption: '📷 Foto dari Instagram'}, { quoted: m})
}
}

} catch (e) {
    console.error(e)
    m.reply('Terjadi kesalahan saat mengunduh media Instagram.')
}
}

handler.help = ['ig', 'igdl']
handler.tags = ['downloader']
handler.command = /^ig(dl)?$/i

export default handler
