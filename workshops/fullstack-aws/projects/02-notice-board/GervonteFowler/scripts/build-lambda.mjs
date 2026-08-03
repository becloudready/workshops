import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = join(root, 'dist', 'lambda-package');
const zipPath = join(root, 'dist', 'lambda.zip');

function run(command, args, options = {}) {
  execFileSync(command, args, { stdio: 'inherit', ...options });
}

run('npm', ['run', 'server:build'], { cwd: root });

rmSync(outputDirectory, { recursive: true, force: true });
if (existsSync(zipPath)) {
  rmSync(zipPath);
}
mkdirSync(join(outputDirectory, 'dist'), { recursive: true });

cpSync(join(root, 'dist', 'server'), join(outputDirectory, 'dist', 'server'), {
  recursive: true,
});
cpSync(join(root, 'lambda', 'package.json'), join(outputDirectory, 'package.json'));
cpSync(join(root, 'lambda', 'package-lock.json'), join(outputDirectory, 'package-lock.json'));

run('npm', ['ci', '--omit=dev', '--ignore-scripts'], { cwd: outputDirectory });
run('zip', ['-q', '-r', zipPath, '.'], { cwd: outputDirectory });

console.log(`Lambda artifact created at ${zipPath}`);
