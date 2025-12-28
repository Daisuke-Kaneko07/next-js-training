'use client'
import { useState, useActionState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkgfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import TextareaAutosize from 'react-textarea-autosize';
import "highlight.js/styles/github.css";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPost } from '@/lib/actions/createPost';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type EditPostFormProps = {
  post: {
    id: string;
    title: string;
    content: string;
    topImage?: string | null;
    published: boolean;
  }
}
export default function EditPostForm({ post }: EditPostFormProps) {
  const [content, setContent] = useState(post.content);
  const [contentLength, setContentLength] = useState(0);
  const [preview, setPreview] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [published, setPublished] = useState(post.published);
  const [imagePreview, setImagePreview] = useState(post.topImage);
  const [state, formAction] = useActionState(createPost, {
    success: false, errors: {}
  });

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    setContentLength(value.length);
  };

  const hadleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  }

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview != post.topImage) {
        URL.revokeObjectURL(imagePreview);
      }
    }
  }, [imagePreview, post.topImage]);

  return (
    <div className='container mx-auto mt-10'>
      <h1 className='text-2xl font-bold mb-4'>新規記事作成(Markdown対応)</h1>
      <form action={formAction} className='space-y-4'>
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input type="text" name="title" id="title" placeholder="記事のタイトル" value={title} onChange={(e) => setTitle(e.target.value)} />
          {state.errors.title && (
            <p className="text-sm text-red-500 mt-1">{state.errors.title.join(',')}</p>
          )}
        </div>
        <div>
          <Label htmlFor="topImageUrl">トップ画像</Label>
          <Input
            type="file"
            name="topImage"
            id="topImage"
            accept="image/*"
            onChange={hadleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt="{post.title}"
                width={0}
                height={0}
                sizes="200px"
                className="w-[200px]"
                priority
              />
            </div>
          )}
          {state.errors.topImage && (
            <p className="text-sm text-red-500 mt-1">{state.errors.topImage.join(',')}</p>
          )}
        </div>
        <div>
          <Label htmlFor="content">内容(Markdown)</Label>
          <TextareaAutosize
            id="content"
            name="content"
            className="w-full p-2 border"
            minRows={8}
            value={content}
            onChange={handleContentChange}
            placeholder="記事の内容をMarkdown形式で入力してください"
          />
          {state.errors.content && (
            <p className="text-sm text-red-500 mt-1">{state.errors.content.join(',')}</p>
          )}
        </div>
        <div className='text-right text-sm text-gray-500 mt-1'>
          文字数: {contentLength}文字
        </div>
        <div>
          <Button type="button" onClick={() => setPreview(!preview)}>
            {preview ? '編集モードに戻る' : 'プレビューを表示'}
          </Button>
        </div>
        {preview && (
          <div className='border p-4 bg-gray-50 prose max-w-none'>
            <ReactMarkdown
              remarkPlugins={[remarkgfm]}
              rehypePlugins={[rehypeHighlight]}
              skipHtml={false}
              unwrapDisallowed={true}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
        <RadioGroup value={published.toString()} name="published" onValueChange={(value) => setPublished(value === 'true')}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="published-one" />
            <Label htmlFor="published-one">表示</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="published-two" />
            <Label htmlFor="published-two">非表示</Label>
          </div>
        </RadioGroup>
        <Button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded'>
          記事を更新
        </Button>
        <input type="hidden" name="postId" value={post.id} />
        <input type="hidden" name="oldImageUrl" value={post.topImage || ''} />
      </form>
    </div>
  )
}
