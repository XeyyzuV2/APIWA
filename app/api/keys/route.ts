import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const keys = await db.getApiKeysByUserId(session.user.id)
  return NextResponse.json(keys)
}

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const newKey = await db.createApiKey(session.user.id)
  return NextResponse.json(newKey)
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { keyId } = await request.json()
    if (!keyId) {
      return NextResponse.json({ error: "Key ID is required" }, { status: 400 })
    }

    // Optional: Check if the key belongs to the user before revoking
    const keys = await db.getApiKeysByUserId(session.user.id)
    if (!keys.some(key => key.id === keyId)) {
        return NextResponse.json({ error: "Key not found or permission denied" }, { status: 404 })
    }

    const revokedKey = await db.revokeApiKey(keyId)
    return NextResponse.json(revokedKey)
  }
