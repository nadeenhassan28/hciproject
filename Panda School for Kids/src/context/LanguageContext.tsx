import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'english' | 'french' | 'spanish';

interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Translations> = {
  english: {
    // Navigation
    back: 'Back',
    backToDashboard: 'Back to Dashboard',
    home: 'Home',
    settings: 'Settings',
    logout: 'Logout',
    continue: 'Continue',
    continueLearning: 'Continue Learning',
    tryAgainButton: 'Try Again',
    
    // Auth
    welcomeBack: 'Welcome Back!',
    parentLogin: 'Parent Login',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    dontHaveAccount: "Don't have an account?",
    signUpHere: 'Sign up here',
    welcomeToPandaSchool: 'Join Panda School!',
    parentSignup: 'Parent Signup',
    parentName: "Parent Name",
    childName: "Child's Name",
    childAge: "Child's Age (years)",
    chooseAvatar: 'Choose Your Avatar',
    signUp: 'Continue',
    alreadyHaveAccount: 'Already have an account?',
    signInHere: 'Sign in here',
    
    // Dashboard
    hello: 'Hello',
    welcomeToLearning: 'Welcome to your learning adventure!',
    chooseGame: 'Choose a game to play:',
    pandaSchool: 'Panda School',
    letsLearnTogether: "Let's learn together!",
    shapes: 'Shapes',
    numbers: 'Numbers',
    counting: 'Counting',
    leaderboard: 'Leaderboard',
    achievements: 'Achievements',
    parentDashboard: 'Parent Dashboard',
    startLearning: 'Start Learning',
    lessonsCompleted: 'Lessons Completed',
    dayStreak: 'Day Streak',
    averageScore: 'Average Score',
    progress: 'Progress',
    
    // Adventure Path
    selectDifficulty: 'Choose Your Path!',
    selectDifficultyDesc: 'Select a difficulty level to begin your adventure',
    easyTrail: 'Easy Trail',
    mediumMountain: 'Medium Mountain',
    hardSummit: 'Hard Summit',
    startAdventure: 'Start your adventure!',
    challengeYourself: 'Challenge yourself!',
    masterTheChallenge: 'Master the challenge!',
    easyLevel: 'Easy Level',
    mediumLevel: 'Medium Level',
    hardLevel: 'Hard Level',
    expertLevel: 'Expert Level',
    locked: 'Locked',
    unlocked: 'Unlocked',
    completedWithScore: 'Completed with score',
    start: 'Start',
    unlockByCompleting: 'Unlock by completing',
    inProgress: 'In Progress',
    mastered: 'Mastered!',
    startAdventureButton: 'Start Adventure',
    scoreAbove50: 'Score above 50% on previous level',
    levelNumber: 'Level',
    
    // Lessons - Questions
    level: 'Level',
    score: 'Score',
    timeLeft: 'Time Left',
    question: 'Question',
    of: 'of',
    clickTheCorrect: 'Click the correct',
    selectTheNumber: 'Select the number',
    howManyObjectsSeeYou: 'How many objects do you see?',
    canYouIdentifyShape: 'Can you identify this shape?',
    whichOneIsCircle: 'Which one is a circle?',
    whatShapeIsThis: 'What shape is this?',
    findTheSquare: 'Find the square',
    identifyTheTriangle: 'Identify the triangle',
    whichIsNotStar: 'Which is NOT a star?',
    countTheHearts: 'Count the hearts',
    howManyCircles: 'How many circles do you see?',
    whatsNextInPattern: "What's next in the pattern?",
    whatNumber: 'What number is this?',
    countAndSelect: 'Count and select the correct answer',
    selectCorrectNumber: 'Select the correct number',
    
    // Shapes
    circle: 'Circle',
    square: 'Square',
    triangle: 'Triangle',
    star: 'Star',
    heart: 'Heart',
    hexagon: 'Hexagon',
    rectangle: 'Rectangle',
    oval: 'Oval',
    diamond: 'Diamond',
    
    // Numbers
    zero: 'Zero',
    one: 'One',
    two: 'Two',
    three: 'Three',
    four: 'Four',
    five: 'Five',
    six: 'Six',
    seven: 'Seven',
    eight: 'Eight',
    nine: 'Nine',
    ten: 'Ten',
    
    // Feedback
    correct: 'Correct!',
    tryAgain: 'Try Again!',
    wellDone: 'Well Done!',
    awesome: 'Awesome!',
    fantastic: 'Fantastic!',
    keepGoing: 'Keep Going!',
    greatWork: 'Great work!',
    amazing: 'Amazing!',
    excellent: 'Excellent!',
    superb: 'Superb!',
    
    // Lesson Complete
    lessonComplete: 'Lesson Complete!',
    keepGoingTitle: 'Keep Going!',
    congratulations: 'Congratulations!',
    greatJobProgress: 'Great job! You\'re making amazing progress.',
    learningPractice: 'You\'re learning! Practice makes perfect. Let\'s try again!',
    youScored: 'You scored',
    youGot: 'You got',
    correctAnswers: 'Correct',
    points: 'Points',
    passed: 'Passed!',
    needMorePractice: 'Need more practice',
    backToDashboard: 'Back to Dashboard',
    difficultyUnlocked: 'Next difficulty unlocked!',
    keepPracticing: 'Keep practicing!',
    remember: 'Remember:',
    everyMistakeLearn: 'Every mistake is a chance to learn something new! You\'re doing great by trying. Let\'s give it another go!',
    
    // Leaderboard
    topScores: 'Top Scores',
    topPlayers: 'Top Players',
    yourRank: 'Your Rank',
    noScoresYet: 'No scores yet. Start playing!',
    rank: 'Rank',
    player: 'Player',
    averageScore: 'Average Score',
    gamesPlayed: 'Games Played',
    you: 'You',
    keepLearningClimb: 'Keep learning to climb higher!',
    dayStreak: 'day streak',
    pts: 'pts',
    
    // Achievements
    achievementsTitle: 'Achievements',
    achievementUnlocked: 'Achievement Unlocked!',
    firstSteps: 'First Steps',
    firstStepsDesc: 'Complete your first lesson',
    perfectScore: 'Perfect Score',
    perfectScoreDesc: 'Get 100% on any lesson',
    speedDemon: 'Speed Demon',
    speedDemonDesc: 'Complete a lesson in under 30 seconds',
    dedicated: 'Dedicated Learner',
    dedicatedDesc: 'Play 10 lessons',
    shapesMaster: 'Shapes Master',
    shapesMasterDesc: 'Complete all shapes levels',
    numbersMaster: 'Numbers Master',
    numbersMasterDesc: 'Complete all numbers levels',
    countingMaster: 'Counting Master',
    countingMasterDesc: 'Complete all counting levels',
    
    // Settings Categories
    profile: 'Profile',
    profileDesc: 'Manage parent and child information',
    manageParentChild: 'Manage parent and child information',
    soundAudio: 'Sound & Audio',
    soundAudioDesc: 'Music and sound effects',
    musicSoundEffects: 'Music and sound effects',
    appearance: 'Appearance',
    appearanceDesc: 'Themes and visual settings',
    themesVisual: 'Themes and visual settings',
    notifications: 'Notifications',
    notificationsDesc: 'Daily reminders and alerts',
    dailyReminders: 'Daily reminders and alerts',
    language: 'Language',
    languageDesc: 'Choose your preferred language',
    chooseLanguage: 'Choose your preferred language',
    
    // Profile Settings
    parentNameLabel: "Parent's Name",
    childNameLabel: "Child's Name",
    childAgeLabel: "Child's Age",
    childAvatar: "Child's Avatar",
    editProfile: 'Edit Profile',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    ageError: 'Age must be at least 5 years old',
    notSet: 'Not set',
    yearsOld: 'years old',
    
    // Audio Settings
    soundEffects: 'Sound Effects',
    soundEffectsDesc: 'Claps, feedback sounds',
    backgroundMusic: 'Background Music',
    backgroundMusicDesc: 'Relaxing learning music',
    
    // Appearance Settings
    chooseTheme: 'Choose Theme',
    active: 'Active',
    darkMode: 'Dark Mode',
    comingSoon: 'Coming soon!',
    
    // Notification Settings
    dailyReminders: 'Daily Reminders',
    dailyRemindersDesc: 'Get reminded to practice',
    
    // Language Settings
    selectLanguage: 'Select Language',
    
    // About
    version: 'Version 1.0.0',
    tagline: 'Making learning fun for everyone!',
    developedWith: 'Developed with ❤️ for children',
    copyright: '© 2025 Panda School. All rights reserved.',
    
    // Logout Confirmation
    areYouSure: 'Are you sure?',
    logoutMessage: 'You will be logged out and returned to the login screen.',
    
    // Parent Dashboard
    activityOverview: 'Activity Overview',
    screenTime: 'Screen Time',
    streakLevel: 'Streak Level',
    progressTracking: 'Progress Tracking',
    areasNeedingImprovement: 'Areas Needing Improvement',
    areasNeedingFocus: 'What needs more focusing on:',
    currentDifficulty: 'Current Difficulty',
    currentLearningLevels: 'Current Learning Levels:',
    totalPlayTime: 'Total Play Time',
    minutes: 'minutes',
    minute: 'minute',
    hours: 'hours',
    hour: 'hour',
    days: 'days',
    day: 'day',
    lessonsCompleted: 'Lessons Completed',
    lesson: 'Lesson',
    lessons: 'Lessons',
    completed: 'Completed',
    currentStreak: 'Current Streak',
    bestStreak: 'Best Streak',
    totalScore: 'Total Score',
    todaysActivity: "Today's Activity",
    weeklyProgress: 'Weekly Progress',
    monthlyStats: 'Monthly Stats',
    performanceByGame: 'Performance by Game',
    recentActivity: 'Recent Activity',
    noDataYet: 'No data yet. Start playing!',
    noActivitiesYet: 'No activities yet. Start learning!',
    answerStatistics: 'Answer Statistics by Mini-Game',
    thisWeek: 'This week',
    time: 'Time',
    lessonProgress: 'Lesson Progress',
    overallCompletion: 'Overall completion',
    overallProgress: 'Overall Progress',
    avgScore: 'Avg Score',
    streak: 'Streak',
    justNow: 'Just now',
    ago: 'ago',
    
    // Difficulty Levels
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    close: 'Close',
    open: 'Open',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    submit: 'Submit',
    reset: 'Reset',
  },
  
  french: {
    // Navigation
    back: 'Retour',
    backToDashboard: 'Retour au tableau de bord',
    home: 'Accueil',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    continue: 'Continuer',
    continueLearning: 'Continuer l\'apprentissage',
    tryAgainButton: 'Réessayer',
    
    // Auth
    welcomeBack: 'Bon retour!',
    parentLogin: 'Connexion Parent',
    email: 'Email',
    password: 'Mot de passe',
    signIn: 'Se connecter',
    dontHaveAccount: "Vous n'avez pas de compte?",
    signUpHere: 'Inscrivez-vous ici',
    welcomeToPandaSchool: 'Rejoignez Panda School!',
    parentSignup: 'Inscription Parent',
    parentName: "Nom du parent",
    childName: "Nom de l'enfant",
    childAge: "Âge de l'enfant (ans)",
    chooseAvatar: 'Choisissez votre avatar',
    signUp: 'Continuer',
    alreadyHaveAccount: 'Vous avez déjà un compte?',
    signInHere: 'Connectez-vous ici',
    
    // Dashboard
    hello: 'Bonjour',
    welcomeToLearning: 'Bienvenue dans votre aventure d\'apprentissage!',
    chooseGame: 'Choisissez un jeu:',
    pandaSchool: 'École Panda',
    letsLearnTogether: 'Apprenons ensemble!',
    shapes: 'Formes',
    numbers: 'Nombres',
    counting: 'Compter',
    leaderboard: 'Classement',
    achievements: 'Réalisations',
    parentDashboard: 'Tableau de bord parent',
    startLearning: 'Commencer l\'apprentissage',
    lessonsCompleted: 'Leçons terminées',
    dayStreak: 'Jours consécutifs',
    averageScore: 'Score moyen',
    progress: 'Progrès',
    
    // Adventure Path
    selectDifficulty: 'Choisissez votre chemin!',
    selectDifficultyDesc: 'Sélectionnez un niveau de difficulté pour commencer votre aventure',
    easyTrail: 'Sentier facile',
    mediumMountain: 'Montagne moyenne',
    hardSummit: 'Sommet difficile',
    startAdventure: 'Commencez votre aventure!',
    challengeYourself: 'Défiez-vous!',
    masterTheChallenge: 'Maîtrisez le défi!',
    easyLevel: 'Niveau facile',
    mediumLevel: 'Niveau moyen',
    hardLevel: 'Niveau difficile',
    expertLevel: 'Niveau expert',
    locked: 'Verrouillé',
    unlocked: 'Déverrouillé',
    completedWithScore: 'Terminé avec un score',
    start: 'Commencer',
    unlockByCompleting: 'Débloquer en terminant',
    inProgress: 'En cours',
    mastered: 'Maîtrisé!',
    startAdventureButton: 'Commencer l\'aventure',
    scoreAbove50: 'Score supérieur à 50% au niveau précédent',
    levelNumber: 'Niveau',
    
    // Lessons - Questions
    level: 'Niveau',
    score: 'Score',
    timeLeft: 'Temps restant',
    question: 'Question',
    of: 'de',
    clickTheCorrect: 'Cliquez sur le bon',
    selectTheNumber: 'Sélectionnez le nombre',
    howManyObjectsSeeYou: 'Combien d\'objets voyez-vous?',
    canYouIdentifyShape: 'Pouvez-vous identifier cette forme?',
    whichOneIsCircle: 'Lequel est un cercle?',
    whatShapeIsThis: 'Quelle est cette forme?',
    findTheSquare: 'Trouvez le carré',
    identifyTheTriangle: 'Identifiez le triangle',
    whichIsNotStar: 'Lequel n\'est PAS une étoile?',
    countTheHearts: 'Comptez les cœurs',
    howManyCircles: 'Combien de cercles voyez-vous?',
    whatsNextInPattern: 'Quel est le suivant dans le motif?',
    whatNumber: 'Quel est ce nombre?',
    countAndSelect: 'Comptez et sélectionnez la bonne réponse',
    selectCorrectNumber: 'Sélectionnez le bon nombre',
    
    // Shapes
    circle: 'Cercle',
    square: 'Carré',
    triangle: 'Triangle',
    star: 'Étoile',
    heart: 'Cœur',
    hexagon: 'Hexagone',
    rectangle: 'Rectangle',
    oval: 'Ovale',
    diamond: 'Diamant',
    
    // Numbers
    zero: 'Zéro',
    one: 'Un',
    two: 'Deux',
    three: 'Trois',
    four: 'Quatre',
    five: 'Cinq',
    six: 'Six',
    seven: 'Sept',
    eight: 'Huit',
    nine: 'Neuf',
    ten: 'Dix',
    
    // Feedback
    correct: 'Correct!',
    tryAgain: 'Réessayez!',
    wellDone: 'Bien joué!',
    awesome: 'Génial!',
    fantastic: 'Fantastique!',
    keepGoing: 'Continuez!',
    greatWork: 'Excellent travail!',
    amazing: 'Incroyable!',
    excellent: 'Excellent!',
    superb: 'Superbe!',
    
    // Lesson Complete
    lessonComplete: 'Leçon terminée!',
    keepGoingTitle: 'Continuez!',
    congratulations: 'Félicitations!',
    greatJobProgress: 'Excellent travail! Vous faites des progrès incroyables.',
    learningPractice: 'Vous apprenez! La pratique rend parfait. Réessayons!',
    youScored: 'Vous avez marqué',
    youGot: 'Vous avez eu',
    correctAnswers: 'Correct',
    points: 'Points',
    passed: 'Réussi!',
    needMorePractice: 'Besoin de plus de pratique',
    backToDashboard: 'Retour au tableau de bord',
    difficultyUnlocked: 'Prochaine difficulté débloquée!',
    keepPracticing: 'Continuez à pratiquer!',
    remember: 'Rappelez-vous:',
    everyMistakeLearn: 'Chaque erreur est une occasion d\'apprendre quelque chose de nouveau! Vous faites très bien en essayant. Essayons encore!',
    
    // Leaderboard
    topScores: 'Meilleurs scores',
    topPlayers: 'Meilleurs joueurs',
    yourRank: 'Votre rang',
    noScoresYet: 'Pas encore de scores. Commencez à jouer!',
    rank: 'Rang',
    player: 'Joueur',
    averageScore: 'Score moyen',
    gamesPlayed: 'Parties jouées',
    you: 'Vous',
    keepLearningClimb: 'Continuez à apprendre pour monter plus haut!',
    dayStreak: 'jours consécutifs',
    pts: 'pts',
    
    // Achievements
    achievementsTitle: 'Réalisations',
    achievementUnlocked: 'Réalisation débloquée!',
    firstSteps: 'Premiers pas',
    firstStepsDesc: 'Terminez votre première leçon',
    perfectScore: 'Score parfait',
    perfectScoreDesc: 'Obtenez 100% à n\'importe quelle leçon',
    speedDemon: 'Démon de vitesse',
    speedDemonDesc: 'Terminez une leçon en moins de 30 secondes',
    dedicated: 'Apprenant dévoué',
    dedicatedDesc: 'Jouez 10 leçons',
    shapesMaster: 'Maître des formes',
    shapesMasterDesc: 'Terminez tous les niveaux de formes',
    numbersMaster: 'Maître des nombres',
    numbersMasterDesc: 'Terminez tous les niveaux de nombres',
    countingMaster: 'Maître du comptage',
    countingMasterDesc: 'Terminez tous les niveaux de comptage',
    
    // Settings Categories
    profile: 'Profil',
    profileDesc: 'Gérer les informations du parent et de l\'enfant',
    manageParentChild: 'Gérer les informations du parent et de l\'enfant',
    soundAudio: 'Son et audio',
    soundAudioDesc: 'Musique et effets sonores',
    musicSoundEffects: 'Musique et effets sonores',
    appearance: 'Apparence',
    appearanceDesc: 'Thèmes et paramètres visuels',
    themesVisual: 'Thèmes et paramètres visuels',
    notifications: 'Notifications',
    notificationsDesc: 'Rappels quotidiens et alertes',
    dailyReminders: 'Rappels quotidiens et alertes',
    language: 'Langue',
    languageDesc: 'Choisissez votre langue préférée',
    chooseLanguage: 'Choisissez votre langue préférée',
    
    // Profile Settings
    parentNameLabel: "Nom du parent",
    childNameLabel: "Nom de l'enfant",
    childAgeLabel: "Âge de l'enfant",
    childAvatar: "Avatar de l'enfant",
    editProfile: 'Modifier le profil',
    saveChanges: 'Enregistrer les modifications',
    cancel: 'Annuler',
    ageError: 'L\'âge doit être d\'au moins 5 ans',
    notSet: 'Non défini',
    yearsOld: 'ans',
    
    // Audio Settings
    soundEffects: 'Effets sonores',
    soundEffectsDesc: 'Applaudissements, sons de feedback',
    backgroundMusic: 'Musique de fond',
    backgroundMusicDesc: 'Musique d\'apprentissage relaxante',
    
    // Appearance Settings
    chooseTheme: 'Choisir un thème',
    active: 'Actif',
    darkMode: 'Mode sombre',
    comingSoon: 'Bientôt disponible!',
    
    // Notification Settings
    dailyReminders: 'Rappels quotidiens',
    dailyRemindersDesc: 'Recevez des rappels pour pratiquer',
    
    // Language Settings
    selectLanguage: 'Sélectionner la langue',
    
    // About
    version: 'Version 1.0.0',
    tagline: 'Rendre l\'apprentissage amusant pour tous!',
    developedWith: 'Développé avec ❤️ pour les enfants',
    copyright: '© 2025 Panda School. Tous droits réservés.',
    
    // Logout Confirmation
    areYouSure: 'Êtes-vous sûr?',
    logoutMessage: 'Vous serez déconnecté et redirigé vers l\'écran de connexion.',
    
    // Parent Dashboard
    activityOverview: 'Aperçu de l\'activité',
    screenTime: 'Temps d\'écran',
    streakLevel: 'Niveau de série',
    progressTracking: 'Suivi des progrès',
    areasNeedingImprovement: 'Domaines nécessitant une amélioration',
    areasNeedingFocus: 'Ce qui nécessite plus de concentration:',
    currentDifficulty: 'Difficulté actuelle',
    currentLearningLevels: 'Niveaux d\'apprentissage actuels:',
    totalPlayTime: 'Temps de jeu total',
    minutes: 'minutes',
    minute: 'minute',
    hours: 'heures',
    hour: 'heure',
    days: 'jours',
    day: 'jour',
    lessonsCompleted: 'Leçons terminées',
    lesson: 'Leçon',
    lessons: 'Leçons',
    completed: 'Terminées',
    currentStreak: 'Série actuelle',
    bestStreak: 'Meilleure série',
    totalScore: 'Score total',
    todaysActivity: 'Activité du jour',
    weeklyProgress: 'Progrès hebdomadaire',
    monthlyStats: 'Statistiques mensuelles',
    performanceByGame: 'Performance par jeu',
    recentActivity: 'Activité récente',
    noDataYet: 'Pas encore de données. Commencez à jouer!',
    noActivitiesYet: 'Pas encore d\'activités. Commencez à apprendre!',
    answerStatistics: 'Statistiques de réponse par mini-jeu',
    thisWeek: 'Cette semaine',
    time: 'Temps',
    lessonProgress: 'Progression de la leçon',
    overallCompletion: 'Complétion globale',
    overallProgress: 'Progression globale',
    avgScore: 'Score moyen',
    streak: 'Série',
    justNow: 'À l\'instant',
    ago: 'il y a',
    
    // Difficulty Levels
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    expert: 'Expert',
    
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    close: 'Fermer',
    open: 'Ouvrir',
    yes: 'Oui',
    no: 'Non',
    ok: 'OK',
    submit: 'Soumettre',
    reset: 'Réinitialiser',
  },
  
  spanish: {
    // Navigation
    back: 'Atrás',
    backToDashboard: 'Volver al panel',
    home: 'Inicio',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
    continue: 'Continuar',
    continueLearning: 'Continuar aprendiendo',
    tryAgainButton: 'Intentar de nuevo',
    
    // Auth
    welcomeBack: '¡Bienvenido de nuevo!',
    parentLogin: 'Inicio de sesión para padres',
    email: 'Correo electrónico',
    password: 'Contraseña',
    signIn: 'Iniciar sesión',
    dontHaveAccount: '¿No tienes una cuenta?',
    signUpHere: 'Regístrate aquí',
    welcomeToPandaSchool: '¡Únete a Panda School!',
    parentSignup: 'Registro de padres',
    parentName: "Nombre del padre",
    childName: "Nombre del niño",
    childAge: "Edad del niño (años)",
    chooseAvatar: 'Elige tu avatar',
    signUp: 'Continuar',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    signInHere: 'Inicia sesión aquí',
    
    // Dashboard
    hello: 'Hola',
    welcomeToLearning: '¡Bienvenido a tu aventura de aprendizaje!',
    chooseGame: 'Elige un juego:',
    pandaSchool: 'Escuela Panda',
    letsLearnTogether: '¡Aprendamos juntos!',
    shapes: 'Formas',
    numbers: 'Números',
    counting: 'Contar',
    leaderboard: 'Tabla de clasificación',
    achievements: 'Logros',
    parentDashboard: 'Panel de padres',
    startLearning: 'Comenzar a aprender',
    lessonsCompleted: 'Lecciones completadas',
    dayStreak: 'Racha de días',
    averageScore: 'Puntuación media',
    progress: 'Progreso',
    
    // Adventure Path
    selectDifficulty: '¡Elige tu camino!',
    selectDifficultyDesc: 'Selecciona un nivel de dificultad para comenzar tu aventura',
    easyTrail: 'Sendero fácil',
    mediumMountain: 'Montaña media',
    hardSummit: 'Cumbre difícil',
    startAdventure: '¡Comienza tu aventura!',
    challengeYourself: '¡Desafíate a ti mismo!',
    masterTheChallenge: '¡Domina el desafío!',
    easyLevel: 'Nivel fácil',
    mediumLevel: 'Nivel medio',
    hardLevel: 'Nivel difícil',
    expertLevel: 'Nivel experto',
    locked: 'Bloqueado',
    unlocked: 'Desbloqueado',
    completedWithScore: 'Completado con puntuación',
    start: 'Comenzar',
    unlockByCompleting: 'Desbloquear completando',
    inProgress: 'En progreso',
    mastered: '¡Dominado!',
    startAdventureButton: 'Comenzar aventura',
    scoreAbove50: 'Puntuación superior al 50% en el nivel anterior',
    levelNumber: 'Nivel',
    
    // Lessons - Questions
    level: 'Nivel',
    score: 'Puntuación',
    timeLeft: 'Tiempo restante',
    question: 'Pregunta',
    of: 'de',
    clickTheCorrect: 'Haz clic en el correcto',
    selectTheNumber: 'Selecciona el número',
    howManyObjectsSeeYou: '¿Cuántos objetos ves?',
    canYouIdentifyShape: '¿Puedes identificar esta forma?',
    whichOneIsCircle: '¿Cuál es un círculo?',
    whatShapeIsThis: '¿Qué forma es esta?',
    findTheSquare: 'Encuentra el cuadrado',
    identifyTheTriangle: 'Identifica el triángulo',
    whichIsNotStar: '¿Cuál NO es una estrella?',
    countTheHearts: 'Cuenta los corazones',
    howManyCircles: '¿Cuántos círculos ves?',
    whatsNextInPattern: '¿Cuál es el siguiente en el patrón?',
    whatNumber: '¿Qué número es este?',
    countAndSelect: 'Cuenta y selecciona la respuesta correcta',
    selectCorrectNumber: 'Selecciona el número correcto',
    
    // Shapes
    circle: 'Círculo',
    square: 'Cuadrado',
    triangle: 'Triángulo',
    star: 'Estrella',
    heart: 'Corazón',
    hexagon: 'Hexágono',
    rectangle: 'Rectángulo',
    oval: 'Óvalo',
    diamond: 'Diamante',
    
    // Numbers
    zero: 'Cero',
    one: 'Uno',
    two: 'Dos',
    three: 'Tres',
    four: 'Cuatro',
    five: 'Cinco',
    six: 'Seis',
    seven: 'Siete',
    eight: 'Ocho',
    nine: 'Nueve',
    ten: 'Diez',
    
    // Feedback
    correct: '¡Correcto!',
    tryAgain: '¡Inténtalo de nuevo!',
    wellDone: '¡Bien hecho!',
    awesome: '¡Increíble!',
    fantastic: '¡Fantástico!',
    keepGoing: '¡Sigue adelante!',
    greatWork: '¡Gran trabajo!',
    amazing: '¡Asombroso!',
    excellent: '¡Excelente!',
    superb: '¡Magnífico!',
    
    // Lesson Complete
    lessonComplete: '¡Lección completada!',
    keepGoingTitle: '¡Sigue adelante!',
    congratulations: '¡Felicitaciones!',
    greatJobProgress: '¡Buen trabajo! Estás haciendo un progreso increíble.',
    learningPractice: '¡Estás aprendiendo! La práctica hace al maestro. ¡Intentémoslo de nuevo!',
    youScored: 'Obtuviste',
    youGot: 'Conseguiste',
    correctAnswers: 'Correcto',
    points: 'Puntos',
    passed: '¡Aprobado!',
    needMorePractice: 'Necesita más práctica',
    backToDashboard: 'Volver al panel',
    difficultyUnlocked: '¡Siguiente dificultad desbloqueada!',
    keepPracticing: '¡Sigue practicando!',
    remember: 'Recuerda:',
    everyMistakeLearn: '¡Cada error es una oportunidad para aprender algo nuevo! Lo estás haciendo genial al intentarlo. ¡Intentémoslo una vez más!',
    
    // Leaderboard
    topScores: 'Mejores puntuaciones',
    topPlayers: 'Mejores jugadores',
    yourRank: 'Tu rango',
    noScoresYet: 'Aún no hay puntuaciones. ¡Comienza a jugar!',
    rank: 'Rango',
    player: 'Jugador',
    averageScore: 'Puntuación media',
    gamesPlayed: 'Juegos jugados',
    you: 'Tú',
    keepLearningClimb: '¡Sigue aprendiendo para subir más alto!',
    dayStreak: 'racha de días',
    pts: 'pts',
    
    // Achievements
    achievementsTitle: 'Logros',
    achievementUnlocked: '¡Logro desbloqueado!',
    firstSteps: 'Primeros pasos',
    firstStepsDesc: 'Completa tu primera lección',
    perfectScore: 'Puntuación perfecta',
    perfectScoreDesc: 'Obtén 100% en cualquier lección',
    speedDemon: 'Demonio de velocidad',
    speedDemonDesc: 'Completa una lección en menos de 30 segundos',
    dedicated: 'Estudiante dedicado',
    dedicatedDesc: 'Juega 10 lecciones',
    shapesMaster: 'Maestro de formas',
    shapesMasterDesc: 'Completa todos los niveles de formas',
    numbersMaster: 'Maestro de números',
    numbersMasterDesc: 'Completa todos los niveles de números',
    countingMaster: 'Maestro del conteo',
    countingMasterDesc: 'Completa todos los niveles de conteo',
    
    // Settings Categories
    profile: 'Perfil',
    profileDesc: 'Administrar información de padres e hijos',
    manageParentChild: 'Administrar información de padres e hijos',
    soundAudio: 'Sonido y audio',
    soundAudioDesc: 'Música y efectos de sonido',
    musicSoundEffects: 'Música y efectos de sonido',
    appearance: 'Apariencia',
    appearanceDesc: 'Temas y configuración visual',
    themesVisual: 'Temas y configuración visual',
    notifications: 'Notificaciones',
    notificationsDesc: 'Recordatorios diarios y alertas',
    dailyReminders: 'Recordatorios diarios y alertas',
    language: 'Idioma',
    languageDesc: 'Elige tu idioma preferido',
    chooseLanguage: 'Elige tu idioma preferido',
    
    // Profile Settings
    parentNameLabel: "Nombre del padre",
    childNameLabel: "Nombre del niño",
    childAgeLabel: "Edad del niño",
    childAvatar: "Avatar del niño",
    editProfile: 'Editar perfil',
    saveChanges: 'Guardar cambios',
    cancel: 'Cancelar',
    ageError: 'La edad debe ser de al menos 5 años',
    notSet: 'No establecido',
    yearsOld: 'años',
    
    // Audio Settings
    soundEffects: 'Efectos de sonido',
    soundEffectsDesc: 'Aplausos, sonidos de retroalimentación',
    backgroundMusic: 'Música de fondo',
    backgroundMusicDesc: 'Música relajante de aprendizaje',
    
    // Appearance Settings
    chooseTheme: 'Elegir tema',
    active: 'Activo',
    darkMode: 'Modo oscuro',
    comingSoon: '¡Próximamente!',
    
    // Notification Settings
    dailyReminders: 'Recordatorios diarios',
    dailyRemindersDesc: 'Recibe recordatorios para practicar',
    
    // Language Settings
    selectLanguage: 'Seleccionar idioma',
    
    // About
    version: 'Versión 1.0.0',
    tagline: '¡Haciendo que el aprendizaje sea divertido para todos!',
    developedWith: 'Desarrollado con ❤️ para niños',
    copyright: '© 2025 Panda School. Todos los derechos reservados.',
    
    // Logout Confirmation
    areYouSure: '¿Estás seguro?',
    logoutMessage: 'Cerrarás sesión y volverás a la pantalla de inicio de sesión.',
    
    // Parent Dashboard
    activityOverview: 'Resumen de actividad',
    screenTime: 'Tiempo de pantalla',
    streakLevel: 'Nivel de racha',
    progressTracking: 'Seguimiento de progreso',
    areasNeedingImprovement: 'Áreas que necesitan mejora',
    areasNeedingFocus: 'Lo que necesita más atención:',
    currentDifficulty: 'Dificultad actual',
    currentLearningLevels: 'Niveles de aprendizaje actuales:',
    totalPlayTime: 'Tiempo total de juego',
    minutes: 'minutos',
    minute: 'minuto',
    hours: 'horas',
    hour: 'hora',
    days: 'días',
    day: 'día',
    lessonsCompleted: 'Lecciones completadas',
    lesson: 'Lección',
    lessons: 'Lecciones',
    completed: 'Completadas',
    currentStreak: 'Racha actual',
    bestStreak: 'Mejor racha',
    totalScore: 'Puntuación total',
    todaysActivity: 'Actividad de hoy',
    weeklyProgress: 'Progreso semanal',
    monthlyStats: 'Estadísticas mensuales',
    performanceByGame: 'Rendimiento por juego',
    recentActivity: 'Actividad reciente',
    noDataYet: '¡Aún no hay datos. Comienza a jugar!',
    noActivitiesYet: '¡Aún no hay actividades. Comienza a aprender!',
    answerStatistics: 'Estadísticas de respuesta por mini-juego',
    thisWeek: 'Esta semana',
    time: 'Tiempo',
    lessonProgress: 'Progreso de la lección',
    overallCompletion: 'Completación general',
    overallProgress: 'Progreso general',
    avgScore: 'Puntuación promedio',
    streak: 'Racha',
    justNow: 'Justo ahora',
    ago: 'hace',
    
    // Difficulty Levels
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    expert: 'Experto',
    
    // Common
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    close: 'Cerrar',
    open: 'Abrir',
    yes: 'Sí',
    no: 'No',
    ok: 'OK',
    submit: 'Enviar',
    reset: 'Restablecer',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('english');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}