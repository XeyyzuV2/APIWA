import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getLogsByUserId } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const logs = await getLogsByUserId(session.user.id)

  // Process logs for charting
  const requestsPerEndpoint = logs.reduce((acc, log) => {
    acc[log.endpoint] = (acc[log.endpoint] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getCount = logs.filter(log => log.method === 'GET').length;
  const postCount = logs.filter(log => log.method === 'POST').length;

  const analyticsData = {
    totalRequests: logs.length,
    requestsPerEndpoint: Object.entries(requestsPerEndpoint).map(([name, value]) => ({ name, value })),
    methodCounts: [
        { name: 'GET', value: getCount },
        { name: 'POST', value: postCount }
    ],
    lastRequest: logs.length > 0 ? logs[logs.length - 1].timestamp : null,
  };

  return NextResponse.json(analyticsData)
}
