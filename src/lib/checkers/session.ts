import { auth } from "@/auth"
import { GET_USER_BY_EMAIL } from "../database/queries/user"

export async function getSessionInfo() {


  const session = await auth()


  if (!session || !session.user) return null

  const dbUser = await GET_USER_BY_EMAIL(session.user.email!)

  if (!dbUser) return null

  const info = {
    session: session,
    user: dbUser
  }

  return info
}
