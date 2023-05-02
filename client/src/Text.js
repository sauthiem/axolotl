export const listePages = [
    {
      lien:'Plan',
      fr:'Aperçu',
      en:'Overview',
      sp:'Resumen'
    },
    {
      lien:'EOI',
      fr:'eOI & OI',
      en:'eOI & OI',
      sp:'eOI & OI'
    },
    {
      lien:'EPF',
      fr:'ePF',
      en:'ePF',
      sp:'ePF'
    },
    {
      lien:'SPO',
      fr:'SpO₂',
      en:'SpO₂',
      sp:'SpO₂'
    },
    {
      lien:'PMOY',
      fr:'Pres Vent',
      en:'Vent Pr',
      sp:'Vent Pr'
    },
    {
      lien:'FIO',
      fr:'FiO₂',
      en:'FiO₂',
      sp:'FiO₂'
    },
    {
      lien:'VT',
      fr:'Vt',
      en:'Vt',
      sp:'Vt'
    },
    {
      lien:'PH',
      fr:'pH',
      en:'pH',
      sp:'pH'
    },
    {
      lien:'Bilan',
      fr:'Bilan I-E',
      en:'I-E Balance',
      sp:'Balance DE I-E'
    },]

export const appText = {
    titre:{
        fr: 'INTERFACE DE VISUALISATION CONTINUE DE L'+ "'" +'ÉTAT D' + "'" + 'HYPOXÉMIE',
        en: 'CONTINUOUS VISUALIZATION INTERFACE OF THE HYPOXEMIA STATE',
        sp: 'INTERFAZ DE VISUALIZACIÓN CONTINUA DES ESTADO DE HIPOXEMIA'
    },
    langue:{
        fr: 'Changer la langue',
        en: 'Change language',
        sp: 'Cambiar el idioma'
    },
    francais:{
        fr: 'Français',
        en: 'French',
        sp: 'Francés'
    },
    anglais:{
        fr: 'Anglais',
        en: 'English',
        sp: 'Inglés'
    },
    espagnol:{
        fr: 'Espagnol',
        en: 'Spanish',
        sp: 'Español'
    },
    graph:{
        fr: 'Créer un graphique',
        en: 'Create a chart',
        sp: 'Crear un gráfico',
    },
    creer:{
        fr: 'Créer',
        en: 'Create',
        sp: 'Crear',
    },
    db:{
        fr: 'Actions sur le stockage',
        en: 'Storage actions',
        sp: 'Acciones en el almacén',
    },
    reset:{
        fr: 'Réinitialiser',
        en: 'Reset',
        sp: 'Restablecer',
    },
    pOut:{
        fr: 'Effacer les patients sortis',
        en: 'Delete discharged patients',
        sp: 'Borrar los pacientes dados de alta',
    },
    patient:{
        fr: 'Changer de patient',
        en: 'Change patient',
        sp: 'Cambio de paciente',
    },
    deconnexion:{
        fr: 'Se déconnecter',
        en: 'Logout',
        sp: 'Desconectarse',
    },
    nom:{
        fr: 'Titre du nouveau graphique',
        en: 'Title of the new chart',
        sp: 'Título del nuevo gráfico',
    },
    mesure:{
        fr: 'Mesure',
        en: 'Measure',
        sp: 'Medida',
    },
    type:{
        fr: 'Type de graphique',
        en: 'Type of chart',
        sp: 'Tipo de gráfico',
    },

}

export const bilanText = {
    titre:{
        fr: 'Bilan ingesta-excretas',
        en: 'Balance ingesta-excretas',
        sp: 'Balance ingesta-excretas'
    },
    label1:{
        fr: 'Poids',
        en: 'Weight',
        sp: 'Peso'
    },
    label2:{
        fr: 'Bilan',
        en: 'Balance sheet',
        sp: 'Balance de situación'
    },
    text1:{
        fr: 'Bilan I-E en ml',
        en: 'I-E balance in ml',
        sp: 'Balance de I-E en ml'
    },
    text2:{
        fr: 'Poids en kg',
        en: 'Weight in kg',
        sp: 'Peso en kg'
    },
    slider:{
        fr: 'Intervalle de temps',
        en: 'Time interval',
        sp: 'Intervalo de tiempo'
    },
    diu:{
        fr: 'Diurèse',
        en: 'Diuresis',
        sp: 'Diuresis'
    },
}

export const creerGraphText = {
    bornes:{
        fr: 'Bornes',
        en: 'Markers',
        sp: 'Bornes'
    },
    moyenne:{
        fr: 'Moyenne',
        en: 'Average',
        sp: 'Media'
    },
    mediane:{
        fr: 'Médiane',
        en: 'Median',
        sp: 'Mediana'
    },
    etat:{
        fr: 'Etat critique',
        en: 'Critical condition',
        sp: 'Situación crítica'
    },
    dessus:{
        fr: 'au dessus de',
        en: 'above',
        sp: 'arriba'
    },
    dessous:{
        fr: 'en dessous de',
        en: 'below',
        sp: 'debajo de'
    },
    et:{
        fr: 'et',
        en: 'and',
        sp: 'y'
    },
    couleur:{
        fr: 'Couleur',
        en: 'Color',
        sp: 'Color'
    },
    calculMoy:{
        fr:'Calcul de la moyenne',
        en:'Calculation of average',
        sp:'Cálculo de la media'
    },
    calculMed:{
        fr:'Calcul de la médiane',
        en:'Calculation of median',
        sp:'Cálculo de la mediana'
    },
    mesure1:{
        fr:'Première mesure',
        en:'First measure',
        sp:'Primera medida'
    },
    mesure2:{
        fr:'Deuxième mesure',
        en:'Second measure',
        sp:'Segunda medida'
    },
    ajouter:{
        fr:'Ajouter une autre mesure au graphique',
        en:'Add another measure to the graph',
        sp:'Añadir otra medida al gráfico'
    },
    annuler:{
        fr:'Annuler',
        en:'Cancel',
        sp:'Cancelar'
    }
}

export const demographieText = {
    titre:{
        fr: 'DÉMOGRAPHIE',
        en: 'DEMOGRAPHY',
        sp: 'DEMOGRAFÍA'
    },
    nomMois:{
        fr: ['Jan','Fev','Mars','Avril','Mai','Juin','Juil','Août','Sept','Oct','Nov','Dec'],
        en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        sp: ['Ene','Feb','Mar','Abril','Mayo','Jun','Jul','Ago','Sept','Oct','Nov','Dic'],
    },
    lit:{
        fr: 'Lit : ',
        en: 'Bed: ',
        sp: 'Cama: '
    },
    dossier:{
        fr: 'Numéro de dossier : ',
        en: 'File number: ',
        sp: 'Número de expediente: '
    },
    nom:{
        fr: 'Nom : ',
        en: 'Name: ',
        sp: 'Nombre: '
    },
    age:{
        fr: 'Age : ',
        en: 'Age: ',
        sp: 'Eded: '
    },
    anmois:{
        fr: ['an', 'et', 'mois'],
        en: ['year', 'and', 'months'],
        sp:['año', 'y', 'meses'],
    },
    moisjour:{
        fr: ['mois', 'et', 'jours'],
        en: ['month', 'and', 'days'],
        sp:['mes', 'y', 'días'],
    },
    ans:{
        fr: 'ans',
        en: 'years',
        sp: 'años'
    },
    mois:{
        fr: 'mois',
        en: 'months',
        sp: 'meses'
    },
    jours:{
        fr: 'jours',
        en: 'days',
        sp: 'días'
    },
    sexe:{
        fr: 'Genre : ',
        en: 'Gender: ',
        sp: 'Género: '
    },
    pMesure:{
        fr: 'Poids mesuré : ',
        en: 'Measured weight: ',
        sp: 'Peso medido: '
    },
    pIdeal:{
        fr: 'Poids idéal : ',
        en: 'Ideal weight: ',
        sp: 'Peso ideal: '
    },
    taille:{
        fr: 'Taille : ',
        en: 'Height: ',
        sp: 'Altura: '
    },
    date:{
        fr: 'Date : ',
        en: 'Date: ',
        sp: 'Fecha: '
    },
    heure:{
        fr: 'Heure : ',
        en: 'Time: ',
        sp: 'Hora: '
    },
    faible:{
        fr: 'Modéré',
        en: 'Mild',
        sp: 'Moderado'
    },
    severe:{
        fr: 'Sévère',
        en: 'Severe',
        sp: 'Severa'
    },
    na:{
        fr: 'non renseignée',
        en: 'not indicated',
        sp: 'no conocida'
    },
    hypoxemie:{
        fr: 'Hypoxémie',
        en: 'Hypoxemia',
        sp: 'Hipoxemia'
    },
}

export const eoiText = {
    titre:{
        fr: 'eOI & OI',
        en: 'eOI & OI',
        sp: 'eOI & OI'
    },
    label1:{
        fr: 'OI par minute',
        en: 'OI per minute',
        sp: 'OI por minuto'
    },
    label2:{
        fr: 'eOI par minute',
        en: 'eOI per minute',
        sp: 'eOI por minuto'
    },
    zoom:{
        fr: 'Réinitialiser le zoom',
        en: 'Reset zoom',
        sp: 'Restablecer el zoom'
    },
    slider:{
        fr: 'Intervalle de temps',
        en: 'Time interval',
        sp: 'Intervalo de tiempo'
    },
    faible:{
        fr: 'Zone modéré',
        en: 'Mild area',
        sp: 'Zona moderada'
    },
    severe:{
        fr: 'Zone sévère',
        en: 'Severe area',
        sp: 'Zona severa'
    },
    IO:{
        fr:'INDICE D'+"'"+'OXYGÉNATION',
        en:'OXYGENATION INDEX',
        sp:'ÍNDICE DE OXIGENACIÓN',
    },
    EIO:{
        fr:'INDICE D'+"'"+'OXYGÉNATION ESTIMÉ',
        en:'ESTIMATED OXYGENATION INDEX',
        sp:'ÍNDICE DE OXIGENACIÓN ESTIMADO',
    }
}

export const epfText = {
    titre:{
        fr:'ePF',
        en:'ePF',
        sp:'ePF'
    },
    label1:{
        fr: 'PF par minute',
        en: 'PF per minute',
        sp: 'PF por minuto'
    },
    label2:{
        fr: 'ePF par minute',
        en: 'ePF per minute',
        sp: 'ePF por minuto'
    },
    zoom:{
        fr: 'Réinitialiser le zoom',
        en: 'Reset zoom',
        sp: 'Restablecer el zoom'
    },
    slider:{
        fr: 'Intervalle de temps',
        en: 'Time interval',
        sp: 'Intervalo de tiempo'
    },
    faible:{
        fr: 'Zone modéré',
        en: 'Mild area',
        sp: 'Zona moderada'
    },
    severe:{
        fr: 'Zone sévère',
        en: 'Severe area',
        sp: 'Zona severa'
    },
    PF:{
        fr:'Ratio PaO₂/FiO₂',
        en:'PaO₂/FiO₂ ratio',
        sp:'Relación PaO₂/FiO₂',
    },
    EPF:{
        fr:'Ratio PaO₂/FiO₂ estimé',
        en:'Estimated PaO₂/FiO₂ ratio',
        sp:'Estimación de la relación PaO₂/FiO₂',
    }
}

export const fioText = {
    titre:{
        fr:'Fraction inspirée d'+"'"+'oxygène',
        en:'Inspired fraction of oxygen',
        sp:'Fracción inspirada de oxígeno'
    },
    text1:{
        fr: 'FiO₂',
        en: 'FiO₂',
        sp: 'FiO₂'
    },
    label1:{
        fr: 'FiO₂ par minute',
        en: 'FiO₂ per minute',
        sp: 'FiO₂ por minuto'
    },
    slider:{
        fr: 'Intervalle de temps',
        en: 'Time interval',
        sp: 'Intervalo de tiempo'
    },
    mediane:{
        fr: 'Médiane FiO2',
        en: 'FiO₂ median',
        sp: 'Mediana FiO₂'
    },
    IQR:{
        fr: 'VALEUR IQR',
        en: 'IQR VALUE',
        sp: 'IQR VALOR'
    },
}

export const loginText = {
    titre:{
        fr:'Connexion',
        en:'Login',
        sp:'Conexión'
    },
    username:{
        fr: 'Nom d'+"'"+'utilisateur',
        en: 'Username',
        sp: 'Nombre de usuario'
    },
    password:{
        fr: 'Mot de passe',
        en: 'Password',
        sp: 'Contraseña'
    },
}

export const mainText = {
    chargement:{
        fr:'Chargement...',
        en:'Loading...',
        sp:'Cargando...'
    },
    chambre:{
        fr: 'Lit',
        en: 'Bed',
        sp: 'Cama'
    },
    titre:{
        fr: 'Veuillez indiquer le lit du patient',
        en: 'Please indicate the patient' +"'" + 's bed',
        sp: 'Por favor, indique la cama del paciente'
    },

}

export const menuText = {
    plan:{
        fr: 'Aperçu',
        en: 'Overview',
        sp: 'Resumen'
    },
    slider:{
        fr: 'Intervalle de temps',
        en: 'Time interval',
        sp: 'Intervalo de tiempo'
    },
    heures:{
        fr:' heures',
        en:' hours',
        sp:' horas'
    },
    jours:{
        fr: ' jours',
        en: ' days',
        sp: ' días'
    },
}


export const phText = {
    titre:{
        fr:'pH',
        en:'pH',
        sp:'pH'
    },
    valeur:{
        fr: 'valeur',
        en: 'value',
        sp: 'valor'
    },
    art:{
        fr: 'pH Artériel',
        en: 'Arterial pH',
        sp: 'pH arterial'
    },
    vei:{
        fr: 'pH Veineux',
        en: 'Venous pH',
        sp: 'pH Venoso'
    },
    cap:{
        fr: 'pH Capillaire',
        en: 'Capillary pH',
        sp: 'pH Capilar'
    },
    moyen:{
        fr: 'pH moyen',
        en: 'Average pH',
        sp: 'pH medio'
    },
    conformite:{
        fr: 'Conformité',
        en: 'Compliance',
        sp: 'Cumplimiento'
    },
}

///A modifier
export const planText = {
    recommandations:{
        fr:'Recommandations',
        en:'Recommendations',
        sp:'Recomendaciones'
    },
    faible:{
        fr: 'faible',
        en: 'low',
        sp: 'bajo'
    },
    eleve:{
        fr: 'élevé',
        en: 'high',
        sp: 'alto'
    },
    reduire:{
        fr: 'Réduire le taux de',
        en: 'Reduce the rate of',
        sp: 'Reducir la tasa de'
    },
    augmenter:{
        fr: 'Augmenter le taux de',
        en: 'Increase the rate of',
        sp: 'Aumentar la tasa de'
    },
    a:{
        fr: 'à',
        en: 'to',
        sp: 'al'
    },
    chargement:{
        fr: 'Chargement des données',
        en: 'Loading data',
        sp: 'Carga de datos'
    },
    erreur:{
        fr: 'Aucune donnée pour cette période',
        en: 'No data for this period',
        sp: 'No hay datos para este período'
    }
}

export const pmoyText = {
    titre:{
        fr:'Pressions de ventilation',
        en:'Ventilation pressures',
        sp:'Presiónes de ventilación'
    },
    text1:{
        fr:'Pr-vent',
        en:'Vent-Pr',
        sp:'Vent-Pr'
    },
    text2:{
        fr:'Pressions de ventilation',
        en:'Ventilation pressures',
        sp:'Presiónes de ventilación'
    },
    mediane:{
        fr: 'Médiane',
        en: 'Median',
        sp: 'Mediana'
    },
}
export const spoText = {
    titre:{
        fr:'Saturation pulsée en O₂',
        en:'Pulsed O₂ saturation',
        sp:'Saturación de O₂ pulsada'
    },
    text1:{
        fr:'SpO₂',
        en:'SpO₂',
        sp:'SpO₂'
    },
    jours:{
        fr: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
        en: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
        sp: ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'],
    },
    mois:{
        fr: ['Jan','Fev','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Dec'],
        en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        sp: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    },
    valeur:{
        fr: 'valeur',
        en: 'value',
        sp: 'valor'
    },
    slider:{
        fr: 'Intervalle de temps',
        en: 'Time interval',
        sp: 'Intervalo de tiempo'
    },
    conformite:{
        fr: 'CONFORMITÉ',
        en: 'COMPLIANCE',
        sp: 'CUMPLIMIENTO'
    },
}

export const vtText = {
    titre:{
        fr:'Volume courant expiré',
        en:'Exhaled tidal volume',
        sp:'Volumen tidal exhalado'
    },
    text1:{
        fr:'Vt',
        en:'Vt',
        sp:'Vt'
    },
    valeur:{
        fr: 'valeur',
        en: 'value',
        sp: 'valor'
    },
    slider:{
        fr: 'Intervalle de temps',
        en: 'Time interval',
        sp: 'Intervalo de tiempo'
    },
    conformite:{
        fr: 'CONFORMITÉ',
        en: 'COMPLIANCE',
        sp: 'CUMPLIMIENTO'
    },
    sup:{
        fr: 'Valeurs supérieures',
        en: 'Upper values',
        sp: 'Valores superiores'
    },
    inf:{
        fr: 'Valeurs inférieures',
        en: 'Lower values',
        sp: 'Valores inferiores'
    },
}