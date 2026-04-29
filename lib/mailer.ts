export async function sendMail(to: string, subject: string, body: string) {
  // MVP: local output only
  console.log('[MAIL]', { to, subject, body });
}
