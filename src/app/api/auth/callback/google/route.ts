import { google } from 'googleapis'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return new Response(
      `<script>
      window.close();
    </script>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
  )

  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  })

  const { data } = await oauth2.userinfo.get()

  // Закрытие попапа и передача данных в основное окно
  return new Response(
    `<script>
      window.opener.postMessage(${JSON.stringify(data)}, '*');
      window.close();
    </script>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
