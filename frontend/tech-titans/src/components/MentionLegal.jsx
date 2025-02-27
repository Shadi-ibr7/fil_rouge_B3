
function MentionLegal() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Mentions Légales</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Édition du site</h2>
        <p>Le présent site, accessible à l’URL <a href="https://projet-b3-front.vercel.app/" className="text-blue-600">https://projet-b3-front.vercel.app/</a>, est édité par :</p>
        <p><strong>Association Event Ease</strong>, enregistrée auprès de la préfecture/sous-préfecture de 77 - Sous-Préfecture Fontainebleau sous le numéro W123456789.</p>
        <p>Siège social : 2 rue de l'échappée, 75010 PARIS.</p>
        <p>Représenté par Prénom Nom.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Hébergement</h2>
        <p>Le site est hébergé par la société Vercel, située à :</p>
        <p>2 rue de l'échappée, 75010 PARIS.</p>
        <p>Contact : +33612341111</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Directeur de publication</h2>
        <p>Le Directeur de la publication est Prénom Nom.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Nous contacter</h2>
        <p>Téléphone : +33611235416</p>
        <p>Email : <a href="mailto:nom@gmail.com" className="text-blue-600">nom@gmail.com</a></p>
        <p>Adresse postale : 2 rue de l'échappée, 75010 PARIS.</p>
      </section>

      <footer className="text-center text-gray-600 mt-6">
        <p>Mentions légales générées par <a href="https://www.legalstart.fr/" className="text-blue-600">Legalstart</a>.</p>
      </footer>
    </div>
  );
}

export default MentionLegal;
