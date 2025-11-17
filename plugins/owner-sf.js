import fs from 'fs'

let handler = async (m, { text, usedPrefix, command}) => {
    if (!text) return m.reply(`⚠️ Masukkan path tujuan penyimpanan.\n\nContoh:\n${usedPrefix + command}./plugins/test.js`)

    if (!m.quoted || typeof m.quoted.text!== 'string') {
        return m.reply('⚠️ Balas pesan yang berisi kode teks yang ingin disimpan.')
}

    try {
        fs.writeFileSync(text, m.quoted.text)
        m.reply(`✅ File berhasil disimpan ke: ${text}`)
} catch (err) {
        console.error(err)
        m.reply(`❌ Gagal menyimpan file:\n${err.message}`)
}
}

handler.command = /^(sf)$/i
handler.help = ['sf']
handler.tags = ['owner']
handler.owner = true

export default handler
