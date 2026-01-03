import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// In-memory fallback when Supabase isn't configured
const memoryWaitlist: string[] = []

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // If Supabase is configured, use it
    if (isSupabaseConfigured() && supabase) {
      // Check if already exists
      const { data: existing } = await supabase
        .from('waitlist')
        .select('id')
        .eq('email', normalizedEmail)
        .single()

      if (existing) {
        return NextResponse.json(
          { message: 'Already on the waitlist!', alreadyExists: true },
          { status: 200 }
        )
      }

      // Insert new signup
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email: normalizedEmail, source: 'landing_page' }])

      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json(
          { error: 'Failed to join waitlist' },
          { status: 500 }
        )
      }

      // Get total count
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })

      console.log(`📧 New waitlist signup: ${normalizedEmail}`)
      console.log(`📊 Total signups: ${count}`)

      return NextResponse.json(
        { message: 'Successfully joined the waitlist!', position: count },
        { status: 200 }
      )
    } 
    
    // Fallback to in-memory storage (for local dev without Supabase)
    if (memoryWaitlist.includes(normalizedEmail)) {
      return NextResponse.json(
        { message: 'Already on the waitlist!', alreadyExists: true },
        { status: 200 }
      )
    }

    memoryWaitlist.push(normalizedEmail)
    console.log(`📧 New waitlist signup (local): ${normalizedEmail}`)
    console.log(`📊 Total signups (local): ${memoryWaitlist.length}`)

    return NextResponse.json(
      { message: 'Successfully joined the waitlist!', position: memoryWaitlist.length },
      { status: 200 }
    )

  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    if (isSupabaseConfigured() && supabase) {
      const { count, error } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })

      if (error) throw error
      return NextResponse.json({ count: count || 0, source: 'supabase' })
    }

    return NextResponse.json({ count: memoryWaitlist.length, source: 'memory' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get count', count: 0 }, { status: 500 })
  }
}
