import { object, string } from 'zod';
export const registerSchema = object({
  name: string().min(1, '名前は必須です').max(100, '名前は100文字以内で入力してください'),
  email: string({ required_error: 'メールアドレスは必須です' })
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください'),
  password: string({ required_error: 'パスワードは必須です' })
    .min(1, 'パスワードは必須です')
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(32, 'パスワードは32文字以内で入力してください'),
  confirmPassword: string({ required_error: '確認用パスワードは必須です' })
    .min(1, '確認用パスワードは必須です')
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードと確認用パスワードが一致しません',
    path: ['confirmPassword'],
  });