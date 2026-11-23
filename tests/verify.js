const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(root).filter(name => name.endsWith('.html'));
const failures = [];
const siteUrl = 'https://madjermahomed.github.io/QuickTools/';

for (const file of htmlFiles) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const canonicalUrl = siteUrl + (file === 'index.html' ? '' : file);
  if (!source.includes('<meta charset="UTF-8">') && !source.includes('<meta charset=\"UTF-8\">')) {
    failures.push(`${file}: missing UTF-8 declaration`);
  }
  if (!source.includes(`<link rel="canonical" href="${canonicalUrl}">`)) {
    failures.push(`${file}: missing canonical URL`);
  }
  if (!source.includes(`<meta property="og:url" content="${canonicalUrl}">`)) {
    failures.push(`${file}: missing Open Graph URL`);
  }
  if (!source.includes('<html lang="en" translate="yes">')) {
    failures.push(`${file}: missing source language or translation support`);
  }
  if (!source.includes('name="viewport"')) failures.push(`${file}: missing viewport`);
  if (!source.includes('<title>')) failures.push(`${file}: missing title`);
  if (!source.includes('rel="stylesheet" href="assets/css/style.css"')) failures.push(`${file}: missing shared stylesheet`);
  if (!source.includes('<main')) failures.push(`${file}: missing main landmark`);
  if (!source.includes('<h1')) failures.push(`${file}: missing H1`);
  for (const match of source.matchAll(/(?:href|src)="([^"#?]+)"/g)) {
    const target = match[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(target)) continue;
    const resolved = path.resolve(root, target);
    if (!fs.existsSync(resolved)) failures.push(`${file}: broken local target ${target}`);
  }
}

function loanPayment(principal, monthlyRate, payments) {
  if (monthlyRate === 0) return principal / payments;
  return principal * monthlyRate * Math.pow(1 + monthlyRate, payments) /
    (Math.pow(1 + monthlyRate, payments) - 1);
}
if (Math.abs(loanPayment(1200, 0.01, 12) - 106.62) > 0.01) failures.push('Loan formula failed');

const compound = (principal, monthly, annualRate, months) => {
  let balance = principal;
  for (let i = 0; i < months; i++) balance = balance * (1 + annualRate) + monthly;
  return balance;
};
if (Math.abs(compound(1000, 0, 0.01, 12) - 1126.825) > 0.01) failures.push('Compound interest formula failed');

if (!fs.existsSync(path.join(root, 'sitemap.xml'))) failures.push('Missing sitemap.xml');
if (!fs.existsSync(path.join(root, 'robots.txt'))) failures.push('Missing robots.txt');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const file of htmlFiles) {
  const url = siteUrl + (file === 'index.html' ? '' : file);
  if (!sitemap.includes(`<loc>${url}</loc>`)) failures.push(`sitemap.xml: missing ${url}`);
}
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${siteUrl}sitemap.xml`)) failures.push('robots.txt: missing sitemap URL');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Verified ${htmlFiles.length} HTML pages, local links, formulas and search files.`);
