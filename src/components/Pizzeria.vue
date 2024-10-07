<template>
  <div>
    <h1>Liste de Pizzas et Produits</h1>

    <!-- Liste déroulante pour sélectionner une pizza -->
    <h2>Sélectionnez une Pizza</h2>
    <select v-model="selectedPizza" @change="updateSelectedPizza">
      <option disabled value="">Choisissez une pizza</option>
      <option v-for="pizza in pizzas" :key="pizza.id_pizza" :value="pizza.id_pizza">
        {{ pizza.nom_pizza }}
      </option>
    </select>
    <p v-if="selectedPizza">Vous avez sélectionné la pizza avec l'ID : {{ selectedPizza }}</p>

    <!-- Détails de la pizza sélectionnée -->
    <div v-if="selectedPizzaDetails">
      <h3>Détails de la Pizza</h3>
      <p><strong>Nom :</strong> {{ selectedPizzaDetails.nom_pizza }}</p>
      <p><strong>Quantité :</strong> {{ selectedPizzaDetails.nb_pizza }}</p>
      <p><strong>Produits :</strong></p>
      <ul>
        <li v-for="produit in selectedPizzaDetails.produits" :key="produit.id_produit">
          {{ produit.quantite }} x {{ produit.nom_produit }}
        </li>
      </ul>
    </div>


    <!-- Liste déroulante des produits -->
    <h2>Sélectionnez un produit</h2>
    <select v-model="selectedProduit">
      <option disabled value="">Choisissez un produit</option>
      <option v-for="produit in produits" :key="produit.id_produit" :value="produit.id_produit">
        {{ produit.nom_produit }}
      </option>
    </select>
    <p v-if="selectedProduit">Vous avez sélectionné le produit avec l'ID : {{ selectedProduit }}</p>

    <!-- Formulaire pour insérer une nouvelle pizza -->
    <h2>Insérer une nouvelle Pizza</h2>
    <form @submit.prevent="insertPizza">
      <div>
        <label for="nom_pizza">Nom de la Pizza :</label>
        <input type="text" v-model="nouvellePizza.nom_pizza" id="nom_pizza" required>
      </div>
      <div>
        <label for="nb_pizza">Quantité :</label>
        <input type="number" v-model="nouvellePizza.nb_pizza" id="nb_pizza" required>
      </div>
      <div>
        <label for="produits">Produits (séparés par des virgules):</label>
        <input type="text" v-model="nouvellePizza.produits" id="produits" placeholder="Exemple : 1-2,3-1">
        <small>Format : id_produit-quantité (séparés par des virgules)</small>
      </div>
      <button type="submit">Ajouter la Pizza</button>
    </form>
    <button @click="deletePizza">Supprimer la Pizza</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      pizzas: [],
      produits: [],
      selectedPizza: '', // Pour stocker l'ID de la pizza sélectionnée
      selectedProduit: '', // Pour stocker l'ID du produit sélectionné
      selectedPizzaDetails: null, // Détails de la pizza sélectionnée
      nouvellePizza: {
        nom_pizza: '',
        nb_pizza: '',
        produits: '', // Produits au format "id_produit-quantité"
      }
    };
  },
  mounted() {
    // Charger les pizzas et les produits au montage du composant
    this.getPizzas();
    this.getProduits();
  },
  methods: {
    // Requête pour supprimer une pizza
    async deletePizza() {
      if (this.selectedPizza) {
        try {
          await axios.delete(`http://localhost:3000/api/pizza/${this.selectedPizza}`);
          await this.getPizzas();
          this.selectedPizza = '';
          this.selectedPizzaDetails = null;
        } catch (error) {
          console.error('Erreur lors de la suppression de la pizza :', error);
          alert('Erreur lors de la suppression de la pizza');
        }
      }
    },
    
    // Requête pour inserer les pizzas
    async insertPizza() {
      const produitsArray = this.nouvellePizza.produits.split(',').map(produit => {
        const [id_produit, quantite] = produit.split('-');
        return {id_produit: parseInt(id_produit), quantite: parseInt(quantite)};
      });

      const nouvellePizza = {
        nom_pizza: this.nouvellePizza.nom_pizza,
        nb_pizza: this.nouvellePizza.nb_pizza,
        produits: produitsArray
      };
      try {
        await axios.post('http://localhost:3000/api/pizzaInserer', nouvellePizza);
        alert('Pizza insérée avec succès !');
        await this.getPizzas();
        this.nouvellePizza = {nom_pizza: '', nb_pizza: '', produits: ''};
      } catch (error) {
        console.error('Erreur lors de l\'insertion de la pizza :', error);
        alert('Erreur lors de l\'insertion de la pizza');
      }
    },
    // Requête pour récupérer les pizzas
    async getPizzas() {
      try {
        const response = await axios.get('http://localhost:3000/api/pizza'); // Appel à l'API des pizzas
        this.pizzas = response.data;
        await this.updateSelectedPizza(); // Mettre à jour les détails de la première pizza par défaut
      } catch (error) {
        console.error('Erreur lors de la récupération des pizzas :', error);
      }
    },
    // Requête pour récupérer les produits
    async getProduits() {
      try {
        const response = await axios.get('http://localhost:3000/api/produit'); // Appel à l'API des produits
        this.produits = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
      }
    },
    // Mettre à jour les détails de la pizza sélectionnée
    async updateSelectedPizza() {
      if (this.selectedPizza) {
        try {
          const response = await axios.get(`http://localhost:3000/api/pizza/${this.selectedPizza}`);
          this.selectedPizzaDetails = response.data;
        } catch (error) {
          console.error('Erreur lors de la récupération des détails de la pizza :', error);
        }
      } else {
        this.selectedPizzaDetails = null;
      }
    }
  }
};
</script>

<style scoped>
/* Style basique, tu peux personnaliser */
h1, h2 {
  color: #333;
}

select {
  margin: 10px 0;
  padding: 5px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

p {
  margin: 5px 0;
}
</style>
