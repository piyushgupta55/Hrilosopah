import { redirect } from 'next/navigation';

export default function ExplorePage({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale}`);
}
