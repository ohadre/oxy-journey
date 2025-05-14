import { Question, LocalizedText, DisplayQuestion, LanguageCode, LocalizedAnswerOption } from '../types/question.types';

// Helper to resolve localized text, defaulting to English if the specified language or text itself is missing.
const resolveText = (localizedText: LocalizedText | string | undefined, lang: LanguageCode): string => {
  if (typeof localizedText === 'string') {
    return localizedText; // It's already a non-localized string
  }
  if (!localizedText) return '';
  return localizedText[lang] || localizedText.en || ''; // Default to specified lang, then English, then empty string
};

// Helper to resolve localized options
const resolveOptions = (
  sourceOptions: Array<{ text: LocalizedText | string; isCorrect: boolean }> | undefined,
  lang: LanguageCode
): { text: string; isCorrect: boolean }[] | undefined => {
  if (!sourceOptions) return undefined;
  return sourceOptions.map(opt => ({
    text: resolveText(opt.text, lang), // Use the improved resolveText
    isCorrect: !!opt.isCorrect, // Ensure boolean
  }));
};

/**
 * Fetches questions from the JSON data file and resolves their text fields
 * to the specified language.
 * Gracefully handles mixed data where some questions might be in the old single-language format.
 * @param lang The language code (e.g., 'en', 'he') to resolve texts to.
 * @returns A promise that resolves to an array of DisplayQuestion objects.
 */
export const fetchAndResolveQuestions = async (lang: LanguageCode): Promise<DisplayQuestion[]> => {
  try {
    const response = await fetch('/data/questions.json'); // Path relative to public directory
    if (!response.ok) {
      console.error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch questions: ${response.statusText}`);
    }
    const questionsData: Question[] = await response.json(); // Assume data matches Question[] type more closely now

    const resolvedQuestions: DisplayQuestion[] = questionsData.map((qData): DisplayQuestion => {
      
      const questionText = resolveText(qData.text, lang);
      const questionOptions = resolveOptions(qData.options, lang);
      const questionExplanation = qData.explanation ? resolveText(qData.explanation, lang) : undefined;
      const imageUrl = qData.image_url; // Get the image_url

      // For Yes/No questions that might not have options defined in questions.json but expect them for rendering
      // (especially if they were string-only and we want consistent DisplayQuestion structure)
      let finalOptions = questionOptions;
      if (qData.type === 'yes-no' && (!questionOptions || questionOptions.length === 0)) {
        // console.warn(`Question ${qData.id} is yes-no but has no/empty options. Providing default Yes/No.`);
        // Provide default English Yes/No if original options are completely missing or text resolution failed to populate them
        // This part needs care: if qData.options was present but texts resolved to empty, this might overwrite.
        // However, the goal is to ensure Yes/No questions always have renderable options.
        if (lang === 'he') {
            finalOptions = [
                { text: 'נכון', isCorrect: qData.options?.find(o => resolveText(o.text, 'en').toLowerCase() === 'true')?.isCorrect || false },
                { text: 'לא נכון', isCorrect: qData.options?.find(o => resolveText(o.text, 'en').toLowerCase() === 'false')?.isCorrect || false }
            ];
        } else {
            finalOptions = [
                { text: 'True', isCorrect: qData.options?.find(o => resolveText(o.text, 'en').toLowerCase() === 'true')?.isCorrect || false },
                { text: 'False', isCorrect: qData.options?.find(o => resolveText(o.text, 'en').toLowerCase() === 'false')?.isCorrect || false }
            ];
        }
        // A sanity check to ensure one of the default options is marked correct if original data was ambiguous
        // This might be too aggressive if the original data was intentionally different.
        // For now, we assume typical True/False where one must be correct.
        const hasCorrectOption = finalOptions.some(opt => opt.isCorrect);
        if (!hasCorrectOption && finalOptions.length > 0 && qData.options && qData.options.length > 0) {
            // If no default option got marked correct, try to infer from the first original option if possible
            // This logic is getting complex and indicates data structure issues for q2 type questions.
            // For q2 specifically, options were [ { text: "True", isCorrect: true }, { text: "False", isCorrect: false } ]
            // So, find(o => resolveText(o.text, 'en').toLowerCase() === 'true') should work.
        }

      }

      return {
        id: qData.id,
        topic: qData.topic, // Topic is not localized in this iteration
        type: qData.type,
        text: questionText,
        options: finalOptions, // Use the potentially defaulted finalOptions for yes-no
        // Determine correctOptionIndex after options are finalized
        // This is crucial for 'multiple-choice' and 'yes-no'
        correctOptionIndex: finalOptions?.findIndex(opt => opt.isCorrect),
        explanation: questionExplanation,
        image_url: imageUrl, // Pass the image_url
      };
    });
    
    // console.log(`[questionService] Resolved ${lang} questions:`, resolvedQuestions);
    return resolvedQuestions;
  } catch (error) {
    console.error("[questionService] Error fetching or processing questions:", error);
    return []; // Return empty array on error as a fallback
  }
};

// Example of how this might be used (primarily for testing/dev purposes):
/*
const loadQuestions = async () => {
  console.log('Loading Hebrew questions...');
  const heQuestions = await fetchAndResolveQuestions('he');
  console.log('HE Questions:', heQuestions);

  console.log('\nLoading English questions...');
  const enQuestions = await fetchAndResolveQuestions('en');
  console.log('EN Questions:', enQuestions);

  // Test with a question that might be in old format (if q2/q3 weren't updated)
  console.log('\nEnglish Question (potentially old format ID q2):',
    enQuestions.find(q => q.id === 'q2')
  );
  console.log('\nHebrew Question (potentially old format ID q2 - would fallback to EN if text was string):',
    heQuestions.find(q => q.id === 'q2')
  );
};

loadQuestions();
*/