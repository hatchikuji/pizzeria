import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import db from "./dbconfig.mjs"; // Connexion à la base de données
import fs from 'fs';
import cors from 'cors';

// Différentes variables
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const logpath = path.join(path.resolve(), '../logs', 'server.mjs.log');

const logEvents = (message) => {
    const timestamp = new Date().toISOString();
    fs.appendFile(logpath, `[${timestamp}] ${message}\n`, (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture dans le fichier de logs :', err);
        }
    });
};

// Configuration pour servir les fichiers statiques
app.use(express.static(path.join(path.resolve(), 'public')));

app.use(express.json()); // Middleware pour parser les requêtes JSON

// CORS
app.use(cors({
    origin: 'http://localhost:5173'
}));


// Récupérer les données de la base de données
app.get('/api/pizza', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pizza');
        res.json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des pizzas :', error);
        res.status(500).json({message: 'Erreur serveur'});
    }
});

app.get('/api/produit', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM produit');
        res.json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Inserer les pizzas dans la base de données
app.post('/api/pizzaInserer', async (req, res) => {
    const {nom_pizza, nb_pizza, produits} = req.body;
    console.log('Données reçues :', req.body); // Log des données reçues

    try {
        const [result] = await db.query('INSERT INTO pizza (nom_pizza, nb_pizza) VALUES (?, ?)', [nom_pizza, nb_pizza]);
        const idPizza = result.insertId;

        if (produits && produits.length) {
            const values = produits.map(produit => `(${idPizza}, ${produit.id_produit}, ${produit.quantite})`).join(',');
            console.log('Requête SQL pour les produits :', values); // Log des valeurs avant insertion
            await db.query(`INSERT INTO lien (id_pizza, id_produit, quantite) VALUES ${values}`);
        }

        res.status(201).json({id_pizza: idPizza});
    } catch (error) {
        console.error('Erreur lors de l\'insertion de la pizza :', error);
        res.status(500).json({message: 'Erreur serveur'});
    }
});



// Récupérer les pizzas avec leurs produits associés
app.get('/api/pizzasAvecProduits', async (req, res) => {
    const query = `
        SELECT p.id_pizza, p.nom_pizza, p.nb_pizza, pr.id_produit, pr.nom_produit
        FROM pizza p
        JOIN lien l ON p.id_pizza = l.id_pizza
        JOIN produit pr ON l.id_produit = pr.id_produit
    `;
    try {
        const [rows] = await db.query(query);
        const pizzas = rows.reduce((acc, row) => {
            const { id_pizza, nom_pizza, nb_pizza, id_produit, nom_produit } = row;

            // Trouver ou créer l'objet pizza dans l'accumulateur
            let pizza = acc.find(p => p.id_pizza === id_pizza);
            if (!pizza) {
                pizza = {
                    id_pizza,
                    nom_pizza,
                    nb_pizza,
                    produits: [] // tableau pour les produits associés
                };
                acc.push(pizza);
            }

            // Ajouter le produit à la pizza
            if (id_produit) {
                pizza.produits.push({ id_produit, nom_produit });
            }

            return acc;
        }, []);
        res.json(pizzas);
    } catch (error) {
        console.error('Erreur lors de la récupération des pizzas avec produits :', error);
        res.status(500).send('Erreur lors de la récupération des pizzas avec produits');
    }
});

// Suppression d'une pizza par ID
app.delete('/api/pizza/:id', async (req, res) => {
    const idPizza = req.params.id;
    try {
        const [result] = await db.query('DELETE FROM pizza WHERE id_pizza = ?', [idPizza]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Pizza supprimée avec succès.' });
        } else {
            res.status(404).json({ message: 'Pizza non trouvée.' });
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de la pizza :', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la pizza.' });
    }
});


// Récupérer les détails d'une pizza
app.get('/api/pizza/:id', async (req, res) => {
    const pizzaId = req.params.id;
    try {
        const [pizza] = await db.query('SELECT * FROM pizza WHERE id_pizza = ?', [pizzaId]);
        const [produits] = await db.query(`
            SELECT p.*, l.quantite FROM produit p
                                            JOIN lien l ON p.id_produit = l.id_produit
            WHERE l.id_pizza = ?`, [pizzaId]);

        const pizzaDetails = {
            ...pizza[0],
            produits: produits.map(produit => ({
                ...produit,
                quantite: produit.quantite // Ajouter la quantité de produit
            }))
        };

        res.json(pizzaDetails);
    } catch (error) {
        console.error('Erreur lors de la récupération de la pizza :', error);
        res.status(500).send('Erreur serveur');
    }
});





// Démarrer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur en marche sur le port ${PORT}`);
});

