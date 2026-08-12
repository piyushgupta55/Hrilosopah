import { redirect } from 'next/navigation';

export default function AdminQuestionsPage({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale}/admin/quizzes`);
}
