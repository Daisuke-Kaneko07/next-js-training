import {prisma} from '@/lib/prisma';

export async function getPosts() {
    return await prisma.post.findMany({
        where: { published: true },
        include: { 
            author: {
                select: {
                    name:true,
                }
            }
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getPostById(id:string) {
    return await prisma.post.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    name: true,
                }
            }
        }
    })
}

export async function searchPosts(searchKeywords: string) {
    // 全角スペースを半角スペースに変換&スペースで分割（空文字を除外）
    const decodedKeyword = decodeURIComponent(searchKeywords);
    const normalizedKeyword = decodedKeyword.replace(/\s+/g, ' ').trim();
    const keywords = normalizedKeyword.split(' ').filter(Boolean);

    const filters = keywords.map(keyword => ({
        OR: [
            { title: { contains: keyword } },
            { content: { contains: keyword } },
        ]
    }));

    return await prisma.post.findMany({
        where: {
            AND: filters,
        },
        include: {
            author: {
                select: {
                    name: true,
                }
            }
        }
    });
}