const d = require('/opt/resume/shared/data/resume.json');
console.log('jobTitle:', d.basic.jobTitle);
console.log('projects:', d.projects.length);
d.projects.forEach((p, i) => {
  console.log('  P' + (i + 1) + ':', (p.name || '').substring(0, 35));
  console.log('      stack:', (p.stack || '').length, 'chars');
  console.log('      target:', (p.target || '').length, 'chars');
  console.log('      team:', (p.team || '').length, 'chars');
  console.log('      contribution:', (p.contribution || '').length, 'chars');
  console.log('      effect:', (p.effect || '').length, 'chars');
});
