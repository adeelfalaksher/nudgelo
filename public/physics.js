export const EXPERIMENTS = {
  pendulum: {
    title: 'The pendulum question', label: '01 · Motion', question: 'Which pendulum swings faster?',
    description: 'Does a heavier weight change the rhythm? Change one thing and find out.',
    choices: ['A swings faster', 'B swings faster', 'Same rhythm'],
    fields: [
      ['lengthA', 'A · String length', 0.4, 1.6, 0.1, 0.8, 'm'], ['lengthB', 'B · String length', 0.4, 1.6, 0.1, 1.2, 'm'],
      ['massA', 'A · Bob mass', 0.1, 2, 0.1, 0.4, 'kg'], ['massB', 'B · Bob mass', 0.1, 2, 0.1, 1.2, 'kg']
    ],
    limits: 'Ideal small angle pendulums (10°), massless strings, no drag. Mass does not change the period in this model.',
    formula: 'T = 2π √(L / g), g = 9.81 m/s²'
  },
  friction: {
    title: 'The last glide', label: '02 · Friction', question: 'Which sled travels farther?',
    description: 'Same launch speed. Different surfaces. Let chat call the last glide.',
    choices: ['A goes farther', 'B goes farther', 'Same distance'],
    fields: [
      ['muA', 'A · Friction coefficient', 0.1, 0.6, 0.05, 0.15, 'μ'], ['muB', 'B · Friction coefficient', 0.1, 0.6, 0.05, 0.35, 'μ'],
      ['speed', 'Shared launch speed', 1, 4, 0.5, 3, 'm/s']
    ],
    limits: 'Level surface, constant kinetic friction, no air drag or rolling. Both sleds start at the same speed.',
    formula: 'a = μg, stopping distance d = v² / (2μg)'
  },
  buoyancy: {
    title: 'Float or fall', label: '03 · Density', question: 'Which block floats?',
    description: 'Identical sized blocks, different densities. Find what really keeps something afloat.',
    choices: ['Only A floats', 'Only B floats', 'Both or neither'],
    fields: [
      ['densityA', 'A · Block density', 200, 1800, 100, 600, 'kg/m³'], ['densityB', 'B · Block density', 200, 1800, 100, 1400, 'kg/m³'],
      ['fluid', 'Liquid density', 800, 1300, 100, 1000, 'kg/m³']
    ],
    limits: 'Ideal equilibrium in a large liquid reservoir. No waves, surface tension or displaced level change. Equal density is neutrally buoyant, not surface floating.',
    formula: 'Floating fraction submerged = ρblock / ρliquid'
  }
};
export function parameters(kind, values = {}) {
  const spec = Object.hasOwn(EXPERIMENTS,kind) ? EXPERIMENTS[kind] : null;
  if (!spec || !values || typeof values !== 'object' || Array.isArray(values)) throw new Error('Choose a supported experiment.');
  const p = {};
  for (const [key,,min,max,,fallback] of spec.fields) {
    const value = values[key] === undefined ? fallback : values[key];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error('Keep experiment values within the displayed limits.');
    p[key] = value;
  }
  return Object.freeze(p);
}
const comparison = (a,b) => Math.abs(a-b) < 1e-9 ? 'same' : a < b ? 'a' : 'b';
export function result(kind, values) {
  const p = parameters(kind,values);
  if (kind === 'pendulum') {
    const a = 2*Math.PI*Math.sqrt(p.lengthA/9.81), b = 2*Math.PI*Math.sqrt(p.lengthB/9.81);
    return {winner:comparison(a,b), a, b, unit:'s per swing', explanation: 'A shorter string gives a shorter period. Changing only the mass leaves the rhythm unchanged in the small angle model.'};
  }
  if (kind === 'friction') {
    const a = p.speed**2/(2*p.muA*9.81), b = p.speed**2/(2*p.muB*9.81);
    return {winner:comparison(b,a), a, b, unit:'m traveled', explanation:'Less friction means less deceleration, so the sled keeps moving longer. The distance is calculated from the same friction model that moves the sleds.'};
  }
  const a = p.densityA < p.fluid, b = p.densityB < p.fluid;
  return {winner:a===b?'same':a?'a':'b', a:p.densityA/p.fluid, b:p.densityB/p.fluid, unit:'density ratio', explanation:'A block floats at the surface only when it is less dense than the liquid. A density ratio of 1 is neutral buoyancy; a higher ratio sinks. This animation interpolates to equilibrium, not a fluid dynamics simulation.'};
}
export function position(kind, values, seconds) {
  const p = parameters(kind, values), t = Math.max(0,Number.isFinite(seconds)?seconds:0), r = result(kind,p);
  if (kind === 'pendulum') return {a:10*Math.cos(2*Math.PI*t/r.a), b:10*Math.cos(2*Math.PI*t/r.b)};
  if (kind === 'friction') {
    const distance = mu => {const duration = Math.min(t,p.speed/(mu*9.81));return p.speed*duration-0.5*mu*9.81*duration**2;};
    return {a:distance(p.muA), b:distance(p.muB)};
  }
  const equilibrium = ratio => ratio<1 ? ratio : ratio===1 ? 1.5 : 3;
  const ease = 1-Math.exp(-t*1.3);
  return {a:equilibrium(r.a)*ease, b:equilibrium(r.b)*ease};
}
