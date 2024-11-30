export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const targetURL = new URL(url.pathname, `https://${env.TARGET_HOSTNAME}`);
    targetURL.search = url.search;

    const newHeaders = new Headers(request.headers);
    const sensitiveHeaders = ['host', 'origin', 'referer', 'x-forwarded-host', 'x-real-ip', 'x-forwarded-for', 'cf-ray', 'cf-connecting-ip',
                              'accept-language', 'cache-control', 'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform', 
                              'sec-fetch-dest', 'sec-fetch-mode', 'sec-fetch-site', 'sec-fetch-user', 'upgrade-insecure-requests'];
    sensitiveHeaders.forEach(header => newHeaders.delete(header));

    newHeaders.set('Host', env.TARGET_HOSTNAME);
    newHeaders.set('X-Forwarded-For', generateRandomIP());

    const originalUA = request.headers.get('User-Agent') || '';
    newHeaders.set('User-Agent', generateRandomUserAgent(originalUA));

    const newRequest = new Request(targetURL, {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: 'manual',
    });

    let response = await fetch(newRequest);
    let newResponse = new Response(response.body, response);
    newResponse.headers.delete('x-forwarded-host');
    newResponse.headers.delete('x-forwarded-for');
    newResponse.headers.delete('x-real-ip');
    return newResponse;
  }
};

function generateRandomIP() {
  return Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
}

function generateRandomUserAgent(originalUA) {
  const isMobile = /Mobile|Android|iP(hone|od|ad)/i.test(originalUA);

  if (isMobile) {
    const mobileDevices = ['iPhone', 'Android', 'iPad'];
    const randomDevice = mobileDevices[Math.floor(Math.random() * mobileDevices.length)];
    const osVersion = (randomDevice === 'iPhone' || randomDevice === 'iPad') 
                      ? Math.floor(Math.random() * 4) + 14 
                      : Math.floor(Math.random() * 5) + 10;
    const browserVersion = Math.floor(Math.random() * 20) + 80;

    if (randomDevice === 'iPhone' || randomDevice === 'iPad') {
      return `Mozilla/5.0 (${randomDevice}; CPU OS ${osVersion}_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${browserVersion}.0 Mobile/15E148 Safari/${browserVersion}.1`;
    } else {
      return `Mozilla/5.0 (Linux; Android ${osVersion}; ${randomDevice}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Mobile Safari/537.36`;
    }
  } else {
    const desktopOS = ['Windows NT 10.0', 'Macintosh; Intel Mac OS X 10_15', 'X11; Linux x86_64'];
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    const randomOS = desktopOS[Math.floor(Math.random() * desktopOS.length)];
    const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];
    const browserVersion = Math.floor(Math.random() * 20) + 80;
    return `Mozilla/5.0 (${randomOS}) AppleWebKit/537.36 (KHTML, like Gecko) ${randomBrowser}/${browserVersion}.0`;
  }
}