import { auth, db, FieldValue } from '../../../lib/firebase';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        // Proveri da li korisnik već postoji
        const existingUser = await auth.getUserByEmail(email).catch(() => null);
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Kreiraj korisnika u Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
        });

        // Opcionalno: Sačuvaj dodatne podatke u Firestore
        await db.collection('users').doc(userRecord.uid).set({
            email: userRecord.email,
            createdAt: FieldValue.serverTimestamp(),
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: userRecord.uid,
                email: userRecord.email,
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        if (error.code === 'auth/email-already-exists') {
            return res.status(409).json({ message: 'User already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}
