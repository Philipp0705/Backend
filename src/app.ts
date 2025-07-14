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
    {id: 1, name: 'Milch', menge: 2, status: 'offen'},
    {id: 2, name: 'Brot', menge: 1, status: 'erledigt'}
]

app.use(express.json())

app.get('/items', (req, res) => {
    res.json(liste)
})

app.post('/items', (req, res) => {
    const {menge, name, status} = req.body
    const neueId = liste.length > 0 ? Math.max(...liste.map(item => item.id)) + 1 : 1
    const neuerArtikel = {name, menge, status, id: neueId}

    liste.push(neuerArtikel)
    res.status(201).json(neuerArtikel)
})

app.put('/items/:id', (req, res) => {
    const {name, menge, status} = req.body
    const id = Number(req.params.id)
    const artikelStelle = liste.findIndex(item => item.id === id)
    liste[artikelStelle] = {...liste[artikelStelle],name, menge, status}

    res.json(liste[artikelStelle])
})

app.delete('/items/:id', (req, res) => {
    const id = Number(req.params.id)
    const artikelStelle = liste.findIndex(item => item.id === id)
    liste.splice(artikelStelle, 1)
    
    res.json({ nachricht: 'Artikel gelöscht' })
})

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`)
})