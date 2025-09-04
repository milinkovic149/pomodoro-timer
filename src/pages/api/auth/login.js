import { auth, db } from '../../../lib/firebase';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Koristi Firebase Auth REST API za login
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.error.message === 'EMAIL_NOT_FOUND' || data.error.message === 'INVALID_PASSWORD') {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            throw new Error(data.error.message);
        }

        // Opcionalno: Dobavi dodatne podatke iz Firestore
        const userDoc = await db.collection('users').doc(data.localId).get();
        const userData = userDoc.exists ? userDoc.data() : {};

        res.status(200).json({
            message: 'Login successful',
            token: data.idToken,
            refreshToken: data.refreshToken,
            user: {
                id: data.localId,
                email: data.email,
                ...userData,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
