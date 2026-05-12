import { execSync } from 'child_process';
try {
  console.log(execSync("git show HEAD:src/features/threadline/EvidenceWorkspace.tsx | grep -A 50 'const mainContent'").toString());
} catch(e) {}
