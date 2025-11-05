import { NextRequest, NextResponse } from 'next/server';
import { generatePlan, PlanOptions } from '@/lib/plan';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const idea = String(body?.idea ?? '').trim();
    const options = (body?.options || {}) as PlanOptions;
    if (!idea) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 });
    }
    const plan = generatePlan(idea, options);
    return NextResponse.json({ plan });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
