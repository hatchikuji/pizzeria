import express from 'express';
import http from 'http';
import path from 'path';
import db from "./dbconfig.mjs"; // Connexion à la base de données
import cors from 'cors';

// Différentes variables
const app = express();
const server = http.createServer(app);

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
    console.log('Données reçues :', req.body); // Log des données reçues pour débug

    try {
        const [result] = await db.query('INSERT INTO pizza (nom_pizza, nb_pizza) VALUES (?, ?)', [nom_pizza, nb_pizza]);
        const idPizza = result.insertId;

        if (produits && produits.length) {
            const values = produits.map(produit => `(${idPizza}, ${produit.id_produit}, ${produit.quantite})`).join(',');
            console.log('Requête SQL pour les produits :', values); // Log des valeurs avant insertion
            await db.query(`INSERT INTO contient (id_pizza, id_produit, quantite) VALUES ${values}`);
        }

        res.status(201).json({id_pizza: idPizza});
    } catch (error) {
        console.error('Erreur lors de l\'insertion de la pizza :', error);
        res.status(500).json({message: 'Erreur serveur'});
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
            SELECT p.*, c.quantite FROM produit p JOIN contient c ON p.id_produit = c.id_produit
            WHERE c.id_pizza = ?`, [pizzaId]);

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

