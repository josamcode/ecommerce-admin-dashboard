import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { token } = await request.json();

    jwt.verify(token, SECRET_KEY);
    return Response.json({ valid: true });
  } catch (error) {
    return Response.json({ valid: false }, { status: 401 });
  }
}
