import { NextResponse } from 'next/server';

// In a real application, you would have a database connection here
// For demo purposes, we'll pretend to register the user
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e password sono obbligatori' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Save the user to your database

    // For demo purposes, we'll just return success
    return NextResponse.json(
      { success: true, message: 'Utente registrato con successo' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante la registrazione' },
      { status: 500 }
    );
  }
} 