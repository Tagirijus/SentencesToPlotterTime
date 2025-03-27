import { editor, system } from "@silverbulletmd/silverbullet/syscalls";


const defaultConfig = {
  seconds_per_sentence: 15,
  ignore_headings: true,
  ignore_lists: true
};

export async function showPlotterTime() {
  const selection = await editor.getSelection();
  let content = await editor.getText();
  if (selection.from != selection.to) {
    content = content.slice(selection.from, selection.to);
  };

  let count = await countSentencesInParagraphs(content);
  const config = await getConfig();

  let seconds = count * config.seconds_per_sentence;

  await editor.flashNotification("Plotter runtime: " + formatTime(seconds) + " seconds.", "info");
}

async function getConfig() {
  return {...defaultConfig, ...await system.getSpaceConfig("sentencesToPlotterTime", defaultConfig)};
}

async function countSentencesInParagraphs(content: string): number {
  let totalSentences = 0;
  let sentencesRegex = /[^.!?]+[.!?]*/g;

  let ignore_character_group = '';
  const config = await getConfig();
  console.log(config);
  if (config.ignore_headings) {
    ignore_character_group += '#';
  }
  if (config.ignore_lists) {
    ignore_character_group += '-*';
  }

  let ignore_regex = new RegExp(`^[${ignore_character_group}]`);

  content.split("\n").forEach(line => {
    let trimmedLine = line.trim();
    if (!ignore_regex.test(trimmedLine)) {
      let sentences = trimmedLine.match(sentencesRegex) || [];
      totalSentences += sentences.length;
    }
  });

  return totalSentences;
}

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;

  let formattedMinutes = String(minutes);
  let formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
