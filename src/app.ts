import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = 3001;



interface Artikel {
    artikel: string
    menge: number
    status: 'undone' | 'done'
    kategorie: string
    fav: "yes" | "no"
    id: number
    user: string
}

const liste: Artikel[] = [
    { id: 1, artikel: 'Milch', menge: 2, status: 'done', kategorie: "Kühl", fav: "no", user: "1" },
    { id: 2, artikel: 'Brot', menge: 1, status: 'undone', kategorie: "Essen", fav: "yes", user: "2" }
]

app.use(cors());
app.use(express.json())

app.get('/items', (req, res) => {
    return res.json(liste)
})

app.post('/items', (req, res) => {
    const { artikel, menge, status, kategorie, fav, user } = req.body
    const neueId = liste.length > 0 ? Math.max(...liste.map(item => item.id)) + 1 : 1
    const neuerArtikel = { artikel, menge, status, kategorie, fav, id: neueId, user }
    console.log("Neuer Artikel empfangen:", req.body)
    if (artikel.trim() === "") {
        return res.status(404).json({ nachricht: 'Bitte einen gültigen Artikel eingeben' })
    }
    if (typeof menge !== 'number' || isNaN(menge)) {
        return res.status(404).json({ nachricht: 'Menge darf nur eine Zahl sein' })
    }
    if (menge <= 0) {
        return res.status(404).json({ nachricht: 'Menge muss größer als 0 sein' })
    }
    if (status !== 'undone' && status !== 'done') {
        return res.status(404).json({ nachricht: 'Bitte gültigen Status eingeben (done / undone' })
    }
    liste.push(neuerArtikel)
    return res.status(201).json(neuerArtikel)
})

app.put('/items/:id', (req, res) => {
    const { artikel, menge, status, kategorie, fav, user } = req.body
    const id = Number(req.params.id)
    console.log("Artikel geändert:", req.body)
    if (artikel.trim() === "") {
        return res.status(404).json({ nachricht: 'Bitte einen gültigen Artikel eingeben' })
    }
    if (typeof menge !== 'number' || isNaN(menge)) {
        return res.status(404).json({ nachricht: 'Menge darf nur eine Zahl sein' })
    }
    if (menge <= 0) {
        return res.status(404).json({ nachricht: 'Menge muss größer als 0 sein' })
    }
    if (status !== 'undone' && status !== 'done') {
        return res.status(404).json({ nachricht: 'Bitte gültigen Status eingeben (offen / erledigt' })
    }

    const artikelStelle = liste.findIndex(item => item.id === id)
    if (artikelStelle === -1) {
        return res.status(404).json({ nachricht: 'Artikel wurde nicht gefunden!' })
    }
    liste[artikelStelle] = { ...liste[artikelStelle], artikel, menge, status, kategorie, fav, user }
    return res.json(liste[artikelStelle])
})

app.delete('/items/:id', (req, res) => {
    const id = Number(req.params.id)
    const artikelStelle = liste.findIndex(item => item.id === id)
    console.log("Artikel gelöscht:", req.body)
    if (artikelStelle === -1) {
        return res.status(404).json({ nachricht: 'Artikel wurde nicht gefunden!' })
    }
    liste.splice(artikelStelle, 1)

    return res.json({ nachricht: 'Artikel gelöscht' })
})

app.listen(port, () => {
    return console.log(`Server läuft auf http://localhost:${port}`)
})