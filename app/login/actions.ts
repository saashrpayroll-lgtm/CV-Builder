'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error("Login Error:", error);
        // Redirect with error message as search param
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    // Client-side validations
    if (!email || !password) {
        redirect('/signup?error=' + encodeURIComponent('Email and password are required'))
    }

    if (password.length < 6) {
        redirect('/signup?error=' + encodeURIComponent('Password must be at least 6 characters'))
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            }
        }
    })

    if (error) {
        console.error("Signup Error:", error);
        redirect(`/signup?error=${encodeURIComponent(error.message)}`)
    }

    // Check if email confirmation is required
    if (data?.user?.identities?.length === 0) {
        redirect('/signup?error=' + encodeURIComponent('This email is already registered. Please login instead.'))
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
