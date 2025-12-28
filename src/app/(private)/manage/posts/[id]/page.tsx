import { notFound } from "next/navigation"
import { getOwnPost } from "@/lib/ownPost"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { ja } from "date-fns/locale";
import { format } from 'date-fns';
import { auth } from "@/auth";
import ReactMarkdown from 'react-markdown';
import remarkgfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import "highlight.js/styles/github.css";

type Params = {
  params: Promise<{ id: string }>
}
export default async function ShowPage({ params }: Params) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!session?.user?.email || !userId) {
    throw new Error('不正なリクエストです。');
  }
  const { id } = await params
  const post = await getOwnPost(userId, id)
  if (!post) {
    return notFound()
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        {post.topImage && (
          <div className="h-64 lg:h-96 w-full relative">
            <Image
              src={post.topImage}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover rounded-t-md"
              priority
            />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">
              投稿者：{post.author.name}
            </p>
            <time className="text-sm text-gray-500">
              {format(new Date(post.createdAt), 'yyyy年MM月dd日', { locale: ja })}
            </time>
          </div>
          <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='prose max-w-none'>
            <ReactMarkdown
              remarkPlugins={[remarkgfm]}
              rehypePlugins={[rehypeHighlight]}
              skipHtml={false}
              unwrapDisallowed={true}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
