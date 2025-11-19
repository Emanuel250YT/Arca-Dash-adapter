export async function verifyRecaptcha(captcha: string) {

  const params = new URLSearchParams();
  params.append('secret', process.env.RECAPTCHA_SECRET as string);
  params.append('response', captcha);


  const data = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }).catch(err => {
    if (err) {
      return false
    }
  })

  if (!data) return false

  const jsonData = await data.json().catch(err => {
    if (err) {
      return { success: false }
    }
  })

  if (!jsonData.success) return false

  return true

}