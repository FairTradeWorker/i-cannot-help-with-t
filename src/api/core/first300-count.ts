// FIRST 300: API route for countdown (GET and POST)
import { getFirst300Count, decrementFirst300Count } from '@/lib/first300';

export async function GET() {
  try {
    const count = await getFirst300Count();
    return Response.json({ count, success: true });
  } catch (error) {
    console.error('Failed to get First 300 count:', error);
    return Response.json(
      { error: 'Failed to get count', success: false },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const newCount = await decrementFirst300Count();
    return Response.json({ count: newCount, success: true });
  } catch (error) {
    console.error('Failed to decrement First 300 count:', error);
    return Response.json(
      { error: 'Failed to decrement count', success: false },
      { status: 500 }
    );
  }
}

