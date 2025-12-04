import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-7534bb61/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint - creates a new user and stores profile data
app.post("/make-server-7534bb61/signup", async (c) => {
  try {
    const { email, password, parentName } = await c.req.json();

    if (!email || !password || !parentName) {
      return c.json({ error: "Email, password, and parent name are required" }, 400);
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email since email server isn't configured
    });

    if (authError) {
      console.error('Signup auth error:', authError);
      
      // Handle specific error cases
      if (authError.message.includes('already been registered') || authError.code === 'email_exists') {
        return c.json({ 
          error: "This email is already registered. Please login instead.",
          code: "email_exists" 
        }, 422);
      }
      
      return c.json({ error: `Failed to create user: ${authError.message}` }, 400);
    }

    // Store parent profile data in KV store
    const userId = authData.user.id;
    await kv.set(`user:${userId}:profile`, {
      parentName,
      email,
      createdAt: new Date().toISOString(),
    });

    return c.json({ 
      success: true, 
      userId,
      message: "User created successfully" 
    });

  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: `Signup failed: ${error.message}` }, 500);
  }
});

// Login endpoint - returns access token
app.post("/make-server-7534bb61/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Create a client-side Supabase client for sign in
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Only log in development, not the actual error object to reduce noise
      console.log(`Login attempt failed for email: ${email} - ${error.message}`);
      
      // Handle specific error cases with user-friendly messages
      if (error.message.includes('Invalid login credentials') || error.code === 'invalid_credentials') {
        return c.json({ 
          error: "Invalid email or password. Please check your credentials and try again.",
          code: "invalid_credentials" 
        }, 401);
      }
      
      if (error.message.includes('Email not confirmed')) {
        return c.json({ 
          error: "Please confirm your email address before logging in.",
          code: "email_not_confirmed" 
        }, 401);
      }
      
      return c.json({ 
        error: "Login failed. Please try again.",
        code: "login_failed" 
      }, 401);
    }

    if (!data.session || !data.user) {
      return c.json({ 
        error: "Login failed. Please try again.",
        code: "no_session" 
      }, 401);
    }

    return c.json({ 
      success: true,
      accessToken: data.session.access_token,
      userId: data.user.id,
    });

  } catch (error) {
    console.error('Login error (unexpected):', error);
    return c.json({ error: "An unexpected error occurred. Please try again." }, 500);
  }
});

// Save child profile (requires authentication)
app.post("/make-server-7534bb61/child-profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No token provided" }, 401);
    }

    // Verify user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    const { childName, childAge, avatar } = await c.req.json();

    if (!childName || !childAge || avatar === undefined) {
      return c.json({ error: "Child name, age, and avatar are required" }, 400);
    }

    // Save child profile
    await kv.set(`user:${user.id}:child`, {
      childName,
      childAge,
      avatar,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true, message: "Child profile saved" });

  } catch (error) {
    console.error('Save child profile error:', error);
    return c.json({ error: `Failed to save child profile: ${error.message}` }, 500);
  }
});

// Save progress data (requires authentication)
app.post("/make-server-7534bb61/progress", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No token provided" }, 401);
    }

    // Verify user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    const progressData = await c.req.json();

    // Save progress data
    await kv.set(`user:${user.id}:progress`, {
      ...progressData,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true, message: "Progress saved" });

  } catch (error) {
    console.error('Save progress error:', error);
    return c.json({ error: `Failed to save progress: ${error.message}` }, 500);
  }
});

// Get all user data (requires authentication)
app.get("/make-server-7534bb61/user-data", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No token provided" }, 401);
    }

    // Verify user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: "Unauthorized - Invalid token" }, 401);
    }

    // Get all user data
    const profile = await kv.get(`user:${user.id}:profile`);
    const child = await kv.get(`user:${user.id}:child`);
    const progress = await kv.get(`user:${user.id}:progress`);

    return c.json({ 
      success: true,
      data: {
        profile: profile || null,
        child: child || null,
        progress: progress || null,
      }
    });

  } catch (error) {
    console.error('Get user data error:', error);
    return c.json({ error: `Failed to get user data: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);