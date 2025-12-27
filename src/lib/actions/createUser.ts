'use server';

import { registerSchema } from "@/validations/user";
import { prisma } from "@/lib/prisma";
import bcryptjs from 'bcryptjs';
import { signIn } from '@/auth';
import { redirect } from 'next/navigation';

type ActionState = {
  success: boolean;
  errors: Record<string, string[]>;
};

// バリデーションエラー処理
function handleValidationError(error: any): ActionState {
  const { fieldErrors, formErrors } = error.flatten();
  // zodの仕様でパスワード不一致エラーはformerrorsに入るため、formErrorsがある場合はconfirmPasswordにエラー追加
  if (formErrors.length > 0) {
    return { success: false, errors: { ...fieldErrors, confirmPassword: formErrors } };
  }
  return { success: false, errors: fieldErrors };
}

// カスタムエラー処理
function handleError(customErrors: Record<string, string[]>): ActionState {
  return { success: false, errors: customErrors };
}

// ユーザー作成アクション
export async function createUser(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // フォームから渡された情報を取得
  const rawFormData = Object.fromEntries(
    ["name", "email", "password", "confirmPassword"].map(field => [
      field,
      formData.get(field) as string
    ])
  ) as Record<string, string>;

  // バリデーション実行
  const validationResult = registerSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    return handleValidationError(validationResult.error);
  }

  // メールアドレスの重複チェック
  const existingUser = await prisma.user.findUnique({
    where: { email: rawFormData.email }
  });
  if (existingUser) {
    return handleError({ email: ['このメールアドレスは既に登録されています'] });
  }

  // DB登録
  const hashedPassword = await bcryptjs.hash(rawFormData.password, 12);
  await prisma.user.create({
    data: {
      name: rawFormData.name,
      email: rawFormData.email,
      password: hashedPassword
    }
  });
  // ダッシュボードにリダイレクト
  await signIn('credentials', {
    ...Object.fromEntries(formData),
    redirect: false,
  });
  redirect('/dashboard');
}