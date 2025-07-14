import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

interface Artikel {
    name: string
    menge: number
    status: 'offen' | 'erledigt'
    id: number
}

const liste: Artikel[] = [
    { id: 1, name: 'Milch', menge: 2, status: 'offen' },
    { id: 2, name: 'Brot', menge: 1, status: 'erledigt' }
]

app.use(express.json())

app.get('/items', (req, res) => {
    return res.json(liste)
})

app.post('/items', (req, res) => {
    const { menge, name, status } = req.body
    const neueId = liste.length > 0 ? Math.max(...liste.map(item => item.id)) + 1 : 1
    const neuerArtikel = { name, menge, status, id: neueId }
    if (name.trim() === "") {
        return res.status(404).json({ nachricht: 'Bitte einen gültigen Artikel eingeben' })
    }
    if (typeof menge !== 'number' || isNaN(menge)) {
        return res.status(404).json({ nachricht: 'Menge darf nur eine Zahl sein' })
    }
    if (menge <= 0) {
        return res.status(404).json({ nachricht: 'Menge muss größer als 0 sein' })
    }
    if (status !== 'offen' && status !== 'erledigt') {
        return res.status(404).json({ nachricht: 'Bitte gültigen Status eingeben (offen / erledigt' })
    }
    liste.push(neuerArtikel)
    return res.status(201).json(neuerArtikel)
})

app.put('/items/:id', (req, res) => {
    const { name, menge, status } = req.body
    const id = Number(req.params.id)

    if (name.trim() === "") {
        return res.status(404).json({ nachricht: 'Bitte einen gültigen Artikel eingeben' })
    }
    if (typeof menge !== 'number' || isNaN(menge)) {
        return res.status(404).json({ nachricht: 'Menge darf nur eine Zahl sein' })
    }
    if (menge <= 0) {
        return res.status(404).json({ nachricht: 'Menge muss größer als 0 sein' })
    }
    if (status !== 'offen' && status !== 'erledigt') {
        return res.status(404).json({ nachricht: 'Bitte gültigen Status eingeben (offen / erledigt' })
    }
    
    const artikelStelle = liste.findIndex(item => item.id === id)
    if (artikelStelle === -1) {
        res.status(404).json({ nachricht: 'Artikel wurde nicht gefunden!' })
    }
    liste[artikelStelle] = { ...liste[artikelStelle], name, menge, status }
    return res.json(liste[artikelStelle])
})

app.delete('/items/:id', (req, res) => {
    const id = Number(req.params.id)
    const artikelStelle = liste.findIndex(item => item.id === id)
    if (artikelStelle === -1) {
        res.status(404).json({ nachricht: 'Artikel wurde nicht gefunden!' })
    }
    liste.splice(artikelStelle, 1)

    return res.json({ nachricht: 'Artikel gelöscht' })
})

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`)
})