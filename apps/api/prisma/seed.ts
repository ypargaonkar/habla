import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const lessons = [
  {
    title: 'Greetings & Introductions',
    description: 'Learn essential greetings and how to introduce yourself',
    level: 'A1',
    scenario: 'meeting_people',
    orderIndex: 1,
    content: {
      introduction:
        "In this lesson, you'll learn how to greet people and introduce yourself in Spanish.",
      dialogue: [
        {
          speaker: 'María',
          spanish: '¡Hola! Me llamo María. ¿Cómo te llamas?',
          english: 'Hello! My name is María. What is your name?',
        },
        {
          speaker: 'You',
          spanish: 'Hola, me llamo [your name]. Mucho gusto.',
          english: 'Hello, my name is [your name]. Nice to meet you.',
        },
        {
          speaker: 'María',
          spanish: 'Mucho gusto también. ¿De dónde eres?',
          english: 'Nice to meet you too. Where are you from?',
        },
        {
          speaker: 'You',
          spanish: 'Soy de Estados Unidos. ¿Y tú?',
          english: 'I am from the United States. And you?',
        },
      ],
      exercises: [
        {
          id: '1',
          type: 'shadowing',
          prompt: '¡Hola! Me llamo María.',
          expectedResponse: '¡Hola! Me llamo María.',
          hint: 'Try to match the intonation exactly',
        },
        {
          id: '2',
          type: 'respond',
          prompt: '¿Cómo te llamas?',
          expectedResponse: 'Me llamo...',
          acceptableResponses: ['Me llamo', 'Soy', 'Mi nombre es'],
          hint: 'Say your name in Spanish',
        },
        {
          id: '3',
          type: 'respond',
          prompt: '¿De dónde eres?',
          expectedResponse: 'Soy de...',
          acceptableResponses: ['Soy de', 'Vengo de'],
          hint: 'Say where you are from',
        },
      ],
      vocabulary: [
        { spanish: 'hola', english: 'hello', pronunciation: 'OH-lah' },
        {
          spanish: 'me llamo',
          english: 'my name is',
          pronunciation: 'meh YAH-moh',
        },
        {
          spanish: 'mucho gusto',
          english: 'nice to meet you',
          pronunciation: 'MOO-choh GOO-stoh',
        },
        { spanish: '¿cómo te llamas?', english: 'what is your name?' },
        { spanish: 'soy de', english: 'I am from' },
      ],
    },
  },
  {
    title: 'Ordering at a Restaurant',
    description: 'Learn how to order food and drinks at a restaurant',
    level: 'A1',
    scenario: 'restaurant',
    orderIndex: 2,
    content: {
      introduction:
        "Learn essential phrases for ordering food and drinks at a Spanish restaurant.",
      dialogue: [
        {
          speaker: 'Waiter',
          spanish: 'Buenas tardes. ¿Qué le gustaría ordenar?',
          english: 'Good afternoon. What would you like to order?',
        },
        {
          speaker: 'You',
          spanish: 'Quiero un café con leche, por favor.',
          english: 'I want a coffee with milk, please.',
        },
        {
          speaker: 'Waiter',
          spanish: '¿Algo más?',
          english: 'Anything else?',
        },
        {
          speaker: 'You',
          spanish: 'Sí, también quiero una tostada.',
          english: 'Yes, I also want a toast.',
        },
        {
          speaker: 'Waiter',
          spanish: 'Muy bien. ¿Desea algo de beber?',
          english: 'Very good. Would you like something to drink?',
        },
        {
          speaker: 'You',
          spanish: 'Un vaso de agua, por favor.',
          english: 'A glass of water, please.',
        },
      ],
      exercises: [
        {
          id: '1',
          type: 'listen',
          prompt: '¿Qué le gustaría ordenar?',
          expectedResponse: 'Quiero un café con leche, por favor.',
          hint: 'Order a coffee with milk',
        },
        {
          id: '2',
          type: 'respond',
          prompt: '¿Algo más?',
          expectedResponse: 'Sí, también quiero...',
          hint: 'Order something else',
        },
        {
          id: '3',
          type: 'shadowing',
          prompt: 'Me gustaría la cuenta, por favor.',
          expectedResponse: 'Me gustaría la cuenta, por favor.',
          hint: 'Ask for the check',
        },
      ],
      vocabulary: [
        { spanish: 'quiero', english: 'I want', pronunciation: 'kee-EH-roh' },
        {
          spanish: 'me gustaría',
          english: 'I would like',
          pronunciation: 'meh goo-stah-REE-ah',
        },
        {
          spanish: 'por favor',
          english: 'please',
          pronunciation: 'pohr fah-VOHR',
        },
        { spanish: 'la cuenta', english: 'the check/bill' },
        { spanish: 'el café', english: 'coffee' },
        { spanish: 'el agua', english: 'water' },
      ],
    },
  },
  {
    title: 'Asking for Directions',
    description: 'Learn how to ask for and understand directions',
    level: 'A1',
    scenario: 'directions',
    orderIndex: 3,
    content: {
      introduction: "Learn how to ask for directions and understand responses.",
      dialogue: [
        {
          speaker: 'You',
          spanish: 'Disculpe, ¿dónde está el museo?',
          english: 'Excuse me, where is the museum?',
        },
        {
          speaker: 'Local',
          spanish: 'El museo está a dos calles de aquí. Sigue recto y gira a la derecha.',
          english: 'The museum is two streets from here. Go straight and turn right.',
        },
        {
          speaker: 'You',
          spanish: '¿Está lejos?',
          english: 'Is it far?',
        },
        {
          speaker: 'Local',
          spanish: 'No, está cerca. A cinco minutos caminando.',
          english: "No, it's close. Five minutes walking.",
        },
      ],
      exercises: [
        {
          id: '1',
          type: 'respond',
          prompt: '¿Dónde está la estación de tren?',
          expectedResponse: 'Disculpe, ¿dónde está la estación de tren?',
          hint: 'Ask where the train station is',
        },
        {
          id: '2',
          type: 'shadowing',
          prompt: 'Sigue recto y gira a la izquierda.',
          expectedResponse: 'Sigue recto y gira a la izquierda.',
          hint: 'Go straight and turn left',
        },
      ],
      vocabulary: [
        { spanish: 'disculpe', english: 'excuse me' },
        { spanish: '¿dónde está?', english: 'where is?' },
        { spanish: 'a la derecha', english: 'to the right' },
        { spanish: 'a la izquierda', english: 'to the left' },
        { spanish: 'sigue recto', english: 'go straight' },
        { spanish: 'cerca', english: 'close/near' },
        { spanish: 'lejos', english: 'far' },
      ],
    },
  },
  {
    title: 'Shopping Basics',
    description: 'Learn essential phrases for shopping',
    level: 'A1',
    scenario: 'shopping',
    orderIndex: 4,
    content: {
      introduction: "Learn how to shop and ask about prices in Spanish.",
      dialogue: [
        {
          speaker: 'You',
          spanish: '¿Cuánto cuesta esto?',
          english: 'How much does this cost?',
        },
        {
          speaker: 'Seller',
          spanish: 'Cuesta veinte euros.',
          english: 'It costs twenty euros.',
        },
        {
          speaker: 'You',
          spanish: '¿Tiene uno más pequeño?',
          english: 'Do you have a smaller one?',
        },
        {
          speaker: 'Seller',
          spanish: 'Sí, aquí tiene.',
          english: 'Yes, here you go.',
        },
      ],
      exercises: [
        {
          id: '1',
          type: 'respond',
          prompt: '¿Puedo ayudarle?',
          expectedResponse: 'Sí, ¿cuánto cuesta esto?',
          hint: 'Ask how much something costs',
        },
        {
          id: '2',
          type: 'shadowing',
          prompt: 'Me lo llevo.',
          expectedResponse: 'Me lo llevo.',
          hint: "I'll take it",
        },
      ],
      vocabulary: [
        { spanish: '¿cuánto cuesta?', english: 'how much does it cost?' },
        { spanish: 'barato', english: 'cheap' },
        { spanish: 'caro', english: 'expensive' },
        { spanish: 'grande', english: 'big' },
        { spanish: 'pequeño', english: 'small' },
        { spanish: 'me lo llevo', english: "I'll take it" },
      ],
    },
  },
  {
    title: 'Making Plans with Friends',
    description: 'Learn how to make plans and talk about future activities',
    level: 'A2',
    scenario: 'social',
    orderIndex: 1,
    content: {
      introduction:
        "Learn how to make plans and suggest activities with friends.",
      dialogue: [
        {
          speaker: 'Friend',
          spanish: '¿Qué quieres hacer este fin de semana?',
          english: 'What do you want to do this weekend?',
        },
        {
          speaker: 'You',
          spanish: 'Podemos ir al cine. ¿Qué te parece?',
          english: "We can go to the movies. What do you think?",
        },
        {
          speaker: 'Friend',
          spanish: '¡Buena idea! ¿A qué hora?',
          english: 'Good idea! What time?',
        },
        {
          speaker: 'You',
          spanish: '¿Te va bien a las siete?',
          english: 'Does seven work for you?',
        },
      ],
      exercises: [
        {
          id: '1',
          type: 'respond',
          prompt: '¿Qué quieres hacer mañana?',
          expectedResponse: 'Quiero ir...',
          hint: 'Suggest an activity',
        },
        {
          id: '2',
          type: 'shadowing',
          prompt: '¿Te va bien a las ocho?',
          expectedResponse: '¿Te va bien a las ocho?',
          hint: 'Ask if 8 o\'clock works',
        },
      ],
      vocabulary: [
        { spanish: '¿qué quieres hacer?', english: 'what do you want to do?' },
        { spanish: 'podemos', english: 'we can' },
        { spanish: '¿qué te parece?', english: 'what do you think?' },
        { spanish: '¿a qué hora?', english: 'what time?' },
        { spanish: '¿te va bien?', english: 'does it work for you?' },
        { spanish: 'buena idea', english: 'good idea' },
      ],
    },
  },
];

async function main() {
  console.log('Seeding database...');

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: {
        level_orderIndex: {
          level: lesson.level,
          orderIndex: lesson.orderIndex,
        },
      },
      update: lesson,
      create: lesson,
    });
    console.log(`Created lesson: ${lesson.title}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
