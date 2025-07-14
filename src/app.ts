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

app.get('/items', (req, res) => {
    res.json(liste)
})

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`)
})