async function testQuickAuth() {
  const userId = 'FKAD-BUZL-LMGY'
  
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'vi-VN,vi;q=0.9,en-GB;q=0.8,en;q=0.7',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Origin': 'https://shop.vnggames.com',
    'Referer': 'https://shop.vnggames.com/',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36',
  }

  const authParams = new URLSearchParams()
  authParams.append('platform', 'mobile')
  authParams.append('clientKey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjIjoxMDY2MSwiYSI6MTA2NjEsInMiOjF9.B08-6v9oP3rNxrvImC-WBO-AN0mru77ZNLOgqosNIjA')
  authParams.append('loginType', '9')
  authParams.append('lang', 'VI')
  authParams.append('jtoken', '')
  authParams.append('userID', '')
  authParams.append('roleID', userId)
  authParams.append('roleName', userId)
  authParams.append('serverID', '')
  authParams.append('getVgaId', '1')

  try {
    console.log("TESTING VNG AUTH/QUICK...")
    const response = await fetch('https://billing.vnggames.com/fe/api/auth/quick', {
      method: 'POST',
      headers: headers,
      body: authParams.toString(),
    })

    const text = await response.text()
    try {
      const data = JSON.parse(text)
      console.log("AUTH_QUICK_RESPONSE:", JSON.stringify(data, null, 2))
    } catch (e) {
      console.log("RESPONSE_TEXT (NOT JSON):", text.slice(0, 1000))
    }
  } catch (error) {
    console.error("TEST_ERROR:", error)
  }
}

testQuickAuth()
