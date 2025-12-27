import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostCardProps } from "@/types/post";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import Image from "next/image";

export default function PostCard({ post }: PostCardProps) {
  return (
    <div>
      <Card className="hover:shadow-lg transition-shadow">
        <Link href={`/posts/${post.id}`}>
          {post.topImage && (
            <div className="h-48 w-full relative">
              <Image
                src={post.topImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-t-md"
                priority
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="line-Clamp-2">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2 line-Clamp-2">
              {post.content}
            </p>
            <div className="flex items-center text-sm text-gray-500 justify-between">
              <span>{post.author.name}</span>
              <time>{
                formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ja })}
              </time>
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  )
}