import z from "zod";

export const usersSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    emailVerified: z.boolean().optional(),
    image: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    sessions: z.array(z.object({
        id: z.string(),
        userId: z.string(),
        sessionToken: z.string(),
        expiresAt: z.date(),
    })).optional(),
    accounts: z.array(z.object({
        id: z.string(),
        userId: z.string(),
        providerId: z.string(),
        accessToken: z.string(),
        refreshToken: z.string(),
        idToken: z.string(),
        accessTokenExpiresAt: z.date(),
        refreshTokenExpiresAt: z.date(),
    })).optional(),
});

export const createUserSchema = usersSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    sessions: true,
    accounts: true,
});

export const updateUserSchema = createUserSchema.partial();
