import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Validate the file is an image
        const ext = pathname.split('.').pop()?.toLowerCase()
        const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif']
        if (!allowed.includes(ext ?? '')) {
          throw new Error('Only image files are allowed')
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10 MB
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ folder: 'products' }),
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Blob upload completed:', blob.url)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
