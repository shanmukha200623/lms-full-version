['auth','courses','assignments','materials','submissions','users'].forEach(r=>{
  try {
    const mod = require('./routes/' + r);
    if (typeof mod === 'object' && !mod.stack) console.log(`⚠️  ${r}.js exports object, not router`);
    else console.log(`✅ ${r}.js looks fine`);
  } catch(e) {
    console.log(`❌ Could not load ${r}.js`, e.message);
  }
});
