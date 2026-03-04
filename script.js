const TOKEN_PREFIX = '!NUI!';

const serverTimeInput = document.getElementById('serverTime');
const epochTimeInput = document.getElementById('epochTime');
const output = document.getElementById('tokenOutput');
const debugOutput = document.getElementById('debugOutput');
const statusEl = document.getElementById('status');

const useNowButton = document.getElementById('useNow');
const generateButton = document.getElementById('generate');
const copyButton = document.getElementById('copy');

function getCurrentUnixSeconds() {
  return Math.floor(Date.now() / 1000);
}

function bytesToBase64(bytes) {
  let binary = '';
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function compressRawToken(rawToken) {
  if (!window.pako || typeof window.pako.deflateRaw !== 'function') {
    throw new Error('Compression library (pako) is not available.');
  }

  return window.pako.deflateRaw(rawToken);
}

function generateRandomDigits(length) {
  let value = '';

  for (let i = 0; i < length; i += 1) {
    value += Math.floor(Math.random() * 10).toString();
  }

  return value;
}

function createToken(serverTime) {
  const str1 = generateRandomDigits(String(serverTime).length + 1);
  const str2 = String(serverTime - 100);
  const rawToken = `${str1}-${str2}`;

  const compressed = compressRawToken(rawToken);
  const encoded = bytesToBase64(compressed);
  const token = `${TOKEN_PREFIX}${encoded}`;

  return {
    token,
    serverTime,
    rawToken,
    str1,
    str2,
    compressedLength: compressed.length,
  };
}

function parsePositiveInt(value) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function inferServerTime(epochTimestamp) {
  return epochTimestamp;
}

function setNow() {
  epochTimeInput.value = String(getCurrentUnixSeconds());
  generate();
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#ff8686' : '#7ae3a9';
}

function generate() {
  const manualServerTime = parsePositiveInt(serverTimeInput.value);
  const epochTimestamp = parsePositiveInt(epochTimeInput.value);

  if (!manualServerTime && !epochTimestamp) {
    setStatus('Enter a server time or an epoch timestamp.', true);
    return;
  }

  if (serverTimeInput.value.trim() && !manualServerTime) {
    setStatus('Server time must be a positive integer.', true);
    return;
  }

  if (!manualServerTime && epochTimeInput.value.trim() && !epochTimestamp) {
    setStatus('Epoch timestamp must be a positive integer.', true);
    return;
  }

  const serverTime = manualServerTime ?? inferServerTime(epochTimestamp);

  try {
    const details = createToken(serverTime);
    const mode = manualServerTime ? 'manual_server_time' : 'inferred_from_epoch';
    output.value = details.token;
    debugOutput.textContent = JSON.stringify({ ...details, mode, epochTimestamp: epochTimestamp ?? null }, null, 2);
    setStatus('Token generated.');
  } catch (error) {
    setStatus(`Could not generate token: ${error.message}`, true);
  }
}

async function copyToken() {
  if (!output.value) {
    setStatus('Generate a token first.', true);
    return;
  }

  try {
    await navigator.clipboard.writeText(output.value);
    setStatus('Token copied to clipboard.');
  } catch {
    output.select();
    document.execCommand('copy');
    setStatus('Token copied using fallback copy command.');
  }
}

useNowButton.addEventListener('click', setNow);
generateButton.addEventListener('click', generate);
copyButton.addEventListener('click', copyToken);

setNow();
