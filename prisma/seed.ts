import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
    // テーブルをリフレッシュ
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    // ダミーパスワード生成
    const hashedPassword = await bcrypt.hash("password123", 10);
    // ダミー画像
    const dummyImage = [
        "https://picsum.photos/seed/post1/600/400",
        "https://picsum.photos/seed/post2/600/400",
        "https://picsum.photos/seed/post3/600/400",
    ];
    // ユーザーを作成
    const user = await prisma.user.create({
        data: {
            name: "Test User1",
            email: "test@example.com",
            password: hashedPassword,
            posts: {
                create: [
                    {
                        title: "First Post",
                        content: "This is the content of the first post.",
                        topImage: dummyImage[0],
                        published: true,
                    },
                    {
                        title: "Second Post",
                        content: "This is the content of the second post.",
                        topImage: dummyImage[1],
                        published: false,
                    },
                    {
                        title: "Third Post",
                        content: "This is the content of the third post.",
                        topImage: dummyImage[2],
                        published: true,
                    },
                ],
            }
        },
    });
    console.log({ user });

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });