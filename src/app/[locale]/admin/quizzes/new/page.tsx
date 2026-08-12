import React from 'react';
import { QuizEditorForm } from '@/components/admin/QuizEditorForm';

export const dynamic = 'force-dynamic';

export default function CreateQuizPage() {
  return <QuizEditorForm mode="create" />;
}
