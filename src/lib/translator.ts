// Multi-language Translation Helper for Quiz Questions & Results

const TRANSLATION_DICTIONARY: Record<string, Record<string, string>> = {
  hi: {
    // General terms
    'What does AI stand for?': 'AI का पूर्ण रूप क्या है?',
    'Automated Interface': 'ऑटोमेटेड इंटरफेस',
    'Artificial Intelligence': 'आर्टिफिशियल इंटेलिजेंस (कृत्रिम बुद्धिमत्ता)',
    'Algorithmic Integration': 'एल्गोरिदमिक एकीकरण',
    'Advanced Iteration': 'एडवांस इटेरेशन',
    'AI stands for Artificial Intelligence, which is the simulation of human intelligence processes by machines.':
      'AI का अर्थ आर्टिफिशियल इंटेलिजेंस है, जो मशीनों द्वारा मानव बुद्धिमत्ता प्रक्रियाओं का सिमुलेशन है।',

    'Which of the following is considered a subset of AI?':
      'निम्नलिखित में से किसे AI का उपसमूह माना जाता है?',
    'Cloud Computing': 'क्लाउड कंप्यूटिंग',
    'Machine Learning': 'मशीन लर्निंग',
    Blockchain: 'ब्लॉकचेन',
    'Quantum Computing': 'क्वांटम कंप्यूटिंग',
    'Machine Learning is a subset of AI that focuses on building systems that learn from data.':
      'मशीन लर्निंग AI का एक उपसमूह है जो डेटा से सीखने वाले सिस्टम बनाने पर केंद्रित है।',

    'What is a "Large Language Model" (LLM)?': '"लार्ज लैंग्वेज मॉडल" (LLM) क्या है?',
    'A model that translates languages perfectly': 'एक मॉडल जो भाषाओं का सटीक अनुवाद करता है',
    'A huge database of words': 'शब्दों का एक विशाल डेटाबेस',
    'An AI model trained on vast amounts of text to understand and generate human language':
      'एक AI मॉडल जिसे मानव भाषा को समझने और उत्पन्न करने के लिए विशाल मात्रा में टेक्स्ट पर प्रशिक्षित किया गया है',
    'A programming language for AI': 'AI के लिए एक प्रोग्रामिंग भाषा',

    "Which test was proposed by Alan Turing to evaluate a machine's capability to exhibit intelligent behavior?":
      'ऐलन ट्यूरिंग द्वारा मशीन की बुद्धिमान व्यवहार प्रदर्शित करने की क्षमता का मूल्यांकन करने के लिए कौन सा परीक्षण प्रस्तावित किया गया था?',
    'The Turing Test': 'ट्यूरिंग टेस्ट',
    'The AI Benchmark': 'AI बेंचमार्क',
    'The Intelligence Quotient (IQ) Test': 'इंटेलिजेंस क्वोटिएंट (IQ) टेस्ट',
    'The Machine Learning Exam': 'मशीन लर्निंग परीक्षा',

    'What does "NLP" stand for in the context of Artificial Intelligence?':
      'आर्टिफिशियल इंटेलिजेंस के संदर्भ में "NLP" का पूर्ण रूप क्या है?',
    'Neural Language Programming': 'न्यूरल लैंग्वेज प्रोग्रामिंग',
    'Natural Language Processing': 'नेचुरल लैंग्वेज प्रोसेसिंग',
    'New Learning Protocol': 'न्यू लर्निंग प्रोटोकॉल',
    'Non-Linear Processing': 'नॉन-लीनियर प्रोसेसिंग',

    'What is an "algorithm" in computer science?': 'कंप्यूटर साइंस में "एल्गोरिदम" क्या है?',
    'A type of computer hardware': 'कंप्यूटर हार्डवेयर का एक प्रकार',
    'A programming language': 'एक प्रोग्रामिंग भाषा',
    'A set of instructions designed to perform a specific task':
      'एक विशिष्ट कार्य करने के लिए डिज़ाइन किए गए निर्देशों का सेट',
    'A specific brand of AI': 'AI का एक विशिष्ट ब्रांड',

    'What is "Generative AI"?': '"जनरेटिव AI" क्या है?',
    'Sorts large databases': 'बड़े डेटाबेस को सॉर्ट करता है',
    'Generates new content, such as text, images, or audio':
      'नया कंटेंट जनरेट करता है, जैसे टेक्स्ट, इमेज या ऑडियो',
    'Repairs broken computer code automatically':
      'टूटे हुए कंप्यूटर कोड की स्वचालित मरम्मत करता है',
    'Translates text into binary code': 'टेक्स्ट को बाइनरी कोड में अनुवाद करता है',

    'What is a primary ethical concern regarding AI systems?':
      'AI सिस्टम से संबंधित प्राथमिक नैतिक चिंता क्या है?',
    'It uses too much internet bandwidth': 'यह बहुत अधिक इंटरनेट बैंडविड्थ का उपयोग करता है',
    'AI systems might exhibit bias learned from their training data':
      'AI सिस्टम अपने प्रशिक्षण डेटा से सीखे गए पूर्वाग्रह को प्रदर्शित कर सकते हैं',
    'AI will forget how to speak human languages': 'AI मानव भाषाएं बोलना भूल जाएगा',
    'AI cannot be turned off': 'AI को बंद नहीं किया जा सकता',

    'What is Computer Vision?': 'कंप्यूटर विज़न क्या है?',
    'A monitor with very high resolution': 'बहुत उच्च रेजोल्यूशन वाला मॉनिटर',
    'A field of AI that enables computers to derive meaning from digital images and videos':
      'AI का एक क्षेत्र जो कंप्यूटर को डिजिटल छवियों और वीडियो से अर्थ निकालने में सक्षम बनाता है',
    'A virtual reality headset': 'एक वर्चुअल रियलिटी हेडसेट',
    'A type of graphics card': 'ग्राफिक्स कार्ड का एक प्रकार',

    'Which of the following is NOT an application of AI?':
      'निम्नलिखित में से कौन सा AI का अनुप्रयोग नहीं है?',
    'Self-driving cars': 'सेल्फ-ड्राइविंग कारें',
    'Spam email filters': 'स्पैम ईमेल फिल्टर',
    'Basic mechanical clocks': 'बुनियादी मैकेनिकल घड़ियां',
    'Voice assistants like Siri or Alexa': 'सिरी या एलेक्सा जैसे वॉयस असिस्टेंट',
  },
  es: {
    'What does AI stand for?': '¿Qué significan las siglas IA?',
    'Automated Interface': 'Interfaz Automatizada',
    'Artificial Intelligence': 'Inteligencia Artificial',
    'Algorithmic Integration': 'Integración Algorítmica',
    'Advanced Iteration': 'Iteración Avanzada',

    'Which of the following is considered a subset of AI?':
      '¿Cuál de los siguientes se considera un subconjunto de la IA?',
    'Cloud Computing': 'Computación en la nube',
    'Machine Learning': 'Aprendizaje Automático (Machine Learning)',
    Blockchain: 'Cadena de bloques (Blockchain)',
    'Quantum Computing': 'Computación Cuántica',

    'What is a "Large Language Model" (LLM)?': '¿Qué es un "Modelo de Lenguaje Grande" (LLM)?',
    'A model that translates languages perfectly': 'Un modelo que traduce idiomas perfectamente',
    'A huge database of words': 'Una enorme base de datos de palabras',
    'An AI model trained on vast amounts of text to understand and generate human language':
      'Un modelo de IA entrenado con grandes cantidades de texto para entender y generar lenguaje humano',
    'A programming language for AI': 'Un lenguaje de programación para IA',
  },
  fr: {
    'What does AI stand for?': 'Que signifie IA ?',
    'Automated Interface': 'Interface Automatisée',
    'Artificial Intelligence': 'Intelligence Artificielle',
    'Algorithmic Integration': 'Intégration Algorithmique',
    'Advanced Iteration': 'Itération Avancée',

    'Which of the following is considered a subset of AI?':
      "Lequel des éléments suivants est considéré comme un sous-ensemble de l'IA ?",
    'Cloud Computing': 'Cloud Computing',
    'Machine Learning': 'Machine Learning (Apprentissage Automatique)',
    Blockchain: 'Blockchain',
    'Quantum Computing': 'Informatique Quantique',
  },
  de: {
    'What does AI stand for?': 'Wofür steht KI?',
    'Automated Interface': 'Automatisierte Schnittstelle',
    'Artificial Intelligence': 'Künstliche Intelligenz',
    'Algorithmic Integration': 'Algorithmische Integration',
    'Advanced Iteration': 'Erweiterte Iteration',
  },
  ar: {
    'What does AI stand for?': 'ماذا يعني الذكاء الاصطناعي (AI)؟',
    'Automated Interface': 'واجهة مؤتمتة',
    'Artificial Intelligence': 'الذكاء الاصطناعي',
    'Algorithmic Integration': 'التكامل الخوارزمي',
    'Advanced Iteration': 'التكرار المتقدم',
  },
  zh: {
    'What does AI stand for?': 'AI 代表什么？',
    'Automated Interface': '自动化接口',
    'Artificial Intelligence': '人工智能 (Artificial Intelligence)',
    'Algorithmic Integration': '算法集成',
    'Advanced Iteration': '高级迭代',
  },
  ru: {
    'What does AI stand for?': 'Что означает ИИ (AI)?',
    'Automated Interface': 'Автоматизированный интерфейс',
    'Artificial Intelligence': 'Искусственный интеллект',
    'Algorithmic Integration': 'Алгоритмическая интеграция',
    'Advanced Iteration': 'Расширенная итерация',
  },
};

export function getTranslationForText(text: string, locale: string): string {
  if (!text || !locale || locale === 'en') return text;
  const dict = TRANSLATION_DICTIONARY[locale];
  if (dict && dict[text]) {
    return dict[text];
  }
  return text;
}

export function translateQuestionData(q: any, locale: string) {
  if (!q || !locale || locale === 'en') return q;

  // Check if DB Question Translation object exists matching locale
  if (Array.isArray(q.translations)) {
    const dbTrans = q.translations.find((t: any) => t.locale === locale);
    if (dbTrans) {
      let opts: string[] = [];
      try {
        opts = typeof dbTrans.options === 'string' ? JSON.parse(dbTrans.options) : dbTrans.options;
      } catch {
        opts = q.options;
      }
      return {
        ...q,
        text: dbTrans.text || q.text,
        options: Array.isArray(opts) && opts.length >= 2 ? opts : q.options,
        explanation: dbTrans.explanation || q.explanation,
      };
    }
  }

  // Dictionary Fallback
  const translatedText = getTranslationForText(q.text, locale);
  const rawOpts = Array.isArray(q.options)
    ? q.options
    : typeof q.options === 'string'
      ? JSON.parse(q.options)
      : [];
  const translatedOpts = rawOpts.map((opt: string) => getTranslationForText(opt, locale));
  const translatedExp = q.explanation
    ? getTranslationForText(q.explanation, locale)
    : q.explanation;

  return {
    ...q,
    text: translatedText,
    options: translatedOpts,
    explanation: translatedExp,
  };
}
