/* eslint-disable no-console */
import { config } from 'dotenv';
import { exec } from 'child_process';

config();

async function run(cmd: string, handler: (data: string) => void) {
  const child = exec(cmd);

  await new Promise<void>((resolve) => {
    if (child.stdout) {
      child.on('close', () => resolve());
      child.stdout.on('data', handler);
    }
  });
}

async function main() {
  let code = 0;

  try {
    const url = process.env.EXPO_URL;
    if (!url) throw new Error('Missing environnement variable: EXPO_URL.');

    const emulators: string[] = [];

    await run('adb devices', (data: string) => {
      const lines = data.split('\n');

      lines.forEach((line) => { if (line.includes('emulator')) emulators.push(line.split('\t')[0]); });
    });

    const promises = emulators.map((emulator) => run(
      `adb -s ${emulator} shell am start -a android.intent.action.VIEW -d ${url}`,
      () => console.log(`Starting ${emulator} on ${url}.`),
    ));

    await Promise.all(promises);
  } catch (e) {
    code = 1;
    console.error(e);
  } finally {
    process.exit(code);
  }
}

main();
