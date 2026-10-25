export interface Medecine {
  slug: string
  name: string
  nameWithArticle: string
  ctaLabel: string
  /** Pictogramme de la médecine (image dans public/icons) */
  icon: string
  shortDescription: string
  heroImage: string
  heroTagline: string
  /** Phrase d'accroche sous le titre (par défaut : shortDescription) */
  heroLead?: string
  /** Pastilles du hero (par défaut : les premiers motifs de consultation) */
  heroChips?: { label: string; icon: 'wind' | 'moon' | 'heart' | 'info' | 'activity' | 'leaf' }[]
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
    icon: '/icons/osteopathie.png',
    shortDescription: 'Pratique manuelle qui s\'intéresse à la mobilité du corps',
    heroImage: '/images/medecines/osteopathie/hero.webp',
    heroTagline: 'Retrouver sa mobilité avec l’',
    heroLead: 'Pratique manuelle douce pour mieux comprendre les tensions du corps, soulager les gênes du quotidien et bouger plus librement.',
    heroChips: [
      { label: 'Douleurs de dos', icon: 'activity' },
      { label: 'Tensions musculaires', icon: 'activity' },
      { label: 'Maux de tête', icon: 'info' },
      { label: 'Stress et fatigue', icon: 'wind' }
    ],
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
      title: 'Ostéopathie : trouver un ostéopathe près de vous | Léya',
      description: 'Découvrez l\'ostéopathie sur Léya : en quoi elle consiste, le déroulé d\'une séance, et trouvez un ostéopathe près de chez vous pour prendre rendez-vous en ligne.'
    }
  },
  {
    slug: 'naturopathie',
    name: 'Naturopathie',
    nameWithArticle: 'la naturopathie',
    ctaLabel: 'un/e naturopathe',
    icon: '/icons/naturopathie.png',
    shortDescription: 'Approche globale centrée sur l\'hygiène de vie : alimentation, plantes, gestion du stress',
    heroImage: '/images/AdobeStock_336398199.jpeg',
    heroTagline: 'Prendre soin de soi avec la',
    heroLead: 'Une approche globale centrée sur l’hygiène de vie : alimentation, plantes et gestion du stress, pour mieux vous écouter au quotidien.',
    heroChips: [
      { label: 'Fatigue', icon: 'moon' },
      { label: 'Gênes digestives', icon: 'leaf' },
      { label: 'Alimentation', icon: 'leaf' },
      { label: 'Stress', icon: 'wind' }
    ],
    duration: '1 heure à 1h30',
    definitionImage: '/images/medecines/naturopathie/definition.webp',
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
      title: 'Naturopathie : trouver un naturopathe près de vous | Léya',
      description: 'Découvrez la naturopathie sur Léya : une approche d\'hygiène de vie (alimentation, plantes, gestion du stress). Trouvez un naturopathe près de chez vous et prenez rendez-vous en ligne.'
    }
  },
  {
    slug: 'sophrologie',
    name: 'Sophrologie',
    nameWithArticle: 'la sophrologie',
    ctaLabel: 'un/e sophrologue',
    icon: '/icons/sophrologie.png',
    shortDescription: 'Méthode de relaxation, de respiration et de visualisation',
    heroImage: '/images/medecines/sophrologie/hero.webp',
    heroTagline: 'Apaiser le corps et l’esprit avec la',
    heroLead: 'Respiration, relaxation et visualisation : une méthode douce pour mieux gérer le stress, le sommeil et les émotions.',
    heroChips: [
      { label: 'Stress', icon: 'wind' },
      { label: 'Sommeil', icon: 'moon' },
      { label: 'Anxiété', icon: 'heart' },
      { label: 'Concentration', icon: 'info' }
    ],
    duration: '45 min à 1 heure',
    definitionImage: '/images/AdobeStock_519549071.jpeg',
    definitionText: [
      'La sophrologie est une méthode psychocorporelle qui utilise des exercices de relaxation, de respiration et de visualisation positive pour favoriser la détente du corps et de l\'esprit.',
      'Elle propose des outils concrets, à pratiquer seul, pour mieux gérer le stress, les émotions et les défis du quotidien.'
    ],
    conditions: ['Stress', 'Sommeil', 'Confiance en soi', 'Peurs du quotidien', 'Gestion de la douleur au quotidien', 'Préparation aux examens', 'Fatigue et surmenage'],
    mosaicImage1: '/images/medecines/sophrologie/mosaique-1.webp',
    mosaicImage2: '/images/medecines/sophrologie/mosaique-2.webp',
    mosaicImage2Tagline: 'Retrouvez le calme',
    mosaicImage3: '/images/medecines/sophrologie/mosaique-3.webp',
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
      title: 'Sophrologie : trouver un sophrologue près de vous | Léya',
      description: 'Découvrez la sophrologie sur Léya : relaxation, respiration, visualisation. Trouvez un sophrologue près de chez vous et prenez rendez-vous en ligne.'
    }
  },
  {
    slug: 'acupuncture',
    name: 'Acupuncture',
    nameWithArticle: "l'acupuncture",
    ctaLabel: 'un/e acupuncteur',
    icon: '/icons/acupuncture.png',
    shortDescription: 'Pratique issue de la médecine traditionnelle chinoise, qui utilise de fines aiguilles',
    heroImage: '/images/medecines/acupuncture/hero.webp',
    heroTagline: 'Une pratique traditionnelle : l’',
    heroLead: 'Pratique issue de la médecine traditionnelle chinoise, qui utilise de fines aiguilles pour accompagner le bien-être au quotidien.',
    heroChips: [
      { label: 'Douleurs', icon: 'activity' },
      { label: 'Maux de tête', icon: 'info' },
      { label: 'Stress', icon: 'wind' },
      { label: 'Sommeil', icon: 'moon' }
    ],
    duration: '45 min à 1 heure',
    definitionImage: '/images/medecines/acupuncture/definition.webp',
    definitionText: [
      'L\'acupuncture est une pratique de la médecine traditionnelle chinoise qui consiste à stimuler des points précis du corps à l\'aide de fines aiguilles. Selon cette tradition, cela vise à rétablir la circulation de l\'énergie vitale.',
      'Elle est souvent utilisée en complément d\'un suivi médical, par exemple face à des douleurs ou à du stress. Parlez-en à votre médecin si vous suivez un traitement.'
    ],
    conditions: ['Douleurs', 'Maux de tête', 'Gênes digestives', 'Stress', 'Sommeil', 'Accompagnement pour arrêter de fumer'],
    mosaicImage1: '/images/medecines/acupuncture/mosaique-1.webp',
    mosaicImage2: '/images/medecines/acupuncture/mosaique-2.webp',
    mosaicImage2Tagline: 'Une pratique ancestrale',
    mosaicImage3: '/images/medecines/acupuncture/mosaique-3.webp',
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
      title: 'Acupuncture : trouver un acupuncteur près de vous | Léya',
      description: 'Découvrez l\'acupuncture sur Léya : une pratique issue de la médecine traditionnelle chinoise. Trouvez un acupuncteur près de chez vous et prenez rendez-vous en ligne.'
    }
  },
  {
    slug: 'hypnotherapie',
    name: 'Hypnothérapie',
    nameWithArticle: "l'hypnothérapie",
    ctaLabel: 'un/e hypnothérapeute',
    icon: '/icons/hypnotherapie.png',
    shortDescription: 'Accompagnement qui utilise l\'état d\'hypnose pour travailler sur ses habitudes et ses émotions',
    heroImage: '/images/medecines/hypnotherapie/hero.webp',
    heroTagline: 'Se recentrer avec l’',
    heroLead: 'Un accompagnement qui utilise l’état d’hypnose pour travailler sur ses habitudes, ses émotions et sa confiance en soi.',
    heroChips: [
      { label: 'Stress', icon: 'wind' },
      { label: 'Confiance en soi', icon: 'heart' },
      { label: 'Peurs du quotidien', icon: 'heart' },
      { label: 'Habitudes alimentaires', icon: 'leaf' }
    ],
    duration: '1 heure à 1h30',
    definitionImage: '/images/medecines/hypnotherapie/definition.webp',
    definitionText: [
      'L\'hypnothérapie est un accompagnement qui utilise l\'état naturel d\'hypnose — une conscience modifiée entre veille et sommeil — pour accompagner un changement d\'habitude, la gestion d\'une émotion ou d\'une peur.',
      'Contrairement aux idées reçues, vous restez conscient et en contrôle pendant la séance.'
    ],
    conditions: ['Peurs du quotidien', 'Accompagnement pour arrêter de fumer', 'Stress', 'Confiance en soi', 'Gestion de la douleur au quotidien', 'Habitudes alimentaires'],
    mosaicImage1: '/images/medecines/hypnotherapie/mosaique-1.webp',
    mosaicImage2: '/images/medecines/hypnotherapie/mosaique-2.webp',
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
      title: 'Hypnothérapie : trouver un hypnothérapeute | Léya',
      description: 'Découvrez l\'hypnothérapie sur Léya : en quoi consiste une séance et ce qu\'elle peut accompagner. Trouvez un hypnothérapeute près de chez vous et prenez rendez-vous en ligne.'
    }
  },
  {
    slug: 'massage',
    name: 'Massage bien-être',
    nameWithArticle: 'le massage bien-être',
    ctaLabel: 'un/e thérapeute',
    icon: '/icons/massage.png',
    shortDescription: 'Massage de détente qui s\'adresse au corps et à l\'esprit',
    heroImage: '/images/medecines/massage/hero.webp',
    heroTagline: 'Un moment de détente avec le',
    heroLead: 'Un massage de détente qui s’adresse au corps et à l’esprit, pour relâcher les tensions et prendre un vrai temps pour soi.',
    heroChips: [
      { label: 'Tensions musculaires', icon: 'activity' },
      { label: 'Stress', icon: 'wind' },
      { label: 'Fatigue', icon: 'moon' },
      { label: 'Raideurs du dos', icon: 'activity' }
    ],
    duration: '45 min à 1h30',
    definitionImage: '/images/medecines/massage/definition.webp',
    definitionText: [
      'Le massage bien-être est une pratique de détente qui utilise des techniques manuelles variées pour relâcher les muscles et les tensions accumulées.',
      'Un massage bien-être n\'a pas de visée médicale : c\'est un moment de détente qui peut contribuer au bien-être et à la récupération.'
    ],
    conditions: ['Tensions musculaires', 'Stress', 'Raideurs du dos', 'Fatigue', 'Sommeil', 'Récupération sportive', 'Détente'],
    mosaicImage1: '/images/medecines/massage/mosaique-1.webp',
    mosaicImage2: '/images/medecines/massage/mosaique-2.webp',
    mosaicImage2Tagline: 'Détente et récupération',
    mosaicImage3: '/images/medecines/massage/mosaique-3.webp',
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
      title: 'Massage bien-être : trouver un praticien près de vous | Léya',
      description: 'Découvrez les massages bien-être sur Léya : détente et récupération. Trouvez un praticien près de chez vous et réservez en ligne.'
    }
  },
  {
    slug: 'reflexologie',
    name: 'Réflexologie',
    nameWithArticle: 'la réflexologie',
    ctaLabel: 'un/e réflexologue',
    icon: '/icons/reflexologie.svg',
    shortDescription: 'Pressions douces sur des zones des pieds, des mains ou du visage',
    heroImage: '/images/medecines/reflexologie/hero.webp',
    heroTagline: 'Se détendre en profondeur avec la',
    heroLead: 'Des pressions douces sur les pieds, les mains ou le visage, pour relâcher les tensions et s’offrir un vrai temps de détente.',
    heroChips: [
      { label: 'Stress', icon: 'wind' },
      { label: 'Sommeil', icon: 'moon' },
      { label: 'Fatigue', icon: 'moon' },
      { label: 'Tensions', icon: 'activity' }
    ],
    duration: '45 min à 1 heure',
    definitionImage: '/images/medecines/reflexologie/definition.webp',
    definitionText: [
      'La réflexologie est une technique manuelle qui consiste à exercer des pressions sur des zones précises des pieds, des mains, des oreilles ou du visage, considérées comme reliées aux différentes parties du corps.',
      'Pratiquée habillé, le plus souvent sur les pieds, elle vise avant tout la détente et le bien-être, en complément d\'un suivi médical.'
    ],
    conditions: ['Stress', 'Sommeil', 'Fatigue', 'Tensions musculaires', 'Gênes digestives', 'Jambes lourdes', 'Besoin de détente'],
    mosaicImage1: '/images/medecines/reflexologie/mosaique-1.webp',
    mosaicImage2: '/images/medecines/reflexologie/mosaique-2.webp',
    mosaicImage2Tagline: 'Un temps pour soi',
    mosaicImage3: '/images/medecines/reflexologie/mosaique-3.webp',
    steps: [
      { title: 'Échange initial', description: 'Le réflexologue fait le point avec vous sur vos besoins, votre sommeil, votre niveau de stress et votre état général.' },
      { title: 'Installation', description: 'Vous vous allongez habillé, pieds nus, confortablement installé dans un fauteuil ou sur une table.' },
      { title: 'Pressions réflexes', description: 'Le praticien exerce des pressions et des mouvements doux sur les zones réflexes adaptées à votre demande.' },
      { title: 'Retour au calme', description: 'Un temps de repos clôt la séance, suivi de conseils simples pour prolonger la détente.' }
    ],
    benefits: [
      'Un moment de détente profonde',
      'Peut aider à relâcher le stress et les tensions',
      'Peut contribuer à un sommeil plus réparateur',
      'Une sensation de légèreté après la séance',
      'Une pratique douce, sans manipulation'
    ],
    seo: {
      title: 'Réflexologie : trouver un réflexologue près de vous | Léya',
      description: 'Découvrez la réflexologie sur Léya : pressions douces sur les pieds ou les mains, déroulé d\'une séance. Trouvez un réflexologue et réservez en ligne.'
    }
  },
  {
    slug: 'kinesiologie',
    name: 'Kinésiologie',
    nameWithArticle: 'la kinésiologie',
    ctaLabel: 'un/e kinésiologue',
    icon: '/icons/kinesiologie.svg',
    shortDescription: 'Accompagnement qui s\'appuie sur le test musculaire pour mieux gérer le stress et les émotions',
    heroImage: '/images/medecines/kinesiologie/hero.webp',
    heroTagline: 'Retrouver son équilibre avec la',
    heroLead: 'Un accompagnement qui s’appuie sur le test musculaire pour mieux comprendre ses blocages et avancer face au stress du quotidien.',
    heroChips: [
      { label: 'Stress', icon: 'wind' },
      { label: 'Émotions', icon: 'heart' },
      { label: 'Confiance en soi', icon: 'heart' },
      { label: 'Concentration', icon: 'info' }
    ],
    duration: '1 heure à 1h30',
    definitionImage: '/images/medecines/kinesiologie/definition.webp',
    definitionText: [
      'La kinésiologie est une approche d\'accompagnement qui utilise le test musculaire : le praticien exerce une légère pression sur un muscle, souvent le bras tendu, et observe sa réponse.',
      'Elle propose des exercices corporels, de respiration et de rééquilibrage pour mieux gérer le stress, les émotions et les périodes de changement. Elle ne pose pas de diagnostic.'
    ],
    conditions: ['Stress', 'Émotions', 'Confiance en soi', 'Concentration', 'Apprentissages', 'Périodes de changement', 'Fatigue et surmenage'],
    mosaicImage1: '/images/medecines/kinesiologie/mosaique-1.webp',
    mosaicImage2: '/images/medecines/kinesiologie/mosaique-2.webp',
    mosaicImage2Tagline: 'À l’écoute du corps',
    mosaicImage3: '/images/medecines/kinesiologie/mosaique-3.webp',
    steps: [
      { title: 'Définir l\'objectif', description: 'Vous échangez avec le kinésiologue sur votre situation et formulez ensemble un objectif pour la séance.' },
      { title: 'Test musculaire', description: 'Par de légères pressions sur un muscle, le praticien repère ce qui crée du stress en lien avec votre objectif.' },
      { title: 'Rééquilibrages', description: 'Exercices corporels, respiration, points de contact ou visualisation sont proposés selon vos besoins.' },
      { title: 'Ancrage', description: 'Vous repartez avec des exercices simples à refaire chez vous pour prolonger le travail de la séance.' }
    ],
    benefits: [
      'Un temps d\'écoute pour faire le point',
      'Peut aider à mieux gérer le stress et les émotions',
      'Peut accompagner les périodes de changement',
      'Des exercices simples à pratiquer au quotidien',
      'Une approche douce, pour les enfants comme pour les adultes'
    ],
    seo: {
      title: 'Kinésiologie : trouver un kinésiologue près de vous | Léya',
      description: 'Découvrez la kinésiologie sur Léya : test musculaire, gestion du stress et des émotions, déroulé d\'une séance. Trouvez un kinésiologue près de chez vous.'
    }
  },
  {
    slug: 'shiatsu',
    name: 'Shiatsu',
    nameWithArticle: 'le shiatsu',
    ctaLabel: 'un/e praticien/ne en shiatsu',
    icon: '/icons/shiatsu.svg',
    shortDescription: 'Technique japonaise de pressions des doigts et des paumes, pratiquée habillé',
    heroImage: '/images/medecines/shiatsu/hero.webp',
    heroTagline: 'Relâcher les tensions avec le',
    heroLead: 'Une technique japonaise de pressions des pouces et des paumes, pratiquée habillé, pour détendre le corps et apaiser l’esprit.',
    heroChips: [
      { label: 'Tensions musculaires', icon: 'activity' },
      { label: 'Stress', icon: 'wind' },
      { label: 'Fatigue', icon: 'moon' },
      { label: 'Raideurs', icon: 'activity' }
    ],
    duration: '1 heure à 1h15',
    definitionImage: '/images/medecines/shiatsu/definition.webp',
    definitionText: [
      'Le shiatsu est une technique manuelle d\'origine japonaise : « shiatsu » signifie « pression des doigts ». Le praticien exerce des pressions avec les pouces, les paumes ou les coudes, et ajoute des étirements doux.',
      'La séance se déroule habillé, le plus souvent sur un futon posé au sol. Le shiatsu vise la détente et l\'équilibre général, en complément d\'un suivi médical.'
    ],
    conditions: ['Tensions musculaires', 'Stress', 'Fatigue', 'Raideurs du dos', 'Sommeil', 'Récupération sportive', 'Besoin de détente'],
    mosaicImage1: '/images/medecines/shiatsu/mosaique-1.webp',
    mosaicImage2: '/images/medecines/shiatsu/mosaique-2.webp',
    mosaicImage2Tagline: 'Une détente en profondeur',
    mosaicImage3: '/images/medecines/shiatsu/mosaique-3.webp',
    steps: [
      { title: 'Échange initial', description: 'Le praticien vous interroge sur votre état du moment, vos tensions et vos attentes.' },
      { title: 'Installation', description: 'Vous vous allongez habillé, en tenue souple, sur un futon ou une table.' },
      { title: 'Pressions et étirements', description: 'Pressions rythmées des pouces et des paumes le long du corps, mobilisations et étirements doux.' },
      { title: 'Temps de repos', description: 'Quelques minutes de calme pour laisser le corps intégrer la séance, puis des conseils pour la suite.' }
    ],
    benefits: [
      'Un moment de détente du corps et de l\'esprit',
      'Peut aider à relâcher les tensions musculaires',
      'Peut contribuer à un meilleur sommeil',
      'Une sensation de souplesse après la séance',
      'Une pratique habillé, sans huile'
    ],
    seo: {
      title: 'Shiatsu : trouver un praticien en shiatsu près de vous | Léya',
      description: 'Découvrez le shiatsu sur Léya : pressions des doigts d\'origine japonaise, pratiquées habillé. Trouvez un praticien près de chez vous et réservez en ligne.'
    }
  },
  {
    slug: 'chiropraxie',
    name: 'Chiropraxie',
    nameWithArticle: 'la chiropraxie',
    ctaLabel: 'un/e chiropracteur/rice',
    icon: '/icons/chiropraxie.svg',
    shortDescription: 'Pratique manuelle centrée sur la colonne vertébrale et les articulations',
    heroImage: '/images/medecines/chiropraxie/hero.webp',
    heroTagline: 'Prendre soin de son dos avec la',
    heroLead: 'Une pratique manuelle centrée sur la colonne vertébrale et les articulations, pour soulager les gênes du dos et retrouver du mouvement.',
    heroChips: [
      { label: 'Douleurs de dos', icon: 'activity' },
      { label: 'Douleurs de nuque', icon: 'activity' },
      { label: 'Maux de tête', icon: 'info' },
      { label: 'Posture', icon: 'activity' }
    ],
    duration: '30 à 45 min',
    definitionImage: '/images/medecines/chiropraxie/definition.webp',
    definitionText: [
      'La chiropraxie est une pratique manuelle qui s\'intéresse à la colonne vertébrale, aux articulations et à leur lien avec le système nerveux. En France, le titre de chiropracteur est encadré et suppose une formation de cinq ans.',
      'Le chiropracteur utilise des ajustements, des gestes manuels précis et rapides, pour redonner de la mobilité aux articulations. Il oriente vers un médecin lorsque la situation le nécessite.'
    ],
    conditions: ['Douleurs de dos', 'Douleurs de nuque', 'Maux de tête', 'Douleurs articulaires', 'Posture', 'Récupération sportive'],
    mosaicImage1: '/images/medecines/chiropraxie/mosaique-1.webp',
    mosaicImage2: '/images/medecines/chiropraxie/mosaique-2.webp',
    mosaicImage2Tagline: 'Retrouvez du mouvement',
    mosaicImage3: '/images/medecines/chiropraxie/mosaique-3.webp',
    steps: [
      { title: 'Bilan initial', description: 'Le chiropracteur retrace avec vous l\'historique de vos douleurs, vos antécédents et vos habitudes.' },
      { title: 'Examen', description: 'Observation de la posture, tests de mobilité et examen de la colonne pour repérer les zones en cause.' },
      { title: 'Ajustements', description: 'Des gestes manuels précis et adaptés sont réalisés pour redonner de la mobilité aux articulations.' },
      { title: 'Conseils', description: 'Exercices, postures et rythme de suivi vous sont proposés pour prolonger les effets de la séance.' }
    ],
    benefits: [
      'Peut aider à soulager les douleurs de dos et de nuque',
      'Peut contribuer à une meilleure mobilité',
      'Peut accompagner la récupération sportive',
      'Des conseils de posture pour le quotidien',
      'Un professionnel au titre encadré en France'
    ],
    seo: {
      title: 'Chiropraxie : trouver un chiropracteur près de vous | Léya',
      description: 'Découvrez la chiropraxie sur Léya : une pratique manuelle centrée sur la colonne vertébrale. Trouvez un chiropracteur près de chez vous et réservez en ligne.'
    }
  },
  {
    slug: 'etiopathie',
    name: 'Étiopathie',
    nameWithArticle: 'l\'étiopathie',
    ctaLabel: 'un/e étiopathe',
    icon: '/icons/etiopathie.svg',
    shortDescription: 'Méthode manuelle qui cherche l\'origine mécanique d\'une gêne',
    heroImage: '/images/medecines/etiopathie/hero.webp',
    heroTagline: 'Remonter à l’origine de ses gênes avec l’',
    heroLead: 'Une méthode manuelle qui cherche la cause mécanique d’une gêne pour agir dessus, plutôt que sur le seul symptôme.',
    heroChips: [
      { label: 'Douleurs de dos', icon: 'activity' },
      { label: 'Douleurs articulaires', icon: 'activity' },
      { label: 'Gênes digestives', icon: 'leaf' },
      { label: 'Maux de tête', icon: 'info' }
    ],
    duration: '30 à 45 min',
    definitionImage: '/images/medecines/etiopathie/definition.webp',
    definitionText: [
      'L\'étiopathie est une méthode manuelle née en France dans les années 1960. Son principe : rechercher la cause mécanique d\'un trouble (« étio » signifie « cause ») plutôt que de s\'arrêter au symptôme.',
      'Après un échange détaillé, l\'étiopathe réalise des manipulations ciblées. Le titre n\'est pas reconnu par l\'État : l\'étiopathie complète un suivi médical, sans le remplacer.'
    ],
    conditions: ['Douleurs de dos', 'Douleurs articulaires', 'Gênes digestives', 'Maux de tête', 'Tensions musculaires', 'Douleurs de nuque'],
    mosaicImage1: '/images/medecines/etiopathie/mosaique-1.webp',
    mosaicImage2: '/images/medecines/etiopathie/mosaique-2.webp',
    mosaicImage2Tagline: 'Chercher la cause',
    mosaicImage3: '/images/medecines/etiopathie/mosaique-3.webp',
    steps: [
      { title: 'Interrogatoire', description: 'L\'étiopathe vous pose des questions précises sur la gêne, son apparition et vos antécédents.' },
      { title: 'Examen manuel', description: 'Palpation et tests de mobilité pour remonter à l\'origine mécanique de la gêne.' },
      { title: 'Manipulations', description: 'Des gestes manuels ciblés sont réalisés sur la zone identifiée comme à l\'origine du trouble.' },
      { title: 'Suivi', description: 'Le praticien vous explique ce qui a été fait et vous indique si une nouvelle séance est utile.' }
    ],
    benefits: [
      'Une approche qui cherche l\'origine de la gêne',
      'Peut aider à soulager certaines douleurs mécaniques',
      'Peut contribuer à retrouver de la mobilité',
      'Des séances courtes et ciblées',
      'Des explications claires sur ce qui est fait'
    ],
    seo: {
      title: 'Étiopathie : trouver un étiopathe près de vous | Léya',
      description: 'Découvrez l\'étiopathie sur Léya : une méthode manuelle qui cherche la cause mécanique d\'une gêne. Trouvez un étiopathe près de chez vous et réservez en ligne.'
    }
  },
  {
    slug: 'medecine-traditionnelle-chinoise',
    name: 'Médecine traditionnelle chinoise',
    nameWithArticle: 'la médecine traditionnelle chinoise',
    ctaLabel: 'un/e praticien/ne en MTC',
    icon: '/icons/medecine-traditionnelle-chinoise.svg',
    shortDescription: 'Approche globale issue de Chine : plantes, massage tuina, ventouses, diététique',
    heroImage: '/images/medecines/medecine-traditionnelle-chinoise/hero.webp',
    heroTagline: 'Retrouver l’équilibre avec la',
    heroLead: 'Une approche globale issue de Chine, qui associe bilan énergétique, plantes, massage tuina, ventouses et conseils d’hygiène de vie.',
    heroChips: [
      { label: 'Fatigue', icon: 'moon' },
      { label: 'Stress', icon: 'wind' },
      { label: 'Gênes digestives', icon: 'leaf' },
      { label: 'Sommeil', icon: 'moon' }
    ],
    duration: '1 heure à 1h30',
    definitionImage: '/images/medecines/medecine-traditionnelle-chinoise/definition.webp',
    definitionText: [
      'La médecine traditionnelle chinoise (MTC) est un ensemble de pratiques issues de Chine, fondé sur l\'équilibre entre le yin et le yang et la circulation de l\'énergie (le qi) dans le corps.',
      'Après un bilan (questions, observation de la langue, prise des pouls), le praticien peut proposer plusieurs outils : plantes, massage tuina, ventouses, moxibustion, diététique ou qi gong, en complément d\'un suivi médical.'
    ],
    conditions: ['Fatigue', 'Stress', 'Gênes digestives', 'Sommeil', 'Douleurs', 'Équilibre alimentaire', 'Hygiène de vie'],
    mosaicImage1: '/images/medecines/medecine-traditionnelle-chinoise/mosaique-1.webp',
    mosaicImage2: '/images/medecines/medecine-traditionnelle-chinoise/mosaique-2.webp',
    mosaicImage2Tagline: 'Une tradition millénaire',
    mosaicImage3: '/images/medecines/medecine-traditionnelle-chinoise/mosaique-3.webp',
    steps: [
      { title: 'Bilan énergétique', description: 'Questions sur votre mode de vie, observation de la langue et prise des pouls pour comprendre votre état général.' },
      { title: 'Analyse', description: 'Le praticien met en relation vos gênes et vos habitudes pour définir l\'axe de travail.' },
      { title: 'Soins', description: 'Selon vos besoins : massage tuina, ventouses, moxibustion ou conseils en plantes.' },
      { title: 'Hygiène de vie', description: 'Vous repartez avec des conseils de diététique et d\'exercices (qi gong) adaptés à votre rythme.' }
    ],
    benefits: [
      'Une approche globale du corps et de l\'hygiène de vie',
      'Peut aider à mieux gérer le stress et la fatigue',
      'Peut contribuer à un meilleur équilibre digestif',
      'Des conseils de diététique adaptés à votre situation',
      'Des exercices simples à pratiquer chez soi'
    ],
    seo: {
      title: 'Médecine chinoise (MTC) : trouver un praticien | Léya',
      description: 'Découvrez la médecine traditionnelle chinoise sur Léya : bilan, plantes, tuina, ventouses. Trouvez un praticien en MTC près de chez vous et réservez en ligne.'
    }
  }
]

export function getMedecineBySlug(slug: string): Medecine | undefined {
  return medecines.find(m => m.slug === slug)
}

/** Pictogrammes de la maquette (vert, pour fond clair) ; à défaut, l'icône historique de la médecine. */
const PICTOGRAMS: Record<string, string> = {
  osteopathie: '/images/landing/med-osteopathie.svg',
  sophrologie: '/images/landing/med-sophrologie.svg',
  naturopathie: '/images/landing/med-naturopathie.svg',
  hypnotherapie: '/images/landing/med-hypnotherapie.svg',
  massage: '/images/landing/med-massage.svg',
}
export const medecinePictogram = (m: Medecine): string => PICTOGRAMS[m.slug] ?? m.icon
