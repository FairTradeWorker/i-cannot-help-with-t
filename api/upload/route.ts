// File Upload API
// POST /api/upload - Upload files (videos, images) to storage

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/api/lib/auth';
import { publicApiLimiter, getClientIP, createRateLimitResponse } from '@/api/lib/rate-limiter';

// For now, this is a placeholder that accepts files
// In production, integrate with S3, Cloudinary, or Supabase Storage

export async function POST(request: NextRequest) {
  // Authentication required
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limiting
  const ip = getClientIP(request);
  const rateLimit = await publicApiLimiter.limit(ip);
  if (!rateLimit.success) {
    return createRateLimitResponse(Math.ceil((rateLimit.reset - Date.now()) / 1000));
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'video' | 'image' | 'thumbnail'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = {
      video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
      image: ['image/jpeg', 'image/png', 'image/webp'],
      thumbnail: ['image/jpeg', 'image/png'],
    };

    const allowed = allowedTypes[type as keyof typeof allowedTypes];
    if (!allowed || !allowed.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type for ${type}. Allowed: ${allowed.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size (50MB for videos, 5MB for images)
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max size: ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // TODO: Upload to storage (S3, Cloudinary, Supabase Storage)
    // For now, return a mock URL
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const extension = file.name.split('.').pop();
    const mockUrl = `https://storage.fairtradeworker.com/${user.id}/${type}/${fileId}.${extension}`;

    // In production:
    // 1. Upload file to storage service
    // 2. Get public URL
    // 3. Return URL

    return NextResponse.json(
      {
        url: mockUrl,
        fileName: file.name,
        size: file.size,
        type: file.type,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}

