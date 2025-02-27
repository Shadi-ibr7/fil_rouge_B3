import React from "react";

function PolitiqueConfi() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Politique de Confidentialité</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Introduction</h2>
        <p>Cette politique de confidentialité explique comment l'Association Event Ease collecte, utilise et protège les informations personnelles des utilisateurs du site <a href="https://projet-b3-front.vercel.app/" className="text-blue-600">https://projet-b3-front.vercel.app/</a>.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Données collectées</h2>
        <p>Nous collectons les informations suivantes :</p>
        <ul className="list-disc ml-6">
          <li>Nom et prénom</li>
          <li>Adresse email</li>
          <li>Numéro de téléphone</li>
          <li>Données de navigation</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Utilisation des données</h2>
        <p>Les données collectées sont utilisées pour :</p>
        <ul className="list-disc ml-6">
          <li>Améliorer l'expérience utilisateur</li>
          <li>Fournir un support client</li>
          <li>Envoyer des communications importantes</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Protection des données</h2>
        <p>Nous mettons en place des mesures de sécurité pour protéger vos informations personnelles contre l'accès non autorisé.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>Pour toute question relative à cette politique de confidentialité, vous pouvez nous contacter :</p>
        <p>Email : <a href="mailto:nom@gmail.com" className="text-blue-600">nom@gmail.com</a></p>
        <p>Adresse : 2 rue de l'échappée, 75010 PARIS.</p>
      </section>

      <footer className="text-center text-gray-600 mt-6">
        <p>Politique de confidentialité générée par <a href="https://www.legalstart.fr/" className="text-blue-600">Legalstart</a>.</p>
      </footer>
    </div>
  );
}

export default PolitiqueConfi;
