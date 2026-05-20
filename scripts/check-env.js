#!/usr/bin/env node
/**
 * NoteForge AI - Setup Verification Script
 * Run: node scripts/check-env.js
 */

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_APP_URL",
];

let allGood = true;
const missing = [];

console.log("\n🔍 NoteForge AI — Environment Check\n");
console.log("─".repeat(40));

for (const key of required) {
  const val = process.env[key];
  if (!val || val.startsWith("your_") || val.startsWith("placeholder")) {
    console.log(`  ❌  ${key}`);
    missing.push(key);
    allGood = false;
  } else {
    const masked = val.slice(0, 8) + "..." + val.slice(-4);
    console.log(`  ✅  ${key} = ${masked}`);
  }
}

console.log("─".repeat(40));

if (allGood) {
  console.log("\n✅ All environment variables are set!\n");
  process.exit(0);
} else {
  console.log(`\n❌ Missing ${missing.length} variable(s):\n`);
  missing.forEach((k) => console.log(`   • ${k}`));
  console.log("\nCopy .env.example → .env.local and fill in the values.\n");
  process.exit(1);
}
