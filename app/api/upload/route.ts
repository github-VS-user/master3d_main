import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

// Configure larger body size limit for image uploads
export const runtime = 'nodejs'
export const maxDuration = 30 // 30 seconds timeout

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Upload API called')
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.error('[v0] No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('[v0] File received:', file.name, 'Size:', file.size, 'Type:', file.type)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('[v0] Invalid file type:', file.type)
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Validate file size (max 10MB - increased from 5MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error('[v0] File too large:', file.size)
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `products/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`

    console.log('[v0] Uploading to Vercel Blob:', filename)

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    })

    console.log('[v0] Upload successful:', blob.url)

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
