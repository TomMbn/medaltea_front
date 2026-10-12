export interface Medecine {
  slug: string
  name: string
  nameWithArticle: string
  ctaLabel: string
  icon: string
  shortDescription: string
  heroImage: string
  heroTagline: string
  count: string
  duration: string
  definitionImage: string
  definitionText: string[]
  conditions: string[]
  mosaicImage1: string
  mosaicImage2: string
  mosaicImage2Tagline: string
  mosaicImage3: string
  steps: { title: string; description: string }[]
  benefits: string[]
  seo: { title: string; description: string }
}

export const medecines: Medecine[] = [
  {
    slug: 'osteopathie',
    name: 'Ostéopathie',
    nameWithArticle: "l'ostéopathie",
    ctaLabel: 'un/e ostéopathe',
    icon: '🦴',
    shortDescription: 'Thérapie manuelle qui rétablit l\'équilibre du corps',
    heroImage: '/images/medicine-5.jpeg',
    heroTagline: 'Gagnez en mobilité',
    count: '+200',
    duration: '45 min à 1 heure',
    definitionImage: '/images/AdobeStock_452334355.jpeg',
    definitionText: [
      'L\'ostéopathie est une thérapie manuelle qui vise à rétablir l\'équilibre du corps en traitant les restrictions de mobilité.',
      'À travers des manipulations douces, elle permet de soulager les douleurs et d\'améliorer le fonctionnement global de l\'organisme.'
    ],
    conditions: ['Douleurs lombaires', 'Tensions musculaires', 'Migraines et maux de tête', 'Troubles digestifs', 'Douleurs articulaires', 'Stress et fatigue'],
    mosaicImage1: '/images/AdobeStock_313373132.jpeg',
    mosaicImage2: '/images/AdobeStock_317007907.jpeg',
    mosaicImage2Tagline: 'Gagnez en mobilité',
    mosaicImage3: '/images/AdobeStock_329541430.jpeg',
    steps: [
      { title: 'Consultation initiale', description: 'Vous échangez avec le praticien sur vos douleurs, votre mode de vie et vos antécédents.' },
      { title: 'Analyse du corps', description: 'L\'ostéopathe observe votre posture, vos mouvements et identifie les zones de tension.' },
      { title: 'Manipulations', description: 'Des techniques manuelles adaptées sont réalisées pour relâcher les tensions et rétablir l\'équilibre.' },
      { title: 'Conseils personnalisés', description: 'Vous repartez avec des recommandations pour prolonger les effets de la séance.' }
    ],
    benefits: [
      'Soulage efficacement les douleurs musculaires et articulaires',
      'Améliore la mobilité et la posture',
      'Réduit les tensions liées au stress',
      'Favorise la récupération sportive',
      'Améliore le bien-être général'
    ],
    seo: {
      title: 'Ostéopathie — Trouvez un ostéopathe près de chez vous | Léya',
      description: 'Découvrez l\'ostéopathie sur Léya et trouvez un ostéopathe qualifié près de chez vous. Douleurs lombaires, tensions musculaires, migraines : prenez rendez-vous facilement.'
    }
  },
  {
    slug: 'naturopathie',
    name: 'Naturopathie',
    nameWithArticle: 'la naturopathie',
    ctaLabel: 'un/e naturopathe',
    icon: '🌿',
    shortDescription: 'Approche globale qui utilise les ressources naturelles pour rééquilibrer l\'organisme',
    heroImage: '/images/AdobeStock_336398199.jpeg',
    heroTagline: 'Retrouvez votre équilibre naturel',
    count: '+150',
    duration: '1 heure à 1h30',
    definitionImage: '/images/AdobeStock_243765470.jpeg',
    definitionText: [
      'La naturopathie est une approche holistique de la santé qui utilise les ressources naturelles — alimentation, plantes, techniques de relaxation — pour rééquilibrer l\'organisme.',
      'Elle s\'appuie sur la capacité naturelle du corps à s\'autoguérir et vise à identifier et corriger les causes profondes des déséquilibres de santé.'
    ],
    conditions: ['Fatigue chronique', 'Troubles digestifs', 'Problèmes de peau', 'Anxiété et stress', 'Troubles du sommeil', 'Déséquilibres hormonaux', 'Surpoids'],
    mosaicImage1: '/images/AdobeStock_160757465.jpeg',
    mosaicImage2: '/images/AdobeStock_171835155.jpeg',
    mosaicImage2Tagline: 'Retrouvez votre vitalité',
    mosaicImage3: '/images/AdobeStock_33920024.jpeg',
    steps: [
      { title: 'Bilan de santé global', description: 'Le naturopathe évalue votre état de santé global : alimentation, sommeil, stress, antécédents familiaux.' },
      { title: 'Analyse des habitudes', description: 'Identification des facteurs déséquilibrants dans votre mode de vie quotidien.' },
      { title: 'Programme naturel', description: 'Mise en place d\'un protocole personnalisé : nutrition, plantes, techniques de détox et exercices.' },
      { title: 'Suivi et ajustements', description: 'Un accompagnement régulier pour adapter le programme à vos progrès et besoins évolutifs.' }
    ],
    benefits: [
      'Rééquilibre naturel et durable de l\'organisme',
      'Prévention des maladies chroniques',
      'Amélioration du sommeil et de l\'énergie',
      'Gestion du stress et des émotions',
      'Accompagnement nutritionnel personnalisé',
      'Soutien du système immunitaire'
    ],
    seo: {
      title: 'Naturopathie — Trouvez un naturopathe près de chez vous | Léya',
      description: 'Découvrez la naturopathie sur Léya. Approche naturelle et holistique pour rééquilibrer votre organisme. Trouvez un naturopathe qualifié et prenez rendez-vous facilement.'
    }
  },
  {
    slug: 'sophrologie',
    name: 'Sophrologie',
    nameWithArticle: 'la sophrologie',
    ctaLabel: 'un/e sophrologue',
    icon: '🧘',
    shortDescription: 'Méthode psychocorporelle qui harmonise le corps et l\'esprit',
    heroImage: '/images/hero-section.jpeg',
    heroTagline: 'Harmonisez votre corps et votre esprit',
    count: '+180',
    duration: '1 heure',
    definitionImage: '/images/AdobeStock_519549071.jpeg',
    definitionText: [
      'La sophrologie est une méthode psychocorporelle qui utilise des exercices de relaxation, de respiration et de visualisation positive pour harmoniser le corps et l\'esprit.',
      'Elle permet de développer une meilleure conscience de soi et d\'acquérir des outils concrets pour gérer le stress, les émotions et les défis du quotidien.'
    ],
    conditions: ['Stress et anxiété', 'Troubles du sommeil', 'Manque de confiance', 'Phobies', 'Douleurs chroniques', 'Préparation aux examens', 'Burn-out'],
    mosaicImage1: '/images/AdobeStock_550036958.jpeg',
    mosaicImage2: '/images/women-phone.jpeg',
    mosaicImage2Tagline: 'Trouvez votre sérénité',
    mosaicImage3: '/images/AdobeStock_329541430.jpeg',
    steps: [
      { title: 'Entretien initial', description: 'Le sophrologue identifie vos besoins, objectifs et définit avec vous le protocole adapté.' },
      { title: 'Relaxation guidée', description: 'Des exercices de respiration et de détente musculaire pour atteindre un état de calme profond.' },
      { title: 'Sophronisation', description: 'Visualisations positives et techniques mentales pour ancrer de nouvelles ressources intérieures.' },
      { title: 'Ancrage et autonomie', description: 'Vous repartez avec des exercices à pratiquer seul pour maintenir les bénéfices au quotidien.' }
    ],
    benefits: [
      'Gestion efficace du stress et de l\'anxiété',
      'Amélioration significative de la qualité du sommeil',
      'Renforcement de la confiance et de l\'estime de soi',
      'Préparation mentale aux défis importants',
      'Soulagement des douleurs et tensions chroniques',
      'Meilleure connaissance et acceptation de soi'
    ],
    seo: {
      title: 'Sophrologie — Trouvez un sophrologue près de chez vous | Léya',
      description: 'Découvrez la sophrologie sur Léya. Gérez votre stress, améliorez votre sommeil et renforcez votre confiance. Trouvez un sophrologue qualifié et prenez rendez-vous facilement.'
    }
  },
  {
    slug: 'acupuncture',
    name: 'Acupuncture',
    nameWithArticle: "l'acupuncture",
    ctaLabel: 'un/e acupuncteur',
    icon: '✨',
    shortDescription: 'Médecine traditionnelle chinoise qui rééquilibre les énergies vitales du corps',
    heroImage: '/images/medicine-3.jpeg',
    heroTagline: 'Rééquilibrez votre énergie vitale',
    count: '+120',
    duration: '45 min à 1 heure',
    definitionImage: '/images/AdobeStock_171835155.jpeg',
    definitionText: [
      'L\'acupuncture est une pratique de la médecine traditionnelle chinoise qui consiste à stimuler des points précis du corps à l\'aide de fines aiguilles pour rétablir la circulation de l\'énergie vitale.',
      'Reconnue par l\'OMS pour de nombreuses indications, elle agit en profondeur sur le corps et l\'esprit pour restaurer un équilibre durable.'
    ],
    conditions: ['Douleurs chroniques', 'Migraines', 'Troubles digestifs', 'Anxiété et dépression', 'Troubles du sommeil', 'Problèmes gynécologiques', 'Arrêt du tabac'],
    mosaicImage1: '/images/AdobeStock_160757465.jpeg',
    mosaicImage2: '/images/AdobeStock_243765470.jpeg',
    mosaicImage2Tagline: 'Libérez votre énergie',
    mosaicImage3: '/images/AdobeStock_33920024.jpeg',
    steps: [
      { title: 'Diagnostic traditionnel', description: 'L\'acupuncteur évalue votre état de santé selon les principes de la médecine traditionnelle chinoise.' },
      { title: 'Identification des méridiens', description: 'Les déséquilibres énergétiques et les points à traiter sont identifiés avec précision.' },
      { title: 'Pose des aiguilles', description: 'Des aiguilles très fines, stériles et indolores sont placées sur les points thérapeutiques sélectionnés.' },
      { title: 'Rééquilibrage énergétique', description: 'Un moment de repos laisse l\'énergie circuler librement et les effets thérapeutiques s\'installer.' }
    ],
    benefits: [
      'Soulagement durable des douleurs chroniques',
      'Régulation du système nerveux et émotionnel',
      'Amélioration du sommeil et de la vitalité',
      'Soutien du système immunitaire',
      'Gestion du stress, de l\'anxiété et des troubles digestifs',
      'Reconnue par l\'Organisation Mondiale de la Santé'
    ],
    seo: {
      title: 'Acupuncture — Trouvez un acupuncteur près de chez vous | Léya',
      description: 'Découvrez l\'acupuncture sur Léya. Médecine traditionnelle chinoise reconnue par l\'OMS. Trouvez un acupuncteur qualifié pour soulager vos douleurs et rééquilibrer votre énergie.'
    }
  },
  {
    slug: 'hypnotherapie',
    name: 'Hypnothérapie',
    nameWithArticle: "l'hypnothérapie",
    ctaLabel: 'un/e hypnothérapeute',
    icon: '🌀',
    shortDescription: 'Thérapie brève qui utilise l\'état d\'hypnose pour accéder aux ressources inconscientes',
    heroImage: '/images/women-hypno.jpg',
    heroTagline: 'Libérez votre potentiel intérieur',
    count: '+90',
    duration: '1 heure à 1h30',
    definitionImage: '/images/hero-section-2.jpeg',
    definitionText: [
      'L\'hypnothérapie est une thérapie brève qui utilise l\'état naturel d\'hypnose — une conscience modifiée entre veille et sommeil — pour accéder aux ressources de l\'inconscient et faciliter des changements profonds.',
      'Contrairement aux idées reçues, vous restez pleinement conscient et en contrôle pendant toute la séance. L\'hypnose est un état naturel que nous expérimentons tous quotidiennement.'
    ],
    conditions: ['Phobies et peurs', 'Arrêt du tabac', 'Troubles anxieux', 'Manque de confiance', 'Gestion de la douleur', 'Traumatismes', 'Troubles alimentaires'],
    mosaicImage1: '/images/AdobeStock_317007907.jpeg',
    mosaicImage2: '/images/AdobeStock_452334355.jpeg',
    mosaicImage2Tagline: 'Accédez à vos ressources',
    mosaicImage3: '/images/AdobeStock_550036958.jpeg',
    steps: [
      { title: 'Entretien motivationnel', description: 'L\'hypnothérapeute comprend vos objectifs et installe un cadre de confiance et de sécurité.' },
      { title: 'Induction hypnotique', description: 'Un état de relaxation profonde est induit à travers des techniques de guidage progressif.' },
      { title: 'Travail thérapeutique', description: 'Des suggestions positives et des techniques adaptées agissent sur les schémas inconscients à modifier.' },
      { title: 'Retour et ancrage', description: 'Un retour en pleine conscience et des techniques d\'ancrage renforcent les changements positifs.' }
    ],
    benefits: [
      'Libération des peurs, phobies et blocages inconscients',
      'Aide efficace à l\'arrêt du tabac et aux addictions',
      'Gestion profonde du stress et de l\'anxiété',
      'Amélioration de la confiance et de l\'estime de soi',
      'Traitement des traumatismes et deuils',
      'Résultats souvent visibles dès la première séance'
    ],
    seo: {
      title: 'Hypnothérapie — Trouvez un hypnothérapeute près de chez vous | Léya',
      description: 'Découvrez l\'hypnothérapie sur Léya. Thérapie brève et efficace pour surmonter vos peurs, arrêter de fumer ou gérer votre stress. Trouvez un hypnothérapeute qualifié facilement.'
    }
  },
  {
    slug: 'massage',
    name: 'Massage bien-être',
    nameWithArticle: 'le massage bien-être',
    ctaLabel: 'un/e thérapeute',
    icon: '🤲',
    shortDescription: 'Thérapie manuelle qui détend le corps et apaise l\'esprit en profondeur',
    heroImage: '/images/medicines-1.jpeg',
    heroTagline: 'Offrez-vous un moment de détente',
    count: '+300',
    duration: '45 min à 1h30',
    definitionImage: '/images/AdobeStock_33920024.jpeg',
    definitionText: [
      'Le massage bien-être est une pratique thérapeutique qui utilise des techniques manuelles variées pour détendre les muscles, améliorer la circulation et libérer les tensions physiques et mentales accumulées.',
      'Bien plus qu\'une simple relaxation, le massage agit en profondeur sur le système nerveux, favorisant un état de bien-être durable et une meilleure récupération de l\'organisme.'
    ],
    conditions: ['Tensions musculaires', 'Stress et anxiété', 'Douleurs dorsales', 'Fatigue chronique', 'Troubles du sommeil', 'Récupération sportive', 'Circulation sanguine'],
    mosaicImage1: '/images/AdobeStock_519549071.jpeg',
    mosaicImage2: '/images/AdobeStock_550036958.jpeg',
    mosaicImage2Tagline: 'Détente et récupération',
    mosaicImage3: '/images/AdobeStock_336398199.jpeg',
    steps: [
      { title: 'Accueil et écoute', description: 'Le thérapeute identifie vos zones de tension, vos besoins et adapte la technique au protocole idéal.' },
      { title: 'Préparation', description: 'Installation confortable sur la table de massage dans une ambiance propice à la détente totale.' },
      { title: 'Massage personnalisé', description: 'Application des techniques adaptées : effleurage, pétrissage, points de pression selon les besoins.' },
      { title: 'Conseils post-séance', description: 'Recommandations pour prolonger les bienfaits : hydratation, étirements, fréquence des séances.' }
    ],
    benefits: [
      'Décontraction musculaire profonde et durable',
      'Amélioration de la circulation sanguine et lymphatique',
      'Réduction significative du stress et de l\'anxiété',
      'Soulagement des douleurs chroniques',
      'Amélioration de la qualité du sommeil',
      'Boost de l\'énergie et de la vitalité'
    ],
    seo: {
      title: 'Massage bien-être — Trouvez un masseur près de chez vous | Léya',
      description: 'Découvrez les massages bien-être sur Léya. Détente, récupération et soulagement des douleurs. Trouvez un thérapeute qualifié près de chez vous et réservez en ligne.'
    }
  }
]

export function getMedecineBySlug(slug: string): Medecine | undefined {
  return medecines.find(m => m.slug === slug)
}
