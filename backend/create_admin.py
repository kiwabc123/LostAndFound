"""Script to create or update an admin user."""

import asyncio
import sys
from app.database import async_session_maker
from app.models.user import User, UserRole
from app.utils.security import hash_password
from sqlalchemy import select


async def create_admin(username: str, email: str, password: str) -> None:
    async with async_session_maker() as session:
        result = await session.execute(select(User).where(User.username == username))
        user = result.scalar_one_or_none()

        if user:
            user.email = email
            user.password_hash = hash_password(password)
            user.role = UserRole.ADMIN
            action = "Updated"
        else:
            user = User(
                username=username,
                email=email,
                password_hash=hash_password(password),
                role=UserRole.ADMIN,
            )
            session.add(user)
            action = "Created"

        await session.commit()
        print(f"{action} admin user: {username} ({email})")


if __name__ == "__main__":
    username = sys.argv[1] if len(sys.argv) > 1 else "admin"
    email = sys.argv[2] if len(sys.argv) > 2 else "admin@example.com"
    password = sys.argv[3] if len(sys.argv) > 3 else "Admin1234!"

    asyncio.run(create_admin(username, email, password))
