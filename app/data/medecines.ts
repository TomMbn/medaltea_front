export interface Medecine {
  slug: string
  name: string
  nameWithArticle: string
  ctaLabel: string
  icon: string
  shortDescription: string
  heroImage: string
  heroTagline: string
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
    shortDescription: 'Pratique manuelle qui s\'intéresse à la mobilité du corps',
    heroImage: '/images/medicine-5.jpeg',
    heroTagline: 'Gagnez en mobilité',
    duration: '45 min à 1 heure',
    definitionImage: '/images/AdobeStock_452334355.jpeg',
    definitionText: [
      'L\'ostéopathie est une pratique manuelle qui vise à améliorer la mobilité du corps en travaillant sur les tensions et les restrictions de mouvement.',
      'À travers des manipulations douces, elle peut aider à relâcher les tensions et à soulager certaines gênes.'
    ],
    conditions: ['Douleurs de dos', 'Tensions musculaires', 'Maux de tête', 'Gênes digestives', 'Douleurs articulaires', 'Stress et fatigue'],
    mosaicImage1: '/images/AdobeStock_313373132.jpeg',
    mosaicImage2: '/images/AdobeStock_317007907.jpeg',
    mosaicImage2Tagline: 'Gagnez en mobilité',
    mosaicImage3: '/images/AdobeStock_329541430.jpeg',
    steps: [
      { title: 'Consultation initiale', description: 'Vous échangez avec le praticien sur vos douleurs, votre mode de vie et vos antécédents.' },
      { title: 'Analyse du corps', description: 'L\'ostéopathe observe votre posture, vos mouvements et identifie les zones de tension.' },
      { title: 'Manipulations', description: 'Des techniques manuelles adaptées sont réalisées pour relâcher les tensions et retrouver de la mobilité.' },
      { title: 'Conseils personnalisés', description: 'Vous repartez avec des recommandations pour prolonger les effets de la séance.' }
    ],
    benefits: [
      'Peut aider à soulager les douleurs musculaires et articulaires',
      'Peut contribuer à une meilleure mobilité et posture',
      'Peut aider à relâcher les tensions liées au stress',
      'Peut accompagner la récupération sportive',
      'Peut contribuer au bien-être général'
    ],
    seo: {
      title: 'Ostéopathie — Trouvez un ostéopathe près de chez vous | Léya',
      description: 'Découvrez l\'ostéopathie sur Léya : en quoi elle consiste, le déroulé d\'une séance, et trouvez un ostéopathe près de chez vous pour prendre rendez-vous en ligne.'
    }
  },
  {
    slug: 'naturopathie',
    name: 'Naturopathie',
    nameWithArticle: 'la naturopathie',
    ctaLabel: 'un/e naturopathe',
    icon: '🌿',
    shortDescription: 'Approche globale centrée sur l\'hygiène de vie : alimentation, plantes, gestion du stress',
    heroImage: '/images/AdobeStock_336398199.jpeg',
    heroTagline: 'Prenez soin de votre hygiène de vie',
    duration: '1 heure à 1h30',
    definitionImage: '/images/AdobeStock_243765470.jpeg',
    definitionText: [
      'La naturopathie est une approche globale de l\'hygiène de vie qui utilise des ressources naturelles — alimentation, plantes, techniques de relaxation — pour accompagner le bien-être au quotidien.',
      'Elle part de vos habitudes de vie (alimentation, sommeil, activité, stress) pour proposer des conseils d\'hygiène de vie personnalisés, en complément d\'un suivi médical.'
    ],
    conditions: ['Fatigue', 'Gênes digestives', 'Alimentation', 'Stress', 'Sommeil', 'Équilibre alimentaire', 'Hygiène de vie'],
    mosaicImage1: '/images/AdobeStock_160757465.jpeg',
    mosaicImage2: '/images/AdobeStock_171835155.jpeg',
    mosaicImage2Tagline: 'Une approche au quotidien',
    mosaicImage3: '/images/AdobeStock_33920024.jpeg',
    steps: [
      { title: 'Bilan de santé global', description: 'Le naturopathe évalue votre état de santé global : alimentation, sommeil, stress, antécédents familiaux.' },
      { title: 'Analyse des habitudes', description: 'Repérage des habitudes de votre quotidien qui peuvent être ajustées.' },
      { title: 'Programme naturel', description: 'Mise en place d\'un programme personnalisé : conseils nutritionnels, plantes, techniques de relaxation et exercices.' },
      { title: 'Suivi et ajustements', description: 'Un accompagnement régulier pour adapter les conseils à votre rythme et à vos besoins.' }
    ],
    benefits: [
      'Un accompagnement personnalisé sur l\'hygiène de vie',
      'Des conseils nutritionnels adaptés à votre situation',
      'Des pistes pour mieux gérer le stress',
      'Des habitudes à construire pour le sommeil et l\'énergie',
      'Un suivi à votre rythme'
    ],
    seo: {
      title: 'Naturopathie — Trouvez un naturopathe près de chez vous | Léya',
      description: 'Découvrez la naturopathie sur Léya : une approche d\'hygiène de vie (alimentation, plantes, gestion du stress). Trouvez un naturopathe près de chez vous et prenez rendez-vous en ligne.'
    }
  },
  {
    slug: 'sophrologie',
    name: 'Sophrologie',
    nameWithArticle: 'la sophrologie',
    ctaLabel: 'un/e sophrologue',
    icon: '🧘',
    shortDescription: 'Méthode de relaxation, de respiration et de visualisation',
    heroImage: '/images/hero-section.jpeg',
    heroTagline: 'Apprenez à mieux vous détendre',
    duration: '1 heure',
    definitionImage: '/images/AdobeStock_519549071.jpeg',
    definitionText: [
      'La sophrologie est une méthode psychocorporelle qui utilise des exercices de relaxation, de respiration et de visualisation positive pour favoriser la détente du corps et de l\'esprit.',
      'Elle propose des outils concrets, à pratiquer seul, pour mieux gérer le stress, les émotions et les défis du quotidien.'
    ],
    conditions: ['Stress', 'Sommeil', 'Confiance en soi', 'Peurs du quotidien', 'Gestion de la douleur au quotidien', 'Préparation aux examens', 'Fatigue et surmenage'],
    mosaicImage1: '/images/AdobeStock_550036958.jpeg',
    mosaicImage2: '/images/women-phone.jpeg',
    mosaicImage2Tagline: 'Des outils pour le quotidien',
    mosaicImage3: '/images/AdobeStock_329541430.jpeg',
    steps: [
      { title: 'Entretien initial', description: 'Le sophrologue identifie vos besoins, objectifs et définit avec vous le protocole adapté.' },
      { title: 'Relaxation guidée', description: 'Des exercices de respiration et de détente musculaire pour favoriser un état de calme.' },
      { title: 'Sophronisation', description: 'Visualisations positives et techniques mentales pour ancrer de nouvelles ressources intérieures.' },
      { title: 'Ancrage et autonomie', description: 'Vous repartez avec des exercices à pratiquer seul pour maintenir les bénéfices au quotidien.' }
    ],
    benefits: [
      'Des outils pour mieux gérer le stress',
      'Des exercices pour favoriser l\'endormissement',
      'Un soutien pour gagner en confiance',
      'Une préparation mentale avant une échéance importante',
      'Des techniques de détente face aux tensions du quotidien',
      'Une meilleure connaissance de soi'
    ],
    seo: {
      title: 'Sophrologie — Trouvez un sophrologue près de chez vous | Léya',
      description: 'Découvrez la sophrologie sur Léya : relaxation, respiration, visualisation. Trouvez un sophrologue près de chez vous et prenez rendez-vous en ligne.'
    }
  },
  {
    slug: 'acupuncture',
    name: 'Acupuncture',
    nameWithArticle: "l'acupuncture",
    ctaLabel: 'un/e acupuncteur',
    icon: '✨',
    shortDescription: 'Pratique issue de la médecine traditionnelle chinoise, qui utilise de fines aiguilles',
    heroImage: '/images/medicine-3.jpeg',
    heroTagline: 'Une pratique issue de la tradition chinoise',
    duration: '45 min à 1 heure',
    definitionImage: '/images/AdobeStock_171835155.jpeg',
    definitionText: [
      'L\'acupuncture est une pratique de la médecine traditionnelle chinoise qui consiste à stimuler des points précis du corps à l\'aide de fines aiguilles. Selon cette tradition, cela vise à rétablir la circulation de l\'énergie vitale.',
      'Elle est souvent utilisée en complément d\'un suivi médical, par exemple face à des douleurs ou à du stress. Parlez-en à votre médecin si vous suivez un traitement.'
    ],
    conditions: ['Douleurs', 'Maux de tête', 'Gênes digestives', 'Stress', 'Sommeil', 'Accompagnement pour arrêter de fumer'],
    mosaicImage1: '/images/AdobeStock_160757465.jpeg',
    mosaicImage2: '/images/AdobeStock_243765470.jpeg',
    mosaicImage2Tagline: 'Une pratique ancestrale',
    mosaicImage3: '/images/AdobeStock_33920024.jpeg',
    steps: [
      { title: 'Diagnostic traditionnel', description: 'L\'acupuncteur évalue votre état de santé selon les principes de la médecine traditionnelle chinoise.' },
      { title: 'Identification des méridiens', description: 'Selon la tradition chinoise, l\'acupuncteur repère les points à stimuler.' },
      { title: 'Pose des aiguilles', description: 'Des aiguilles très fines et stériles à usage unique sont placées sur les points choisis. La sensation varie selon les personnes.' },
      { title: 'Temps de repos', description: 'Un moment de repos, aiguilles en place, avant leur retrait.' }
    ],
    benefits: [
      'Peut aider à soulager certaines douleurs',
      'Peut accompagner la gestion du stress',
      'Peut contribuer à un meilleur sommeil',
      'Une pratique souvent associée à un suivi médical'
    ],
    seo: {
      title: 'Acupuncture — Trouvez un acupuncteur près de chez vous | Léya',
      description: 'Découvrez l\'acupuncture sur Léya : une pratique issue de la médecine traditionnelle chinoise. Trouvez un acupuncteur près de chez vous et prenez rendez-vous en ligne.'
    }
  },
  {
    slug: 'hypnotherapie',
    name: 'Hypnothérapie',
    nameWithArticle: "l'hypnothérapie",
    ctaLabel: 'un/e hypnothérapeute',
    icon: '🌀',
    shortDescription: 'Accompagnement qui utilise l\'état d\'hypnose pour travailler sur ses habitudes et ses émotions',
    heroImage: '/images/women-hypno.jpg',
    heroTagline: 'Un accompagnement par l\'hypnose',
    duration: '1 heure à 1h30',
    definitionImage: '/images/hero-section-2.jpeg',
    definitionText: [
      'L\'hypnothérapie est un accompagnement qui utilise l\'état naturel d\'hypnose — une conscience modifiée entre veille et sommeil — pour accompagner un changement d\'habitude, la gestion d\'une émotion ou d\'une peur.',
      'Contrairement aux idées reçues, vous restez conscient et en contrôle pendant la séance.'
    ],
    conditions: ['Peurs du quotidien', 'Accompagnement pour arrêter de fumer', 'Stress', 'Confiance en soi', 'Gestion de la douleur au quotidien', 'Habitudes alimentaires'],
    mosaicImage1: '/images/AdobeStock_317007907.jpeg',
    mosaicImage2: '/images/AdobeStock_452334355.jpeg',
    mosaicImage2Tagline: 'Un état de détente guidée',
    mosaicImage3: '/images/AdobeStock_550036958.jpeg',
    steps: [
      { title: 'Entretien motivationnel', description: 'L\'hypnothérapeute comprend vos objectifs et installe un cadre de confiance et de sécurité.' },
      { title: 'Induction hypnotique', description: 'Un état de relaxation profonde est induit à travers des techniques de guidage progressif.' },
      { title: 'Séance d\'accompagnement', description: 'Des suggestions positives et des techniques adaptées pour accompagner le changement souhaité.' },
      { title: 'Retour et ancrage', description: 'Un retour en pleine conscience et des techniques d\'ancrage renforcent les changements positifs.' }
    ],
    benefits: [
      'Un accompagnement face aux peurs du quotidien',
      'Un soutien dans une démarche d\'arrêt du tabac',
      'Des outils pour mieux gérer le stress',
      'Un appui pour la confiance en soi',
      'Un accompagnement personnalisé, à votre rythme'
    ],
    seo: {
      title: 'Hypnothérapie — Trouvez un hypnothérapeute près de chez vous | Léya',
      description: 'Découvrez l\'hypnothérapie sur Léya : en quoi consiste une séance et ce qu\'elle peut accompagner. Trouvez un hypnothérapeute près de chez vous et prenez rendez-vous en ligne.'
    }
  },
  {
    slug: 'massage',
    name: 'Massage bien-être',
    nameWithArticle: 'le massage bien-être',
    ctaLabel: 'un/e thérapeute',
    icon: '🤲',
    shortDescription: 'Massage de détente qui s\'adresse au corps et à l\'esprit',
    heroImage: '/images/medicines-1.jpeg',
    heroTagline: 'Offrez-vous un moment de détente',
    duration: '45 min à 1h30',
    definitionImage: '/images/AdobeStock_33920024.jpeg',
    definitionText: [
      'Le massage bien-être est une pratique de détente qui utilise des techniques manuelles variées pour relâcher les muscles et les tensions accumulées.',
      'Un massage bien-être n\'a pas de visée médicale : c\'est un moment de détente qui peut contribuer au bien-être et à la récupération.'
    ],
    conditions: ['Tensions musculaires', 'Stress', 'Raideurs du dos', 'Fatigue', 'Sommeil', 'Récupération sportive', 'Détente'],
    mosaicImage1: '/images/AdobeStock_519549071.jpeg',
    mosaicImage2: '/images/AdobeStock_550036958.jpeg',
    mosaicImage2Tagline: 'Détente et récupération',
    mosaicImage3: '/images/AdobeStock_336398199.jpeg',
    steps: [
      { title: 'Accueil et écoute', description: 'Le thérapeute identifie vos zones de tension, vos besoins et adapte la technique à votre demande.' },
      { title: 'Préparation', description: 'Installation confortable sur la table de massage dans une ambiance propice à la détente totale.' },
      { title: 'Massage personnalisé', description: 'Application des techniques adaptées : effleurage, pétrissage, points de pression selon les besoins.' },
      { title: 'Conseils post-séance', description: 'Recommandations pour prolonger les bienfaits : hydratation, étirements, fréquence des séances.' }
    ],
    benefits: [
      'Un moment de détente musculaire',
      'Une sensation de légèreté après la séance',
      'Un temps pour relâcher le stress',
      'Peut contribuer à un meilleur sommeil',
      'Un accompagnement de la récupération après l\'effort'
    ],
    seo: {
      title: 'Massage bien-être — Trouvez un masseur près de chez vous | Léya',
      description: 'Découvrez les massages bien-être sur Léya : détente et récupération. Trouvez un praticien près de chez vous et réservez en ligne.'
    }
  }
]

export function getMedecineBySlug(slug: string): Medecine | undefined {
  return medecines.find(m => m.slug === slug)
}
