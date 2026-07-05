// ========================================
// API LAYER - Google Sheets Backend
// ========================================

const API_CONFIG = {
  // ⚠️ GANTI DENGAN URL DEPLOYMENT ANDA
  baseUrl: 'https://script.google.com/macros/s/AKfycbzNxYKM45cXgDcVPKHUqbx80I8uWh3XvHEXtCMIe7dv5TD6MwWFX0hL7GaSIQqWq2V-/exec',

  // Timeout 8 detik (Google Script bisa lambat)
  timeout: 8000,

  // Nama key untuk cache di localStorage
  cacheKey: 'undangan_cache',

  // Flag apakah sedang loading dari API
  loading: false
};

// ===== HELPER: Fetch dengan Timeout =====
function fetchWithTimeout(url, options, timeout) {
  return new Promise(function(resolve, reject) {
    const controller = new AbortController();
    const timer = setTimeout(function() {
      controller.abort();
      reject(new Error('Request timeout'));
    }, timeout || API_CONFIG.timeout);

    fetch(url, Object.assign({}, options, { signal: controller.signal }))
      .then(function(res) { clearTimeout(timer); return res; })
      .then(resolve)
      .catch(function(err) {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// ===== HELPER: Escape HTML (XSS Protection) =====
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

// ===== HELPER: Deep Merge =====
function deepMerge(defaults, saved) {
  const result = Object.assign({}, defaults);
  for (const key in saved) {
    if (Array.isArray(saved[key]) && Array.isArray(defaults[key])) {
      result[key] = saved[key].length > 0 ? saved[key] : defaults[key];
    } else if (typeof saved[key] === 'object' && saved[key] !== null && !Array.isArray(saved[key])) {
      result[key] = deepMerge(defaults[key] || {}, saved[key]);
    } else {
      result[key] = saved[key];
    }
  }
  return result;
}

// ===== API: Fetch Semua Data =====
async function apiFetchAll() {
  API_CONFIG.loading = true;

  try {
    const res = await fetchWithTimeout(API_CONFIG.baseUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'Accept': 'application/json' }
    });

    const json = await res.json();

    if (json.success && json.data) {
      const apiData = json.data;

      // Konversi format API ke format DATA yang lama
      const converted = Object.assign({}, apiData.settings || {}, {
        gallery: apiData.gallery || [],
        timeline: apiData.timeline || [],
        ucapan: apiData.ucapan || []
      });

      // Cache ke localStorage sebagai fallback
      try {
        localStorage.setItem(API_CONFIG.cacheKey, JSON.stringify(converted));
      } catch (e) { /* ignore */ }

      console.log('✓ Data loaded from Google Sheets');
      API_CONFIG.loading = false;
      return converted;
    } else {
      throw new Error(json.error || 'Invalid response');
    }
  } catch (err) {
    console.warn('⚠ API failed, using cache:', err.message);
    API_CONFIG.loading = false;

    // Fallback ke cache
    try {
      const cached = localStorage.getItem(API_CONFIG.cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) { /* ignore */ }

    // Fallback ke data lama (backward compatibility)
    try {
      const oldData = localStorage.getItem('undangan_data');
      if (oldData) {
        return JSON.parse(oldData);
      }
    } catch (e) { /* ignore */ }

    return null;
  }
}

// ===== API: Login =====
async function apiLogin(password) {
  try {
    const res = await fetchWithTimeout(API_CONFIG.baseUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        password: password
      })
    });

    const json = await res.json();
    return json.success === true;
  } catch (err) {
    console.error('Login API error:', err);
    return false;
  }
}

// ===== API: Save Settings =====
async function apiSaveSettings(settings, apiKey) {
  try {
    const res = await fetchWithTimeout(API_CONFIG.baseUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_settings',
        api_key: apiKey,
        data: settings
      })
    });

    const json = await res.json();
    return json.success === true;
  } catch (err) {
    console.error('Save settings error:', err);
    return false;
  }
}

// ===== API: Save Gallery =====
async function apiSaveGallery(gallery, apiKey) {
  try {
    const res = await fetchWithTimeout(API_CONFIG.baseUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_gallery',
        api_key: apiKey,
        data: gallery
      })
    });

    const json = await res.json();
    return json.success === true;
  } catch (err) {
    console.error('Save gallery error:', err);
    return false;
  }
}

// ===== API: Save Timeline =====
async function apiSaveTimeline(timeline, apiKey) {
  try {
    const res = await fetchWithTimeout(API_CONFIG.baseUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_timeline',
        api_key: apiKey,
        data: timeline
      })
    });

    const json = await res.json();
    return json.success === true;
  } catch (err) {
    console.error('Save timeline error:', err);
    return false;
  }
}

// ===== API: Add Ucapan (Publik) =====
async function apiAddUcapan(ucapan) {
  try {
    const res = await fetchWithTimeout(API_CONFIG.baseUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_ucapan',
        data: ucapan
      })
    });

    const json = await res.json();
    return json.success === true;
  } catch (err) {
    console.error('Add ucapan error:', err);
    return false;
  }
}

// ===== API: Delete Ucapan =====
async function apiDeleteUcapan(index, apiKey) {
  try {
    const res = await fetchWithTimeout(API_CONFIG.baseUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_ucapan',
        api_key: apiKey,
        index: index
      })
    });

    const json = await res.json();
    return json.success === true;
  } catch (err) {
    console.error('Delete ucapan error:', err);
    return false;
  }
}

// ===== API: Reset Ucapan =====
async function apiResetUcapan(apiKey) {
  try {
    const res = await fetchWithTimeout(API_CONFIG.baseUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'reset_ucapan',
        api_key: apiKey
      })
    });

    const json = await res.json();
    return json.success === true;
  } catch (err) {
    console.error('Reset ucapan error:', err);
    return false;
  }
}

// ===== EXPOSE TO GLOBAL =====
window.API_CONFIG = API_CONFIG;
