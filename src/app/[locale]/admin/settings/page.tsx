import { redirect } from 'next/navigation';

export default function AdminSettingsPage({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale}/admin/dashboard`);
}
