const target = (process.env.TARGET_URL || '').replace(/\/$/, '');
const users = Number(process.env.USERS || '100');
const durationSeconds = Number(process.env.DURATION_SECONDS || '30');
const allowProduction = process.env.ALLOW_PRODUCTION === 'true';
const testPhone = process.env.TEST_PHONE || '';
const testPassword = process.env.TEST_PASSWORD || '';

if (!target) throw new Error('TARGET_URL is required');
if (!Number.isFinite(users) || users < 1 || users > 1000) throw new Error('USERS must be between 1 and 1000');
if (!Number.isFinite(durationSeconds) || durationSeconds < 10 || durationSeconds > 300) throw new Error('DURATION_SECONDS must be between 10 and 300');

const hostname = new URL(target).hostname;
const isProduction = hostname === 'prof-harti.vercel.app' || hostname.includes('git-main');
if (isProduction && !allowProduction) {
  throw new Error('Refusing to load-test production. Use a preview/staging URL, or explicitly set ALLOW_PRODUCTION=true.');
}

const publicPaths = ['/ar', '/fr', '/ar/login'];
const authedPaths = ['/ar/dashboard', '/api/v1/student/live', '/api/v1/student/assessments'];
const deadline = Date.now() + durationSeconds * 1000;
const latencies = [];
let requests = 0;
let failures = 0;
let authFailures = 0;

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[index];
}

async function timedFetch(url, options = {}) {
  const started = performance.now();
  try {
    const response = await fetch(url, { redirect: 'manual', ...options });
    const elapsed = performance.now() - started;
    latencies.push(elapsed);
    requests += 1;
    if (response.status >= 500) failures += 1;
    await response.arrayBuffer();
    return response;
  } catch (error) {
    latencies.push(performance.now() - started);
    requests += 1;
    failures += 1;
    return null;
  }
}

async function loginCookie() {
  if (!testPhone || !testPassword) return null;
  const response = await timedFetch(`${target}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ phone: testPhone, password: testPassword }),
  });
  if (!response || response.status >= 400) {
    authFailures += 1;
    return null;
  }
  const setCookie = response.headers.get('set-cookie');
  return setCookie ? setCookie.split(';')[0] : null;
}

async function virtualUser(id) {
  const cookie = await loginCookie();
  let cursor = id;
  while (Date.now() < deadline) {
    const useAuthed = Boolean(cookie) && cursor % 2 === 1;
    const paths = useAuthed ? authedPaths : publicPaths;
    const path = paths[cursor % paths.length];
    const headers = cookie && useAuthed ? { cookie } : undefined;
    await timedFetch(`${target}${path}`, { headers });
    cursor += 1;
    await new Promise((resolve) => setTimeout(resolve, 150 + Math.floor(Math.random() * 350)));
  }
}

console.log(`Load test target: ${target}`);
console.log(`Virtual users: ${users}`);
console.log(`Duration: ${durationSeconds}s`);
console.log(`Authenticated flow: ${testPhone && testPassword ? 'enabled' : 'disabled (public routes only)'}`);

await Promise.all(Array.from({ length: users }, (_, index) => virtualUser(index)));

const failureRate = requests ? failures / requests : 1;
const p50 = percentile(latencies, 50);
const p95 = percentile(latencies, 95);
const p99 = percentile(latencies, 99);
const rps = requests / durationSeconds;

console.log('\n=== LOAD TEST RESULT ===');
console.log(`requests=${requests}`);
console.log(`rps=${rps.toFixed(2)}`);
console.log(`failures=${failures}`);
console.log(`failure_rate=${(failureRate * 100).toFixed(2)}%`);
console.log(`auth_failures=${authFailures}`);
console.log(`p50_ms=${p50.toFixed(0)}`);
console.log(`p95_ms=${p95.toFixed(0)}`);
console.log(`p99_ms=${p99.toFixed(0)}`);

const maxFailureRate = Number(process.env.MAX_FAILURE_RATE || '0.01');
const maxP95 = Number(process.env.MAX_P95_MS || '1500');

if (failureRate > maxFailureRate) {
  throw new Error(`Failure rate ${(failureRate * 100).toFixed(2)}% exceeds ${(maxFailureRate * 100).toFixed(2)}%`);
}
if (p95 > maxP95) {
  throw new Error(`p95 ${p95.toFixed(0)}ms exceeds ${maxP95}ms`);
}
