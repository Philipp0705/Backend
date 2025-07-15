//Import aller wichtigen Sachen
import express, { Request, Response } from 'express';
import cors from 'cors';

//Definierung wie ein Artikel aufgebaut ist
interface Artikel {
    artikel: string
    menge: number
    status: 'undone' | 'done'
    kategorie: string
    fav: "yes" | "no"
    id: number
}

//Setzen  von Variablen
const app = express();
const port = 3001; //Legt fest, auf welchem Port das Backend läuft
const liste: Record<string, Artikel[]> = {}

app.use(cors());
app.use(express.json())


//Definition der GET-Function
app.get('/users/:user/items', (req, res) => {
    const user = req.params.user
    if (liste[user]) {
        return res.json(liste[user])
    }
    else return res.json({ nachricht: 'User wurde nicht gefunden!' })
})

//Definition der POST-Function
app.post('/users/:user/items', (req, res) => {
    const user = req.params.user
    const { artikel, menge, status, kategorie, fav } = req.body

    if (!liste[user]) {
        liste[user] = []
    }

    //Validierung
    if (artikel.trim === "") {
        return res.status(404).json({ nachricht: "Bitte einen Artikel eingeben" })
    }
    if (typeof menge !== "number" || isNaN(menge)) {
        return res.status(404).json({ nachricht: "Bitte eine gültige Menge eingeben" })
    }
    if (menge <= 0) {
        return res.status(404).json({ nachricht: "Menge muss größer als 0 sein" })
    }

    console.log("Neuer Artikel empfangen:", req.body)

    const neueId = liste[user].length > 0 ? Math.max(...liste[user].map(item => item.id)) + 1 : 1
    const neuerArtikel = { artikel, menge, status, kategorie, fav, id: neueId }
    liste[user].push(neuerArtikel)

    return res.status(201).json(neuerArtikel)
})

//Definition der PUT-Function
app.put('/users/:user/items/:id', (req, res) => {
    const user = req.params.user
    const id = Number(req.params.id)
    const { artikel, menge, status, kategorie, fav } = req.body

    //Validierung vom User
    if (!liste[user]) { return res.json({ nachricht: "Es wurde kein User gefunden!" }) }

    const artikelStelle = liste[user].findIndex(item => item.id === id)

    //Validierung vom Item
    if (artikelStelle === -1) {
        return res.status(404).json({ nachricht: 'Artikel wurde nicht gefunden!' })
    }

    liste[user][artikelStelle] = { ...liste[user][artikelStelle], artikel, menge, status, kategorie, fav }

    return res.json(liste[user][artikelStelle])
})

//Definition der DELETE-Function
app.delete('/users/:user/items/:id', (req, res) => {
    const user = req.params.user
    const id = Number(req.params.id)

    //Validierung vom User
    if (!liste[user]) { return res.json({ nachricht: "Es wurde kein User gefunden!" }) }

    const artikelStelle = liste[user].findIndex(item => item.id === id)

    //Validierung vom Artikel
    if (artikelStelle === -1) {
        return res.status(404).json({ nachricht: 'Artikel wurde nicht gefunden!' })
    }
    
    liste[user].splice(artikelStelle, 1)

    return res.json({ nachricht: 'Artikel gelöscht' })
})

//Server auf PORT starten
app.listen(port, () => {
    return console.log(`Server läuft auf http://localhost:${port}`)
})