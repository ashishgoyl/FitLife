/**
 * Multi-Provider OTP Dispatch Service
 * Supports CallMeBot (WhatsApp), Twilio (WhatsApp/SMS), Fast2SMS, and RapidAPI.
 */
export async function sendOtpMessage({ phoneNumber, otp, channel, provider, settings }) {
  const cleanPhone = String(phoneNumber || '').replace(/\D/g, '')
  if (!cleanPhone || cleanPhone.length < 10) {
    throw new Error('Valid 10-digit mobile number required.')
  }

  const message = `Your FitLife Verification Code is: ${otp}. Valid for 5 minutes.`

  // 1. CallMeBot (Free WhatsApp API for Developers)
  if (provider === 'callmebot') {
    const apiKey = settings?.callmebotKey || process.env.CALLMEBOT_API_KEY
    if (!apiKey) {
      throw new Error('CallMeBot API Key is required. Follow instructions in Settings to get your key.')
    }
    const url = `https://api.callmebot.com/whatsapp.php?phone=+91${cleanPhone}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`
    const r = await fetch(url)
    const respText = await r.text()
    if (!r.ok || respText.toLowerCase().includes('error')) {
      throw new Error(respText || 'CallMeBot WhatsApp delivery failed.')
    }
    return { success: true, message: `OTP sent via WhatsApp to +91 ${cleanPhone}` }
  }

  // 2. Twilio (WhatsApp & SMS)
  if (provider === 'twilio') {
    const sid = settings?.twilioSid || process.env.TWILIO_ACCOUNT_SID
    const token = settings?.twilioToken || process.env.TWILIO_AUTH_TOKEN
    let from = settings?.twilioFrom || process.env.TWILIO_FROM_NUMBER
    if (!sid || !token) {
      throw new Error('Twilio Account SID and Auth Token are required in Settings.')
    }

    let to = `+91${cleanPhone}`
    if (channel === 'whatsapp') {
      to = `whatsapp:+91${cleanPhone}`
      from = from ? (from.startsWith('whatsapp:') ? from : `whatsapp:${from}`) : 'whatsapp:+14155238886'
    }

    const params = new URLSearchParams()
    params.append('To', to)
    params.append('From', from)
    params.append('Body', message)

    const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const data = await r.json()
    if (!r.ok) {
      throw new Error(data.message || 'Twilio delivery failed. Check credentials and recipient number.')
    }
    return { success: true, message: `OTP sent via ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} to +91 ${cleanPhone}` }
  }

  // 3. Fast2SMS (Indian SMS Gateway)
  if (provider === 'fast2sms') {
    let apiKey = settings?.fast2smsKey || process.env.FAST2SMS_API_KEY
    if (!apiKey) {
      throw new Error('Fast2SMS authorization key is required.')
    }
    apiKey = apiKey.replace(/^api-/, '').trim()

    const otpUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(apiKey)}&route=otp&variables_values=${otp}&numbers=${cleanPhone}`
    const r = await fetch(otpUrl, { method: 'GET' })
    const data = await r.json()

    if (data.return) {
      return { success: true, message: `SMS OTP sent to +91 ${cleanPhone}` }
    }

    const qUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(apiKey)}&route=q&message=${encodeURIComponent(`Your FitLife Verification Code is: ${otp}. Valid for 5 minutes.`)}&language=english&flash=0&numbers=${cleanPhone}`
    const qResp = await fetch(qUrl, { method: 'GET' })
    const qData = await qResp.json()

    if (qData.return) {
      return { success: true, message: `SMS OTP sent to +91 ${cleanPhone}` }
    }

    if (data.status_code === 996 || qData.status_code === 999 || String(data.message || qData.message).includes('website verification')) {
      throw new Error(`Fast2SMS blocked by Indian telecom laws: ${data.message || qData.message || 'Website verification required'}. Please use RapidAPI SMSAPI key to send real SMS.`)
    }

    throw new Error(data.message || qData.message || 'Fast2SMS delivery failed.')
  }

  // 4. RapidAPI (SMSAPI.com)
  if (provider === 'rapidapi' || settings?.rapidapiKey) {
    const rapidKey = settings?.rapidapiKey || process.env.RAPIDAPI_KEY
    if (!rapidKey) {
      throw new Error('RapidAPI Key (x-rapidapi-key) is required.')
    }

    const recipient = cleanPhone.startsWith('91') && cleanPhone.length > 10 ? cleanPhone : `91${cleanPhone}`
    const queryParams = new URLSearchParams({
      to: recipient,
      message,
      format: 'json',
    })

    const rapidResp = await fetch(`https://smsapi-com3.p.rapidapi.com/sms.do?${queryParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'smsapi-com3.p.rapidapi.com',
        'x-rapidapi-key': String(rapidKey).trim(),
      },
      body: JSON.stringify({
        to: recipient,
        message,
        format: 'json',
      }),
    })

    const rapidData = await rapidResp.json().catch(() => ({}))
    if (!rapidResp.ok || (rapidData.error && rapidData.error !== 0)) {
      const errDetail = rapidData.message || rapidData.error_message || (rapidData.error ? `SMSAPI Error Code ${rapidData.error}` : null) || `RapidAPI error (HTTP ${rapidResp.status})`
      throw new Error(errDetail)
    }

    return { success: true, message: `SMS OTP sent via RapidAPI to +${recipient}` }
  }

  throw new Error(`Unsupported provider: ${provider}`)
}

