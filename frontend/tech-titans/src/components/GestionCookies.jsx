import React from "react";

function GestionCookies() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Gestion des Cookies</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Introduction</h2>
        <p>Cette page explique comment l'Association Event Ease utilise les cookies et technologies similaires sur le site <a href="https://projet-b3-front.vercel.app/" className="text-blue-600">https://projet-b3-front.vercel.app/</a>.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Qu'est-ce qu'un cookie ?</h2>
        <p>Un cookie est un petit fichier texte stocké sur votre appareil qui permet d'améliorer votre expérience utilisateur et de collecter des données analytiques.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Types de cookies utilisés</h2>
        <ul className="list-disc ml-6">
          <li>Cookies essentiels : nécessaires au bon fonctionnement du site.</li>
          <li>Cookies analytiques : permettent d'analyser l'utilisation du site.</li>
          <li>Cookies publicitaires : utilisés pour afficher des publicités personnalisées.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Gestion des cookies</h2>
        <p>Vous pouvez gérer vos préférences en matière de cookies à tout moment via les paramètres de votre navigateur ou en utilisant notre bannière de consentement.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>Pour toute question relative à la gestion des cookies, vous pouvez nous contacter :</p>
        <p>Email : <a href="mailto:nom@gmail.com" className="text-blue-600">nom@gmail.com</a></p>
        <p>Adresse : 2 rue de l'échappée, 75010 PARIS.</p>
      </section>

      <footer className="text-center text-gray-600 mt-6">
        <p>Informations sur les cookies générées par <a href="https://www.legalstart.fr/" className="text-blue-600">Legalstart</a>.</p>
      </footer>
    </div>
  );
}

export default GestionCookies;
