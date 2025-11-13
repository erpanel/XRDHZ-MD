let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text) return m.reply(`🍀 *Contoh: ${usedPrefix + command} https://vt.tiktok.com/xxxx/*`)
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const api = `https://api.zenzxz.my.id/api/downloader/tiktok?url=${encodeURIComponent(text)}`
        const res = await fetch(api)
        if (!res.ok) throw new Error(`🍂 *Server tidak merespons!*`)
        const json = await res.json()
        if (!json.success || !json.data) throw new Error(`🍂 *Data tidak ditemukan atau link tidak valid!*`)

        const data = json.data
        const caption = `
✨ *TIKTOK DOWNLOADER* ✨
──────────────────────
🎬 *Judul:* ${data.title || '-'}
👤 *Author:* ${data.author?.nickname || 'Tidak diketahui'}
🌍 *Region:* ${data.region || 'N/A'}
🕒 *Durasi:* ${data.duration ? data.duration + ' detik' : '-'}
💬 *Komentar:* ${data.comment_count || 0}
❤️ *Likes:* ${data.digg_count || 0}
🔁 *Share:* ${data.share_count || 0}
👀 *Views:* ${data.play_count || 0}
*──────────────────────*
🎵 *Audio:* ${data.music_info?.title || '-'} - ${data.music_info?.author || '-'}
📆 *Upload:* ${new Date(data.create_time * 1000).toLocaleString('id-ID')}
*──────────────────────*
`.trim()

        if (Array.isArray(data.images) && data.images.length > 0) {
            for (let [i, img] of data.images.entries()) {
                await conn.sendMessage(m.chat, {
                    image: { url: img },
                    caption: i === 0 ? caption : ''
                }, { quoted: m })
            }
        } 
        else if (data.hdplay || data.play) {
            await conn.sendMessage(m.chat, {
                video: { url: data.hdplay || data.play },
                caption
            }, { quoted: m })
        } 
        else if (data.music_info?.play) {
            await conn.sendMessage(m.chat, {
                audio: { url: data.music_info.play },
                mimetype: 'audio/mpeg',
                fileName: `${data.music_info?.title || 'audio'}.mp3`,
                ptt: false,
                caption: `🎵 *Audio TikTok*\n🎧 ${data.music_info?.title || '-'} - ${data.music_info?.author || '-'}`
            }, { quoted: m })
        } 
        else {
            throw new Error(`🍂 *Tipe konten tidak dikenal atau belum didukung!*`)
        }

    } catch (e) {
        console.error(e)
        await m.reply(`🍂 *Terjadi kesalahan:* ${e.message}`)
    } finally {
        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
    }
}

handler.help = ['tiktok'];
handler.tags = ['downloader'];
handler.command = /^(tiktok|tiktokdl|tiktokdownload|tt)$/i;
handler.register = false; // false in jika tidak ada fitur register atau daftar di bot mu.

export default handler
