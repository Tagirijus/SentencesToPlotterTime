import { editor, system } from "@silverbulletmd/silverbullet/syscalls";


const defaultConfig = {
  seconds_per_sentence: 20,
  milliseconds_per_word: 2000,
  ignore_headings: true,
  ignore_lists: true
};

export async function showPlotterTime() {
  const selection = await editor.getSelection();
  let content = await editor.getText();
  if (selection.from != selection.to) {
    content = content.slice(selection.from, selection.to);
  };

  let countSentences = await countSentencesInParagraphs(content);
  let countWords = await countWordsInParagraphs(content);
  const config = await getConfig();

  let seconds_sentences = countSentences * config.seconds_per_sentence;
  let seconds_words = countWords * config.milliseconds_per_word;

  await editor.flashNotification("Plotter runtime: " + formatTime(seconds_sentences, false) + " min [by sentence] or " + formatTime(seconds_words, true) + " min [by words].", "info");
}

async function getConfig() {
  return {...defaultConfig, ...await system.getSpaceConfig("sentencesToPlotterTime", defaultConfig)};
}

async function countSentencesInParagraphs(content: string): number {
  let totalSentences = 0;
  let sentencesRegex = /[^.!?]+[.!?]*/g;

  let ignore_character_group = '';
  const config = await getConfig();
  if (config.ignore_headings) {
    ignore_character_group += '#';
  }
  if (config.ignore_lists) {
    ignore_character_group += '*-';
  }

  let ignore_regex = new RegExp(`^\s*[${ignore_character_group}]`);

  content.split("\n").forEach(line => {
    let trimmedLine = line.trim();
    if (!ignore_regex.test(trimmedLine)) {
      let sentences = trimmedLine.match(sentencesRegex) || [];
      totalSentences += sentences.length;
    }
  });

  return totalSentences;
}

async function countWordsInParagraphs(content: string): number {
  let totalWords = 0;
  let wordRegex = /\b\w+\b/g;

  let ignore_character_group = '';
  const config = await getConfig();
  if (config.ignore_headings) {
    ignore_character_group += '#';
  }
  if (config.ignore_lists) {
    ignore_character_group += '*-';
  }

  let ignore_regex = new RegExp(`^\s*[${ignore_character_group}]`);

  content.split("\n").forEach(line => {
    let trimmedLine = line.trim();
    if (!ignore_regex.test(trimmedLine)) {
      let words = trimmedLine.match(wordRegex) || [];
      totalWords += words.length;
    }
  });

  return totalWords;
}

function formatTime(seconds, milliseconds) {
  if (milliseconds) {
    seconds = seconds / 1000;
  }
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;

  let formattedMinutes = String(minutes);
  let formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
