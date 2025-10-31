let selectedType = null;

document.querySelectorAll('.loanType').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.loanType').forEach(b => b.classList.remove('ring-4', 'ring-green-300'));
        btn.classList.add('ring-4', 'ring-green-400');
        selectedType = btn.dataset.type;
    });
});

function getInterestRate(type, duree) {
    switch (type) {
        case 'Maison':
             return 0.035;
        case 'Appartement':
             return 0.04;
        case 'Terrain':
             return 0.05;
        case 'Petite entreprise':
             return 0.06;
        case 'Prêt personnel':
             return 0.07;
        default:
             return ;
    }
}

function calculMensualite(P, r, n) {
    if (r === 0) return P / n;
    return (P * r) / (1 - Math.pow(1 + r, -n));
}

document.getElementById('simulateBtn').addEventListener('click', () => {
    const montant = parseFloat(document.getElementById('montant').value);
    const duree = parseFloat(document.getElementById('duree').value);
    const revenu = parseFloat(document.getElementById('revenu').value);

    if (!selectedType || !montant || !duree || !revenu) {
        alert("Veuillez remplir tous les champs et sélectionner un type de prêt !");
        return;
    }

    const tauxAnnuel = getInterestRate(selectedType, duree);
    const tauxMensuel = tauxAnnuel / 12;
    const nbMois = duree * 12;
    const mensualite = calculMensualite(montant, tauxMensuel, nbMois);
    const total = mensualite * nbMois;
    const interets = total - montant;
    const ratio = (mensualite / revenu) * 100;

    let messageHTML = '';

    if (ratio > 40) { messageHTML = `
          <div class="border rounded-lg p-6 flex items-center space-x-4 bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h2 class="text-red-500 font-bold text-lg mb-1">Prêt non accessible</h2>
              <p class="text-sm text-slate-950">
                Votre mensualité représente <span class="font-semibold">${ratio.toFixed(1)}%</span> de votre salaire.<br>
                Ce prêt dépasse vos capacités de remboursement (limite fixée à 40%).
              </p>
            </div>
          </div>`;
    } else { messageHTML = `
          <div class="border rounded-lg p-6 flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h2 class="text-green-00 font-bold text-lg mb-1">Prêt accessible</h2>
              <p class="text-sm text-slate-950">
                Votre mensualité représente <span class="font-semibold">${ratio.toFixed(1)}%</span> de votre salaire.<br>
                Ce prêt est dans vos capacités de remboursement.
              </p>
            </div>
          </div>

          <div class="border rounded-lg p-6 mt-6">
            <h3 class="text-green-500 font-bold text-center mb-4">Récapitulatif</h3>
            <dl class="grid grid-cols-2 gap-y-3 text-sm">
              <dt class="font-semibold">Type de prêt</dt><dd class="text-right">${selectedType}</dd>
              <dt class="font-semibold">Montant emprunté</dt><dd class="text-right">${montant.toLocaleString()} Dhs</dd>
              <dt class="font-semibold">Durée</dt><dd class="text-right">${duree} ans</dd>
              <dt class="font-semibold">Taux d’intérêt</dt><dd class="text-right">${(tauxAnnuel * 100).toFixed(2)}%</dd>
            </dl>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            <div class="border rounded-lg p-4 text-center">
              <img src="photos/carte-de-credit.png" class="w-10 h-10 mx-auto mb-2" />
              <p class="font-semibold">Mensualité</p>
              <p class="text-lg font-bold">${mensualite.toFixed(2)} Dhs</p>
            </div>
            <div class="border rounded-lg p-4 text-center">
              <img src="photos/signe-de-pourcentage.png" class="w-10 h-10 mx-auto mb-2" />
              <p class="font-semibold">Total intérêts</p>
              <p class="text-lg font-bold">${interets.toFixed(2)} Dhs</p>
            </div>
            <div class="border rounded-lg p-4 text-center">
              <img src="photos/tendance-haussiere.png" class="w-10 h-10 mx-auto mb-2" />
              <p class="font-semibold">Total à rembourser</p>
              <p class="text-lg font-bold">${total.toFixed(2)} Dhs</p>
            </div>
          </div>`;
    }

    const result = document.getElementById('resultat');
    result.innerHTML = messageHTML;
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth' });
});