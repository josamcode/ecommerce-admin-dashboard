import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;
const NEXT_PUBLIC_ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
const NEXT_PUBLIC_ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Verify user data
    if (username === NEXT_PUBLIC_ADMIN_USERNAME && password === NEXT_PUBLIC_ADMIN_PASSWORD) {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
      return Response.json({ success: true, token });
    } else {
      return Response.json({ success: false }, { status: 401 });
    }
  } catch (error) {
    return Response.json(
      { success: false, error: "An error occurred." },
      { status: 500 }
    );
  }
}


