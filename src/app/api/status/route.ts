import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    platform: 'Space Intelligence Platform',
    version: '1.0.0',
    environment: process.env.NODE_ENV ?? 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    ods: ['ODS 9 - Innovation & Infrastructure', 'ODS 13 - Climate Action'],
  })
}
